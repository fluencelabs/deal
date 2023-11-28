// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "src/dev/TestERC20.sol";
import "src/core/Core.sol";
import "src/deal/Deal.sol";

library Random {
    function pseudoRandom(bytes memory seed) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(blockhash(block.number - 1), seed));
    }
}
