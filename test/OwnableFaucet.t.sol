// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "src/dev/OwnableFaucet.sol";

contract OwnableFaucetTest is Test {
    // TODO test with mock tUSD
    OwnableFaucet faucet;

    function setUp() external {
        faucet = new OwnableFaucet(IERC20(address(0)));
        vm.deal(address(faucet), 100 ether);
    }

    function test_NativeSend() external {
        address receiver = address(3232323);
        faucet.sendFLT(receiver, 10 ether);
        assertEq(receiver.balance, 10 ether);
    }
}
