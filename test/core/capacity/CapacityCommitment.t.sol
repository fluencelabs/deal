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
import "filecoin-solidity/v0.8/utils/Actor.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/utils/BytesConverter.sol";
import "test/utils/TestWithDeployment.sol";
import "test/utils/TestHelper.sol";

contract CapacityCommitmentTest is TestWithDeployment {
    using SafeERC20 for IERC20;
    using BytesConverter for bytes32;
    using TestHelper for TestWithDeployment.Deployment;

    // ------------------ Events ------------------
    event CommitmentCreated(
        bytes32 indexed peerId,
        bytes32 commitmentId,
        uint256 duration,
        address delegator,
        uint256 rewardDelegationRate,
        uint256 fltCollateralPerUnit
    );
    event CommitmentRemoved(bytes32 indexed commitmentId);
    event CommitmentActivated(
        bytes32 indexed peerId, bytes32 indexed commitmentId, uint256 startEpoch, uint256 endEpoch, bytes32[] unitIds
    );
    event CommitmentFinished(bytes32 indexed commitmentId);

    event CollateralDeposited(bytes32 indexed commitmentId, uint256 totalCollateral);

    event ProofSubmitted(bytes32 indexed commitmentId, bytes32 indexed unitId, bytes32 localUnitNonce);
    event RewardWithdrawn(bytes32 indexed commitmentId, uint256 amount);

    // ------------------ Errors ------------------
    error TooManyProofs();

    // Init variables
    IMarket.RegisterComputePeer[] registerPeers;
    uint256 minPricePerWorkerEpoch;
    CIDV1[] effectors;
    address paymentToken;
    uint256 ccDuration;
    address ccDelegator;
    uint256 rewardCCDelegationRate;

    // ------------------ Test ------------------
    function setUp() public {
        _deploySystem();

        paymentToken = address(deployment.tUSD);
        minPricePerWorkerEpoch = 1000;

        for (uint256 i = 0; i < 10; i++) {
            effectors.push(CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("effector", i))}));
        }

        for (uint256 i = 0; i < 10; i++) {
            bytes32 peerId = TestHelper.pseudoRandom(abi.encode("peerId", i));

            bytes32[] memory unitIds = new bytes32[](5);
            for (uint256 j = 0; j < unitIds.length; j++) {
                unitIds[j] = keccak256(abi.encodePacked(TestHelper.pseudoRandom(abi.encode(peerId, "unitId", i, j))));
            }

            registerPeers.push(
                IOffer.RegisterComputePeer({
                    peerId: peerId,
                    unitIds: unitIds,
                    owner: address(bytes20(TestHelper.pseudoRandom(abi.encode("peerId-address", i))))
                })
            );
        }

        ccDuration = deployment.core.minDuration();
        ccDelegator = address(bytes20(TestHelper.pseudoRandom(abi.encode("delegator"))));

        vm.deal(ccDelegator, type(uint256).max);

        rewardCCDelegationRate = 100;
    }

    function test_CreateCapacityCommitment() public {
        deployment.market.setProviderInfo("name", CIDV1({prefixes: 0x12345678, hash: bytes32(0)}));
        deployment.market.registerMarketOffer(
            minPricePerWorkerEpoch,
            paymentToken,
            effectors,
            registerPeers,
            deployment.core.minProtocolVersion(),
            deployment.core.maxProtocolVersion()
        );

        bytes32 peerId = registerPeers[0].peerId;
        bytes32 commitmentId =
            keccak256(abi.encodePacked(block.number, peerId, ccDuration, ccDelegator, rewardCCDelegationRate));

        // expect emit CommitmentCreated
        vm.expectEmit(true, true, false, true, address(deployment.capacity));
        emit CommitmentCreated(
            peerId,
            commitmentId,
            ccDuration,
            ccDelegator,
            rewardCCDelegationRate,
            deployment.core.fltCollateralPerUnit()
        );

        // call createCapacityCommitment
        deployment.capacity.createCommitment(peerId, ccDuration, ccDelegator, rewardCCDelegationRate);
    }

    function test_GetCapacityCommitment() public {
        deployment.market.setProviderInfo("name", CIDV1({prefixes: 0x12345678, hash: bytes32(0)}));

        deployment.market.registerMarketOffer(
            minPricePerWorkerEpoch,
            paymentToken,
            effectors,
            registerPeers,
            deployment.core.minProtocolVersion(),
            deployment.core.maxProtocolVersion()
        );

        bytes32 peerId = registerPeers[0].peerId;

        bytes32 commitmentId = _createCapacityCommitment(peerId);

        ICapacity.CommitmentView memory commitment = deployment.capacity.getCommitment(commitmentId);

        assertEq(uint256(commitment.status), uint256(ICapacity.CCStatus.WaitDelegation), "Status mismatch");
        assertEq(commitment.peerId, peerId, "PeerId mismatch");
        assertEq(commitment.collateralPerUnit, deployment.core.fltCollateralPerUnit(), "CollateralPerUnit mismatch");
        assertEq(commitment.endEpoch, commitment.startEpoch + ccDuration, "Duration mismatch");
        assertEq(commitment.rewardDelegatorRate, rewardCCDelegationRate, "RewardDelegatorRate mismatch");
        assertEq(commitment.delegator, ccDelegator, "Delegator mismatch");
        assertEq(commitment.totalFailCount, 0, "TotalFailCount mismatch");
        assertEq(commitment.startEpoch, 0, "StartEpoch mismatch");
        assertEq(commitment.failedEpoch, 0, "FailedEpoch mismatch");
        assertEq(commitment.exitedUnitCount, 0, "ExitedUnitCount mismatch");
    }

    function test_DepositCollateral() public {
        deployment.market.setProviderInfo("name", CIDV1({prefixes: 0x12345678, hash: bytes32(0)}));

        deployment.market.registerMarketOffer(
            minPricePerWorkerEpoch,
            paymentToken,
            effectors,
            registerPeers,
            deployment.core.minProtocolVersion(),
            deployment.core.maxProtocolVersion()
        );

        uint256 amountTotal = 0;
        bytes32[] memory createdCCIds = new bytes32[](registerPeers.length);
        uint256[] memory amounts = new uint256[](registerPeers.length);
        uint256 unitCountTotal = 0;
        uint256 activeUnitCountBefore = deployment.core.activeUnitCount();
        for (uint256 i = 0; i < registerPeers.length; ++i) {
            bytes32 peerId = registerPeers[i].peerId;
            uint256 unitCount = registerPeers[i].unitIds.length;
            unitCountTotal += unitCount;
            bytes32 commitmentId = _createCapacityCommitment(peerId);
            createdCCIds[i] = commitmentId;

            uint256 amount = unitCount * deployment.core.fltCollateralPerUnit();
            amounts[i] = amount;
            amountTotal += amount;
        }

        vm.startPrank(ccDelegator);
        uint256 currentEpoch = deployment.core.currentEpoch();

        for (uint256 i = 0; i < registerPeers.length; ++i) {
            vm.expectEmit(true, true, false, true, address(deployment.capacity));
            emit CollateralDeposited(createdCCIds[i], amounts[i]);

            vm.expectEmit(true, true, true, true, address(deployment.capacity));
            emit CommitmentActivated(
                registerPeers[i].peerId,
                createdCCIds[i],
                currentEpoch + 1,
                currentEpoch + 1 + ccDuration,
                registerPeers[i].unitIds
            );
        }

        deployment.capacity.depositCollateral{value: amountTotal}(createdCCIds);
        vm.stopPrank();

        StdCheats.skip(uint256(deployment.core.epochDuration()));

        uint256 activeUnitCountAfter = deployment.core.activeUnitCount();
        assertEq(activeUnitCountAfter, activeUnitCountBefore + unitCountTotal, "ActiveUnitCount mismatch");

        // Verify commitments info.
        for (uint256 i = 0; i < registerPeers.length; ++i) {
            ICapacity.CommitmentView memory commitment = deployment.capacity.getCommitment(createdCCIds[i]);
            assertEq(uint256(commitment.status), uint256(ICapacity.CCStatus.Active), "Status mismatch");
            assertEq(commitment.peerId, registerPeers[i].peerId, "PeerId mismatch");
            assertEq(commitment.collateralPerUnit, deployment.core.fltCollateralPerUnit(), "CollateralPerUnit mismatch");
            assertEq(commitment.endEpoch, deployment.core.currentEpoch() + ccDuration, "Duration mismatch");
            assertEq(commitment.rewardDelegatorRate, rewardCCDelegationRate, "RewardDelegatorRate mismatch");
            assertEq(commitment.delegator, ccDelegator, "Delegator mismatch");
            assertEq(commitment.startEpoch, deployment.core.currentEpoch(), "StartEpoch mismatch");
            assertEq(commitment.failedEpoch, 0, "FailedEpoch mismatch");
            assertEq(commitment.exitedUnitCount, 0, "ExitedUnitCount mismatch");
        }
    }

    function test_SubmitProof() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;
        bytes32 unitId = registerPeers[0].unitIds[0];

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        StdCheats.skip(uint256(deployment.core.epochDuration()));

        vm.startPrank(peerOwner);

        bytes32 localUnitNonce = keccak256(abi.encodePacked("localUnitNonce"));
        // RandomXProxyMock returns difficulty
        bytes32 targetHash = deployment.core.difficulty();

        vm.expectEmit(true, true, false, true, address(deployment.capacity));
        emit ProofSubmitted(commitmentId, unitId, localUnitNonce);

        deployment.capacity.submitProof(unitId, localUnitNonce, targetHash);

        vm.stopPrank();
    }

    function test_SubmitProofs() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        StdCheats.skip(uint256(deployment.core.epochDuration()));

        vm.startPrank(peerOwner);

        uint64 proofsPerUnit = 4;
        bytes32[] memory unitIds = new bytes32[](proofsPerUnit * unitCount);
        bytes32[] memory localUnitNonces = new bytes32[](proofsPerUnit * unitCount);
        bytes32[] memory targetHashes = new bytes32[](proofsPerUnit * unitCount);
        for (uint256 i = 0; i < proofsPerUnit * unitCount; ++i) {
            unitIds[i] = registerPeers[0].unitIds[i % unitCount];
            localUnitNonces[i] = keccak256(abi.encodePacked("localUnitNonce", i));
            // RandomXProxyMock returns difficulty
            targetHashes[i] = deployment.core.difficulty();

            vm.expectEmit(true, true, false, true, address(deployment.capacity));
            emit ProofSubmitted(commitmentId, unitIds[i], localUnitNonces[i]);
        }

        deployment.capacity.submitProofs(unitIds, localUnitNonces, targetHashes);

        vm.stopPrank();
    }

    function test_SubmitProofs_TooManyProofs() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        StdCheats.skip(uint256(deployment.core.epochDuration()));

        vm.startPrank(peerOwner);

        uint256 maxProofs = deployment.core.maxProofsPerEpoch();

        bytes32[] memory unitIds = new bytes32[](unitCount + maxProofs);
        bytes32[] memory localUnitNonces = new bytes32[](unitCount + maxProofs);
        bytes32[] memory targetHashes = new bytes32[](unitCount + maxProofs);
        for (uint256 i = 0; i < unitCount; ++i) {
            unitIds[i] = registerPeers[0].unitIds[i];
            localUnitNonces[i] = keccak256(abi.encodePacked("localUnitNonce", i));
            // RandomXProxyMock returns difficulty
            targetHashes[i] = deployment.core.difficulty();
        }

        for (uint256 i = unitCount; i < maxProofs + unitCount; ++i) {
            unitIds[i] = registerPeers[0].unitIds[0];
            localUnitNonces[i] = keccak256(abi.encodePacked("localUnitNonce-max", i));
            // RandomXProxyMock returns difficulty
            targetHashes[i] = deployment.core.difficulty();
        }

        vm.expectRevert(TooManyProofs.selector);

        deployment.capacity.submitProofs(unitIds, localUnitNonces, targetHashes);

        vm.stopPrank();
    }

    function test_SubmitProofs_AlreadySubmitted() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        StdCheats.skip(uint256(deployment.core.epochDuration()));

        vm.startPrank(peerOwner);

        bytes32[] memory unitIds = new bytes32[](unitCount + 1);
        bytes32[] memory localUnitNonces = new bytes32[](unitCount + 1);
        bytes32[] memory targetHashes = new bytes32[](unitCount + 1);
        for (uint256 i = 0; i < unitCount; ++i) {
            unitIds[i] = registerPeers[0].unitIds[i];
            localUnitNonces[i] = keccak256(abi.encodePacked("localUnitNonce", i));
            // RandomXProxyMock returns difficulty
            targetHashes[i] = deployment.core.difficulty();
        }

        unitIds[unitCount] = registerPeers[0].unitIds[0];
        // Repeated local unit nonce
        localUnitNonces[unitCount] = keccak256(abi.encodePacked("localUnitNonce", uint256(0)));
        // RandomXProxyMock returns difficulty
        targetHashes[unitCount] = deployment.core.difficulty();
        
        vm.expectRevert("Proof is already submitted for this unit");

        deployment.capacity.submitProofs(unitIds, localUnitNonces, targetHashes);

        vm.stopPrank();
    }

    function test_RewardAfterSubmitProofs() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;
        bytes32 unitId = registerPeers[0].unitIds[0];

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        // warp to next epoch
        StdCheats.skip(deployment.core.epochDuration());

        // RandomXProxyMock returns difficulty
        bytes32 targetHash = deployment.core.difficulty();

        vm.startPrank(peerOwner);
        uint256 maxProofsPerEpoch = deployment.core.maxProofsPerEpoch();
        for (uint256 i = 0; i < maxProofsPerEpoch; i++) {
            bytes32 localUnitNonce_ = keccak256(abi.encodePacked("localUnitNonce", i));

            vm.expectEmit(true, true, false, true, address(deployment.capacity));
            emit ProofSubmitted(commitmentId, unitId, localUnitNonce_);

            deployment.capacity.submitProof(unitId, localUnitNonce_, targetHash);
        }

        uint256 reward = (
            deployment.core.getRewardPool(deployment.core.currentEpoch()) / deployment.core.vestingPeriodCount()
        ) * deployment.core.vestingPeriodCount();
        StdCheats.skip(deployment.core.epochDuration());

        bytes32 localUnitNonce = keccak256(abi.encodePacked("localUnitNonce"));
        deployment.capacity.submitProof(unitId, localUnitNonce, targetHash);

        assertEq(deployment.capacity.totalRewards(commitmentId), reward, "TotalRewards mismatch");
        assertEq(deployment.capacity.unlockedRewards(commitmentId), 0, "UnlockedRewards mismatch");

        vm.stopPrank();
    }

    function test_ExitCommitment() external {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        // warp to next epoch
        StdCheats.skip(deployment.core.epochDuration());

        StdCheats.skip(ccDuration * 2000);
        bytes32[] memory unitIds = deployment.market.getComputeUnitIds(peerId);

        deployment.capacity.removeCUFromCC(commitmentId, unitIds);
        deployment.capacity.finishCommitment(commitmentId);
    }

    function test_ExitCommitmentWithDealAfterTime() external {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;

        (bytes32 commitmentId, bytes32 offerId) = _createAndDepositCapacityCommitment(peerId, unitCount);

        // warp to next epoch
        StdCheats.skip(deployment.core.epochDuration());

        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.core.minDealDepositedEpochs();

        deployment.tUSD.safeApprove(address(deployment.dealFactory), minAmount);
        uint256 protocolVersion = deployment.core.minProtocolVersion();
        (IDeal d,) = deployment.deployDeal(
            TestHelper.DeployDealParams({
                minWorkers: 1,
                maxWorkersPerProvider: 2,
                targetWorkers: targetWorkers,
                pricePerWorkerEpoch: pricePerWorkerEpoch,
                depositAmount: minAmount,
                protocolVersion: protocolVersion
            })
        );

        bytes32[] memory unitIds = deployment.market.getComputeUnitIds(peerId);
        bytes32[][] memory unitIds2d = new bytes32[][](1);
        unitIds2d[0] = unitIds;

        bytes32[] memory offerIds = new bytes32[](1);
        offerIds[0] = offerId;

        deployment.market.matchDeal(d, offerIds, unitIds2d);

        StdCheats.skip(ccDuration * 2000);

        deployment.capacity.removeCUFromCC(commitmentId, unitIds);
        deployment.capacity.finishCommitment(commitmentId);
    }

    // ------------------ Internals ------------------
    function _createCapacityCommitment(bytes32 peerId) internal returns (bytes32 commitmentId) {
        vm.recordLogs();
        deployment.capacity.createCommitment(peerId, ccDuration, ccDelegator, rewardCCDelegationRate);

        Vm.Log[] memory entries = vm.getRecordedLogs();

        (commitmentId,,,) = abi.decode(entries[0].data, (bytes32, address, uint256, uint256));

        return commitmentId;
    }

    function _createAndDepositCapacityCommitment(bytes32 peerId, uint256 unitCount)
        internal
        returns (bytes32 commitmentId, bytes32 offerId)
    {
        deployment.market.setProviderInfo("name", CIDV1({prefixes: 0x12345678, hash: bytes32(0)}));
        offerId = deployment.market.registerMarketOffer(
            minPricePerWorkerEpoch,
            paymentToken,
            effectors,
            registerPeers,
            deployment.core.minProtocolVersion(),
            deployment.core.maxProtocolVersion()
        );

        commitmentId = _createCapacityCommitment(peerId);

        vm.startPrank(ccDelegator);

        bytes32[] memory commitmentIds = new bytes32[](1);
        commitmentIds[0] = commitmentId;

        deployment.capacity.depositCollateral{value: unitCount * deployment.core.fltCollateralPerUnit()}(commitmentIds);
        vm.stopPrank();
    }

    receive() external payable {}
}
 