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
import "forge-std/StdCheats.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "src/deal/interfaces/IDeal.sol";
import "src/core/modules/market/interfaces/IOffer.sol";

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
            protocolVersion: deployment.core.minProtocolVersion()
        });
        params.minAmount = params.pricePerWorkerEpoch * params.targetWorkers * deployment.core.minDealDepositedEpochs();

        deployment.tUSD.safeApprove(address(deployment.dealFactory), params.minAmount);
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
                    minPricePerWorkerEpoch: params.pricePerWorkerEpoch,
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
        assertEq(amount, params.pricePerWorkerEpoch * (deployment.core.minDealDepositedEpochs()), "reward amount");

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
                    minPricePerWorkerEpoch: params.pricePerWorkerEpoch,
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
