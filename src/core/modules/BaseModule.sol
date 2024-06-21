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

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "./interfaces/IBaseModule.sol";

contract BaseModule is Initializable, IBaseModule {
    ICore public immutable core;

    // ------------------ Initializer ------------------
    constructor(ICore core_) {
        core = core_;
        _disableInitializers();
    }

    // ------------------ Modifiers ------------------
    modifier onlyCoreOwner() {
        require(OwnableUpgradableDiamond(address(core)).owner() == msg.sender, "BaseModule: caller is not the owner");
        _;
    }

    modifier onlyMarket() {
        require(address(core.market()) == msg.sender, "BaseModule: caller is not the market");
        _;
    }

    modifier onlyCapacity() {
        require(address(core.capacity()) == msg.sender, "BaseModule: caller is not the capacity");
        _;
    }

    function owner() public view returns (address) {
        return OwnableUpgradableDiamond(address(core)).owner();
    }
}
