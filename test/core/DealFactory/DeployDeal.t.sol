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
import "src/deal/interfaces/IConfig.sol";
import "test/utils/DeployDealSystem.sol";
import "test/utils/Random.sol";

contract CreateDeal is Test {
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
        IDeal.AccessType accessType;
        address[] accessList;
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
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: Random.pseudoRandom("effector", i)});
        }

        CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: Random.pseudoRandom("appCID", 0)});

        uint256 minWorkers = 1;
        uint256 maxWorkersPerProvider = 1;
        IERC20 paymentToken = IERC20(address(deployment.tUSD));

        IDeal d = deployment.core.deployDeal(
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

        return (
            d,
            DealParams({
                appCID: appCID,
                paymentToken: paymentToken,
                minWorkers: minWorkers,
                targetWorkers: targetWorkers,
                maxWorkersPerProvider: maxWorkersPerProvider,
                pricePerWorkerEpoch: pricePerWorkerEpoch,
                effectors: effectors,
                accessType: IConfig.AccessType.NONE,
                accessList: new address[](0)
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
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * DeployDealSystem.DEFAULT_MIN_DEPOSITED_EPOCHES;

        uint256 balanceBefore = deployment.tUSD.balanceOf(address(this));

        deployment.tUSD.safeApprove(address(deployment.core), minAmount);
        (IDeal d, DealParams memory dealParams) = _deployDeal(pricePerWorkerEpoch, targetWorkers);

        uint256 balanceDiff = balanceBefore - deployment.tUSD.balanceOf(address(this));

        assertEq(balanceDiff, minAmount);
        assertEq(deployment.tUSD.balanceOf(address(d)), minAmount);
        assertEq(deployment.tUSD.allowance(address(this), address(deployment.core)), 0);
        assertEq(dealParams.appCID.prefixes, d.appCID().prefixes);
        assertEq(dealParams.appCID.hash, d.appCID().hash);
        assertEq(address(dealParams.paymentToken), address(d.paymentToken()));
        assertEq(dealParams.minWorkers, d.minWorkers());
        assertEq(dealParams.targetWorkers, d.targetWorkers());
        assertEq(dealParams.maxWorkersPerProvider, d.maxWorkersPerProvider());
        assertEq(dealParams.pricePerWorkerEpoch, d.pricePerWorkerEpoch());
        assertEq(dealParams.effectors.length, d.effectors().length);
        for (uint256 i = 0; i < dealParams.effectors.length; i++) {
            assertEq(dealParams.effectors[i].prefixes, d.effectors()[i].prefixes);
            assertEq(dealParams.effectors[i].hash, d.effectors()[i].hash);
        }
        assertEq(uint256(dealParams.accessType), uint256(d.accessType()));
        address[] memory accessList = d.getAccessList();
        assertEq(dealParams.accessList.length, accessList.length);
        for (uint256 i = 0; i < dealParams.accessList.length; i++) {
            assertEq(dealParams.accessList[i], accessList[i]);
        }

        assertEq(deployment.core.hasDeal(d), true);
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
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * DeployDealSystem.DEFAULT_MIN_DEPOSITED_EPOCHES;

        vm.startPrank(address(0x01));

        deployment.tUSD.safeApprove(address(deployment.core), minAmount * 100);

        vm.expectRevert("ERC20: transfer amount exceeds balance");
        _deployDeal(pricePerWorkerEpoch, targetWorkers);

        vm.stopPrank();
    }
}
