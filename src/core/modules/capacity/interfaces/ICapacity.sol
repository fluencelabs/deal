// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/core/interfaces/ICore.sol";
import "./ICapacityConst.sol";

/// @title Capacity contract interface
/// @dev Capacity contract is responsible for managing the commitments
interface ICapacity is ICapacityConst {
    // ------------------ Events ------------------

    /// @dev Emitted when a new commitment is created
    /// @param peerId Peer id which linked to the commitment
    /// @param commitmentId Commitment id
    /// @param duration The duration of the commitment in epoches
    /// @param delegator The delegator address. If address is zero, the commitment has no delegator
    /// @param rewardDelegationRate The reward delegation rate in precision
    /// @param fltCollateralPerUnit The flt collateral per compute unit
    event CommitmentCreated(
        bytes32 indexed peerId,
        bytes32 commitmentId,
        uint256 duration,
        address delegator,
        uint256 rewardDelegationRate,
        uint256 fltCollateralPerUnit
    );

    /// @dev Emitted when a commitment is removed. Commitment can be removed only if it is in WaitDelegation status
    /// @param commitmentId Commitment id
    event CommitmentRemoved(bytes32 indexed commitmentId);

    /// @dev Emitted when a commitment is activated. Commitment can be activated only if delegator deposited collateral.
    /// @param peerId Peer id which linked to the commitment
    /// @param commitmentId Commitment id which activated
    /// @param startEpoch The start epoch of the commitment
    /// @param endEpoch The end epoch of the commitment
    /// @param unitIds Compute unit ids which linked to the commitment
    event CommitmentActivated(
        bytes32 indexed peerId, bytes32 indexed commitmentId, uint256 startEpoch, uint256 endEpoch, bytes32[] unitIds
    );

    /// @dev Emitted when a commitment is finished. Commitment can be finished only if it is in Failed or Ended
    /// @param commitmentId Commitment id which finished
    event CommitmentFinished(bytes32 indexed commitmentId);

    /// @dev Emitted when a delegator deposited collateral to commitment
    /// @param commitmentId Commitment id
    /// @param totalCollateral The total collateral deposited to commitment
    event CollateralDeposited(bytes32 indexed commitmentId, uint256 totalCollateral);

    /// @dev Emitted when a proof is submitted
    /// @param commitmentId Commitment id
    /// @param unitId Compute unit id which linked to the proof
    /// @param localUnitNonce The local nonce of the unit for calculating the target hash
    event ProofSubmitted(bytes32 indexed commitmentId, bytes32 indexed unitId, bytes32 localUnitNonce);

    /// @dev Emitted when a reward is withdrawn
    /// @param commitmentId Commitment id
    /// @param amount The amount of the withdrawn reward
    event RewardWithdrawn(bytes32 indexed commitmentId, uint256 amount);

    /// @dev Emitted when a unit deactivated. Unit is deactivated when it moved to deal
    /// @param commitmentId Commitment id
    /// @param unitId Compute unit id which deactivated
    event UnitDeactivated(bytes32 indexed commitmentId, bytes32 indexed unitId);

    /// @dev Emitted when a unit activated. Unit is activated when it returned from deal
    /// @param commitmentId Commitment id
    /// @param unitId Compute unit id which activated
    event UnitActivated(bytes32 indexed commitmentId, bytes32 indexed unitId, uint256 startEpoch);

    // To fetch updates on changes in CC stats (currently only in stats related to CUs).
    event CommitmentStatsUpdated(
        bytes32 commitmentId,
        uint256 totalCUFailCount,
        uint256 exitedUnitCount,
        uint256 activeUnitCount,
        uint256 nextAdditionalActiveUnitCount,
        // Aka Snapshot epoch but in order to not mislead with actual snapshotting, it renamed to changedEpoch.
        uint256 changedEpoch
    );

    // ------------------ Errors ------------------
    /// @dev Throws if peer sent too many proofs for the commitment by unit per epoch
    error TooManyProofs();

    /// @dev Capacity commitment is not active
    error CapacityCommitmentIsNotActive(CCStatus status);

    /// @dev Capacity commitment is active
    error CapacityCommitmentIsActive(CCStatus status);

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
        uint256 vestingPeriodDuration_,
        uint256 vestingPeriodCount_,
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
    /// @dev Returns the commitment status
    /// @param commitmentId Commitment id
    /// @return status commitment status
    function getStatus(bytes32 commitmentId) external view returns (CCStatus);

    /// @dev Returns the commitment info
    /// @param commitmentId Commitment id
    /// @return info commitment info
    function getCommitment(bytes32 commitmentId) external view returns (CommitmentView memory);

    /// @dev Returns the total reward of the commitment. It includes the reward in vesting
    /// @param commitmentId Commitment id
    /// @return totalRewards total reward of the commitment
    function totalRewards(bytes32 commitmentId) external view returns (uint256);

    /// @dev Returns the total vested reward of the commitment
    /// @param commitmentId Commitment id
    /// @return totalVestedRewards total vested reward of the commitment
    function unlockedRewards(bytes32 commitmentId) external view returns (uint256);
    function getGlobalNonce() external view returns (bytes32);

    // ----------------- Deal Callbacks -----------------
    function onUnitMovedToDeal(bytes32 commitmentId, bytes32 unitId) external;
    function onUnitReturnedFromDeal(bytes32 commitmentId, bytes32 unitId) external;

    // ----------------- Mutables -----------------
    /// @dev Creates a new commitment
    /// @param peerId Peer id which linked to the commitment
    /// @param duration The duration of the commitment in epoches
    /// @param delegator The delegator address. If address is zero, the commitment has no delegator
    /// @param rewardDelegationRate The reward delegation rate in precision
    function createCommitment(bytes32 peerId, uint256 duration, address delegator, uint256 rewardDelegationRate)
        external
        returns (bytes32);

    /// @dev Removes the commitment if it is in WaitDelegation status
    /// @param commitmentId Commitment id
    function removeCommitment(bytes32 commitmentId) external;

    /// @dev Finishes the commitment if it is in Failed or Ended status
    /// @param commitmentId Commitment id
    function finishCommitment(bytes32 commitmentId) external;

    /// @dev Deposits collateral for commitments. It makes commitments active
    /// @param commitmentIds Commitment ids
    function depositCollateral(bytes32[] calldata commitmentIds) external payable;

    /// @dev Submits a proof for the commitment
    /// @param unitId Compute unit id which provied the proof
    /// @param localUnitNonce The local nonce of the unit for calculating the target hash. It's the proof
    /// @param resultHash The target hash of this proof
    function submitProof(bytes32 unitId, bytes32 localUnitNonce, bytes32 resultHash) external;

    /// @dev Remove CU from Ended or Failed CC. Need to call this function before finish the commitment
    /// @param commitmentId Commitment id
    /// @param unitIds Compute unit ids which will be removed from the commitment
    function removeCUFromCC(bytes32 commitmentId, bytes32[] calldata unitIds) external;

    /// @dev Withdraws the reward from the commitment
    /// @param commitmentId Commitment id
    function withdrawReward(bytes32 commitmentId) external;
}
