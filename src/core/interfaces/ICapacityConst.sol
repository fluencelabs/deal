/*
 * Fluence Compute Marketplace
 *
 * Copyright (C) 2024 Fluence DAO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

pragma solidity ^0.8.19;

import "./IEpochController.sol";


/// @title Capacity constants contract interface
/// @dev The constants contract is responsible for managing the constants for the capacity commitment
interface ICapacityConst is IEpochController {
    // ------------------ Events ------------------
    /// @dev Emitted when a constant with a uint256 value is updated
    /// @param constantType The type of the constant
    /// @param newValue The new value of the constant
    event CapacityConstantUpdated(CapacityConstantType constantType, uint256 newValue);

    /// @dev Emitted when new oracle address is set
    /// @param oracle The oracle address
    event OracleSet(address oracle);

    /// @dev Emitted when the FLT price is updated
    /// @param newValue The new value of the FLT price
    event FLTPriceUpdated(uint256 newValue);

    /// @dev Emitted when the difficulty is updated
    /// @param difficulty The new value of the difficulty
    event DifficultyUpdated(bytes32 difficulty);

    // ------------------ Types ------------------
    enum CapacityConstantType {
        MinDuration,
        USDCollateralPerUnit,
        SlashingRate,
        WithdrawEpochsAfterFailed,
        MaxFailedRatio,
        USDTargetRevenuePerEpoch,
        MinRewardPerEpoch,
        MaxRewardPerEpoch,
        MinProofsPerEpoch,
        MaxProofsPerEpoch
    }

    struct CapacityConstInitArgs {
        uint256 fltPrice;
        uint256 usdCollateralPerUnit;
        uint256 usdTargetRevenuePerEpoch;
        uint256 minDuration;
        uint256 minRewardPerEpoch;
        uint256 maxRewardPerEpoch;
        uint256 vestingPeriodDuration;
        uint256 vestingPeriodCount;
        uint256 slashingRate;
        uint256 minProofsPerEpoch;
        uint256 maxProofsPerEpoch;
        uint256 withdrawEpochsAfterFailed;
        uint256 maxFailedRatio;
        bytes32 difficulty;
        uint256 initRewardPool;
        address randomXProxy;
        address oracle;
    }

    // #region ------------------ External View Functions ------------------
    /// @dev Returns the flt price
    function fltPrice() external view returns (uint256);

    /// @dev Returns the flt collateral per compute unit for creating CC
    function fltCollateralPerUnit() external view returns (uint256);

    /// @dev Returns the usd collateral per compute for creating CC
    function usdCollateralPerUnit() external view returns (uint256);

    /// @dev Returns the target revenue in usd value per epoch
    function usdTargetRevenuePerEpoch() external view returns (uint256);

    /// @dev Returns the min duration of CC in Epochs
    function minDuration() external view returns (uint256);

    /// @dev Returns the min reward pool per epoch
    function minRewardPerEpoch() external view returns (uint256);

    /// @dev Returns the max reward pool per epoch
    function maxRewardPerEpoch() external view returns (uint256);

    /// @dev Returns the vesting duration for one period in Epochs
    function vestingPeriodDuration() external view returns (uint256);

    /// @dev Returns the total vesting periods
    function vestingPeriodCount() external view returns (uint256);

    /// @dev Returns the slashing rate for failed CU
    function slashingRate() external view returns (uint256);

    /// @dev Returns the min required randomX proofs per epoch for the 1 CU.
    /// @dev  If lower than this - CU is failed and CC slashed.
    function minProofsPerEpoch() external view returns (uint256);

    /// @dev Returns the max randomX proofs per epoch
    function maxProofsPerEpoch() external view returns (uint256);

    /// @dev Returns the delay for withdraw collateral in Epochs after failed CC
    function withdrawEpochsAfterFailed() external view returns (uint256);

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
    function setCapacityConstant(CapacityConstantType constantType, uint256 v) external;

    /// @dev Sets a new oracle
    function setOracle(address oracle_) external;
    // #endregion ------------------ External Mutable Functions ------------------
}
