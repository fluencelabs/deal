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

import {IConfig} from "src/deal/interfaces/IConfig.sol";

/// @title Worker manager contract interface
/// @dev Worker manager contract is responsible for managing the workers in the deal
interface IWorkerManager is IConfig {
    // ------------------ Types ------------------
    struct ComputeUnit {
        bytes32 id;
        bytes32 workerId;
        bytes32 peerId;
        address provider;
        uint256 joinedEpoch;
    }

    // ------------------ Events ------------------

    /// @dev Emitted when a new compute unit is added
    /// @param unitId The compute unit ID
    event ComputeUnitJoined(bytes32 indexed peerId, bytes32 unitId);

    /// @dev Emitted when a compute unit is removed
    /// @param unitId The compute unit ID
    event ComputeUnitRemoved(bytes32 indexed peerId, bytes32 unitId);

    /// @dev Emitted when a worker ID is updated
    /// @param computeUnitId The compute unit
    /// @param workerId The new worker ID
    event WorkerIdUpdated(bytes32 computeUnitId, bytes32 workerId);

    // ------------------ Public View Functions ---------------------
    /// @dev Returns the compute unit info by ID
    function getComputeUnit(bytes32 id) external view returns (ComputeUnit memory);

    /// @dev Returns total number of compute units
    function getComputeUnitCount() external view returns (uint256);

    /// @dev Returns the compute units by provider
    function getComputeUnitCount(address provider) external view returns (uint256);

    /// @dev Returns the compute units info by provider
    function getComputeUnits() external view returns (ComputeUnit[] memory);

    /// @dev Returns the worker count. Worker is a compute unit that has a worker ID
    function getWorkerCount() external view returns (uint256);

    /// @dev Returns the boolean flag indicating whether the peer exists in the deal
    function isComputePeerExist(bytes32 peerId) external view returns (bool);
}
