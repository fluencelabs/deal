// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, Vm} from "forge-std/Test.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CIDV1} from "src/utils/Common.sol";
import {IOffer} from "src/core/interfaces/IOffer.sol";
import {ICapacity} from "src/core/interfaces/ICapacity.sol";
import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {IMarket} from "src/core/interfaces/IMarket.sol";
import {TestWithDeployment} from "test/utils/TestWithDeployment.sol";
import {TestHelper} from "test/utils/TestHelper.sol";

contract CapacityCommitmentTest is TestWithDeployment {
    using SafeERC20 for IERC20;
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

        ccDuration = deployment.diamondAsCore.minDuration();
        ccDelegator = address(bytes20(TestHelper.pseudoRandom(abi.encode("delegator"))));

        vm.deal(ccDelegator, type(uint256).max);

        rewardCCDelegationRate = 100;
    }

    function test_CreateCapacityCommitment() public {
        deployment.diamondAsMarket.setProviderInfo("name", CIDV1({prefixes: 0x12345678, hash: bytes32(0)}));
        deployment.diamondAsMarket.registerMarketOffer(
            minPricePerWorkerEpoch,
            paymentToken,
            effectors,
            registerPeers,
            deployment.diamondAsCore.minProtocolVersion(),
            deployment.diamondAsCore.maxProtocolVersion()
        );

        bytes32 peerId = registerPeers[0].peerId;
        bytes32 commitmentId =
            keccak256(abi.encodePacked(block.number, peerId, ccDuration, ccDelegator, rewardCCDelegationRate));

        // expect emit CommitmentCreated
        vm.expectEmit(true, true, false, true, address(deployment.diamond));
        emit CommitmentCreated(
            peerId,
            commitmentId,
            ccDuration,
            ccDelegator,
            rewardCCDelegationRate,
            deployment.diamondAsCore.fltCollateralPerUnit()
        );

        // call createCapacityCommitment
        deployment.diamondAsCapacity.createCommitment(peerId, ccDuration, ccDelegator, rewardCCDelegationRate);
    }

    function test_GetCapacityCommitment() public {
        deployment.diamondAsMarket.setProviderInfo("name", CIDV1({prefixes: 0x12345678, hash: bytes32(0)}));

        deployment.diamondAsMarket.registerMarketOffer(
            minPricePerWorkerEpoch,
            paymentToken,
            effectors,
            registerPeers,
            deployment.diamondAsCore.minProtocolVersion(),
            deployment.diamondAsCore.maxProtocolVersion()
        );

        bytes32 peerId = registerPeers[0].peerId;

        bytes32 commitmentId = _createCapacityCommitment(peerId);

        ICapacity.CommitmentView memory commitment = deployment.diamondAsCapacity.getCommitment(commitmentId);

        assertEq(uint256(commitment.status), uint256(ICapacity.CCStatus.WaitDelegation), "Status mismatch");
        assertEq(commitment.peerId, peerId, "PeerId mismatch");
        assertEq(commitment.collateralPerUnit, deployment.diamondAsCore.fltCollateralPerUnit(), "CollateralPerUnit mismatch");
        assertEq(commitment.endEpoch, commitment.startEpoch + ccDuration, "Duration mismatch");
        assertEq(commitment.rewardDelegatorRate, rewardCCDelegationRate, "RewardDelegatorRate mismatch");
        assertEq(commitment.delegator, ccDelegator, "Delegator mismatch");
        assertEq(commitment.totalFailCount, 0, "TotalFailCount mismatch");
        assertEq(commitment.startEpoch, 0, "StartEpoch mismatch");
        assertEq(commitment.failedEpoch, 0, "FailedEpoch mismatch");
        assertEq(commitment.exitedUnitCount, 0, "ExitedUnitCount mismatch");
    }

    function test_DepositCollateral() public {
        deployment.diamondAsMarket.setProviderInfo("name", CIDV1({prefixes: 0x12345678, hash: bytes32(0)}));

        deployment.diamondAsMarket.registerMarketOffer(
            minPricePerWorkerEpoch,
            paymentToken,
            effectors,
            registerPeers,
            deployment.diamondAsCore.minProtocolVersion(),
            deployment.diamondAsCore.maxProtocolVersion()
        );

        uint256 amountTotal = 0;
        bytes32[] memory createdCCIds = new bytes32[](registerPeers.length);
        uint256[] memory amounts = new uint256[](registerPeers.length);
        uint256 unitCountTotal = 0;
        uint256 activeUnitCountBefore = deployment.diamondAsCore.activeUnitCount();
        for (uint256 i = 0; i < registerPeers.length; ++i) {
            bytes32 peerId = registerPeers[i].peerId;
            uint256 unitCount = registerPeers[i].unitIds.length;
            unitCountTotal += unitCount;
            bytes32 commitmentId = _createCapacityCommitment(peerId);
            createdCCIds[i] = commitmentId;

            uint256 amount = unitCount * deployment.diamondAsCore.fltCollateralPerUnit();
            amounts[i] = amount;
            amountTotal += amount;
        }

        vm.startPrank(ccDelegator);
        uint256 currentEpoch = deployment.diamondAsCore.currentEpoch();

        for (uint256 i = 0; i < registerPeers.length; ++i) {
            vm.expectEmit(true, true, false, true, address(deployment.diamond));
            emit CollateralDeposited(createdCCIds[i], amounts[i]);

            vm.expectEmit(true, true, true, true, address(deployment.diamond));
            emit CommitmentActivated(
                registerPeers[i].peerId,
                createdCCIds[i],
                currentEpoch + 1,
                currentEpoch + 1 + ccDuration,
                registerPeers[i].unitIds
            );
        }

        deployment.diamondAsCapacity.depositCollateral{value: amountTotal}(createdCCIds);
        vm.stopPrank();

        StdCheats.skip(uint256(deployment.diamondAsCore.epochDuration()));

        uint256 activeUnitCountAfter = deployment.diamondAsCore.activeUnitCount();
        assertEq(activeUnitCountAfter, activeUnitCountBefore + unitCountTotal, "ActiveUnitCount mismatch");

        // Verify commitments info.
        for (uint256 i = 0; i < registerPeers.length; ++i) {
            ICapacity.CommitmentView memory commitment = deployment.diamondAsCapacity.getCommitment(createdCCIds[i]);
            assertEq(uint256(commitment.status), uint256(ICapacity.CCStatus.Active), "Status mismatch");
            assertEq(commitment.peerId, registerPeers[i].peerId, "PeerId mismatch");
            assertEq(commitment.collateralPerUnit, deployment.diamondAsCore.fltCollateralPerUnit(), "CollateralPerUnit mismatch");
            assertEq(commitment.endEpoch, deployment.diamondAsCore.currentEpoch() + ccDuration, "Duration mismatch");
            assertEq(commitment.rewardDelegatorRate, rewardCCDelegationRate, "RewardDelegatorRate mismatch");
            assertEq(commitment.delegator, ccDelegator, "Delegator mismatch");
            assertEq(commitment.startEpoch, deployment.diamondAsCore.currentEpoch(), "StartEpoch mismatch");
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

        StdCheats.skip(uint256(deployment.diamondAsCore.epochDuration()));

        vm.startPrank(peerOwner);

        bytes32 localUnitNonce = keccak256(abi.encodePacked("localUnitNonce"));
        // RandomXProxyMock returns difficulty
        bytes32 targetHash = deployment.diamondAsCore.difficulty();

        vm.expectEmit(true, true, false, true, address(deployment.diamond));
        emit ProofSubmitted(commitmentId, unitId, localUnitNonce);

        deployment.diamondAsCapacity.submitProof(unitId, localUnitNonce, targetHash);

        vm.stopPrank();
    }

    function test_SubmitProofs() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        StdCheats.skip(uint256(deployment.diamondAsCore.epochDuration()));

        vm.startPrank(peerOwner);

        uint64 proofsPerUnit = 4;
        bytes32[] memory unitIds = new bytes32[](proofsPerUnit * unitCount);
        bytes32[] memory localUnitNonces = new bytes32[](proofsPerUnit * unitCount);
        bytes32[] memory targetHashes = new bytes32[](proofsPerUnit * unitCount);
        for (uint256 i = 0; i < proofsPerUnit * unitCount; ++i) {
            unitIds[i] = registerPeers[0].unitIds[i % unitCount];
            localUnitNonces[i] = keccak256(abi.encodePacked("localUnitNonce", i));
            // RandomXProxyMock returns difficulty
            targetHashes[i] = deployment.diamondAsCore.difficulty();

            vm.expectEmit(true, true, false, true, address(deployment.diamond));
            emit ProofSubmitted(commitmentId, unitIds[i], localUnitNonces[i]);
        }

        deployment.diamondAsCapacity.submitProofs(unitIds, localUnitNonces, targetHashes);

        vm.stopPrank();
    }

    function test_SubmitProofs_TooManyProofs() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        StdCheats.skip(uint256(deployment.diamondAsCore.epochDuration()));

        vm.startPrank(peerOwner);

        uint256 maxProofs = deployment.diamondAsCore.maxProofsPerEpoch();

        bytes32[] memory unitIds = new bytes32[](unitCount + maxProofs);
        bytes32[] memory localUnitNonces = new bytes32[](unitCount + maxProofs);
        bytes32[] memory targetHashes = new bytes32[](unitCount + maxProofs);
        for (uint256 i = 0; i < unitCount; ++i) {
            unitIds[i] = registerPeers[0].unitIds[i];
            localUnitNonces[i] = keccak256(abi.encodePacked("localUnitNonce", i));
            // RandomXProxyMock returns difficulty
            targetHashes[i] = deployment.diamondAsCore.difficulty();
        }

        for (uint256 i = unitCount; i < maxProofs + unitCount; ++i) {
            unitIds[i] = registerPeers[0].unitIds[0];
            localUnitNonces[i] = keccak256(abi.encodePacked("localUnitNonce-max", i));
            // RandomXProxyMock returns difficulty
            targetHashes[i] = deployment.diamondAsCore.difficulty();
        }

        vm.expectRevert(TooManyProofs.selector);

        deployment.diamondAsCapacity.submitProofs(unitIds, localUnitNonces, targetHashes);

        vm.stopPrank();
    }

    function test_SubmitProofs_AlreadySubmitted() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        StdCheats.skip(uint256(deployment.diamondAsCore.epochDuration()));

        vm.startPrank(peerOwner);

        bytes32[] memory unitIds = new bytes32[](unitCount + 1);
        bytes32[] memory localUnitNonces = new bytes32[](unitCount + 1);
        bytes32[] memory targetHashes = new bytes32[](unitCount + 1);
        for (uint256 i = 0; i < unitCount; ++i) {
            unitIds[i] = registerPeers[0].unitIds[i];
            localUnitNonces[i] = keccak256(abi.encodePacked("localUnitNonce", i));
            // RandomXProxyMock returns difficulty
            targetHashes[i] = deployment.diamondAsCore.difficulty();
        }

        unitIds[unitCount] = registerPeers[0].unitIds[0];
        // Repeated local unit nonce
        localUnitNonces[unitCount] = keccak256(abi.encodePacked("localUnitNonce", uint256(0)));
        // RandomXProxyMock returns difficulty
        targetHashes[unitCount] = deployment.diamondAsCore.difficulty();
        
        vm.expectRevert("Proof is already submitted for this unit");

        deployment.diamondAsCapacity.submitProofs(unitIds, localUnitNonces, targetHashes);

        vm.stopPrank();
    }

    function test_RewardAfterSubmitProofs() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;
        bytes32 unitId = registerPeers[0].unitIds[0];

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        // warp to next epoch
        StdCheats.skip(deployment.diamondAsCore.epochDuration());

        // RandomXProxyMock returns difficulty
        bytes32 targetHash = deployment.diamondAsCore.difficulty();

        vm.startPrank(peerOwner);
        uint256 maxProofsPerEpoch = deployment.diamondAsCore.maxProofsPerEpoch();
        for (uint256 i = 0; i < maxProofsPerEpoch; i++) {
            bytes32 localUnitNonce_ = keccak256(abi.encodePacked("localUnitNonce", i));

            vm.expectEmit(true, true, false, true, address(deployment.diamond));
            emit ProofSubmitted(commitmentId, unitId, localUnitNonce_);

            deployment.diamondAsCapacity.submitProof(unitId, localUnitNonce_, targetHash);
        }

        uint256 reward = (
            deployment.diamondAsCore.getRewardPool(deployment.diamondAsCore.currentEpoch()) / deployment.diamondAsCore.vestingPeriodCount()
        ) * deployment.diamondAsCore.vestingPeriodCount();
        StdCheats.skip(deployment.diamondAsCore.epochDuration());

        bytes32 localUnitNonce = keccak256(abi.encodePacked("localUnitNonce"));
        deployment.diamondAsCapacity.submitProof(unitId, localUnitNonce, targetHash);

        assertEq(deployment.diamondAsCapacity.totalRewards(commitmentId), reward, "TotalRewards mismatch");
        assertEq(deployment.diamondAsCapacity.unlockedRewards(commitmentId), 0, "UnlockedRewards mismatch");

        vm.stopPrank();
    }

    function test_ExitCommitment() external {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        // warp to next epoch
        StdCheats.skip(deployment.diamondAsCore.epochDuration());

        StdCheats.skip(ccDuration * 2000);
        bytes32[] memory unitIds = deployment.diamondAsMarket.getComputeUnitIds(peerId);

        deployment.diamondAsCapacity.removeCUFromCC(commitmentId, unitIds);
        deployment.diamondAsCapacity.finishCommitment(commitmentId);
    }

    function test_ExitCommitmentWithDealAfterTime() external {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;

        (bytes32 commitmentId, bytes32 offerId) = _createAndDepositCapacityCommitment(peerId, unitCount);

        // warp to next epoch
        StdCheats.skip(deployment.diamondAsCore.epochDuration());

        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 targetWorkers = 3;
        uint256 minAmount = pricePerWorkerEpoch * targetWorkers * deployment.diamondAsCore.minDealDepositedEpochs();

        deployment.tUSD.safeApprove(address(deployment.diamond), minAmount);
        uint256 protocolVersion = deployment.diamondAsCore.minProtocolVersion();
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

        bytes32[] memory unitIds = deployment.diamondAsMarket.getComputeUnitIds(peerId);
        bytes32[][] memory unitIds2d = new bytes32[][](1);
        unitIds2d[0] = unitIds;

        bytes32[] memory offerIds = new bytes32[](1);
        offerIds[0] = offerId;

        deployment.diamondAsMarket.matchDeal(d, offerIds, unitIds2d);

        StdCheats.skip(ccDuration * 2000);

        deployment.diamondAsCapacity.removeCUFromCC(commitmentId, unitIds);
        deployment.diamondAsCapacity.finishCommitment(commitmentId);
    }

    // ------------------ Internals ------------------
    function _createCapacityCommitment(bytes32 peerId) internal returns (bytes32 commitmentId) {
        vm.recordLogs();
        deployment.diamondAsCapacity.createCommitment(peerId, ccDuration, ccDelegator, rewardCCDelegationRate);

        Vm.Log[] memory entries = vm.getRecordedLogs();

        (commitmentId,,,) = abi.decode(entries[0].data, (bytes32, address, uint256, uint256));

        return commitmentId;
    }

    function _createAndDepositCapacityCommitment(bytes32 peerId, uint256 unitCount)
        internal
        returns (bytes32 commitmentId, bytes32 offerId)
    {
        deployment.diamondAsMarket.setProviderInfo("name", CIDV1({prefixes: 0x12345678, hash: bytes32(0)}));
        offerId = deployment.diamondAsMarket.registerMarketOffer(
            minPricePerWorkerEpoch,
            paymentToken,
            effectors,
            registerPeers,
            deployment.diamondAsCore.minProtocolVersion(),
            deployment.diamondAsCore.maxProtocolVersion()
        );

        commitmentId = _createCapacityCommitment(peerId);

        vm.startPrank(ccDelegator);

        bytes32[] memory commitmentIds = new bytes32[](1);
        commitmentIds[0] = commitmentId;

        deployment.diamondAsCapacity.depositCollateral{value: unitCount * deployment.diamondAsCore.fltCollateralPerUnit()}(commitmentIds);
        vm.stopPrank();
    }

    receive() external payable {}
}
 