// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "forge-std/console.sol";
import "src/deal/Deal.sol";
import "src/deal/interfaces/IConfig.sol";
import "src/core/modules/market/Offer.sol";
import "test/utils/DeployDealSystem.sol";
import "test/utils/TestHelper.sol";

contract AddWorkers is Test {
    using SafeERC20 for IERC20;
    using TestHelper for DeployDealSystem.Deployment;

    DeployDealSystem.Deployment deployment;

    // ------------------ Test ------------------

    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
    }

    function test_AddOneWorker() public {
        Deal deal = deployment.deployDealWithoutFactory(10, 10, 1, 1 ether);

        assertEq(
            uint256(deal.getStatus()), uint256(IDeal.Status.NOT_ENOUGH_WORKERS), "status should be NOT_ENOUGH_WORKERS"
        );
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");

        (address[] memory computeProviders, bytes32[] memory peerIds, bytes32[] memory unitIds) =
            TestHelper.generateProviders(1);

        _addOneWorker(deal, computeProviders[0], unitIds[0], peerIds[0]);

        assertEq(deal.getWorkerCount(), 1, "workerCount should be 1");
        assertEq(deal.getComputeUnitCount(), 1, "unitCount should be 1");
        assertEq(deal.getMaxPaidEpoch(), 0, "maxPaidEpoch should be 0");
        assertEq(
            uint256(deal.getStatus()), uint256(IDeal.Status.NOT_ENOUGH_WORKERS), "status should be NOT_ENOUGH_WORKERS"
        );
    }

    function test_AddMinWorkers() public {
        uint256 minWorkers = 10;
        uint256 targetWorkers = 100;
        uint256 pricePerEpoch = 1 ether;
        uint256 startDeposit = deployment.core.minDealDepositedEpochs() * pricePerEpoch * targetWorkers;
        Deal deal = deployment.deployDealWithoutFactory(minWorkers, targetWorkers, 1, pricePerEpoch, startDeposit);

        (address[] memory computeProviders, bytes32[] memory peerIds, bytes32[] memory unitIds) =
            TestHelper.generateProviders(minWorkers);

        for (uint256 i = 0; i < minWorkers; i++) {
            _addOneWorker(deal, computeProviders[i], unitIds[i], peerIds[i]);
        }

        assertEq(deal.getWorkerCount(), minWorkers, "workerCount is not match");
        assertEq(deal.getComputeUnitCount(), minWorkers, "unitCount is not match");

        uint256 currentEpoch = deployment.core.currentEpoch();
        uint256 expectedPaidEpoch = startDeposit / (pricePerEpoch * minWorkers) - 1;
        assertEq(deal.getMaxPaidEpoch(), currentEpoch + expectedPaidEpoch, "maxPaidEpoch mismatch");
        assertEq(uint256(deal.getStatus()), uint256(IDeal.Status.ACTIVE), "status should be ACTIVE");
    }

    function _addOneWorker(IDeal deal, address computeProvider, bytes32 unitId, bytes32 peerId) private {
        vm.prank(address(deployment.market));
        deal.addComputeUnit(computeProvider, unitId, peerId);

        vm.mockCall(
            address(deployment.core.market()),
            abi.encodeWithSelector(Offer.getComputePeer.selector, peerId),
            abi.encode(TestHelper.pseudoRandom("offerId"), TestHelper.pseudoRandom("commitmentId"), 1, computeProvider)
        );
        vm.prank(computeProvider);
        deal.setWorker(unitId, TestHelper.pseudoRandom("workerId"));
    }
}
