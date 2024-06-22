// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";
import {TestERC20} from "src/dev/TestERC20.sol";

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
