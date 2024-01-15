// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/core/interfaces/ICore.sol";

interface ICapacityConst {
    // ------------------ Events ------------------
    event ConstantUpdated(ConstantType constantType, uint256 newValue);
    event FLTPriceUpdated(uint256 newValue);
    event DifficultyUpdated(bytes32 difficulty);

    // ------------------ Types ------------------
    enum ConstantType {
        USDCollateralPerUnit,
        USDTargetRevenuePerEpoch,
        MinDuration,
        MinRewardPerEpoch,
        MaxRewardPerEpoch,
        VestingDuration,
        SlashingRate,
        MinRequierdProofsPerEpoch,
        MaxProofsPerEpoch,
        WithdrawEpochesAfterFailed,
        MaxFailedRatio
    }

    // #region ------------------ External View Functions ------------------
    function fltPrice() external view returns (uint256);

    function fltCollateralPerUnit() external view returns (uint256);

    function usdCollateralPerUnit() external view returns (uint256);

    function fltTargetRevenuePerEpoch() external view returns (uint256);

    function usdTargetRevenuePerEpoch() external view returns (uint256);

    function minDuration() external view returns (uint256);

    function minRewardPerEpoch() external view returns (uint256);

    function maxRewardPerEpoch() external view returns (uint256);

    function vestingDuration() external view returns (uint256);

    function slashingRate() external view returns (uint256);

    function minRequierdProofsPerEpoch() external view returns (uint256);

    function maxProofsPerEpoch() external view returns (uint256);

    function withdrawEpochesAfterFailed() external view returns (uint256);

    function maxFailedRatio() external view returns (uint256);

    function activeUnitCount() external view returns (uint256);

    function difficulty() external view returns (bytes32);

    function getRewardPool(uint256 epoch) external view returns (uint256);
    // #endregion ------------------ External View Functions ------------------

    // #region ------------------ External Mutable Functions ------------------
    function setFLTPrice(uint256 fltPrice_) external;

    function setDifficulty(bytes32 difficulty_) external;

    function setConstant(ConstantType constantType, uint256 v) external;
    // #endregion ------------------ External Mutable Functions ------------------
}
