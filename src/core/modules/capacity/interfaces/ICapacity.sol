// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/core/interfaces/ICore.sol";
import "./ICapacityConst.sol";

interface ICapacity is ICapacityConst {
    // ------------------ Events ------------------
    event CommitmentCreated(
        bytes32 indexed peerId,
        bytes32 commitmentId,
        uint256 duration,
        address delegator,
        uint256 rewardDelegationRate,
        uint256 fltCCCollateralPerUnit
    );
    event CommitmentRemoved(bytes32 indexed commitmentId);
    event CommitmentActivated(
        bytes32 indexed peerId, bytes32 indexed commitmentId, uint256 startEpoch, uint256 endEpoch, bytes32[] unitIds, uint256 nextCCFailedEpoch
    );
    event CommitmentFinished(bytes32 indexed commitmentId);

    event CollateralDeposited(bytes32 indexed commitmentId, uint256 totalCollateral);

    event ProofSubmitted(
        bytes32 indexed commitmentId, bytes32 indexed unitId, bytes32 globalUnitNonce, bytes32 localUnitNonce
    );
    event RewardWithdrawn(bytes32 indexed commitmentId, uint256 amount);

    event UnitDeactivated(bytes32 indexed commitmentId, bytes32 indexed unitId);
    event UnitActivated(bytes32 indexed commitmentId, bytes32 indexed unitId);

    // nextCCFailedEpoch is the epoch when the commitment will be failed if no correct proofs will be submitted.
    event CommitmentSnapshotCommitted(bytes32 peerId, uint256 nextCCFailedEpoch);

    // ------------------ Errors ------------------
    error TooManyProofs();

    // ------------------ Types ------------------
    enum CCStatus {
        Active,
        // WaitDelegation - before collateral is deposited.
        WaitDelegation,
        // Status is WaitStart - means collateral deposited, and epoch should be proceed before Active.
        WaitStart,
        Inactive,
        Failed,
        Removed
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
        uint256 activeUnitCount;
        uint256 nextAdditionalActiveUnitCount;
    }

    struct CommitmentView {
        CCStatus status;
        bytes32 peerId;
        uint256 collateralPerUnit;
        uint256 unitCount;
        uint256 startEpoch;
        uint256 endEpoch;
        uint256 rewardDelegatorRate;
        address delegator;
        uint256 totalCUFailCount;
        uint256 failedEpoch;
        uint256 exitedUnitCount;
    }

    // ------------------ Initializer ------------------
    function initialize(
        uint256 fltPrice_,
        uint256 usdCollateralPerUnit_,
        uint256 usdTargetRevenuePerEpoch_,
        uint256 minDuration_,
        uint256 minRewardPerEpoch_,
        uint256 maxRewardPerEpoch_,
        uint256 vestingDuration_,
        uint256 slashingRate_,
        uint256 minRequierdProofsPerEpoch_,
        uint256 maxProofsPerEpoch_,
        uint256 withdrawEpochesAfterFailed_,
        uint256 maxFailedRatio_,
        bool isWhitelistEnabled_,
        bytes32 initGlobalNonce_,
        bytes32 difficulty_,
        address randomXProxy_
    ) external;

    // ------------------ Views ------------------
    function getStatus(bytes32 commitmentId) external view returns (CCStatus);
    function getCommitment(bytes32 commitmentId) external view returns (CommitmentView memory);
    function totalRewards(bytes32 commitmentId) external view returns (uint256);
    function unlockedRewards(bytes32 commitmentId) external view returns (uint256);
    function getGlobalNonce() external view returns (bytes32);

    // ----------------- Deal Callbacks -----------------
    function onUnitMovedToDeal(bytes32 commitmentId, bytes32 unitId) external;
    function onUnitReturnedFromDeal(bytes32 commitmentId, bytes32 unitId) external;

    // ----------------- Mutables -----------------
    function createCommitment(bytes32 peerId, uint256 duration, address delegator, uint256 rewardDelegationRate)
        external
        returns (bytes32);
    function removeCommitment(bytes32 commitmentId) external;
    function finishCommitment(bytes32 commitmentId) external;
    function depositCollateral(bytes32 commitmentId) external;
    function submitProof(bytes32 unitId, bytes32 globalUnitNonce, bytes32 localUnitNonce, bytes32 targetHash)
        external;
    function commitSnapshot(bytes32 commitmentId) external;
    function removeCUFromCC(bytes32 commitmentId, bytes32[] calldata unitIds) external;
    function withdrawReward(bytes32 commitmentId) external;
}
