// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

interface ICapacityCommitment {
    // ------------------ Events ------------------
    event CapacityCommitmentCreated(
        bytes32 indexed peerId,
        bytes32 commitmentId,
        address delegator,
        uint256 rewardDelegationRate,
        uint256 fltCCCollateralPerUnit
    );
    event CapacityCommitmentRemoved(bytes32 indexed commitmentId);
    event CapacityCommitmentActivated(bytes32 indexed commitmentId);
    event CapacityCommitmentFinished(bytes32 indexed commitmentId);

    event CollateralDeposited(bytes32 indexed commitmentId, uint256 totalCollateral);

    event ProofSubmitted(bytes32 indexed commitmentId, bytes32 indexed unitId);
    event RewardWithdrawn(bytes32 indexed commitmentId, uint256 amount);
}
