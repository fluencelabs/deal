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


import {ICapacityConst} from "src/core/interfaces/ICapacityConst.sol";

/// @title Global Constants contract interface
/// @dev Global Constants contract stores global constants of the system and it is responsible for changing them
interface IGlobalConst is ICapacityConst {
    // ------------------ Events ------------------
    /// @dev Emitted when a constant with uint256 value is updated
    /// @param constantType Constant type
    /// @param newValue New uint256 value
    event ConstantUpdated(ConstantType constantType, uint256 newValue);

    // ------------------ Types ------------------
    enum ConstantType {
        MinDealDepositedEpochs,
        MinDealRematchingEpochs,
        MinProtocolVersion,
        MaxProtocolVersion
    }

    // ------------------ External Constants ------------------
    /// @dev Returns precision for decimal values (USD, percentage)
    function precision() external view returns (uint256);

    // ------------------ External View Functions ------------------

    /// @dev Returns min deposited Epochs constant for new deals
    /// @return min deposited Epochs for new deals
    function minDealDepositedEpochs() external view returns (uint256);

    /// @dev Returns min rematching Epochs constant for all deals
    /// @return min rematching Epochs for all deals
    function minDealRematchingEpochs() external view returns (uint256);

    /// @dev Returns min protocol version which can be specified in offers and deals
    /// @return min protocol version
    function minProtocolVersion() external view returns (uint256);

    /// @dev Returns max protocol version which can be specified in offers and deals
    /// @return max protocol version
    function maxProtocolVersion() external view returns (uint256);

    // ------------------ External Mutable Functions ------------------
    /// @dev Sets constant with uint256 value
    /// @param constantType Constant type
    /// @param v New uint256 value
    function setConstant(ConstantType constantType, uint256 v) external;
}
