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

import "src/deal/interfaces/IDeal.sol";

/// @title Matcher contract interface
/// @dev Matcher contract is responsible for matching compute units with deals
interface IMatcher {
    // ------------------ Errors ------------------
    /// @dev Throws if the min workers of the deal is not matched
    /// @param _minWorkers The min workers of the deal
    error MinWorkersNotMatched(uint256 _minWorkers);

    // ----------------- Events -----------------
    /// @dev Emitted when a deal is matched with a compute unit
    /// @param peerId The peer id of the deal
    /// @param deal The deal address
    /// @param unitId The compute unit id
    /// @param dealCreationBlock The creation block of the deal
    /// @param appCID The app cid of the deal
    event ComputeUnitMatched(
        bytes32 indexed peerId, IDeal deal, bytes32 unitId, uint256 dealCreationBlock, CIDV1 appCID
    );

    // ----------------- Mutable -----------------
    /// @dev Matches a deal with compute units
    /// @param deal The deal address
    /// @param offers The offers with the deal witch has the compute units for matching
    /// @param computeUnits The compute units by the offers for matching with the deal
    function matchDeal(IDeal deal, bytes32[] calldata offers, bytes32[][] calldata computeUnits) external;
}
