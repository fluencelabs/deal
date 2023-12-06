// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "forge-std/Vm.sol";
import "src/core/Core.sol";
import "src/core/CapacityCommitment.sol";
import "src/core/interfaces/ICapacityCommitment.sol";
import "test/utils/DeployDealSystem.sol";
import "src/core/Market.sol";
import "test/utils/Random.sol";

contract CapacityCommitmentTest is Test {
    using SafeERC20 for IERC20;

    // ------------------ Events ------------------
    event CapacityCommitmentCreated(
        bytes32 indexed peerId,
        bytes32 commitmentId,
        address delegator,
        uint256 rewardDelegationRate,
        uint256 fltCCCollateralPerUnit
    );
    event CapacityCommitmentRemoved(bytes32 indexed commitmentId);
    event CapacityCommitmentActivated(bytes32 indexed commitmentId);
    event CapacityCommitmentFinished(bytes32 indexed commitmentId);

    event CollateralDeposited(bytes32 indexed commitmentId, uint256 totalCollateral);

    event ProofSubmitted(bytes32 indexed commitmentId, bytes32 indexed unitId);
    event RewardWithdrawn(bytes32 indexed commitmentId, uint256 amount);

    // ------------------ Variables ------------------
    DeployDealSystem.Deployment deployment;

    // Init variables
    Market.RegisterComputePeer[] registerPeers;
    uint256 minPricePerWorkerEpoch;
    CIDV1[] effectors;
    address paymentToken;
    uint256 ccDuration;
    address ccDelegator;
    uint256 rewardCCDelegationRate;

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();

        paymentToken = address(deployment.tUSD);
        minPricePerWorkerEpoch = 1000;

        for (uint256 i = 0; i < 10; i++) {
            effectors.push(CIDV1({prefixes: 0x12345678, hash: Random.pseudoRandom(abi.encode("effector", i))}));
        }

        for (uint256 i = 0; i < 10; i++) {
            registerPeers.push(
                IMarket.RegisterComputePeer({
                    peerId: Random.pseudoRandom(abi.encode("peerId", i)),
                    unitCount: (i + 1) * 5,
                    owner: address(bytes20(Random.pseudoRandom(abi.encode("peerId-address", i))))
                })
            );
        }

        ccDuration = deployment.core.minCCDuration();
        ccDelegator = address(bytes20(Random.pseudoRandom(abi.encode("peerId-address", 0))));
        deployment.tFLT.transfer(ccDelegator, type(uint256).max);

        rewardCCDelegationRate = 100; // 0.01 = 1% = 100
    }

    function test_CreateCapacityCommitment() public {
        deployment.core.registerMarketOffer(minPricePerWorkerEpoch, paymentToken, effectors, registerPeers);

        bytes32 peerId = registerPeers[0].peerId;
        bytes32 commitmentId =
            keccak256(abi.encodePacked(block.number, peerId, ccDuration, ccDelegator, rewardCCDelegationRate));

        // expect emit CapacityCommitmentCreated
        vm.expectEmit(true, true, false, true, address(deployment.core));
        emit CapacityCommitmentCreated(
            peerId, commitmentId, ccDelegator, rewardCCDelegationRate, deployment.core.fltCCCollateralPerUnit()
        );

        // call createCapacityCommitment
        deployment.core.createCapacityCommitment(peerId, ccDuration, ccDelegator, rewardCCDelegationRate);
    }

    function test_GetCapacityCommitment() public {
        bytes32 peerId = registerPeers[0].peerId;

        (bytes32 commitmentId,) = _createCapacityCommitment(peerId);

        CapacityCommitment.CommitmentInfo memory commitment = deployment.core.getCapacityCommitment(commitmentId);

        assertEq(uint256(commitment.status), uint256(CapacityCommitment.CCStatus.WaitDelegation), "Status mismatch");
        assertEq(commitment.peerId, peerId, "PeerId mismatch");
        assertEq(commitment.collateralPerUnit, deployment.core.fltCCCollateralPerUnit(), "CollateralPerUnit mismatch");
        assertEq(commitment.duration, ccDuration, "Duration mismatch");
        assertEq(commitment.rewardDelegatorRate, rewardCCDelegationRate, "RewardDelegatorRate mismatch");
        assertEq(commitment.delegator, ccDelegator, "Delegator mismatch");
        assertEq(commitment.currentCUSuccessCount, 0, "CurrentCUSuccessCount mismatch");
        assertEq(commitment.totalCUFailCount, 0, "TotalCUFailCount mismatch");
        assertEq(commitment.snapshotEpoch, 0, "SnapshotEpoch mismatch");
        assertEq(commitment.startEpoch, 0, "StartEpoch mismatch");
        assertEq(commitment.failedEpoch, 0, "FailedEpoch mismatch");
        assertEq(commitment.withdrawCCEpochAfterFailed, 0, "WithdrawCCEpochAfterFailed mismatch");
        assertEq(commitment.remainingFailsForLastEpoch, 0, "RemainingFailsForLastEpoch mismatch");
        assertEq(commitment.exitedUnitCount, 0, "ExitedUnitCount mismatch");
        assertEq(commitment.totalWithdrawnReward, 0, "TotalWithdrawnReward mismatch");
    }

    function test_DepositCCCollateral() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitCount;
        (bytes32 commitmentId,) = _createCapacityCommitment(peerId);

        uint256 activeUnitCountBefore = deployment.core.ccActiveUnitCount();
        uint256 amount = unitCount * deployment.core.fltCCCollateralPerUnit();

        vm.startPrank(ccDelegator);
        deployment.tFLT.approve(address(deployment.core), amount);

        vm.expectEmit(true, true, false, true, address(deployment.core));
        emit CollateralDeposited(commitmentId, amount);

        vm.expectEmit(true, true, false, true, address(deployment.core));
        emit CapacityCommitmentActivated(commitmentId);

        deployment.core.depositCapacityCommitmentCollateral(commitmentId);
        vm.stopPrank();

        uint256 activeUnitCountAfter = deployment.core.ccActiveUnitCount();
        assertEq(activeUnitCountAfter, activeUnitCountBefore + unitCount, "ActiveUnitCount mismatch");

        // Verify commitment info
        CapacityCommitment.CommitmentInfo memory commitment = deployment.core.getCapacityCommitment(commitmentId);
        assertEq(uint256(commitment.status), uint256(CapacityCommitment.CCStatus.Active), "Status mismatch");
        assertEq(commitment.peerId, peerId, "PeerId mismatch");
        assertEq(commitment.collateralPerUnit, deployment.core.fltCCCollateralPerUnit(), "CollateralPerUnit mismatch");
        assertEq(commitment.duration, ccDuration, "Duration mismatch");
        assertEq(commitment.rewardDelegatorRate, rewardCCDelegationRate, "RewardDelegatorRate mismatch");
        assertEq(commitment.delegator, ccDelegator, "Delegator mismatch");
        assertEq(commitment.currentCUSuccessCount, 0, "CurrentCUSuccessCount mismatch");
        assertEq(commitment.totalCUFailCount, 0, "TotalCUFailCount mismatch");
        assertEq(commitment.snapshotEpoch, deployment.core.currentEpoch(), "SnapshotEpoch mismatch");
        assertEq(commitment.startEpoch, deployment.core.currentEpoch() + 1, "StartEpoch mismatch");
        assertEq(commitment.failedEpoch, 0, "FailedEpoch mismatch");
        assertEq(commitment.withdrawCCEpochAfterFailed, 0, "WithdrawCCEpochAfterFailed mismatch");
        assertEq(commitment.remainingFailsForLastEpoch, 0, "RemainingFailsForLastEpoch mismatch");
        assertEq(commitment.exitedUnitCount, 0, "ExitedUnitCount mismatch");
        assertEq(commitment.totalWithdrawnReward, 0, "TotalWithdrawnReward mismatch");
    }

    function test_SubmitProof() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitCount;
        address peerOwner = registerPeers[0].owner;
        (bytes32 commitmentId, bytes32 offerId) = _createAndDepositCapacityCommitment(peerId, unitCount);
        bytes32 unitId = keccak256(abi.encodePacked(offerId, peerId, uint256(0)));
        bytes memory proof = abi.encodePacked("proof");

        // warp to next epoch
        vm.warp(block.timestamp + DeployDealSystem.DEFAULT_EPOCH_DURATION);

        vm.startPrank(peerOwner);
        vm.expectEmit(true, true, false, false, address(deployment.core));
        emit ProofSubmitted(commitmentId, unitId);

        deployment.core.submitProof(unitId, proof);
        vm.stopPrank();
    }

    function test_RewardAfterSubmitProofs() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitCount;
        address peerOwner = registerPeers[0].owner;
        (bytes32 commitmentId, bytes32 offerId) = _createAndDepositCapacityCommitment(peerId, unitCount);
        bytes32 unitId = keccak256(abi.encodePacked(offerId, peerId, uint256(0)));
        bytes memory proof = abi.encodePacked("proof");

        // warp to next epoch
        vm.warp(block.timestamp + DeployDealSystem.DEFAULT_EPOCH_DURATION);

        vm.startPrank(peerOwner);
        uint256 minRequiredProofsPerEpoch = deployment.core.minCCRequierdProofsPerEpoch();
        for (uint256 i = 0; i < minRequiredProofsPerEpoch; i++) {
            vm.expectEmit(true, true, false, false, address(deployment.core));
            emit ProofSubmitted(commitmentId, unitId);

            deployment.core.submitProof(unitId, proof);
        }

        vm.warp(block.timestamp + DeployDealSystem.DEFAULT_EPOCH_DURATION);

        assertGe(deployment.core.totalRewards(commitmentId), 0, "TotalRewards mismatch");

        vm.stopPrank();
    }

    // ------------------ Internals ------------------
    function _createCapacityCommitment(bytes32 peerId) internal returns (bytes32 commitmentId, bytes32 offerId) {
        offerId = deployment.core.registerMarketOffer(minPricePerWorkerEpoch, paymentToken, effectors, registerPeers);

        deployment.core.createCapacityCommitment(peerId, ccDuration, ccDelegator, rewardCCDelegationRate);

        commitmentId =
            keccak256(abi.encodePacked(block.number, peerId, ccDuration, ccDelegator, rewardCCDelegationRate));
    }

    function _createAndDepositCapacityCommitment(bytes32 peerId, uint256 unitCount)
        internal
        returns (bytes32 commitmentId, bytes32 offerId)
    {
        (commitmentId, offerId) = _createCapacityCommitment(peerId);

        vm.startPrank(ccDelegator);
        deployment.tFLT.approve(address(deployment.core), unitCount * deployment.core.fltCCCollateralPerUnit());
        deployment.core.depositCapacityCommitmentCollateral(commitmentId);
        vm.stopPrank();
    }
}
