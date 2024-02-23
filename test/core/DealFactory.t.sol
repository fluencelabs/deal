// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "src/core/Core.sol";
import "src/deal/Deal.sol";
import "src/deal/interfaces/IConfig.sol";
import "test/utils/DeployDealSystem.sol";
import "test/utils/DealHelper.sol";
import "test/utils/TestHelper.sol";

contract DealFactoryTest is Test {
    using SafeERC20 for IERC20;
    using DealHelper for DeployDealSystem.Deployment;

    // ------------------ Variables ------------------
    DeployDealSystem.Deployment deployment;

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
    }

    function test_Deploy() public {
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.core.minDealDepositedEpoches();

        uint256 balanceBefore = deployment.tUSD.balanceOf(address(this));

        deployment.tUSD.safeApprove(address(deployment.market), minAmount);
        (IDeal d, DealHelper.DealParams memory dealParams) =
            deployment.deployDeal(1, 2, targetWorkers, pricePerWorkerEpoch, minAmount);

        uint256 balanceDiff = balanceBefore - deployment.tUSD.balanceOf(address(this));

        assertEq(balanceDiff, minAmount, "Should transfer minAmount from msg.sender to Core");
        assertEq(deployment.tUSD.balanceOf(address(d)), minAmount, "Should deposit minAmount to Deal");
        assertEq(deployment.tUSD.allowance(address(this), address(deployment.core)), 0, "Should reset allowance");
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

        assertEq(deployment.market.hasDeal(d), true, "Should deal set in Core");

        //TODO: Check events
    }

    function test_RevertIf_NoTokenAllowance() public {
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.core.minDealDepositedEpoches();

        vm.expectRevert("ERC20: insufficient allowance");
        deployment.deployDeal(1, 2, targetWorkers, pricePerWorkerEpoch, minAmount);
    }

    function test_RevertIf_NoEnoughBalance() public {
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.core.minDealDepositedEpoches();

        vm.startPrank(address(0x01));

        deployment.tUSD.safeApprove(address(deployment.market), minAmount * 100);

        vm.expectRevert("ERC20: transfer amount exceeds balance");
        deployment.deployDeal(1, 2, targetWorkers, pricePerWorkerEpoch, minAmount * 100);

        vm.stopPrank();
    }
}
