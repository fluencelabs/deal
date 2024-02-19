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
import "test/utils/TestHelper.sol";

contract DealFactoryTest is Test {
    using SafeERC20 for IERC20;

    // ------------------ Types ------------------
    struct DealParams {
        CIDV1 appCID;
        IERC20 paymentToken;
        uint256 minWorkers;
        uint256 targetWorkers;
        uint256 maxWorkersPerProvider;
        uint256 pricePerWorkerEpoch;
        CIDV1[] effectors;
    }

    // ------------------ Variables ------------------
    DeployDealSystem.Deployment deployment;

    // ------------------ Internal ------------------
    function _deployDeal(uint256 pricePerWorkerEpoch, uint256 targetWorkers)
        internal
        returns (IDeal, DealParams memory)
    {
        CIDV1[] memory effectors = new CIDV1[](10);
        for (uint256 i = 0; i < 10; i++) {
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("effector", i))});
        }

        CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("appCID", 0))});

        uint256 minWorkers = 1;
        uint256 maxWorkersPerProvider = 1;
        IERC20 paymentToken = IERC20(address(deployment.tUSD));

        IDeal deal = deployment.dealFactory.deployDeal(
            appCID,
            paymentToken,
            minWorkers,
            targetWorkers,
            maxWorkersPerProvider,
            pricePerWorkerEpoch,
            effectors,
            IConfig.AccessType.NONE,
            new address[](0)
        );

        console.log("Deal deployed");

        return (
            deal,
            DealParams({
                appCID: appCID,
                paymentToken: paymentToken,
                minWorkers: minWorkers,
                targetWorkers: targetWorkers,
                maxWorkersPerProvider: maxWorkersPerProvider,
                pricePerWorkerEpoch: pricePerWorkerEpoch,
                effectors: effectors
            })
        );
    }

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
    }

    function test_Deploy() public {
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.core.minDealDepositedEpoches();

        uint256 balanceBefore = deployment.tUSD.balanceOf(address(this));

        deployment.tUSD.safeApprove(address(deployment.dealFactory), minAmount);
        (IDeal d, DealParams memory dealParams) = _deployDeal(pricePerWorkerEpoch, targetWorkers);

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

        assertEq(deployment.dealFactory.hasDeal(d), true, "Should deal set in Core");

        //TODO: Check events
    }

    function test_RevertIf_NoTokenAllowance() public {
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;

        vm.expectRevert("ERC20: insufficient allowance");
        _deployDeal(pricePerWorkerEpoch, targetWorkers);
    }

    function test_RevertIf_NoEnoughBalance() public {
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.core.minDealDepositedEpoches();

        vm.startPrank(address(0x01));

        deployment.tUSD.safeApprove(address(deployment.dealFactory), minAmount * 100);

        vm.expectRevert("ERC20: transfer amount exceeds balance");
        _deployDeal(pricePerWorkerEpoch, targetWorkers);

        vm.stopPrank();
    }
}
