// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "src/dev/OwnableFaucet.sol";

contract ContractWhichCantReceiveEther { }

contract OwnableFaucetTest is Test {
    // TODO test with mock tUSD
    OwnableFaucet faucet;

    function setUp() external {
        faucet = new OwnableFaucet(IERC20(address(0)));
        vm.deal(address(faucet), 100 ether);
    }

    function test_NativeSend() external {
        address receiver = address(3232323);

        vm.expectRevert("Not enough ether");
        faucet.sendFLT(receiver, 1000 ether);

        address addressWhichCantReceiveEther = address(new ContractWhichCantReceiveEther());
        vm.expectRevert("Cannot send ether");
        faucet.sendFLT(addressWhichCantReceiveEther, 10 ether);

        faucet.sendFLT(receiver, 10 ether);
        assertEq(receiver.balance, 10 ether);
    }
}
