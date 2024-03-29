// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import "forge-std/StdCheats.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "src/deal/interfaces/IDeal.sol";
import "src/core/modules/market/Offer.sol";

import "test/utils/DeployDealSystem.sol";
import "test/utils/TestHelper.sol";
import "test/utils/DealHelper.sol";

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
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.core.minDealDepositedEpochs();
        uint256 protocolVersion = deployment.core.minProtocolVersion();

        deployment.tUSD.safeApprove(address(deployment.dealFactory), minAmount);
        (IDeal deal,) = deployment.deployDeal(
            minWorkers, maxWorkersPerProvider, targetWorkers, pricePerWorkerEpoch, minAmount, protocolVersion
        );

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
                    peerCount: 1,
                    minProtocolVersion: deployment.core.minProtocolVersion(),
                    maxProtocolVersion: deployment.core.maxProtocolVersion()
                })
            )
        );
        vm.startPrank(address(deployment.market));
        deal.addComputeUnit(computeProvider, unitId, peerId);
        vm.stopPrank();

        vm.startPrank(computeProvider);
        deal.setWorker(unitId, workerId);

        StdCheats.skip(deployment.core.epochDuration() * deployment.core.minDealDepositedEpochs());

        uint256 amount = deal.getRewardAmount(unitId);
        assertEq(amount, pricePerWorkerEpoch * (deployment.core.minDealDepositedEpochs()), "reward amount");

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
                    peerCount: 1,
                    minProtocolVersion: deployment.core.minProtocolVersion(),
                    maxProtocolVersion: deployment.core.maxProtocolVersion()
                })
            )
        );
        deal.withdrawRewards(unitId);
        vm.stopPrank();

        assertEq(deployment.tUSD.balanceOf(address(deal)), balanceDealBefore - amount, "deal balance");
        assertEq(deployment.tUSD.balanceOf(computeProvider), balanceProviderBefore + amount, "provider balance");
    }
}
