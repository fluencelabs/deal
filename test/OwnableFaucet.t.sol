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

import {Test, console2} from "forge-std/Test.sol";
import "src/dev/OwnableFaucet.sol";

contract ContractWhichCantReceiveEther {}

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
