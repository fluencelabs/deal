// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/core/interfaces/ICore.sol";

/// @title Capacity constants contract interface
/// @dev The constants contract is responsible for managing the constants for the capacity commitment
interface ICapacityConst {
    // ------------------ Events ------------------
    /// @dev Emitted when a constant with a uint256 value is updated
    /// @param constantType The type of the constant
    /// @param newValue The new value of the constant
    event ConstantUpdated(ConstantType constantType, uint256 newValue);

    /// @dev Emitted when the FLT price is updated
    /// @param newValue The new value of the FLT price
    event FLTPriceUpdated(uint256 newValue);

    /// @dev Emitted when the difficulty is updated
    /// @param difficulty The new value of the difficulty
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
    /// @dev Returns the flt price
    function fltPrice() external view returns (uint256);

    /// @dev Returns the flt collateral per compute unit for creating CC
    function fltCollateralPerUnit() external view returns (uint256);

    /// @dev Returns the usd collateral per compute for creating CC
    function usdCollateralPerUnit() external view returns (uint256);

    /// @dev Returns the target revenue in flt value per epoch
    function fltTargetRevenuePerEpoch() external view returns (uint256);

    /// @dev Returns the target revenue in usd value per epoch
    function usdTargetRevenuePerEpoch() external view returns (uint256);

    /// @dev Returns the min duration of CC in epoches
    function minDuration() external view returns (uint256);

    /// @dev Returns the min reward pool per epoch
    function minRewardPerEpoch() external view returns (uint256);

    /// @dev Returns the max reward pool per epoch
    function maxRewardPerEpoch() external view returns (uint256);

    /// @dev Returns the vesting duration for new rewards
    function vestingDuration() external view returns (uint256);

    /// @dev Returns the slashing rate for failed CU
    function slashingRate() external view returns (uint256);

    /// @dev Returns the min required randomX proofs per epoch
    function minRequierdProofsPerEpoch() external view returns (uint256);

    /// @dev Returns the max randomX proofs per epoch
    function maxProofsPerEpoch() external view returns (uint256);

    /// @dev Returns the delay for withdraw collateral in epoches after failed CC
    function withdrawEpochesAfterFailed() external view returns (uint256);

    /// @dev Returns the max failed ratio for CC
    function maxFailedRatio() external view returns (uint256);

    /// @dev Returns the active compute unit count
    function activeUnitCount() external view returns (uint256);

    /// @dev Returns the difficulty for randomX
    function difficulty() external view returns (bytes32);

    /// @dev Returns the randomX proxy address for verification of randomX proofs
    function randomXProxy() external view returns (address);

    /// @dev Returns the reward pool per epoch
    function getRewardPool(uint256 epoch) external view returns (uint256);
    // #endregion ------------------ External View Functions ------------------

    // #region ------------------ External Mutable Functions ------------------
    /// @dev Sets the flt price
    function setFLTPrice(uint256 fltPrice_) external;

    /// @dev Sets the randomX difficulty
    function setDifficulty(bytes32 difficulty_) external;

    /// @dev Sets a constant with a uint256 value
    function setConstant(ConstantType constantType, uint256 v) external;
    // #endregion ------------------ External Mutable Functions ------------------
}
