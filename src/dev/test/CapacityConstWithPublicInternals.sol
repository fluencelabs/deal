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

import "src/core/CapacityConst.sol";
import "./interfaces/ICapacityConstWithPublicInternals.sol";

contract CapacityConstWithPublicInternals is ICapacityConstWithPublicInternals, CapacityConst {
    uint256 public constant EPOCH_DURATION = 1 days;

    function init(CapacityConstInitArgs memory args) public initializer {
        __EpochController_init(EPOCH_DURATION);
        __Ownable_init(msg.sender);
        __CapacityConst_init(args);
    }

    function setActiveUnitCount(uint256 activeUnitCount_) public {
        _setActiveUnitCount(activeUnitCount_);
    }
}
