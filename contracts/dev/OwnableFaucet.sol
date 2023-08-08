// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "./TestERC20.sol";

contract OwnableFaucet is Ownable, Multicall {
    IERC20 public immutable fluenceToken;
    IERC20 public immutable usdToken;

    constructor(IERC20 fluenceToken_, IERC20 usdToken_) {
        fluenceToken = fluenceToken_;
        usdToken = usdToken_;
    }

    function sendUSD(address addr, uint256 value) external onlyOwner {
        usdToken.transfer(addr, value);
    }

    function sendFLT(address addr, uint256 value) external onlyOwner {
        fluenceToken.transfer(addr, value);
    }
}
