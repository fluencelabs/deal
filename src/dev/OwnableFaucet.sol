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

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";

contract OwnableFaucet is Ownable, Multicall {
    IERC20 public immutable usdToken;

    constructor(IERC20 usdToken_) {
        usdToken = usdToken_;
    }

    function sendUSD(address addr, uint256 value) external onlyOwner {
        usdToken.transfer(addr, value);
    }

    function sendFLT(address addr, uint256 value) external onlyOwner {
        require(address(this).balance > value, "Not enough ether");
        (bool success,) = addr.call{value: value}("");
        require(success, "Cannot send ether");
    }

    receive() external payable {}
}
