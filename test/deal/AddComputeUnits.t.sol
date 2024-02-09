// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "forge-std/console.sol";
import "src/deal/Deal.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/deal/interfaces/IConfig.sol";
import "src/core/modules/market/Offer.sol";
import "test/utils/DeployDealSystem.sol";
import "test/utils/TestHelper.sol";

contract AddComputeUnits is Test {
    using SafeERC20 for IERC20;
    using TestHelper for DeployDealSystem.Deployment;

    DeployDealSystem.Deployment deployment;
    Deal dealImpl;

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
        dealImpl = new Deal();
    }

    function test_AddOneUnit() public {
        Deal deal = deployment.deployDealWithoutFactory(10, 10, 1, 1 ether, 10 ether);

        assertEq(uint256(deal.getStatus()), uint256(IDeal.Status.INACTIVE), "status should be INACTIVE");
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");

        (address[] memory computeProviders, bytes32[] memory peerIds, bytes32[] memory unitIds) =
            TestHelper.generateProviders(1);

        vm.prank(address(deployment.market));
        deal.addComputeUnit(computeProviders[0], unitIds[0], peerIds[0]);

        assertEq(deal.getWorkerCount(), 0, "workerCount should be 0");
        assertEq(deal.getComputeUnitCount(), 1, "unitCount should be 1");
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");
        assertEq(uint256(deal.getStatus()), uint256(IDeal.Status.INACTIVE), "status should be INACTIVE");
    }

    function test_AddMinUnits() public {
        uint256 minWorkers = 10;
        Deal deal = deployment.deployDealWithoutFactory(minWorkers, 100, 1, 1 ether, 10 ether);

        assertEq(uint256(deal.getStatus()), uint256(IDeal.Status.INACTIVE), "status should be INACTIVE");
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");

        (address[] memory computeProviders, bytes32[] memory peerIds, bytes32[] memory unitIds) =
            TestHelper.generateProviders(minWorkers);

        for (uint256 i = 0; i < minWorkers; i++) {
            vm.prank(address(deployment.market));
            deal.addComputeUnit(computeProviders[i], unitIds[i], peerIds[i]);
        }

        assertEq(deal.getWorkerCount(), 0, "workerCount should be 0");
        assertEq(deal.getComputeUnitCount(), minWorkers, "unitCount should be minWorkers");
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");
        assertEq(uint256(deal.getStatus()), uint256(IDeal.Status.INACTIVE), "status should be INACTIVE");
    }

    function test_AddTargetUnits() public {
        uint256 targetWorkers = 10;
        Deal deal = deployment.deployDealWithoutFactory(2, targetWorkers, 1, 1 ether, 10 ether);

        assertEq(uint256(deal.getStatus()), uint256(IDeal.Status.INACTIVE), "status should be INACTIVE");
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");

        (address[] memory computeProviders, bytes32[] memory peerIds, bytes32[] memory unitIds) =
            TestHelper.generateProviders(targetWorkers);

        for (uint256 i = 0; i < targetWorkers; i++) {
            vm.prank(address(deployment.market));
            deal.addComputeUnit(computeProviders[i], unitIds[i], peerIds[i]);
        }

        assertEq(deal.getWorkerCount(), 0, "workerCount should be 0");
        assertEq(deal.getComputeUnitCount(), targetWorkers, "unitCount should be minWorkers");
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");
        assertEq(uint256(deal.getStatus()), uint256(IDeal.Status.INACTIVE), "status should be INACTIVE");
    }
}
