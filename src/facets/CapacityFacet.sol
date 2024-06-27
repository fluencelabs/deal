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

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ICore} from "src/core/interfaces/ICore.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {RandomXProxy} from "src/utils/RandomXProxy.sol";
import {BytesConverter} from "src/utils/BytesConverter.sol";
import {Whitelist} from "src/utils/Whitelist.sol";
import {ICapacity} from "src/core/interfaces/ICapacity.sol";
import {Vesting} from "src/core/Vesting.sol";
import {PRECISION} from "src/utils/Common.sol";
import {LibEpochController} from "src/lib/LibEpochController.sol";
import {LibCapacity, CommitmentStorage, RewardInfo} from "src/lib/LibCapacity.sol";
import {LibCapacityConst} from "src/lib/LibCapacityConst.sol";
import {LibOffer} from "src/lib/LibOffer.sol";
import {LibWhitelist} from "src/lib/LibWhitelist.sol";
import {LibDiamond} from "src/lib/LibDiamond.sol";
import {Snapshot} from "src/core/Snapshot.sol";
import {IOffer} from "src/core/interfaces/IOffer.sol";

contract CapacityFacet is ICapacity {
    using SafeERC20 for IERC20;
    using BytesConverter for bytes;
    using Address for address payable;
    using Vesting for Vesting.Info;
    using Snapshot for Snapshot.Cache;

    receive() external payable {
        LibCapacity.store().rewardBalance += msg.value;
    }

    // #region ------------------ Modifiers ------------------
    modifier onlyApproved() {
        require(LibWhitelist.isApproved(msg.sender), "Whitelist: provider is not approved");
        _;
    }
    // #endregion

    // #region ----------------- Public View -----------------
    function getStatus(bytes32 commitmentId) public view returns (CCStatus) {
        CommitmentStorage storage s = LibCapacity.store();
        Commitment storage cc = s.commitments[commitmentId];

        bytes32 peerId = cc.info.peerId;
        require(peerId != bytes32(0x00), "Capacity commitment doesn't exist");

        IOffer.ComputePeer memory peer = LibOffer.getComputePeer(peerId);

        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        CCStatus status = LibCapacity._preCommitCommitmentSnapshot(cc, snapshotCache, peer, LibEpochController.currentEpoch(), LibCapacity._expiredEpoch(cc));

        return status;
    }

    function getCommitment(bytes32 commitmentId) external view returns (CommitmentView memory) {
        return LibCapacity.getCommitment(commitmentId);
    }

    function totalRewards(bytes32 commitmentId) external view returns (uint256) {
        CommitmentStorage storage s = LibCapacity.store();
        Commitment storage cc = s.commitments[commitmentId];

        return cc.vesting.total();
    }

    function unlockedRewards(bytes32 commitmentId) external view returns (uint256) {
        CommitmentStorage storage s = LibCapacity.store();
        Commitment storage cc = s.commitments[commitmentId];

        return cc.vesting.unlocked(LibEpochController.currentEpoch());
    }

    function getGlobalNonce() external view returns (bytes32) {
        CommitmentStorage storage s = LibCapacity.store();
        if (LibEpochController.currentEpoch() != s.changedNonceEpoch) {
            return s.nextGlobalNonce;
        }

        return s.globalNonce;
    }
    // #endregion

    // #region ----------------- Public Mutable -----------------
    function createCommitment(bytes32 peerId, uint256 duration, address delegator, uint256 rewardDelegationRate)
        external
        onlyApproved
        returns (bytes32)
    {
        CommitmentStorage storage s = LibCapacity.store();

        // #region init and verify variables
        IOffer.ComputePeer memory peer = LibOffer.getComputePeer(peerId);
        require(peer.commitmentId == bytes32(0x00), "Peer already has commitment");

        IOffer.Offer memory offer = LibOffer.getOffer(peer.offerId);
        address provider = offer.provider;
        require(msg.sender == provider, "Only provider can create capacity commitment");

        require(duration >= LibCapacityConst.minDuration(), "Duration should be greater than min capacity commitment duration");
        require(rewardDelegationRate > 0, "Reward delegation rate should be greater than 0");
        require(rewardDelegationRate <= PRECISION, "Reward delegation rate should be less or equal 1");
        // #endregion

        // #region create commitment
        uint256 collateralPerUnit = LibCapacityConst.fltCollateralPerUnit();
        bytes32 commitmentId =
            keccak256(abi.encodePacked(block.number, peerId, duration, delegator, rewardDelegationRate));

        Commitment storage cc = s.commitments[commitmentId];
        cc.info = CommitmentInfo({
            status: CCStatus.WaitDelegation,
            peerId: peerId,
            collateralPerUnit: collateralPerUnit,
            duration: duration,
            rewardDelegatorRate: rewardDelegationRate,
            delegator: delegator,
            startEpoch: 0
        });
        LibOffer.setCommitmentId(peerId, commitmentId);

        emit CommitmentCreated(peerId, commitmentId, duration, delegator, rewardDelegationRate, collateralPerUnit);
        // #endregion

        return commitmentId;
    }

    function removeCommitment(bytes32 commitmentId) external {
        CommitmentStorage storage s = LibCapacity.store();
        Commitment storage cc = s.commitments[commitmentId];

        bytes32 peerId = cc.info.peerId;
        IOffer.Offer memory offer = LibOffer.getOffer(LibOffer.getComputePeer(peerId).offerId);

        require(offer.provider == msg.sender, "Only provider can remove capacity commitment");
        require(
            getStatus(commitmentId) == CCStatus.WaitDelegation, "Capacity commitment is not in WaitDelegation status"
        );

        LibOffer.setCommitmentId(peerId, bytes32(0x00));
        delete s.commitments[commitmentId];

        emit CommitmentRemoved(commitmentId);
    }

    function depositCollateral(bytes32[] calldata commitmentIds) external payable {
        CommitmentStorage storage s = LibCapacity.store();

        uint256 totalValue = msg.value;
        for (uint256 i = 0; i < commitmentIds.length; i++) {
            // #region init and verify variables
            bytes32 commitmentId = commitmentIds[i];
            Commitment storage cc = s.commitments[commitmentId];

            require(
                getStatus(commitmentId) == CCStatus.WaitDelegation,
                "Capacity commitment is not in WaitDelegation status"
            );

            bytes32 peerId = cc.info.peerId;
            IOffer.ComputePeer memory peer = LibOffer.getComputePeer(peerId);

            uint256 unitCount = peer.unitCount;
            uint256 collateral = unitCount * cc.info.collateralPerUnit;

            totalValue -= collateral;

            uint256 currentEpoch_ = LibEpochController.currentEpoch();
            // #endregion

            // #region save deposit information
            // Indirect potential delegator address update.
            // The flow below is mirrored in subgraph/src/mappings/capacity.ts.
            address delegator = cc.info.delegator;
            if (delegator == address(0x00)) {
                cc.info.delegator = msg.sender;
            } else {
                require(delegator == msg.sender, "Only delegator can lock collateral");
            }

            uint256 startEpoch = currentEpoch_ + 1;

            cc.info.startEpoch = startEpoch;
            cc.progress.snapshotEpoch = currentEpoch_;
            cc.progress.activeUnitCount = unitCount;

            LibCapacityConst.setActiveUnitCount(LibCapacityConst.activeUnitCount() + unitCount);
            cc.info.status = CCStatus.Active; // it's not WaitStart because WaitStart is dynamic status

            emit CollateralDeposited(commitmentId, collateral);
            emit CommitmentActivated(
                peerId, commitmentId, startEpoch, startEpoch + cc.info.duration, LibOffer.getComputeUnitIds(peerId)
            );
            // #endregion
        }

        require(totalValue == 0, "Excessive value");
    }

    function submitProofs(
        bytes32[] memory unitIds,
        bytes32[] memory localUnitNonces,
        bytes32[] memory resultHashes
    ) public {
        require(unitIds.length > 0, "No proofs given");
        require(unitIds.length == localUnitNonces.length, "Invalid local nonces number");
        require(unitIds.length == resultHashes.length, "Invalid result hashes number");

        CommitmentStorage storage s = LibCapacity.store();

        uint256 currentEpoch = LibEpochController.currentEpoch();

        if (s.changedNonceEpoch != currentEpoch) {
            s.changedNonceEpoch = currentEpoch;
            s.globalNonce = s.nextGlobalNonce;
        }
        // #endregion

        uint256 proofsLength = unitIds.length;
        bytes32[] memory globalUnitNonces = new bytes32[](proofsLength);

        for (uint256 i = 0; i < proofsLength; i++) {
            // #region init and verify variables
            bytes32 unitId = unitIds[i];
            bytes32 localUnitNonce = localUnitNonces[i];
            bytes32 resultHash = resultHashes[i];

            IOffer.ComputeUnit memory unit = LibOffer.getComputeUnit(unitId);
            IOffer.ComputePeer memory peer = LibOffer.getComputePeer(unit.peerId);
            require(peer.owner == msg.sender, "Only compute peer owner can submit proof");

            bytes32 commitmentId = peer.commitmentId;
            require(commitmentId != bytes32(0x00), "Compute unit doesn't have commitment");

            Commitment storage cc = s.commitments[commitmentId];
            require(currentEpoch >= cc.info.startEpoch, "Capacity commitment is not started");

            UnitInfo storage unitInfo = cc.unitInfoById[unitId];

            uint256 expiredEpoch = LibCapacity._expiredEpoch(cc);
            // #endregion

            // #region commit snapshots
            Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
            CCStatus status = LibCapacity._preCommitCommitmentSnapshot(cc, snapshotCache, peer, currentEpoch, expiredEpoch);
            if (status != CCStatus.Active) {
                revert CapacityCommitmentIsNotActive(status);
            }
            LibCapacity._postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);

            LibCapacity._commitUnitSnapshot(cc, unitInfo, currentEpoch, expiredEpoch, snapshotCache.current.failedEpoch);
            // #endregion

            // TODO: Is it necessary to calculate next global nonce each proof? Maybe once per transaction is enough?
            // pseudo-random next global nonce
            s.nextGlobalNonce = keccak256(
                abi.encodePacked(s.globalNonce, blockhash(block.number - 1), unitId, localUnitNonce, resultHash)
            );

            uint256 unitProofCount = unitInfo.proofCountByEpoch[currentEpoch] + 1;
            if (unitProofCount > LibCapacityConst.maxProofsPerEpoch()) {
                revert TooManyProofs();
            }

            // #region save localUnitNonce
            bytes32 globalUnitNonce_ = keccak256(abi.encodePacked(s.globalNonce, unitId));
            require(
                !s.isProofSubmittedByUnit[globalUnitNonce_][localUnitNonce], "Proof is already submitted for this unit"
            );
            s.isProofSubmittedByUnit[globalUnitNonce_][localUnitNonce] = true;

            globalUnitNonces[i] = globalUnitNonce_;
            // #endregion

            // #region save info about proof

            // load unitProofCount and add one because we submit new proof
            RewardInfo storage rewardInfo = s.rewardInfoByEpoch[currentEpoch];
            uint256 minProofsPerEpoch_ = rewardInfo.minProofsPerEpoch;
            if (minProofsPerEpoch_ == 0) {
                minProofsPerEpoch_ = LibCapacityConst.minProofsPerEpoch();
                rewardInfo.minProofsPerEpoch = minProofsPerEpoch_;
            }

            if (unitProofCount == minProofsPerEpoch_) {
                // if proofCount is equal to minRequierdCCProofs, then we have one success for the current epoch
                cc.progress.currentSuccessCount += 1;
                rewardInfo.totalSuccessProofs += unitProofCount;
            } else if (unitProofCount > minProofsPerEpoch_) {
                rewardInfo.totalSuccessProofs++;
            }

            unitInfo.proofCountByEpoch[currentEpoch] = unitProofCount;
            // #endregion

            emit CommitmentStatsUpdated(
                commitmentId,
                cc.progress.totalFailCount,
                cc.finish.exitedUnitCount,
                cc.progress.activeUnitCount,
                cc.progress.nextAdditionalActiveUnitCount,
                currentEpoch - 1
            );

            emit ProofSubmitted(commitmentId, unitId, localUnitNonce);
        }

        // #region check proofs
        (bool success, bytes memory result) = LibCapacityConst.randomXProxy().delegatecall(
            abi.encodeWithSelector(RandomXProxy.run.selector, globalUnitNonces, localUnitNonces)
        );

        require(success, "RandomXProxy.run failed");
        require(result.length > 0, "RandomXProxy.run returned empty result");

        bytes32[] memory hashes = abi.decode(result, (bytes32[]));

        require(hashes.length == proofsLength, "Invalid result length");

        for (uint256 i = 0; i < proofsLength; i++) {
            require(hashes[i] == resultHashes[i], "Proof is not valid");
            require(hashes[i] <= LibCapacityConst.difficulty(), "Proof is bigger than difficulty");
        }
    }

    function submitProof(bytes32 unitId, bytes32 localUnitNonce, bytes32 resultHash) external {
        bytes32[] memory unitIds = new bytes32[](1);
        bytes32[] memory localUnitNonces = new bytes32[](1);
        bytes32[] memory resultHashes = new bytes32[](1);

        unitIds[0] = unitId;
        localUnitNonces[0] = localUnitNonce;
        resultHashes[0] = resultHash;

        submitProofs(unitIds, localUnitNonces, resultHashes);
    }

    function finishCommitment(bytes32 commitmentId) external {
        CommitmentStorage storage s = LibCapacity.store();

        // #region init and verify variables
        uint256 currentEpoch_ = LibEpochController.currentEpoch();

        Commitment storage cc = s.commitments[commitmentId];

        bytes32 peerId = cc.info.peerId;
        IOffer.ComputePeer memory peer = LibOffer.getComputePeer(peerId);
        // #endregion

        // #region pre commit commitment snapshot for the previous epoch
        CCStatus status = cc.info.status;
        if (status != CCStatus.Inactive && status != CCStatus.Failed) {
            revert CapacityCommitmentIsActive(status);
        }
        // #endregion

        require(
            status != CCStatus.Failed || currentEpoch_ >= cc.finish.failedEpoch + LibCapacityConst.withdrawEpochsAfterFailed(),
            "Capacity commitment is failed and not enough epochs passed"
        );

        uint256 unitCount = peer.unitCount;
        require(cc.finish.exitedUnitCount == unitCount, "For finish commitment all units should be exited");

        // #region post commit commitment snapshot

        cc.info.status = CCStatus.Removed;

        LibOffer.setCommitmentId(peerId, bytes32(0x00));
        // #endregion

        // #region withdraw collateral
        address payable delegator = payable(cc.info.delegator);
        uint256 collateralPerUnit_ = cc.info.collateralPerUnit;
        uint256 totalCollateral = collateralPerUnit_ * unitCount;

        delegator.sendValue(totalCollateral - cc.finish.totalSlashedCollateral);
        payable(LibDiamond.contractOwner()).sendValue(cc.finish.totalSlashedCollateral);
        // #endregion

        emit CommitmentFinished(commitmentId);
    }

    function removeCUFromCC(bytes32 commitmentId, bytes32[] calldata unitIds) external {
        CommitmentStorage storage s = LibCapacity.store();

        // #region init and verify variables
        uint256 currentEpoch_ = LibEpochController.currentEpoch();

        Commitment storage cc = s.commitments[commitmentId];
        uint256 expiredEpoch = LibCapacity._expiredEpoch(cc);

        bytes32 peerId = cc.info.peerId;

        IOffer.ComputePeer memory peer = LibOffer.getComputePeer(peerId);
        IOffer.Offer memory offer = LibOffer.getOffer(peer.offerId);

        require(offer.provider == msg.sender, "Only provider can remove capacity commitment");

        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        CCStatus status = LibCapacity._preCommitCommitmentSnapshot(cc, snapshotCache, peer, currentEpoch_, expiredEpoch);
        LibCapacity._postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        if (status != CCStatus.Inactive && status != CCStatus.Failed) {
            revert CapacityCommitmentIsActive(status);
        }
        // #endregion

        for (uint256 i = 0; i < unitIds.length; i++) {
            bytes32 unitId = unitIds[i];
            IOffer.ComputeUnit memory unit = LibOffer.getComputeUnit(unitId);

            require(unit.peerId == peerId, "Compute unit doesn't belong to capacity commitment");

            require(!cc.isUnitExited[unitId], "Compute unit is exited");
            if (unit.deal != address(0x00)) {
                LibOffer._returnComputeUnitFromDeal(unitId);
            }

            UnitInfo storage unitInfo = cc.unitInfoById[unitId];
            LibCapacity._commitUnitSnapshot(cc, unitInfo, currentEpoch_, expiredEpoch, snapshotCache.current.failedEpoch);
            cc.finish.exitedUnitCount += 1;
            cc.finish.totalSlashedCollateral += unitInfo.slashedCollateral;
            cc.isUnitExited[unitId] = true;
        }

        emit CommitmentStatsUpdated(
            commitmentId,
            cc.progress.totalFailCount,
            cc.finish.exitedUnitCount,
            cc.progress.activeUnitCount,
            cc.progress.nextAdditionalActiveUnitCount,
            currentEpoch_ - 1
        );
    }

    function withdrawReward(bytes32 commitmentId) external {
        CommitmentStorage storage s = LibCapacity.store();

        // #region init and verify variables
        uint256 currentEpoch = LibEpochController.currentEpoch();
        Commitment storage cc = s.commitments[commitmentId];
        IOffer.ComputePeer memory peer = LibOffer.getComputePeer(cc.info.peerId);
        IOffer.Offer memory offer = LibOffer.getOffer(peer.offerId);

        require(
            offer.provider == msg.sender || cc.info.delegator == msg.sender,
            "Only provider or delegator can withdraw reward"
        );
        // #endregion

        // #region commit commitment snapshot for the previous epoch
        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        LibCapacity._preCommitCommitmentSnapshot(cc, snapshotCache, peer, currentEpoch, LibCapacity._expiredEpoch(cc));
        LibCapacity._postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        if (snapshotCache.current.failedEpoch != 0) {
            currentEpoch = snapshotCache.current.failedEpoch;
        }
        // #endregion

        // #region withdraw reward
        address provider = LibOffer.getOffer(peer.offerId).provider;
        uint256 amount = cc.vesting.withdraw(currentEpoch);

        uint256 rewardBalance = s.rewardBalance;
        require(
            amount <= rewardBalance, "Not enough reward balance pool on the contract. Wait when DAO will refill it."
        );
        s.rewardBalance = rewardBalance - amount;

        uint256 delegatorReward = (amount * cc.info.rewardDelegatorRate) / PRECISION;
        uint256 providerReward = amount - delegatorReward;

        payable(cc.info.delegator).sendValue(delegatorReward);
        payable(provider).sendValue(providerReward);
        // #endregion

        emit CommitmentStatsUpdated(
            commitmentId,
            cc.progress.totalFailCount,
            cc.finish.exitedUnitCount,
            cc.progress.activeUnitCount,
            cc.progress.nextAdditionalActiveUnitCount,
            currentEpoch - 1
        );
        emit RewardWithdrawn(commitmentId, amount);
    }
}
