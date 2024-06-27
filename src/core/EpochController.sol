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

import {IEpochController} from "src/core/interfaces/IEpochController.sol";
import {EpochControllerStorage, LibEpochController} from "src/lib/LibEpochController.sol";

abstract contract EpochController is IEpochController {
    // ------------------ View ------------------
    /// @dev This function mirrored in:
    /// @dev - ts-client/src/dealMatcherClient/dealMatcherClient.ts
    /// @dev - subgraph/src/contracts.ts
    function currentEpoch() external view returns (uint256) {
        return LibEpochController.currentEpoch();
    }

    function epochDuration() external view returns (uint256) {
        return LibEpochController.store().epochDuration;
    }

    function initTimestamp() external view returns (uint256) {
        return LibEpochController.store().initTimestamp;
    }
}
