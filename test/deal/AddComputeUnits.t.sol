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
import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {TestWithDeployment} from "test/utils/TestWithDeployment.sol";
import {TestHelper} from "test/utils/TestHelper.sol";


contract AddComputeUnits is TestWithDeployment {
    using SafeERC20 for IERC20;
    using TestHelper for TestWithDeployment.Deployment;

    // ------------------ Test ------------------
    function setUp() public {
        _deploySystem();
    }

    function test_AddOneUnit() public {
        IDeal deal = deployment.deployDealWithoutFactory(10, 10, 1, 1 ether);

        assertEq(
            uint256(deal.getStatus()), uint256(IDeal.Status.NOT_ENOUGH_WORKERS), "status should be NOT_ENOUGH_WORKERS"
        );
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");

        (address[] memory computeProviders, bytes32[] memory peerIds, bytes32[] memory unitIds) =
            TestHelper.generateProviders(1);
        vm.prank(address(deployment.diamond));
        deal.addComputeUnit(computeProviders[0], unitIds[0], peerIds[0]);
        assertEq(deal.getWorkerCount(), 0, "workerCount should be 0");
        assertEq(deal.getComputeUnitCount(), 1, "unitCount should be 1");
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");
        assertEq(
            uint256(deal.getStatus()), uint256(IDeal.Status.NOT_ENOUGH_WORKERS), "status should be NOT_ENOUGH_WORKERS"
        );
    }

    function test_AddMinUnits() public {
        uint256 minWorkers = 10;
        IDeal deal = deployment.deployDealWithoutFactory(minWorkers, 100, 1, 1 ether);

        assertEq(
            uint256(deal.getStatus()), uint256(IDeal.Status.NOT_ENOUGH_WORKERS), "status should be NOT_ENOUGH_WORKERS"
        );
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");

        (address[] memory computeProviders, bytes32[] memory peerIds, bytes32[] memory unitIds) =
            TestHelper.generateProviders(minWorkers);
        for (uint256 i = 0; i < minWorkers; i++) {
            vm.prank(address(deployment.diamond));
            deal.addComputeUnit(computeProviders[i], unitIds[i], peerIds[i]);
        }
        assertEq(deal.getWorkerCount(), 0, "workerCount should be 0");
        assertEq(deal.getComputeUnitCount(), minWorkers, "unitCount should be minWorkers");
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");
        assertEq(
            uint256(deal.getStatus()), uint256(IDeal.Status.NOT_ENOUGH_WORKERS), "status should be NOT_ENOUGH_WORKERS"
        );
    }

    function test_AddTargetUnits() public {
        uint256 targetWorkers = 10;
        IDeal deal = deployment.deployDealWithoutFactory(2, targetWorkers, 1, 1 ether);

        assertEq(
            uint256(deal.getStatus()), uint256(IDeal.Status.NOT_ENOUGH_WORKERS), "status should be NOT_ENOUGH_WORKERS"
        );
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");

        (address[] memory computeProviders, bytes32[] memory peerIds, bytes32[] memory unitIds) =
            TestHelper.generateProviders(targetWorkers);
        for (uint256 i = 0; i < targetWorkers; i++) {
            vm.prank(address(deployment.diamond));
            deal.addComputeUnit(computeProviders[i], unitIds[i], peerIds[i]);
        }
        assertEq(deal.getWorkerCount(), 0, "workerCount should be 0");
        assertEq(deal.getComputeUnitCount(), targetWorkers, "unitCount should be minWorkers");
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");
        assertEq(
            uint256(deal.getStatus()), uint256(IDeal.Status.NOT_ENOUGH_WORKERS), "status should be NOT_ENOUGH_WORKERS"
        );
    }
}
