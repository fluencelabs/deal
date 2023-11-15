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
        uint totalRewards;
    }

    struct UnitProofsInfo {
        uint lastSuccessEpoch;
        uint slashedCollateral;
        mapping(uint => uint) proofsCountByEpoch;
    }

    struct Commitment {
        CommitmentInfo info;
        mapping(bytes32 => UnitProofsInfo) unitProofsInfoByUnit;
    }

    // ------------------ Events ------------------

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1.capacityCommitment")) - 1);

    struct CommitmentStorage {
        mapping(bytes32 => Commitment) commitments;
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

    // ----------------- Internal Mutable -----------------
    function _commitCUSnapshot(
        Commitment storage cc,
        UnitProofsInfo storage unitProofsInfo,
        uint epoch,
        uint expiredEpoch,
        uint ccFaildEpoch
    ) internal {
        // slash compute unit
        uint prevEpoch = epoch - 1;
        if (prevEpoch > expiredEpoch) {
            prevEpoch = expiredEpoch;
        }

        if (prevEpoch > ccFaildEpoch && ccFaildEpoch != 0) {
            prevEpoch = ccFaildEpoch;
        }

        uint lastSuccessEpoch = unitProofsInfo.lastSuccessEpoch;
        if (lastSuccessEpoch == 0) {
            unitProofsInfo.lastSuccessEpoch = cc.info.startEpoch - 1;
        }

        if (prevEpoch <= lastSuccessEpoch) {
            return;
        }

        uint slashedCollateral = unitProofsInfo.slashedCollateral;
        uint collateralPerUnit_ = cc.info.collateralPerUnit;
        uint currentAmount = collateralPerUnit_ - slashedCollateral;

        uint count = prevEpoch - lastSuccessEpoch;
        if (count > 0 && currentAmount > 0) {
            slashedCollateral += (collateralPerUnit_ * count * slashingRate()) / PRECISION;

            if (slashedCollateral >= collateralPerUnit_) {
                slashedCollateral = collateralPerUnit_;
            }
            unitProofsInfo.slashedCollateral = slashedCollateral;
        }

        unitProofsInfo.lastSuccessEpoch = prevEpoch;
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
            cc.info.failedEpoch = snapshotEpoch + (remainingFails / failsPerEpoch);
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
            failedEpoch: 0,
            totalRewards: 0
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

        require(currentEpoch_ >= expiredEpoch || cc.info.failedEpoch != 0, "Capacity commitment is active");

        address delegator = cc.info.delegator;
        uint collateral = cc.info.collateralPerUnit * peer.info.unitCount;
        // TODO: slashing
        // TODO: verify unit in deal

        uint totalRewards = cc.info.totalRewards;

        IERC20(fluenceToken()).safeTransfer(delegator, collateral);
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
            _commitCUSnapshot(cc, unitProofsInfo, epoch, expiredEpoch, cc.info.failedEpoch);
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

    function removeCUFromCC(bytes32 commitmentId, bytes32 unitId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        ComputePeer storage peer = _getComutePeer(cc.info.peerId);

        require(cc.info.startEpoch == 0, "Capacity commitment is created");

        uint epoch = currentEpoch();
        uint expiredEpoch = _expiredEpoch(cc);
        _commitCCSnapshot(cc, peer, epoch - 1, expiredEpoch);

        UnitProofsInfo storage unitProofsInfo = cc.unitProofsInfoByUnit[unitId];
        _commitCUSnapshot(cc, unitProofsInfo, epoch, expiredEpoch, cc.info.failedEpoch);
    }
}
