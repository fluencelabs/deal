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
import "test/utils/DealHelper.sol";
import "forge-std/StdCheats.sol";

contract Rewards is Test {
    using SafeERC20 for IERC20;
    using DealHelper for DeployDealSystem.Deployment;

    DeployDealSystem.Deployment deployment;

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
    }

    function test_RewardWithOneWorker() public {
        uint256 minWorkers = 1;
        uint256 maxWorkersPerProvider = 2;
        uint256 targetWorkers = 3;
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.core.minDealDepositedEpoches();

        deployment.tUSD.safeApprove(address(deployment.market), minAmount);
        (IDeal deal,) =
            deployment.deployDeal(minWorkers, maxWorkersPerProvider, targetWorkers, pricePerWorkerEpoch, minAmount);

        address computeProvider = address(0x1234567890123456789012345678901234567890);
        bytes32 unitId = TestHelper.pseudoRandom(abi.encode(computeProvider, "unitId"));
        bytes32 peerId = TestHelper.pseudoRandom(abi.encode(computeProvider, "peerId"));
        bytes32 workerId = TestHelper.pseudoRandom(abi.encode(computeProvider, "workerId"));
        bytes32 offerId = TestHelper.pseudoRandom(abi.encode(computeProvider, "offerId"));

        console.logBytes32(peerId);

        uint256 balanceDealBefore = deployment.tUSD.balanceOf(address(deal));
        uint256 balanceProviderBefore = deployment.tUSD.balanceOf(computeProvider);

        vm.mockCall(
            address(deployment.market),
            abi.encodeWithSelector(IOffer.getComputePeer.selector, peerId),
            abi.encode(
                IOffer.ComputePeer({offerId: offerId, commitmentId: bytes32(0), unitCount: 1, owner: computeProvider})
            )
        );
        vm.mockCall(
            address(deployment.market),
            abi.encodeWithSelector(IOffer.getOffer.selector, offerId),
            abi.encode(
                IOffer.Offer({
                    provider: computeProvider,
                    minPricePerWorkerEpoch: pricePerWorkerEpoch,
                    paymentToken: address(deployment.tUSD),
                    peerCount: 1
                })
            )
        );
        vm.startPrank(address(deployment.market));
        deal.addComputeUnit(computeProvider, unitId, peerId);
        vm.stopPrank();

        vm.startPrank(computeProvider);
        deal.setWorker(unitId, workerId);

        StdCheats.skip(deployment.core.epochDuration() * deployment.core.minDealDepositedEpoches());

        uint256 amount = deal.getRewardAmount(unitId);
        assertEq(amount, pricePerWorkerEpoch * (deployment.core.minDealDepositedEpoches() - 1), "reward amount");

        vm.mockCall(
            address(deployment.market),
            abi.encodeWithSelector(IOffer.getComputePeer.selector, peerId),
            abi.encode(
                IOffer.ComputePeer({offerId: offerId, commitmentId: bytes32(0), unitCount: 1, owner: computeProvider})
            )
        );
        vm.mockCall(
            address(deployment.market),
            abi.encodeWithSelector(IOffer.getOffer.selector, offerId),
            abi.encode(
                IOffer.Offer({
                    provider: computeProvider,
                    minPricePerWorkerEpoch: pricePerWorkerEpoch,
                    paymentToken: address(deployment.tUSD),
                    peerCount: 1
                })
            )
        );
        deal.withdrawRewards(unitId);
        vm.stopPrank();

        assertEq(deployment.tUSD.balanceOf(address(deal)), balanceDealBefore - amount, "deal balance");
        assertEq(deployment.tUSD.balanceOf(computeProvider), balanceProviderBefore + amount, "provider balance");
    }
}
