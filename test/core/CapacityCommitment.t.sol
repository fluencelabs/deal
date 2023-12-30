// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "forge-std/Vm.sol";
import "forge-std/StdCheats.sol";
import "src/core/Core.sol";
import "src/core/modules/capacity/Capacity.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "test/utils/DeployDealSystem.sol";
import "src/core/modules/market/Market.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
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
    event CapacityCommitmentActivated(
        bytes32 indexed peerId, bytes32 indexed commitmentId, uint256 endEpoch, bytes32[] unitIds
    );
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
            bytes32 peerId = Random.pseudoRandom(abi.encode("peerId", i));

            bytes32[] memory unitIds = new bytes32[](5);
            for (uint256 j = 0; j < unitIds.length; j++) {
                unitIds[j] = keccak256(abi.encodePacked(Random.pseudoRandom(abi.encode(peerId, "unitId", i, j))));
            }

            registerPeers.push(
                IOffer.RegisterComputePeer({
                    peerId: peerId,
                    unitIds: unitIds,
                    owner: address(bytes20(Random.pseudoRandom(abi.encode("peerId-address", i))))
                })
            );
        }

        ccDuration = deployment.capacity.minDuration();
        ccDelegator = address(bytes20(Random.pseudoRandom(abi.encode("delegator"))));
        deployment.tFLT.transfer(ccDelegator, type(uint256).max);

        rewardCCDelegationRate = 100; // 0.01 = 1% = 100
    }

    function test_CreateCapacityCommitment() public {
        deployment.market.registerMarketOffer(minPricePerWorkerEpoch, paymentToken, effectors, registerPeers);

        bytes32 peerId = registerPeers[0].peerId;
        bytes32 commitmentId =
            keccak256(abi.encodePacked(block.number, peerId, ccDuration, ccDelegator, rewardCCDelegationRate));

        // expect emit CapacityCommitmentCreated
        vm.expectEmit(true, true, false, true, address(deployment.capacity));
        emit CapacityCommitmentCreated(
            peerId, commitmentId, ccDelegator, rewardCCDelegationRate, deployment.capacity.fltCollateralPerUnit()
        );

        // call createCapacityCommitment
        deployment.capacity.createCommitment(peerId, ccDuration, ccDelegator, rewardCCDelegationRate);
    }

    function test_GetCapacityCommitment() public {
        bytes32 peerId = registerPeers[0].peerId;

        (bytes32 commitmentId,) = _createCapacityCommitment(peerId);

        Capacity.CommitmentView memory commitment = deployment.capacity.getCommitment(commitmentId);

        console.logBytes32(commitment.peerId);
        assertEq(uint256(commitment.status), uint256(ICapacity.CCStatus.WaitDelegation), "Status mismatch");
        assertEq(commitment.peerId, peerId, "PeerId mismatch");
        assertEq(commitment.collateralPerUnit, deployment.capacity.fltCollateralPerUnit(), "CollateralPerUnit mismatch");
        assertEq(commitment.endEpoch, commitment.startEpoch + ccDuration, "Duration mismatch");
        assertEq(commitment.rewardDelegatorRate, rewardCCDelegationRate, "RewardDelegatorRate mismatch");
        assertEq(commitment.delegator, ccDelegator, "Delegator mismatch");
        assertEq(commitment.totalCUFailCount, 0, "TotalCUFailCount mismatch");
        assertEq(commitment.startEpoch, 0, "StartEpoch mismatch");
        assertEq(commitment.failedEpoch, 0, "FailedEpoch mismatch");
        assertEq(commitment.exitedUnitCount, 0, "ExitedUnitCount mismatch");
    }

    function test_DepositCollateral() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        (bytes32 commitmentId,) = _createCapacityCommitment(peerId);

        uint256 activeUnitCountBefore = deployment.capacity.activeUnitCount();
        uint256 amount = unitCount * deployment.capacity.fltCollateralPerUnit();

        vm.startPrank(ccDelegator);
        deployment.tFLT.approve(address(deployment.capacity), amount);
        uint256 currentEpoch = deployment.core.currentEpoch();

        vm.expectEmit(true, true, false, true, address(deployment.capacity));
        emit CollateralDeposited(commitmentId, amount);

        vm.expectEmit(true, true, true, true, address(deployment.capacity));
        emit CapacityCommitmentActivated(peerId, commitmentId, currentEpoch + 1 + ccDuration, registerPeers[0].unitIds);

        deployment.capacity.depositCollateral(commitmentId);
        vm.stopPrank();

        uint256 activeUnitCountAfter = deployment.capacity.activeUnitCount();
        assertEq(activeUnitCountAfter, activeUnitCountBefore + unitCount, "ActiveUnitCount mismatch");

        // Verify commitment info
        Capacity.CommitmentView memory commitment = deployment.capacity.getCommitment(commitmentId);
        assertEq(uint256(commitment.status), uint256(ICapacity.CCStatus.Active), "Status mismatch");
        assertEq(commitment.peerId, peerId, "PeerId mismatch");
        assertEq(commitment.collateralPerUnit, deployment.capacity.fltCollateralPerUnit(), "CollateralPerUnit mismatch");
        assertEq(commitment.endEpoch, deployment.core.currentEpoch() + 1 + ccDuration, "Duration mismatch");
        assertEq(commitment.rewardDelegatorRate, rewardCCDelegationRate, "RewardDelegatorRate mismatch");
        assertEq(commitment.delegator, ccDelegator, "Delegator mismatch");
        assertEq(commitment.startEpoch, deployment.core.currentEpoch() + 1, "StartEpoch mismatch");
        assertEq(commitment.failedEpoch, 0, "FailedEpoch mismatch");
        assertEq(commitment.exitedUnitCount, 0, "ExitedUnitCount mismatch");
    }

    function test_SubmitProof() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;
        bytes32 unitId = registerPeers[0].unitIds[0];

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        bytes32 localK = keccak256(abi.encodePacked("proof"));
        bytes32 h = keccak256(abi.encodePacked("h"));

        StdCheats.skip(uint256(deployment.core.epochDuration()));

        vm.startPrank(peerOwner);

        vm.expectEmit(true, true, true, false, address(deployment.capacity));
        emit ProofSubmitted(commitmentId, unitId);

        deployment.capacity.submitProof(unitId, localK, h);

        vm.stopPrank();
    }

    function test_RewardAfterSubmitProofs() public {
        bytes32 peerId = registerPeers[0].peerId;
        uint256 unitCount = registerPeers[0].unitIds.length;
        address peerOwner = registerPeers[0].owner;
        bytes32 unitId = registerPeers[0].unitIds[0];

        (bytes32 commitmentId,) = _createAndDepositCapacityCommitment(peerId, unitCount);

        bytes32 localK = keccak256(abi.encodePacked("proof"));
        bytes32 h = keccak256(abi.encodePacked("h"));

        // warp to next epoch
        StdCheats.skip(deployment.core.epochDuration());

        vm.startPrank(peerOwner);
        uint256 minRequiredProofsPerEpoch = deployment.capacity.minRequierdProofsPerEpoch();
        for (uint256 i = 0; i < minRequiredProofsPerEpoch; i++) {
            vm.expectEmit(true, true, true, false, address(deployment.capacity));
            emit ProofSubmitted(commitmentId, unitId);

            deployment.capacity.submitProof(unitId, localK, h);
        }

        StdCheats.skip(deployment.core.epochDuration());

        assertGe(deployment.capacity.totalRewards(commitmentId), 0, "TotalRewards mismatch");

        vm.stopPrank();
    }

    // ------------------ Internals ------------------
    function _createCapacityCommitment(bytes32 peerId) internal returns (bytes32 commitmentId, bytes32 offerId) {
        offerId = deployment.market.registerMarketOffer(minPricePerWorkerEpoch, paymentToken, effectors, registerPeers);

        vm.recordLogs();
        deployment.capacity.createCommitment(peerId, ccDuration, ccDelegator, rewardCCDelegationRate);

        Vm.Log[] memory entries = vm.getRecordedLogs();

        (commitmentId,,,) = abi.decode(entries[0].data, (bytes32, address, uint256, uint256));

        return (commitmentId, offerId);
    }

    function _createAndDepositCapacityCommitment(bytes32 peerId, uint256 unitCount)
        internal
        returns (bytes32 commitmentId, bytes32 offerId)
    {
        (commitmentId, offerId) = _createCapacityCommitment(peerId);

        vm.startPrank(ccDelegator);
        deployment.tFLT.approve(address(deployment.capacity), unitCount * deployment.capacity.fltCollateralPerUnit());
        deployment.capacity.depositCollateral(commitmentId);
        vm.stopPrank();
    }
}
