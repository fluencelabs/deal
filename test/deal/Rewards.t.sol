// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import "forge-std/StdCheats.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {IOffer} from "src/core/interfaces/IOffer.sol";

import "test/utils/TestWithDeployment.sol";
import "test/utils/TestHelper.sol";

contract Rewards is TestWithDeployment {
    using SafeERC20 for IERC20;
    using TestHelper for TestWithDeployment.Deployment;

    struct Params {
        uint256 minWorkers;
        uint256 maxWorkersPerProvider;
        uint256 targetWorkers;
        uint256 pricePerWorkerEpoch;
        uint256 minAmount;
        uint256 protocolVersion;
    }

    function setUp() public {
        _deploySystem();
    }

    function test_RewardWithOneWorker() public {
        Params memory params = Params({
            minWorkers: 1,
            maxWorkersPerProvider: 2,
            targetWorkers: 3,
            pricePerWorkerEpoch: 1 ether,
            minAmount: 0,
            protocolVersion: deployment.diamondAsCore.minProtocolVersion()
        });
        params.minAmount = params.pricePerWorkerEpoch * params.targetWorkers * deployment.diamondAsCore.minDealDepositedEpochs();

        deployment.tUSD.safeApprove(address(deployment.diamondAsDealFactory), params.minAmount);
        (IDeal deal,) = deployment.deployDeal(
            TestHelper.DeployDealParams({
                minWorkers: params.minWorkers,
                maxWorkersPerProvider: params.maxWorkersPerProvider,
                targetWorkers: params.targetWorkers,
                pricePerWorkerEpoch: params.pricePerWorkerEpoch,
                depositAmount: params.minAmount,
                protocolVersion: params.protocolVersion
            })
        );

        address computeProvider = address(0x1234567890123456789012345678901234567890);
        bytes32 unitId = TestHelper.pseudoRandom(abi.encode(computeProvider, "unitId"));
        bytes32 peerId = TestHelper.pseudoRandom(abi.encode(computeProvider, "peerId"));
        bytes32 workerId = TestHelper.pseudoRandom(abi.encode(computeProvider, "workerId"));
        bytes32 offerId = TestHelper.pseudoRandom(abi.encode(computeProvider, "offerId"));

        uint256 balanceDealBefore = deployment.tUSD.balanceOf(address(deal));
        uint256 balanceProviderBefore = deployment.tUSD.balanceOf(computeProvider);

        vm.mockCall(
            address(deployment.diamond),
            abi.encodeWithSelector(IOffer.getComputePeer.selector, peerId),
            abi.encode(
                IOffer.ComputePeer({offerId: offerId, commitmentId: bytes32(0), unitCount: 1, owner: computeProvider})
            )
        );
        vm.mockCall(
            address(deployment.diamond),
            abi.encodeWithSelector(IOffer.getOffer.selector, offerId),
            abi.encode(
                IOffer.Offer({
                    provider: computeProvider,
                    minPricePerWorkerEpoch: params.pricePerWorkerEpoch,
                    paymentToken: address(deployment.tUSD),
                    peerCount: 1,
                    minProtocolVersion: deployment.diamondAsCore.minProtocolVersion(),
                    maxProtocolVersion: deployment.diamondAsCore.maxProtocolVersion()
                })
            )
        );
        vm.startPrank(address(deployment.diamond));
        deal.addComputeUnit(computeProvider, unitId, peerId);
        vm.stopPrank();

        vm.startPrank(computeProvider);
        deal.setWorker(unitId, workerId);

        StdCheats.skip(deployment.diamondAsCore.epochDuration() * deployment.diamondAsCore.minDealDepositedEpochs());

        uint256 amount = deal.getRewardAmount(unitId);
        assertEq(amount, params.pricePerWorkerEpoch * (deployment.diamondAsCore.minDealDepositedEpochs()), "reward amount");

        vm.mockCall(
            address(deployment.diamond),
            abi.encodeWithSelector(IOffer.getComputePeer.selector, peerId),
            abi.encode(
                IOffer.ComputePeer({offerId: offerId, commitmentId: bytes32(0), unitCount: 1, owner: computeProvider})
            )
        );
        vm.mockCall(
            address(deployment.diamond),
            abi.encodeWithSelector(IOffer.getOffer.selector, offerId),
            abi.encode(
                IOffer.Offer({
                    provider: computeProvider,
                    minPricePerWorkerEpoch: params.pricePerWorkerEpoch,
                    paymentToken: address(deployment.tUSD),
                    peerCount: 1,
                    minProtocolVersion: deployment.diamondAsCore.minProtocolVersion(),
                    maxProtocolVersion: deployment.diamondAsCore.maxProtocolVersion()
                })
            )
        );
        deal.withdrawRewards(unitId);
        vm.stopPrank();

        assertEq(deployment.tUSD.balanceOf(address(deal)), balanceDealBefore - amount, "deal balance");
        assertEq(deployment.tUSD.balanceOf(computeProvider), balanceProviderBefore + amount, "provider balance");
    }
}
