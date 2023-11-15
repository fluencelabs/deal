// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

interface IGlobalConst {
    enum Constant {
        MinDepositedEpoches,
        MinRematchingEpoches,
        CollateralPerUnit,
        MinCapacityCommitmentDuration,
        FLTPrice,
        MinCapacityRewardPerEpoch,
        MaxCapacityRewardPerEpoch,
        TargetRevenuePerEpoch,
        VestingDuration,
        SlashingRate,
        MaxFailedRatio,
        MinRequierdCCProofs,
        MaxCCProofs,
        WithdrawCCTimeoutAfterFailed
    }

    // ------------------ External View Functions ------------------
    function fluenceToken() external view returns (address);

    function minDepositedEpoches() external view returns (uint256);

    function minRematchingEpoches() external view returns (uint256);

    function collateralPerUnit() external view returns (uint256);

    function minCapacityCommitmentDuration() external view returns (uint256);

    function fltPrice() external view returns (uint256);

    function minCapacityRewardPerEpoch() external view returns (uint256);

    function maxCapacityRewardPerEpoch() external view returns (uint256);

    function targetRevenuePerEpoch() external view returns (uint256);

    function vestingDuration() external view returns (uint256);

    function slashingRate() external view returns (uint256);

    function maxFailedRatio() external view returns (uint256);

    function minRequierdCCProofs() external view returns (uint256);

    function withdrawCCTimeoutAfterFailed() external view returns (uint256);

    // ------------------ External Mutable Functions ------------------
    function setConstant(Constant constantType, uint256 v) external;
}
