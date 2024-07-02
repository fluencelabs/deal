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

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "src/core/interfaces/ICore.sol";
import "./Matcher.sol";
import "./interfaces/IMarket.sol";

contract Market is UUPSUpgradeable, MulticallUpgradeable, Matcher, IMarket {
    // ------------------ Initializer ------------------
    constructor(ICore core_) BaseModule(core_) {}

    function initialize() public initializer {
        __UUPSUpgradeable_init();
        __Multicall_init();
    }

    function _authorizeUpgrade(address) internal override onlyCoreOwner {}
}
