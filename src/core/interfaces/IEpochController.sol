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

/// @title Epoch controller contract interface
/// @dev Epoch controller contract is responsible for changing epochs
interface IEpochController {
    /// @dev Returns current epoch
    /// @return current epoch number
    function currentEpoch() external view returns (uint256);

    /// @dev Returns epoch duration
    /// @return epochDuration in seconds
    function epochDuration() external view returns (uint256);

    /// @dev Returns epoch init timestamp
    /// @return initTimestamp in seconds
    function initTimestamp() external view returns (uint256);
}
