// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../global/AquaProxy.sol";
import "./TestERC20.sol";

contract DeveloperFaucet {
    IERC20 public immutable fluenceToken;
    IERC20 public immutable usdToken;

    constructor() {
        uint256 v = 0;
        unchecked {
            v--;
        }

        fluenceToken = new TestERC20("Fluence Test Token", "FLT", v);
        usdToken = new TestERC20("USD Test Token", "tUSDC", v);
    }

    function receiveUSD(address addr, uint256 value) external {
        usdToken.transfer(addr, value);
    }

    function receiveFLT(address addr, uint256 value) external {
        fluenceToken.transfer(addr, value);
    }
}
