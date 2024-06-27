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


import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {TestWithDeployment} from "test/utils/TestWithDeployment.sol";
import {TestHelper} from "test/utils/TestHelper.sol";
import {IDeal} from "src/deal/interfaces/IDeal.sol";


contract DealFactoryTest is TestWithDeployment {
    using SafeERC20 for IERC20;
    using TestHelper for TestWithDeployment.Deployment;

    // ------------------ Test ------------------
    function setUp() public {
        _deploySystem();
    }

    function test_Deploy() public {
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.diamondAsCore.minDealDepositedEpochs();

        uint256 balanceBefore = deployment.tUSD.balanceOf(address(this));

        deployment.tUSD.safeApprove(address(deployment.diamond), minAmount);
        uint256 protocolVersion = deployment.diamondAsCore.minProtocolVersion();

        (IDeal d, TestHelper.DealParams memory dealParams) = deployment.deployDeal(
            TestHelper.DeployDealParams({
                minWorkers: 1,
                maxWorkersPerProvider: 2,
                targetWorkers: targetWorkers,
                pricePerWorkerEpoch: pricePerWorkerEpoch,
                depositAmount: minAmount,
                protocolVersion: protocolVersion
            })
        );

        uint256 balanceDiff = balanceBefore - deployment.tUSD.balanceOf(address(this));

        assertEq(balanceDiff, minAmount, "Should transfer minAmount from msg.sender to Core");
        assertEq(deployment.tUSD.balanceOf(address(d)), minAmount, "Should deposit minAmount to Deal");
        assertEq(deployment.tUSD.allowance(address(this), address(deployment.diamond)), 0, "Should reset allowance");
        assertEq(dealParams.appCID.prefixes, d.appCID().prefixes, "Should set appCID (prefixes)");
        assertEq(dealParams.appCID.hash, d.appCID().hash, "Should set appCID (hash)");
        assertEq(address(dealParams.paymentToken), address(d.paymentToken()), "Should set paymentToken");
        assertEq(dealParams.minWorkers, d.minWorkers(), "Should set minWorkers");
        assertEq(dealParams.targetWorkers, d.targetWorkers(), "Should set targetWorkers");
        assertEq(dealParams.maxWorkersPerProvider, d.maxWorkersPerProvider(), "Should set maxWorkersPerProvider");
        assertEq(dealParams.pricePerWorkerEpoch, d.pricePerWorkerEpoch(), "Should set pricePerWorkerEpoch");
        assertEq(dealParams.effectors.length, d.effectors().length, "Should set effectors");
        for (uint256 i = 0; i < dealParams.effectors.length; i++) {
            assertEq(dealParams.effectors[i].prefixes, d.effectors()[i].prefixes, "Should set effector (prefixes)");
            assertEq(dealParams.effectors[i].hash, d.effectors()[i].hash, "Should set effector (hash)");
        }

        assertEq(deployment.diamondAsDealFactory.hasDeal(d), true, "Should deal set in Core");

        //TODO: Check events
    }

    function test_RevertIf_NoTokenAllowance() public {
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.diamondAsCore.minDealDepositedEpochs();
        uint256 protocolVersion = deployment.diamondAsCore.minProtocolVersion();

        vm.expectRevert("ERC20: insufficient allowance");
        deployment.deployDeal(
            TestHelper.DeployDealParams({
                minWorkers: 1,
                maxWorkersPerProvider: 2,
                targetWorkers: targetWorkers,
                pricePerWorkerEpoch: pricePerWorkerEpoch,
                depositAmount: minAmount,
                protocolVersion: protocolVersion
            })
        );
    }

    function test_RevertIf_NoEnoughBalance() public {
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.diamondAsCore.minDealDepositedEpochs();

        vm.startPrank(address(0x01));

        deployment.tUSD.safeApprove(address(deployment.diamond), minAmount * 100);
        uint256 protocolVersion = deployment.diamondAsCore.minProtocolVersion();

        vm.expectRevert("ERC20: transfer amount exceeds balance");
        deployment.deployDeal(
            TestHelper.DeployDealParams({
                minWorkers: 1,
                maxWorkersPerProvider: 2,
                targetWorkers: targetWorkers,
                pricePerWorkerEpoch: pricePerWorkerEpoch,
                depositAmount: minAmount,
                protocolVersion: protocolVersion
            })
        );

        vm.stopPrank();
    }
}
