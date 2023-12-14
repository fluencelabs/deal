// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/core/interfaces/ICore.sol";

interface ICapacity {
    // ------------------ Events ------------------
    event CapacityCommitmentCreated(
        bytes32 indexed peerId,
        bytes32 commitmentId,
        address delegator,
        uint256 rewardDelegationRate,
        uint256 fltCCCollateralPerUnit
    );
    event CapacityCommitmentRemoved(bytes32 indexed commitmentId);
    event CapacityCommitmentActivated(
        bytes32 indexed peerId, bytes32 indexed commitmentId, uint256 endEpoch, bytes32[] unitIds
    );
    event CapacityCommitmentFinished(bytes32 indexed commitmentId);

    event CollateralDeposited(bytes32 indexed commitmentId, uint256 totalCollateral);

    event ProofSubmitted(bytes32 indexed commitmentId, bytes32 indexed unitId);
    event RewardWithdrawn(bytes32 indexed commitmentId, uint256 amount);

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

    // ------------------ Initializer ------------------
    function initialize(ICore core) external;
}
