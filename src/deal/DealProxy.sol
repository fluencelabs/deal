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

import "@openzeppelin/contracts/proxy/Proxy.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "src/core/interfaces/ICore.sol";

contract DealProxy is Proxy {
    ICore immutable _core;

    constructor(ICore core_, bytes memory data_) {
        _core = core_;
        if (data_.length > 0) {
            Address.functionDelegateCall(address(core_.dealImpl()), data_);
        }
    }

    function _implementation() internal view override returns (address) {
        return address(_core.dealImpl());
    }
}
