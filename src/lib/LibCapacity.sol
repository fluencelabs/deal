// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {ICapacity} from "src/core/modules/capacity/interfaces/ICapacity.sol";
import {IOffer} from "src/core/modules/market/interfaces/IOffer.sol";
import {Snapshot} from "src/core/modules/capacity/Snapshot.sol";
import {LibOffer} from "src/lib/LibOffer.sol";
import {LibEpochController} from "src/lib/LibEpochController.sol";
import {LibCapacityConst} from "src/lib/LibCapacityConst.sol";
import {PRECISION} from "src/utils/Common.sol";
import {Vesting} from "src/core/modules/capacity/Vesting.sol";

struct CommitmentStorage {
    mapping(bytes32 => ICapacity.Commitment) commitments;
    mapping(uint256 => RewardInfo) rewardInfoByEpoch;
    mapping(bytes32 => mapping(bytes32 => bool)) isProofSubmittedByUnit;
    bytes32 globalNonce;
    bytes32 nextGlobalNonce;
    uint256 changedNonceEpoch;
    uint256 rewardBalance;
}

struct RewardInfo {
    uint256 minProofsPerEpoch;
    uint256 totalSuccessProofs;
}

library LibCapacity {
    using Snapshot for Snapshot.Cache;
    using Vesting for Vesting.Info;

    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.capacity.storage.v1")) - 1);

    function store() internal pure returns (CommitmentStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function _expiredEpoch(ICapacity.Commitment storage cc) internal view returns (uint256) {
        return cc.info.startEpoch + cc.info.duration;
    }

    function getStatus(bytes32 commitmentId) internal view returns (ICapacity.CCStatus) {
        CommitmentStorage storage s = store();
        ICapacity.Commitment storage cc = s.commitments[commitmentId];

        bytes32 peerId = cc.info.peerId;
        require(peerId != bytes32(0x00), "Capacity commitment doesn't exist");

        IOffer.ComputePeer memory peer = LibOffer.getComputePeer(peerId);

        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        ICapacity.CCStatus status = _preCommitCommitmentSnapshot(cc, snapshotCache, peer, LibEpochController.currentEpoch(), _expiredEpoch(cc));

        return status;
    }

    // IMPORTANT: This function affects the off-chain indexer. If you change it, make sure to update the indexer accordingly.
    function _preCommitCommitmentSnapshot(
        ICapacity.Commitment storage cc,
        Snapshot.Cache memory snapshotCache,
        IOffer.ComputePeer memory peer,
        uint256 currentEpoch_,
        uint256 expiredEpoch
    ) internal view returns (ICapacity.CCStatus) {
        ICapacity.CCStatus storageStatus = snapshotCache.current.status;
        uint256 lastSnapshotEpoch = snapshotCache.current.snapshotEpoch;
        uint256 snapshotEpoch = currentEpoch_ - 1;

        if (cc.info.startEpoch == 0) {
            return ICapacity.CCStatus.WaitDelegation;
        } else if (cc.info.startEpoch > currentEpoch_) {
            return ICapacity.CCStatus.WaitStart;
        }

        // only active status can have a snapshot and be changed because with other statuses CC can't work
        // also if snapshotEpoch is less or equal to lastSnapshotEpoch, then we have snapshot for this epoch
        if (storageStatus != ICapacity.CCStatus.Active || snapshotEpoch <= lastSnapshotEpoch) {
            return storageStatus;
        }

        ICapacity.CCStatus newStatus = ICapacity.CCStatus.Active;
        // if the snapshotEpoch is greater than expiredEpoch, then you need to take a snapshot only up to expiredEpoch
        uint256 lastWorkingEpoch = expiredEpoch - 1;
        if (snapshotEpoch >= lastWorkingEpoch) {
            snapshotEpoch = lastWorkingEpoch;
            newStatus = ICapacity.CCStatus.Inactive;
        }

        // #region init variables
        uint256 maxFailedRatio_ = LibCapacityConst.maxFailedRatio();
        uint256 activeUnitCount_ = snapshotCache.current.activeUnitCount;
        uint256 nextAdditionalActiveUnitCount_ = snapshotCache.current.nextAdditionalActiveUnitCount;
        uint256 totalFailCount = snapshotCache.current.totalFailCount;
        uint256 prevFailCount = totalFailCount;
        uint256 currentSuccessCount = snapshotCache.current.currentSuccessCount;

        // maxFailCount is a number of Epochs when units not send proofs
        // if on unit not send proof per one epoch, it's mean that it's one fail
        // maxFailedRatio is the ratio of failed attempts for all units
        uint256 maxFailCount = maxFailedRatio_ * peer.unitCount;
        uint256 snapshotEpochCount = snapshotEpoch - lastSnapshotEpoch;
        uint256 requiredSuccessCount = activeUnitCount_ * snapshotEpochCount;
        // #endregion

        // #region calculate fail count

        // When unit send min proof per one epoch, it's a one success. successCount is a number of success for all units in the snapshot period
        // if successCount is less than requiredSuccessCount, then some units didn't send min proof per few Epochs
        uint256 snapshotTotalFailCount = 0;
        if (currentSuccessCount < requiredSuccessCount) {
            // snapshotTotalFailCount is a number of fails for all units in the snapshot period
            snapshotTotalFailCount = requiredSuccessCount - currentSuccessCount;
            totalFailCount += snapshotTotalFailCount;
        }

        // if totalFailCount_ is more than maxFailCount, then CC is failed
        if (totalFailCount >= maxFailCount) {
            totalFailCount = maxFailCount;
            uint256 restFailCount = maxFailCount - prevFailCount;
            newStatus = ICapacity.CCStatus.Failed;

            if (activeUnitCount_ >= restFailCount) {
                snapshotCache.current.failedEpoch = lastSnapshotEpoch + 1;
                snapshotCache.current.remainingFailedUnitsInLastEpoch = restFailCount % activeUnitCount_;
            } else {
                uint256 newActiveUnitCount = activeUnitCount_ + nextAdditionalActiveUnitCount_;

                // numberOfFillFailedEpoch is a number of epochs when units not send proofs
                uint256 numberOfFillFailedEpoch = 1;
                restFailCount -= activeUnitCount_;

                // TOOD: add currentSuccessCount to calculation
                numberOfFillFailedEpoch += restFailCount / newActiveUnitCount;
                uint256 remainingFailedUnitsInLastEpoch = restFailCount % newActiveUnitCount;

                // Math.ceil(numberOfFillFailedEpoch)
                // if remainingFailedUnitsInLastEpoch is not zero, then we should add one to numberOfFillFailedEpoch becouse the last epoch is not full
                if (remainingFailedUnitsInLastEpoch != 0) {
                    numberOfFillFailedEpoch += 1;
                }

                snapshotCache.current.failedEpoch = lastSnapshotEpoch + numberOfFillFailedEpoch;
                snapshotCache.current.remainingFailedUnitsInLastEpoch = remainingFailedUnitsInLastEpoch;
            }
        }

        snapshotCache.current.totalFailCount = totalFailCount;
        // #endregion

        // #region update activeUnitCount
        // when unit return from deal, unit need to wait one epoch before it will be active
        // nextAdditionalActiveUnitCount is a number of units that will be active in the next epoch
        uint256 nextAdditionalActiveUnitCount = snapshotCache.current.nextAdditionalActiveUnitCount;

        // update activeUnitCount if it's needed
        if (nextAdditionalActiveUnitCount > 0) {
            snapshotCache.current.activeUnitCount += nextAdditionalActiveUnitCount;
            snapshotCache.current.nextAdditionalActiveUnitCount = 0;
        }

        // #endregion

        // #region update status
        if (newStatus != ICapacity.CCStatus.Active) {
            snapshotCache.current.activeUnitCount = 0;
            snapshotCache.current.status = newStatus;
        }
        // #endregion

        // #region update progress
        snapshotCache.current.snapshotEpoch = snapshotEpoch;
        snapshotCache.current.currentSuccessCount = 0;
        // #endregion

        return newStatus;
    }

    function _postCommitCommitmentSnapshot(
        bytes32 commitmentId,
        ICapacity.Commitment storage cc,
        Snapshot.Cache memory snapshotCache
    ) internal {
        if (snapshotCache.initial.status != snapshotCache.current.status) {
            uint256 initialActiveUnitCount_ =
                snapshotCache.initial.activeUnitCount + snapshotCache.initial.nextAdditionalActiveUnitCount;

            if (snapshotCache.current.status == ICapacity.CCStatus.Failed) {
                emit ICapacity.CommitmentFailed(commitmentId, snapshotCache.current.failedEpoch);

                LibCapacityConst._setActiveUnitCount(LibCapacityConst.activeUnitCount() - initialActiveUnitCount_);
            } else if (snapshotCache.current.status == ICapacity.CCStatus.Inactive) {
                LibCapacityConst._setActiveUnitCount(LibCapacityConst.activeUnitCount() - initialActiveUnitCount_);
            }
        }

        snapshotCache.save(cc);
    }

    function _commitUnitSnapshot(
        ICapacity.Commitment storage cc,
        ICapacity.UnitInfo storage unitInfo,
        uint256 currentEpoch,
        uint256 expiredEpoch,
        uint256 faildEpoch
    ) internal returns (bool) {
        CommitmentStorage storage s = store();
        uint256 snapshotEpoch = currentEpoch - 1;

        // #region verify args
        // if unit is inactive, then no need to do anything because it's means that unit is in deal
        if (unitInfo.isInactive) {
            return false;
        }

        // if snapshotEpoch is more than expiredEpoch, then we should use expiredEpoch because it means that the commitment is expired before we start making a snapshot
        uint256 lastWorkingEpoch = expiredEpoch - 1;
        if (snapshotEpoch > lastWorkingEpoch) {
            snapshotEpoch = lastWorkingEpoch;
        }

        // if faildEpoch is more than 0 and snapshotEpoch is more than faildEpoch, then we should use faildEpoch because it means that the commitment is failed before we start making a snapshot
        if (faildEpoch != 0 && snapshotEpoch > faildEpoch) {
            snapshotEpoch = faildEpoch;
        }

        // if lastMinProofsEpoch is zero then we should use startEpoch - 1 because (startEpoch - 1) is the first 'snapshoted' epoch
        uint256 lastSnapshotEpoch = unitInfo.lastSnapshotEpoch;
        if (lastSnapshotEpoch == 0) {
            lastSnapshotEpoch = cc.info.startEpoch - 1;
        }

        // if snapshotEpoch is less or equal to lastSnapshotEpoch, then we should return false because it means that we already made a snapshot for this epoch
        if (snapshotEpoch <= lastSnapshotEpoch) {
            return false;
        }
        // #endregion

        unitInfo.lastSnapshotEpoch = snapshotEpoch;

        // #region slashing
        uint256 slashedCollateral = unitInfo.slashedCollateral;
        uint256 collateralPerUnit_ = cc.info.collateralPerUnit;
        uint256 currentCollateral = collateralPerUnit_ - slashedCollateral;

        // slashingRate is defined by PRECISION
        // Example: if real slashing rate is 0.1% then slashingRate_ = 0.1 * PRECISION
        uint256 slashingRate_ = LibCapacityConst.slashingRate();

        // gapsCount is the number of epochs between lastSnapshotEpoch and snapshotEpoch. In this period unit didn't submit any proof
        uint256 gapsCount = snapshotEpoch - lastSnapshotEpoch;

        RewardInfo storage rewardInfo = s.rewardInfoByEpoch[snapshotEpoch];
        uint256 minProofsPerEpoch_ = rewardInfo.minProofsPerEpoch;
        if (minProofsPerEpoch_ != 0 && unitInfo.proofCountByEpoch[snapshotEpoch] >= minProofsPerEpoch_) {
            gapsCount--;
        }

        // if currentCollateral is more than 0, then we should slash
        if (currentCollateral > 0 && gapsCount > 0) {
            uint256 remainingFailedUnitsInLastEpoch = cc.finish.remainingFailedUnitsInLastEpoch;

            if (snapshotEpoch == faildEpoch && remainingFailedUnitsInLastEpoch != 0) {
                uint256 filledRemainingFailedUnitsInLastEpoch = cc.finish.filledRemainingFailedUnitsInLastEpoch;
                if (filledRemainingFailedUnitsInLastEpoch >= remainingFailedUnitsInLastEpoch) {
                    gapsCount -= 1;
                } else {
                    cc.finish.filledRemainingFailedUnitsInLastEpoch = filledRemainingFailedUnitsInLastEpoch + 1;
                }
            }

            slashedCollateral += (gapsCount * collateralPerUnit_ * slashingRate_) / PRECISION;
            if (slashedCollateral > currentCollateral) {
                slashedCollateral = currentCollateral;
            }
            unitInfo.slashedCollateral = slashedCollateral;
        }
        // #endregion

        // #region calculate reward for the last snapshoted epoch
        uint256 nextEpochAfterLastSnapshot = lastSnapshotEpoch + 1;
        uint256 lastProofCount = unitInfo.proofCountByEpoch[nextEpochAfterLastSnapshot];
        rewardInfo = s.rewardInfoByEpoch[nextEpochAfterLastSnapshot];
        if (lastProofCount < rewardInfo.minProofsPerEpoch) {
            return true;
        }

        uint256 totalSuccessProofs = rewardInfo.totalSuccessProofs;
        if (totalSuccessProofs == 0) {
            return true;
        }

        uint256 reward =
            (LibCapacityConst.getRewardPool(nextEpochAfterLastSnapshot) * lastProofCount) / rewardInfo.totalSuccessProofs;

        if (reward > 0) {
            cc.vesting.add(reward, snapshotEpoch, LibCapacityConst.vestingPeriodDuration(), LibCapacityConst.vestingPeriodCount());
        }

        delete unitInfo.proofCountByEpoch[nextEpochAfterLastSnapshot];
        // #endregion

        return true;
    }

    function onUnitMovedToDeal(bytes32 commitmentId, bytes32 unitId) internal {
        CommitmentStorage storage s = store();

        uint256 currentEpoch_ = LibEpochController.currentEpoch();

        ICapacity.Commitment storage cc = s.commitments[commitmentId];
        IOffer.ComputePeer memory peer = LibOffer.getComputePeer(cc.info.peerId);
        ICapacity.UnitInfo storage unitInfo = cc.unitInfoById[unitId];

        uint256 expiredEpoch = _expiredEpoch(cc);
        // #endregion

        // #region commit snapshot for unit and commitment
        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        ICapacity.CCStatus status = _preCommitCommitmentSnapshot(cc, snapshotCache, peer, currentEpoch_, expiredEpoch);
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        if (status != ICapacity.CCStatus.Active) {
            revert ICapacity.CapacityCommitmentIsNotActive(status);
        }

        _commitUnitSnapshot(cc, unitInfo, currentEpoch_, expiredEpoch, snapshotCache.current.failedEpoch);
        // #endregion

        unitInfo.isInactive = true;
        cc.progress.activeUnitCount--;
        LibCapacityConst._setActiveUnitCount(LibCapacityConst.activeUnitCount() - 1);

        emit ICapacity.CommitmentStatsUpdated(
            commitmentId,
            cc.progress.totalFailCount,
            cc.finish.exitedUnitCount,
            cc.progress.activeUnitCount,
            cc.progress.nextAdditionalActiveUnitCount,
            currentEpoch_ - 1
        );
        emit ICapacity.UnitDeactivated(commitmentId, unitId);
    }

    function onUnitReturnedFromDeal(bytes32 commitmentId, bytes32 unitId) internal {
        CommitmentStorage storage s = store();

        // #region init and verify variables
        uint256 currentEpoch = LibEpochController.currentEpoch();
        uint256 startEpoch = currentEpoch + 1;
        uint256 prevEpoch = currentEpoch - 1;

        ICapacity.Commitment storage cc = s.commitments[commitmentId];
        IOffer.ComputePeer memory peer = LibOffer.getComputePeer(cc.info.peerId);
        ICapacity.UnitInfo storage unitInfo = cc.unitInfoById[unitId];

        uint256 expiredEpoch = _expiredEpoch(cc);
        // #endregion

        // #region commit snapshot for commitment
        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        ICapacity.CCStatus status = _preCommitCommitmentSnapshot(cc, snapshotCache, peer, currentEpoch, expiredEpoch);
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        // #endregion

        // #region activate unit
        unitInfo.isInactive = false;
        unitInfo.lastSnapshotEpoch = currentEpoch;

        emit ICapacity.UnitActivated(commitmentId, unitId, startEpoch);
        // #endregion

        // if status is not active, then we don't need to update activeUnitCount
        if (status == ICapacity.CCStatus.Inactive || status == ICapacity.CCStatus.Failed) {
            return;
        }

        // add one active unit to global activeUnitCount and commitment activeUnitCount
        cc.progress.nextAdditionalActiveUnitCount += 1;
        LibCapacityConst._setActiveUnitCount(LibCapacityConst.activeUnitCount() + 1);

        LibOffer.setStartEpoch(unitId, startEpoch);

        // we put here prevEpoch because commit snapshot was made for the previous epoch
        emit ICapacity.CommitmentStatsUpdated(
            commitmentId,
            cc.progress.totalFailCount,
            cc.finish.exitedUnitCount,
            cc.progress.activeUnitCount,
            cc.progress.nextAdditionalActiveUnitCount,
            prevEpoch
        );
    }

    function getCommitment(bytes32 commitmentId) internal view returns (ICapacity.CommitmentView memory) {
        CommitmentStorage storage s = store();
        ICapacity.Commitment storage cc = s.commitments[commitmentId];

        require(cc.info.peerId != bytes32(0x00), "Capacity commitment doesn't exist");

        return ICapacity.CommitmentView({
            status: getStatus(commitmentId),
            peerId: cc.info.peerId,
            collateralPerUnit: cc.info.collateralPerUnit,
            unitCount: LibOffer.getComputePeer(cc.info.peerId).unitCount,
            startEpoch: cc.info.startEpoch,
            endEpoch: cc.info.startEpoch + cc.info.duration,
            rewardDelegatorRate: cc.info.rewardDelegatorRate,
            delegator: cc.info.delegator,
            totalFailCount: cc.progress.totalFailCount,
            failedEpoch: cc.finish.failedEpoch,
            exitedUnitCount: cc.finish.exitedUnitCount
        });
    }
}
