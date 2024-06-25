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

import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {IGlobalConst} from "src/core/interfaces/IGlobalConst.sol";

/// @title Core contract interface
/// @dev Core contract is the main contract of the system and it is responsible for navigation between modules
interface ICore is IGlobalConst {
    event DealImplSet(IDeal dealImpl);

    function dealImpl() external view returns (IDeal);
    function setActiveUnitCount(uint256 activeUnitCount_) external;
    function setDealImpl(IDeal dealImpl_) external;
}
