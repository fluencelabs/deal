// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "../utils/OwnableUpgradableDiamond.sol";
import "../deal/base/Types.sol";
import "../utils/LinkedListWithUniqueKeys.sol";
import "../deal/interfaces/IDeal.sol";
import "./interfaces/ICapacityCommitment.sol";
import "forge-std/console.sol";
import "./Market.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CapacityCommitment is ICapacityCommitment, Market {
    using SafeERC20 for IERC20;
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;

    // ------------------ Types ------------------
    enum CCStatus {
        Active,
        WaitDelegation,
        Inactive,
        Failed
    }

    struct CommitmentInfo {
        CCStatus status;
        bytes32 peerId;
        uint256 collateralPerUnit;
        uint256 duration;
        uint256 rewardDelegatorRate;
        address delegator;
        uint256 currentCUSuccessCount;
        uint256 totalCUFailCount;
        uint256 snapshotEpoch;
        uint256 startEpoch;
        uint256 failedEpoch;
        uint256 withdrawCCEpochAfterFailed;
        uint256 remainingFailsForLastEpoch;
        uint256 exitedUnitCount;
        uint256 totalWithdrawnReward;
    }

    struct UnitProofsInfo {
        uint256 lastSuccessEpoch;
        uint256 slashedCollateral;
        mapping(uint256 => uint256) proofsCountByEpoch;
    }

    struct Commitment {
        CommitmentInfo info;
        Vesting[] vestings;
        mapping(bytes32 => UnitProofsInfo) unitProofsInfoByUnit;
    }

    struct RewardInfo {
        uint256 minRequierdCCProofs;
        uint256 totalSuccessProofs;
    }

    struct Vesting {
        uint256 timestamp;
        uint256 cumulativeAmount;
    }

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT =
        bytes32(uint256(keccak256("fluence.core.storage.v1.capacityCommitment")) - 1);

    struct CommitmentStorage {
        mapping(bytes32 => Commitment) commitments;
        mapping(uint256 => RewardInfo) rewardInfoByEpoch;
    }

    CommitmentStorage private _storage;

    function _getCommitmentStorage() private pure returns (CommitmentStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ----------------- Public View -----------------
    function getCCStatus(bytes32 commitmentId) external view returns (CCStatus) {
        CommitmentStorage storage s = _getCommitmentStorage();

        Commitment storage cc = s.commitments[commitmentId];

        uint256 currentEpoch_ = currentEpoch();
        if (_isFailed(cc, currentEpoch_)) {
            return CCStatus.Failed;
        } else if (currentEpoch_ >= _expiredEpoch(cc)) {
            return CCStatus.Inactive;
        } else if (cc.info.startEpoch == 0) {
            return CCStatus.WaitDelegation;
        } else {
            return CCStatus.Active;
        }
    }

    function getCapacityCommitment(bytes32 commitmentId) external view returns (CommitmentInfo memory) {
        CommitmentStorage storage s = _getCommitmentStorage();
        return s.commitments[commitmentId].info;
    }

    function totalRewards(bytes32 commitmentId) external view returns (uint256) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        uint256 length = cc.vestings.length;
        if (length == 0) {
            return 0;
        }

        return cc.vestings[length - 1].cumulativeAmount - cc.info.totalWithdrawnReward;
    }

    function unlockedRewards(bytes32 commitmentId) external view returns (uint256) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        (int256 index,) = _findClosestMinVestingByTimestamp(cc.vestings, block.timestamp);
        require(index >= 0, "No vesting found");

        return cc.vestings[uint256(index)].cumulativeAmount - cc.info.totalWithdrawnReward;
    }

    // ----------------- Public Mutable -----------------
    function createCapacityCommitment(bytes32 peerId, uint256 duration, address delegator, uint256 rewardDelegationRate)
        external
    {
        CommitmentStorage storage s = _getCommitmentStorage();

        ComputePeer storage peer = _getComutePeer(peerId);
        require(peer.commitmentId == bytes32(0x00), "Peer already has commitment");

        Offer storage offer = _getOffer(peer.offerId);
        address provider = offer.provider;
        require(provider != address(0x00), "Offer doesn't exist");

        require(duration >= minCCDuration(), "Duration should be greater than min capacity commitment duration");
        require(rewardDelegationRate > 0, "Reward delegation rate should be greater than 0");
        require(rewardDelegationRate <= PRECISION, "Reward delegation rate should be less or equal 100");

        bytes32 commitmentId =
            keccak256(abi.encodePacked(block.number, peerId, duration, delegator, rewardDelegationRate));
        uint256 collateralPerUnit = fltCCCollateralPerUnit();
        s.commitments[commitmentId].info = CommitmentInfo({
            status: CCStatus.WaitDelegation,
            peerId: peerId,
            collateralPerUnit: collateralPerUnit,
            duration: duration,
            rewardDelegatorRate: rewardDelegationRate,
            delegator: delegator,
            currentCUSuccessCount: 0,
            totalCUFailCount: 0,
            snapshotEpoch: 0,
            startEpoch: 0,
            withdrawCCEpochAfterFailed: 0,
            failedEpoch: 0,
            remainingFailsForLastEpoch: 0,
            exitedUnitCount: 0,
            totalWithdrawnReward: 0
        });
        peer.commitmentId = commitmentId;

        emit CapacityCommitmentCreated(peerId, commitmentId, delegator, rewardDelegationRate, collateralPerUnit);
    }

    function removeTempCapacityCommitment(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        require(cc.info.startEpoch == 0, "Capacity commitment is created");

        delete s.commitments[commitmentId];
        peer.commitmentId = bytes32(0x00);

        emit CapacityCommitmentRemoved(commitmentId);
    }

    function finishCapacityCommitment(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        uint256 currentEpoch_ = currentEpoch();
        uint256 expiredEpoch = _expiredEpoch(cc);
        CCStatus status = _commitCCSnapshot(cc, peer, currentEpoch_ - 1, expiredEpoch);

        require(status == CCStatus.Inactive || status == CCStatus.Failed, "Capacity commitment is active");
        if (status == CCStatus.Failed) {
            require(
                currentEpoch_ >= cc.info.withdrawCCEpochAfterFailed, "Capacity commitment is not ready for withdraw"
            );
        }

        uint256 unitCount = peer.unitCount;
        require(cc.info.exitedUnitCount == unitCount, "Capacity commitment wait compute units");

        address delegator = cc.info.delegator;
        uint256 collateralPerUnit_ = cc.info.collateralPerUnit;

        uint256 totalCollateral = collateralPerUnit_ * unitCount;
        uint256 slashedCollateral = cc.info.totalCUFailCount * collateralPerUnit_;

        totalCollateral -= slashedCollateral;

        IERC20(fluenceToken()).safeTransfer(delegator, totalCollateral);

        emit CapacityCommitmentFinished(commitmentId);
    }

    function depositCapacityCommitmentCollateral(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        require(cc.info.startEpoch == 0, "Capacity commitment is created");
        require(cc.info.delegator == msg.sender, "Only delegator can lock collateral");

        uint256 currentEpoch_ = currentEpoch();
        cc.info.startEpoch = currentEpoch_ + 1;
        cc.info.snapshotEpoch = currentEpoch_;

        uint256 unitCount = peer.unitCount;
        uint256 collateral = unitCount * cc.info.collateralPerUnit;

        _setCCActiveUnitCount(ccActiveUnitCount() + unitCount);
        IERC20(fluenceToken()).safeTransferFrom(msg.sender, address(this), collateral);

        cc.info.status = CCStatus.Active;

        emit CollateralDeposited(commitmentId, collateral);
        emit CapacityCommitmentActivated(commitmentId);
    }

    function submitProof(bytes32 unitId, bytes calldata proof) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        ComputeUnit storage unit = _getComputeUnit(unitId);
        ComputePeer storage peer = _getComutePeer(unit.peerId);

        require(peer.owner == msg.sender, "Only compute peer owner can submit proof");

        bytes32 commitmentId = peer.commitmentId;
        Commitment storage cc = s.commitments[commitmentId];

        require(commitmentId != bytes32(0x00), "Compute unit doesn't have commitment");

        uint256 epoch = currentEpoch();
        uint256 expiredEpoch = _expiredEpoch(cc);

        require(epoch >= cc.info.startEpoch, "Capacity commitment is not started");

        CCStatus status = _commitCCSnapshot(cc, peer, epoch - 1, expiredEpoch);
        require(status == CCStatus.Active, "Capacity commitment is not active");

        uint256 minRequierdCCProofs_ = minCCRequierdProofsPerEpoch();

        UnitProofsInfo storage unitProofsInfo = cc.unitProofsInfoByUnit[unitId];
        uint256 unitProofsCount = unitProofsInfo.proofsCountByEpoch[epoch];

        unitProofsCount += 1;
        require(unitProofsCount <= maxCCProofsPerEpoch(), "Too many proofs");

        if (unitProofsCount == minRequierdCCProofs_) {
            cc.info.currentCUSuccessCount += 1;
            _commitCUSnapshot(cc, unit, unitProofsInfo, epoch, expiredEpoch, cc.info.failedEpoch);

            uint256 totalSuccessProofs = s.rewardInfoByEpoch[epoch].totalSuccessProofs;
            if (totalSuccessProofs == 0) {
                s.rewardInfoByEpoch[epoch].minRequierdCCProofs = minRequierdCCProofs_;
            }

            s.rewardInfoByEpoch[epoch].totalSuccessProofs = totalSuccessProofs + unitProofsCount;
        } else if (unitProofsCount > minRequierdCCProofs_) {
            s.rewardInfoByEpoch[epoch].totalSuccessProofs += 1;
        }

        unitProofsInfo.proofsCountByEpoch[epoch] = unitProofsCount;

        emit ProofSubmitted(commitmentId, unitId);
    }

    function commitCCSnapshot(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        uint256 epoch = currentEpoch();
        uint256 expiredEpoch = _expiredEpoch(cc);
        _commitCCSnapshot(cc, peer, epoch - 1, expiredEpoch);
    }

    function removeCUFromCC(bytes32 commitmentId, bytes32[] calldata unitIds) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        uint256 currentEpoch_ = currentEpoch();
        uint256 expiredEpoch = _expiredEpoch(cc);

        bytes32 peerId = cc.info.peerId;
        ComputePeer storage peer = _getComutePeer(peerId);

        CCStatus status = _commitCCSnapshot(cc, peer, currentEpoch_ - 1, expiredEpoch);
        require(status == CCStatus.Inactive || status == CCStatus.Failed, "Capacity commitment is active");

        uint256 failedEpoch = cc.info.failedEpoch;

        for (uint256 i = 0; i < unitIds.length; i++) {
            bytes32 unitId = unitIds[i];
            ComputeUnit storage unit = _getComputeUnit(unitId);

            require(unit.peerId == peerId, "Compute unit doesn't belong to capacity commitment");

            if (unit.deal != address(0x00)) {
                // TODO: double gas for getting peer
                returnComputeUnitFromDeal(unitId);
            }

            bool success =
                _commitCUSnapshot(cc, unit, cc.unitProofsInfoByUnit[unitId], currentEpoch_, expiredEpoch, failedEpoch);
            if (success) {
                cc.info.exitedUnitCount += 1;
            }
        }
    }

    function withdrawCCReward(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        (int256 index, uint256 length) = _findClosestMinVestingByTimestamp(cc.vestings, block.timestamp);
        require(index >= 0, "Nothing to withdraw");

        _commitCCSnapshot(cc, _getComutePeer(cc.info.peerId), currentEpoch() - 1, _expiredEpoch(cc));

        Vesting storage vesting = cc.vestings[uint256(index)];
        uint256 totalWithdrawnReward = cc.info.totalWithdrawnReward;
        uint256 amount = vesting.cumulativeAmount - totalWithdrawnReward;

        if (uint256(index) == (length - 1)) {
            cc.vestings[cc.vestings.length - 1].cumulativeAmount = 0;
            cc.info.totalWithdrawnReward = 0;
        } else {
            cc.info.totalWithdrawnReward = totalWithdrawnReward + amount;
        }

        IERC20 flt = IERC20(fluenceToken());

        uint256 delegatorReward = (amount * cc.info.rewardDelegatorRate) / PRECISION;
        uint256 providerReward = amount - delegatorReward;

        flt.safeTransfer(cc.info.delegator, delegatorReward);
        flt.safeTransfer(_getOffer(_getComutePeer(cc.info.peerId).offerId).provider, providerReward);

        emit RewardWithdrawn(commitmentId, amount);
    }

    // ----------------- Internal View -----------------
    function _isFailed(Commitment storage cc, uint256 currentEpoch_) private view returns (bool) {
        return currentEpoch_ >= _failedEpoch(cc);
    }

    function _failedEpoch(Commitment storage cc) private view returns (uint256) {
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        uint256 maxFailedRatio_ = maxCCProofsPerEpoch();
        uint256 unitCount = peer.unitCount;
        uint256 maxFails = maxFailedRatio_ * unitCount;
        uint256 failsPerEpoch = unitCount;
        uint256 remainingFails = maxFails - cc.info.totalCUFailCount;

        return cc.info.snapshotEpoch + (remainingFails / failsPerEpoch);
    }

    function _expiredEpoch(Commitment storage cc) private view returns (uint256) {
        return cc.info.startEpoch + cc.info.duration;
    }

    function _findClosestMinVestingByTimestamp(Vesting[] storage vestings, uint256 timestamp)
        internal
        view
        returns (int256 index, uint256 length)
    {
        length = vestings.length;
        index = -1;

        uint256 low = 0;
        uint256 high = length - 1;

        while (low <= high) {
            uint256 mid = (low + high) / 2;

            Vesting storage vesting = vestings[mid];
            uint256 vestingTimestamp = vesting.timestamp;

            if (timestamp > vestingTimestamp) {
                index = int256(mid);
                low = mid + 1;
            } else if (timestamp < vestingTimestamp) {
                high = mid - 1;
            } else {
                return (int256(mid), length);
            }
        }
    }

    // ----------------- Internal Mutable -----------------
    function _commitCUSnapshot(
        Commitment storage cc,
        ComputeUnit storage unit,
        UnitProofsInfo storage unitProofsInfo,
        uint256 epoch,
        uint256 expiredEpoch,
        uint256 ccFaildEpoch
    ) internal returns (bool) {
        CommitmentStorage storage s = _getCommitmentStorage();

        uint256 prevEpoch = epoch - 1;
        if (prevEpoch > expiredEpoch) {
            prevEpoch = expiredEpoch;
        }

        if (ccFaildEpoch != 0 && prevEpoch > ccFaildEpoch) {
            prevEpoch = ccFaildEpoch;
        }

        uint256 lastSuccessEpoch = unitProofsInfo.lastSuccessEpoch;
        if (lastSuccessEpoch == 0) {
            lastSuccessEpoch = cc.info.startEpoch - 1;
        }

        if (prevEpoch <= lastSuccessEpoch) {
            return false;
        }

        uint256 slashedCollateral = unitProofsInfo.slashedCollateral;
        uint256 collateralPerUnit_ = cc.info.collateralPerUnit;
        uint256 currentAmount = collateralPerUnit_ - slashedCollateral;

        uint256 count = prevEpoch - lastSuccessEpoch;
        if (currentAmount > 0) {
            slashedCollateral += (collateralPerUnit_ * count * ccSlashingRate()) / PRECISION;

            if (prevEpoch == ccFaildEpoch) {
                uint256 remainingFailsForLastEpoch = cc.info.remainingFailsForLastEpoch;
                if (remainingFailsForLastEpoch > 0 && unit.index < remainingFailsForLastEpoch) {
                    slashedCollateral += (collateralPerUnit_ * ccSlashingRate()) / PRECISION;
                }
            }

            unitProofsInfo.slashedCollateral = slashedCollateral;
        }

        unitProofsInfo.lastSuccessEpoch = prevEpoch;

        RewardInfo storage rewardInfo = s.rewardInfoByEpoch[lastSuccessEpoch];
        uint256 reward = (
            getCCRewardPool(lastSuccessEpoch)
                * ((unitProofsInfo.proofsCountByEpoch[lastSuccessEpoch] * PRECISION) / rewardInfo.totalSuccessProofs)
        ) / PRECISION;

        uint256 vestingLength = cc.vestings.length;
        uint256 cumulativeAmount = 0;
        if (vestingLength > 0) {
            cumulativeAmount = cc.vestings[vestingLength - 1].cumulativeAmount;
        }

        cc.vestings.push(
            Vesting({timestamp: block.timestamp + ccVestingDuration(), cumulativeAmount: cumulativeAmount + reward})
        );

        delete unitProofsInfo.proofsCountByEpoch[lastSuccessEpoch];

        return true;
    }

    function _commitCCSnapshot(Commitment storage cc, ComputePeer storage peer, uint256 epoch, uint256 expiredEpoch)
        private
        returns (CCStatus)
    {
        CCStatus storageStatus = cc.info.status;
        if (storageStatus != CCStatus.Active) {
            return storageStatus;
        }

        uint256 snapshotEpoch = cc.info.snapshotEpoch;
        require(epoch >= snapshotEpoch, "Epoch is too early");

        CCStatus newStatus = CCStatus.Active;
        if (epoch > expiredEpoch) {
            epoch = expiredEpoch;
            newStatus = CCStatus.Inactive;
        }

        uint256 unitCount = peer.unitCount;
        uint256 epochCount = epoch - snapshotEpoch;
        uint256 reqSuccessCount = unitCount * epochCount;
        uint256 totalFailCountByPeriod = reqSuccessCount - cc.info.currentCUSuccessCount;

        uint256 maxFailedRatio_ = maxCCProofsPerEpoch();
        uint256 maxFails = maxFailedRatio_ * peer.unitCount;

        uint256 totalCUFailCount = cc.info.totalCUFailCount;
        totalCUFailCount += totalFailCountByPeriod;
        if (totalCUFailCount >= maxFails) {
            totalCUFailCount = maxFails;

            uint256 failsPerEpoch = unitCount;
            uint256 remainingFails = maxFails - totalCUFailCount;
            uint256 failedEpoch = snapshotEpoch + (remainingFails / failsPerEpoch);
            cc.info.failedEpoch = failedEpoch;
            cc.info.remainingFailsForLastEpoch = remainingFails % failsPerEpoch;
            cc.info.withdrawCCEpochAfterFailed = failedEpoch + ccWithdrawEpochesAfterFailed();

            newStatus = CCStatus.Failed;
        }

        cc.info.totalCUFailCount = totalCUFailCount;
        cc.info.currentCUSuccessCount = 0;
        cc.info.snapshotEpoch = epoch;

        if (newStatus != CCStatus.Active) {
            _setCCActiveUnitCount(ccActiveUnitCount() - unitCount);
            cc.info.status = newStatus;
        }

        return newStatus;
    }
}
