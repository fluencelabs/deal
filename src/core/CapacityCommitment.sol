// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "../utils/OwnableUpgradableDiamond.sol";
import "../deal/base/Types.sol";
import "../utils/LinkedListWithUniqueKeys.sol";
import "../deal/interfaces/IDeal.sol";
import "./Market.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CapacityCommitment is Market {
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
        bytes32 peerId;
        uint collateralPerUnit;
        uint duration;
        uint rewardDelegatorRate;
        address delegator;
        uint currentCUSuccessCount;
        uint totalCUFailCount;
        uint snapshotEpoch;
        uint startEpoch;
        uint failedEpoch;
        uint withdrawCCEpochAfterFailed;
        uint remainingFailsForLastEpoch;
        uint exitedUnitCount;
        uint totalWithdrawnReward;
    }

    struct UnitProofsInfo {
        uint lastSuccessEpoch;
        uint slashedCollateral;
        mapping(uint => uint) proofsCountByEpoch;
    }

    struct Commitment {
        CommitmentInfo info;
        Vesting[] vestings;
        mapping(bytes32 => UnitProofsInfo) unitProofsInfoByUnit;
    }

    struct RewardInfo {
        uint minRequierdCCProofs;
        uint totalSuccessProofs;
        uint rewardPool;
    }

    struct Vesting {
        uint timestamp;
        uint cumulativeAmount;
    }

    // ------------------ Events ------------------

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1.capacityCommitment")) - 1);

    struct CommitmentStorage {
        mapping(bytes32 => Commitment) commitments;
        mapping(uint => RewardInfo) rewardInfoByEpoch;
    }

    CommitmentStorage private _storage;

    function _getCommitmentStorage() private pure returns (CommitmentStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ----------------- Internal View -----------------
    function _isFailed(Commitment storage cc, uint currentEpoch_) private view returns (bool) {
        return currentEpoch_ >= _failedEpoch(cc);
    }

    function _failedEpoch(Commitment storage cc) private view returns (uint) {
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        uint maxFailedRatio_ = maxFailedRatio();
        uint unitCount = peer.info.unitCount;
        uint maxFails = maxFailedRatio_ * unitCount;
        uint failsPerEpoch = unitCount;
        uint remainingFails = maxFails - cc.info.totalCUFailCount;

        return cc.info.snapshotEpoch + (remainingFails / failsPerEpoch);
    }

    function _expiredEpoch(Commitment storage cc) private view returns (uint) {
        return cc.info.startEpoch + cc.info.duration;
    }

    function _findClosestMinVestingByTimestamp(Vesting[] storage vestings, uint timestamp) internal view returns (int index, uint length) {
        length = vestings.length;
        index = -1;

        uint low = 0;
        uint high = length - 1;

        Vesting storage vesting;
        while (low <= high) {
            uint mid = (low + high) / 2;

            vesting = vestings[mid];
            uint vestingTimestamp = vesting.timestamp;

            if (low == high) {
                if (timestamp >= vestingTimestamp) {
                    return (int(mid), length);
                } else {
                    return (int(mid) - 1, length);
                }
            }

            if (timestamp < vestingTimestamp) {
                high = mid - 1;
            } else if (timestamp > vestingTimestamp) {
                low = mid + 1;
            } else {
                return (int(mid), length);
            }
        }

        return (-1, length);
    }

    // ----------------- Internal Mutable -----------------
    function _commitCUSnapshot(
        Commitment storage cc,
        ComputeUnit storage unit,
        UnitProofsInfo storage unitProofsInfo,
        uint epoch,
        uint expiredEpoch,
        uint ccFaildEpoch
    ) internal returns (bool) {
        CommitmentStorage storage s = _getCommitmentStorage();

        // slash compute unit
        uint prevEpoch = epoch - 1;
        if (prevEpoch > expiredEpoch) {
            prevEpoch = expiredEpoch;
        }

        if (ccFaildEpoch != 0 && prevEpoch > ccFaildEpoch) {
            prevEpoch = ccFaildEpoch;
        }

        uint lastSuccessEpoch = unitProofsInfo.lastSuccessEpoch;
        if (lastSuccessEpoch == 0) {
            unitProofsInfo.lastSuccessEpoch = cc.info.startEpoch - 1;
        }

        if (prevEpoch <= lastSuccessEpoch) {
            return false;
        }

        uint slashedCollateral = unitProofsInfo.slashedCollateral;
        uint collateralPerUnit_ = cc.info.collateralPerUnit;
        uint currentAmount = collateralPerUnit_ - slashedCollateral;

        uint count = prevEpoch - lastSuccessEpoch;
        if (count > 0 && currentAmount > 0) {
            slashedCollateral += (collateralPerUnit_ * count * slashingRate()) / PRECISION;

            if (prevEpoch == ccFaildEpoch) {
                uint remainingFailsForLastEpoch = cc.info.remainingFailsForLastEpoch;
                if (remainingFailsForLastEpoch > 0 && unit.index < remainingFailsForLastEpoch) {
                    slashedCollateral += (collateralPerUnit_ * slashingRate()) / PRECISION;
                }
            }

            unitProofsInfo.slashedCollateral = slashedCollateral;
        }

        RewardInfo storage rewardInfo = s.rewardInfoByEpoch[lastSuccessEpoch];
        uint reward = (rewardInfo.rewardPool *
            ((unitProofsInfo.proofsCountByEpoch[lastSuccessEpoch] * PRECISION) / rewardInfo.totalSuccessProofs)) / PRECISION;

        Vesting storage lastVesting = cc.vestings[cc.vestings.length - 1];
        cc.vestings.push(
            Vesting({ timestamp: block.timestamp + vestingDuration(), cumulativeAmount: lastVesting.cumulativeAmount + reward })
        );

        delete unitProofsInfo.proofsCountByEpoch[lastSuccessEpoch];

        unitProofsInfo.lastSuccessEpoch = prevEpoch;

        return true;
    }

    function _commitCCSnapshot(Commitment storage cc, ComputePeer storage peer, uint epoch, uint expiredEpoch) private {
        uint snapshotEpoch = cc.info.snapshotEpoch;
        if (snapshotEpoch >= epoch) {
            return;
        }

        if (epoch > expiredEpoch) {
            epoch = expiredEpoch;
        }

        uint unitCount = peer.info.unitCount;
        uint epochCount = epoch - snapshotEpoch;
        uint reqSuccessCount = unitCount * epochCount;
        uint totalFailCountByPeriod = reqSuccessCount - cc.info.currentCUSuccessCount;

        uint maxFailedRatio_ = maxFailedRatio();
        uint maxFails = maxFailedRatio_ * peer.info.unitCount;

        uint totalCUFailCount = cc.info.totalCUFailCount;
        totalCUFailCount += totalFailCountByPeriod;
        if (totalCUFailCount >= maxFails) {
            totalCUFailCount = maxFails;

            uint failsPerEpoch = unitCount;
            uint remainingFails = maxFails - totalCUFailCount;
            uint failedEpoch = snapshotEpoch + (remainingFails / failsPerEpoch);
            cc.info.failedEpoch = failedEpoch;
            cc.info.remainingFailsForLastEpoch = remainingFails % failsPerEpoch;
            cc.info.withdrawCCEpochAfterFailed = failedEpoch + withdrawCCEpochesAfterFailed();
        }

        cc.info.totalCUFailCount = totalCUFailCount;
        cc.info.currentCUSuccessCount = 0;
        cc.info.snapshotEpoch = epoch;
    }

    // // ----------------- Public View -----------------
    function getCCStatus(bytes32 commitmentId) external view returns (CCStatus) {
        CommitmentStorage storage s = _getCommitmentStorage();

        Commitment storage cc = s.commitments[commitmentId];

        uint currentEpoch_ = currentEpoch();
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

    // ----------------- Public Mutable -----------------
    function totalRewards(bytes32 commitmentId) external view returns (uint256) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        uint last = cc.vestings.length - 1;
        return cc.vestings[last].cumulativeAmount - cc.info.withdrawCCEpochAfterFailed;
    }

    function unlockedRewards(bytes32 commitmentId) external view returns (uint256) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        (int index, uint length) = _findClosestMinVestingByTimestamp(cc.vestings, block.timestamp);
        require(index >= 0, "No vesting found");

        return cc.vestings[uint(index)].cumulativeAmount - cc.info.totalWithdrawnReward;
    }

    function createCapacityCommitment(bytes32 peerId, uint duration, address delegator, uint rewardDelegationRate) external {
        CommitmentStorage storage s = _getCommitmentStorage();

        ComputePeer storage peer = _getComutePeer(peerId);
        require(peer.info.commitmentId == bytes32(0x00), "Peer already has commitment");

        Offer storage offer = _getOffer(peer.info.offerId);
        address provider = offer.info.owner;
        require(provider != address(0x00), "Offer doesn't exist");

        require(duration > minCapacityCommitmentDuration(), "Duration should be greater than min capacity commitment duration");
        require(rewardDelegationRate > 0, "Reward delegation rate should be greater than 0");
        require(rewardDelegationRate <= PRECISION, "Reward delegation rate should be less or equal 100");

        bytes32 commitmentId = keccak256(abi.encodePacked(block.number, peerId, duration, delegator, rewardDelegationRate));
        s.commitments[commitmentId].info = CommitmentInfo({
            peerId: peerId,
            collateralPerUnit: collateralPerUnit(),
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
        peer.info.commitmentId = commitmentId;
    }

    function removeTempCapacityCommitment(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        require(cc.info.startEpoch == 0, "Capacity commitment is created");

        delete s.commitments[commitmentId];
        peer.info.commitmentId = bytes32(0x00);
    }

    function finishCapacityCommitment(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        uint currentEpoch_ = currentEpoch();
        uint expiredEpoch = _expiredEpoch(cc);
        _commitCCSnapshot(cc, peer, currentEpoch_ - 1, expiredEpoch);

        uint failedEpoch = cc.info.failedEpoch;
        require(currentEpoch_ >= expiredEpoch || failedEpoch != 0, "Capacity commitment is active");

        if (failedEpoch != 0) {
            require(currentEpoch_ >= cc.info.withdrawCCEpochAfterFailed, "Capacity commitment is not ready for withdraw");
        }

        uint unitCount = peer.info.unitCount;
        require(cc.info.exitedUnitCount == unitCount, "Capacity commitment wait compute units");

        address delegator = cc.info.delegator;
        uint collateralPerUnit_ = cc.info.collateralPerUnit;

        uint totalCollateral = collateralPerUnit_ * unitCount;
        uint slashedCollateral = cc.info.totalCUFailCount * collateralPerUnit_;

        totalCollateral -= slashedCollateral;

        IERC20(fluenceToken()).safeTransfer(delegator, totalCollateral);
    }

    function lockCollateral(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        require(cc.info.startEpoch == 0, "Capacity commitment is created");
        require(cc.info.delegator == msg.sender, "Only delegator can lock collateral");

        uint currentEpoch_ = currentEpoch();
        cc.info.startEpoch = currentEpoch_ + 1;
        cc.info.snapshotEpoch = currentEpoch_;

        uint collateral = peer.info.unitCount * cc.info.collateralPerUnit;
        IERC20(fluenceToken()).safeTransferFrom(msg.sender, address(this), collateral);
    }

    function submitProof(bytes32 unitId, bytes calldata proof) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        ComputeUnit storage unit = _getComputeUnit(unitId);
        ComputePeer storage peer = _getComutePeer(unit.peerId);

        bytes32 commitmentId = peer.info.commitmentId;
        Commitment storage cc = s.commitments[commitmentId];

        require(commitmentId != bytes32(0x00), "Compute unit doesn't have commitment");

        uint epoch = currentEpoch();
        uint expiredEpoch = _expiredEpoch(cc);

        _commitCCSnapshot(cc, peer, epoch - 1, expiredEpoch);

        //TODO: if cc duration is over, then cc status is Inactive
        require(epoch < expiredEpoch && cc.info.failedEpoch != 0, "Capacity commitment is expired");

        uint minRequierdCCProofs_ = minRequierdCCProofs();

        UnitProofsInfo storage unitProofsInfo = cc.unitProofsInfoByUnit[unitId];
        uint unitProofsCount = unitProofsInfo.proofsCountByEpoch[epoch];

        unitProofsCount += 1;
        require(unitProofsCount <= maxCCProofs(), "Too many proofs");

        if (unitProofsCount == minRequierdCCProofs_) {
            cc.info.currentCUSuccessCount += 1;
            _commitCUSnapshot(cc, unit, unitProofsInfo, epoch, expiredEpoch, cc.info.failedEpoch);

            uint totalSuccessProofs = s.rewardInfoByEpoch[epoch].totalSuccessProofs;
            if (totalSuccessProofs == 0) {
                s.rewardInfoByEpoch[epoch].minRequierdCCProofs = minRequierdCCProofs_;
                s.rewardInfoByEpoch[epoch].rewardPool = 0; //TODO; add reward pool
            }

            s.rewardInfoByEpoch[epoch].totalSuccessProofs = totalSuccessProofs + unitProofsCount;
        } else if (unitProofsCount > minRequierdCCProofs_) {
            s.rewardInfoByEpoch[epoch].totalSuccessProofs += 1;
        }

        unitProofsInfo.proofsCountByEpoch[epoch] = unitProofsCount;
    }

    function commitCCSnapshot(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        uint epoch = currentEpoch();
        uint expiredEpoch = _expiredEpoch(cc);
        _commitCCSnapshot(cc, peer, epoch - 1, expiredEpoch);
    }

    function removeCUFromCC(bytes32 commitmentId, bytes32[] calldata unitIds) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        uint currentEpoch_ = currentEpoch();
        uint expiredEpoch = _expiredEpoch(cc);
        uint failedEpoch = cc.info.failedEpoch;

        bytes32 peerId = cc.info.peerId;
        ComputePeer storage peer = _getComutePeer(peerId);

        _commitCCSnapshot(cc, peer, currentEpoch_ - 1, expiredEpoch);

        for (uint i = 0; i < unitIds.length; i++) {
            bytes32 unitId = unitIds[i];
            ComputeUnit storage unit = _getComputeUnit(unitId);

            require(unit.peerId == peerId, "Compute unit doesn't belong to capacity commitment");

            require(currentEpoch_ >= expiredEpoch || failedEpoch != 0, "Capacity commitment is active");

            if (unit.deal != address(0x00)) {
                // TODO: double gas for getting peer
                returnComputeUnitFromDeal(unitId);
            }

            bool success = _commitCUSnapshot(cc, unit, cc.unitProofsInfoByUnit[unitId], currentEpoch_, expiredEpoch, failedEpoch);
            if (success) {
                cc.info.exitedUnitCount += 1;
            }
        }
    }

    function withdraw(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        (int index, uint length) = _findClosestMinVestingByTimestamp(cc.vestings, block.timestamp);
        require(index >= 0, "Nothing to withdraw");

        Vesting storage vesting = cc.vestings[uint(index)];
        uint totalWithdrawnReward = cc.info.totalWithdrawnReward;
        uint amount = vesting.cumulativeAmount - totalWithdrawnReward;

        require(amount > 0, "Nothing to withdraw");

        if (uint(index) == (length - 1)) {
            cc.vestings[cc.vestings.length - 1].cumulativeAmount = 0;
            cc.info.totalWithdrawnReward = 0;
        } else {
            cc.info.totalWithdrawnReward = totalWithdrawnReward + amount;
        }

        IERC20 flt = IERC20(fluenceToken());

        uint delegatorReward = (amount * cc.info.rewardDelegatorRate) / PRECISION;
        uint providerReward = amount - delegatorReward;

        flt.safeTransfer(cc.info.delegator, delegatorReward);
        flt.safeTransfer(_getOffer(_getComutePeer(cc.info.peerId).info.offerId).info.owner, providerReward);
    }
}
