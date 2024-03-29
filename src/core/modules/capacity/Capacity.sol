// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "src/core/modules/BaseModule.sol";
import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/deal/base/Types.sol";
import "src/utils/RandomXProxy.sol";
import "src/utils/BytesConverter.sol";
import "src/utils/Whitelist.sol";
import "./interfaces/ICapacity.sol";
import "./Vesting.sol";
import "./Snapshot.sol";
import "forge-std/console.sol";
import {PRECISION} from "src/core/GlobalConst.sol";

contract Capacity is UUPSUpgradeable, MulticallUpgradeable, BaseModule, ICapacity {
    using SafeERC20 for IERC20;
    using BytesConverter for bytes;
    using Address for address payable;
    using Vesting for Vesting.Info;
    using Snapshot for Snapshot.Cache;

    // #region ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.capacity.storage.v1")) - 1);

    struct CommitmentStorage {
        mapping(bytes32 => Commitment) commitments;
        mapping(uint256 => RewardInfo) rewardInfoByEpoch;
        mapping(bytes32 => mapping(bytes32 => bool)) isProofSubmittedByUnit;
        bytes32 globalNonce;
        bytes32 nextGlobalNonce;
        uint256 changedNonceEpoch;
        uint256 totalRewardPool;
        //new storage values
        mapping(address => uint256) collateralBalance;
        mapping(address => uint256) rewardBalance;
    }

    function _getCommitmentStorage() private pure returns (CommitmentStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }
    // #endregion

    // #region ------------------ Initializer & Upgradeable ------------------
    receive() external payable {
        _getCommitmentStorage().totalRewardPool += msg.value;
    }

    constructor(ICore core_) BaseModule(core_) {}

    function initialize(bytes32 initGlobalNonce_) external initializer {
        __UUPSUpgradeable_init();
        __Multicall_init();

        CommitmentStorage storage s = _getCommitmentStorage();
        s.globalNonce = initGlobalNonce_;
        s.changedNonceEpoch = core.currentEpoch();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyCoreOwner {}
    // #endregion

    // #region ------------------ Modifiers ------------------
    modifier onlyApproved() {
        require(Whitelist(address(core)).isApproved(msg.sender), "Whitelist: provider is not approved");
        _;
    }
    // #endregion

    // #region ----------------- Public View -----------------
    function getStatus(bytes32 commitmentId) public view returns (CCStatus) {
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        bytes32 peerId = cc.info.peerId;
        require(peerId != bytes32(0x00), "Capacity commitment doesn't exist");

        IMarket.ComputePeer memory peer = market.getComputePeer(peerId);

        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        CCStatus status = _preCommitCommitmentSnapshot(cc, snapshotCache, peer, core.currentEpoch(), _expiredEpoch(cc));

        return status;
    }

    function getCommitment(bytes32 commitmentId) external view returns (CommitmentView memory) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        require(cc.info.peerId != bytes32(0x00), "Capacity commitment doesn't exist");

        return CommitmentView({
            status: getStatus(commitmentId),
            peerId: cc.info.peerId,
            collateralPerUnit: cc.info.collateralPerUnit,
            unitCount: core.market().getComputePeer(cc.info.peerId).unitCount,
            startEpoch: cc.info.startEpoch,
            endEpoch: cc.info.startEpoch + cc.info.duration,
            rewardDelegatorRate: cc.info.rewardDelegatorRate,
            delegator: cc.info.delegator,
            totalFailCount: cc.progress.totalFailCount,
            failedEpoch: cc.finish.failedEpoch,
            exitedUnitCount: cc.finish.exitedUnitCount
        });
    }

    function totalRewards(bytes32 commitmentId) external view returns (uint256) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        return cc.vesting.total();
    }

    function unlockedRewards(bytes32 commitmentId) external view returns (uint256) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        return cc.vesting.unlocked(core.currentEpoch());
    }

    function getGlobalNonce() external view returns (bytes32) {
        CommitmentStorage storage s = _getCommitmentStorage();
        if (core.currentEpoch() != s.changedNonceEpoch) {
            return s.nextGlobalNonce;
        }

        return s.globalNonce;
    }

    function getRewardInfo(uint256 epoch) external view returns (RewardInfo memory) {
        return _getCommitmentStorage().rewardInfoByEpoch[epoch];
    }

    function getTotalRewardPool() external view returns (uint256) {
        return _getCommitmentStorage().totalRewardPool;
    }
    // #endregion

    // #region ----------------- Public Mutable -----------------
    function createCommitment(bytes32 peerId, uint256 duration, address delegator, uint256 rewardDelegationRate)
        external
        onlyApproved
        returns (bytes32)
    {
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

        // #region init and verify variables
        IMarket.ComputePeer memory peer = market.getComputePeer(peerId);
        require(peer.commitmentId == bytes32(0x00), "Peer already has commitment");

        IMarket.Offer memory offer = market.getOffer(peer.offerId);
        address provider = offer.provider;
        require(msg.sender == provider, "Only provider can create capacity commitment");

        require(duration >= core.minDuration(), "Duration should be greater than min capacity commitment duration");
        require(rewardDelegationRate > 0, "Reward delegation rate should be greater than 0");
        require(rewardDelegationRate <= PRECISION, "Reward delegation rate should be less or equal 1");
        // #endregion

        // #region create commitment
        uint256 collateralPerUnit = core.fltCollateralPerUnit();
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
        market.setCommitmentId(peerId, commitmentId);

        emit CommitmentCreated(peerId, commitmentId, duration, delegator, rewardDelegationRate, collateralPerUnit);
        // #endregion

        return commitmentId;
    }

    function removeCommitment(bytes32 commitmentId) external {
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        bytes32 peerId = cc.info.peerId;
        IMarket.Offer memory offer = market.getOffer(market.getComputePeer(peerId).offerId);

        require(offer.provider == msg.sender, "Only provider can remove capacity commitment");
        require(
            getStatus(commitmentId) == CCStatus.WaitDelegation, "Capacity commitment is not in WaitDelegation status"
        );

        market.setCommitmentId(peerId, bytes32(0x00));
        delete s.commitments[commitmentId];

        emit CommitmentRemoved(commitmentId);
    }

    function depositCollateral(bytes32[] calldata commitmentIds) external payable {
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

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
            IMarket.ComputePeer memory peer = market.getComputePeer(peerId);

            uint256 unitCount = peer.unitCount;
            uint256 collateral = unitCount * cc.info.collateralPerUnit;

            totalValue -= collateral;

            uint256 currentEpoch_ = core.currentEpoch();
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

            core.setActiveUnitCount(core.activeUnitCount() + unitCount);
            cc.info.status = CCStatus.Active; // it's not WaitStart because WaitStart is dynamic status

            emit CollateralDeposited(commitmentId, collateral);
            emit CommitmentActivated(
                peerId, commitmentId, startEpoch, startEpoch + cc.info.duration, market.getComputeUnitIds(peerId)
            );
            // #endregion
        }

        require(totalValue == 0, "Excessive value");
    }

    function submitProof(bytes32 unitId, bytes32 localUnitNonce, bytes32 resultHash) external {
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

        // #region init and verify variables
        uint256 currentEpoch = core.currentEpoch();

        IMarket.ComputeUnit memory unit = market.getComputeUnit(unitId);
        IMarket.ComputePeer memory peer = market.getComputePeer(unit.peerId);
        require(peer.owner == msg.sender, "Only compute peer owner can submit proof");

        bytes32 commitmentId = peer.commitmentId;
        require(commitmentId != bytes32(0x00), "Compute unit doesn't have commitment");

        Commitment storage cc = s.commitments[commitmentId];
        require(currentEpoch >= cc.info.startEpoch, "Capacity commitment is not started");

        UnitInfo storage unitInfo = cc.unitInfoById[unitId];
        require(!unitInfo.isInactive, "Compute unit is in deal");

        uint256 expiredEpoch = _expiredEpoch(cc);
        // #endregion

        // #region commit snapshots
        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        CCStatus status = _preCommitCommitmentSnapshot(cc, snapshotCache, peer, currentEpoch, expiredEpoch);
        if (status != CCStatus.Active) {
            revert CapacityCommitmentIsNotActive(status);
        }
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);

        _commitUnitSnapshot(cc, unitInfo, currentEpoch, expiredEpoch, snapshotCache.current.failedEpoch);
        // #endregion

        // #region update global nonce
        if (s.changedNonceEpoch != currentEpoch) {
            s.changedNonceEpoch = currentEpoch;
            s.globalNonce = s.nextGlobalNonce;
        }

        // pseudo-random next global nonce
        s.nextGlobalNonce =
            keccak256(abi.encodePacked(s.globalNonce, blockhash(block.number - 1), unitId, localUnitNonce, resultHash));
        // #endregion

        uint256 unitProofCount = unitInfo.proofCountByEpoch[currentEpoch] + 1;

        RewardInfo storage rewardInfo = s.rewardInfoByEpoch[currentEpoch];
        if (rewardInfo.minProofsPerEpoch == 0) {
            rewardInfo.minProofsPerEpoch = core.minProofsPerEpoch();
            rewardInfo.maxProofsPerEpoch = core.maxProofsPerEpoch();
        }

        if (unitProofCount > rewardInfo.maxProofsPerEpoch) {
            revert TooManyProofs();
        }

        // #region save localUnitNonce
        bytes32 globalUnitNonce_ = keccak256(abi.encodePacked(s.globalNonce, unitId));
        require(!s.isProofSubmittedByUnit[globalUnitNonce_][localUnitNonce], "Proof is already submitted for this unit");
        s.isProofSubmittedByUnit[globalUnitNonce_][localUnitNonce] = true;
        // #endregion

        // #region save info about proof

        // load unitProofCount and add one because we submit new proof
        if (unitProofCount == rewardInfo.minProofsPerEpoch) {
            // if proofCount is equal to minRequiredCCProofs, then we have one success for the current epoch
            cc.progress.currentSuccessCount += 1;
            cc.progress.successCountByEpoch[currentEpoch] += 1;
            rewardInfo.totalSuccessProofs += unitProofCount;
        } else if (unitProofCount > rewardInfo.minProofsPerEpoch) {
            rewardInfo.totalSuccessProofs++;
        }

        unitInfo.proofCountByEpoch[currentEpoch] = unitProofCount;
        // #endregion

        // #region check proof
        (bool success, bytes memory randomXResultHash) = core.randomXProxy().delegatecall(
            abi.encodeWithSelector(RandomXProxy.run.selector, globalUnitNonce_, localUnitNonce)
        );

        require(success, "RandomXProxy.run failed");
        require(randomXResultHash.toBytes32() == resultHash, "Proof is not valid");
        require(resultHash <= core.difficulty(), "Proof is bigger than difficulty");
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

    function finishCommitment(bytes32 commitmentId) external {
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

        // #region init and verify variables
        uint256 currentEpoch_ = core.currentEpoch();

        Commitment storage cc = s.commitments[commitmentId];

        bytes32 peerId = cc.info.peerId;
        IMarket.ComputePeer memory peer = market.getComputePeer(peerId);
        // #endregion

        // #region check status
        CCStatus status = cc.info.status;
        if (status != CCStatus.Inactive && status != CCStatus.Failed) {
            revert CapacityCommitmentIsActive(status);
        }
        // #endregion

        require(
            status != CCStatus.Failed || currentEpoch_ >= cc.finish.failedEpoch + core.withdrawEpochsAfterFailed(),
            "Capacity commitment is failed and not enough epochs passed"
        );

        uint256 unitCount = peer.unitCount;
        require(cc.finish.exitedUnitCount == unitCount, "For finish commitment all units should be exited");

        // #region post commit commitment snapshot

        cc.info.status = CCStatus.Removed;

        market.setCommitmentId(peerId, bytes32(0x00));
        // #endregion

        // #region withdraw collateral
        address payable delegator = payable(cc.info.delegator);
        uint256 collateralPerUnit_ = cc.info.collateralPerUnit;
        uint256 totalCollateral = collateralPerUnit_ * unitCount;

        s.collateralBalance[delegator] += totalCollateral - cc.finish.totalSlashedCollateral;

        // send to DAO
        payable(owner()).sendValue(cc.finish.totalSlashedCollateral);
        // #endregion

        emit CommitmentFinished(commitmentId);
    }

    function withdrawCollateral() external {
        CommitmentStorage storage s = _getCommitmentStorage();
        uint256 amount = s.collateralBalance[msg.sender];
        require(amount > 0, "No collateral balance");

        s.collateralBalance[msg.sender] = 0;
        payable(msg.sender).sendValue(amount);
    }

    function removeCUFromCC(bytes32 commitmentId, bytes32[] calldata unitIds) external {
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

        // #region init and verify variables
        uint256 currentEpoch_ = core.currentEpoch();

        Commitment storage cc = s.commitments[commitmentId];
        uint256 expiredEpoch = _expiredEpoch(cc);

        bytes32 peerId = cc.info.peerId;

        IMarket.ComputePeer memory peer = market.getComputePeer(peerId);

        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        CCStatus status = _preCommitCommitmentSnapshot(cc, snapshotCache, peer, currentEpoch_, expiredEpoch);
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        if (status != CCStatus.Inactive && status != CCStatus.Failed) {
            revert CapacityCommitmentIsActive(status);
        }
        // #endregion

        for (uint256 i = 0; i < unitIds.length; i++) {
            bytes32 unitId = unitIds[i];
            IMarket.ComputeUnit memory unit = market.getComputeUnit(unitId);

            require(unit.peerId == peerId, "Compute unit doesn't belong to capacity commitment");
            require(unit.deal == address(0x00), "Compute unit is in deal");
            require(!cc.finish.isUnitExited[unitId], "Compute unit is exited");

            UnitInfo storage unitInfo = cc.unitInfoById[unitId];
            _commitUnitSnapshot(cc, unitInfo, currentEpoch_, expiredEpoch, snapshotCache.current.failedEpoch);

            cc.finish.exitedUnitCount += 1;
            cc.finish.totalSlashedCollateral += unitInfo.slashedCollateral;
            cc.finish.isUnitExited[unitId] = true;
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

    function fixReward(bytes32 commitmentId) external {
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

        // #region init and verify variables
        uint256 currentEpoch = core.currentEpoch();
        Commitment storage cc = s.commitments[commitmentId];
        IMarket.ComputePeer memory peer = market.getComputePeer(cc.info.peerId);
        IMarket.Offer memory offer = market.getOffer(peer.offerId);

        require(
            offer.provider == msg.sender || cc.info.delegator == msg.sender,
            "Only provider or delegator can withdraw reward"
        );
        // #endregion

        // #region commit commitment snapshot for the previous epoch
        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        _preCommitCommitmentSnapshot(cc, snapshotCache, peer, currentEpoch, _expiredEpoch(cc));
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        if (snapshotCache.current.failedEpoch != 0) {
            currentEpoch = snapshotCache.current.failedEpoch;
        }
        // #endregion

        // #region withdraw reward
        address provider = market.getOffer(peer.offerId).provider;
        uint256 amount = cc.vesting.withdraw(currentEpoch);

        uint256 delegatorReward = (amount * cc.info.rewardDelegatorRate) / PRECISION;
        uint256 providerReward = amount - delegatorReward;

        s.rewardBalance[cc.info.delegator] += delegatorReward;
        s.rewardBalance[provider] += providerReward;
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

    // TODO: remove the argument if we decide to support withdraw only in new CLI version
    function withdrawReward(bytes32) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        uint256 amount = s.rewardBalance[msg.sender];
        require(amount > 0, "No reward balance");

        uint256 totalRewardPool = s.totalRewardPool;
        require(amount <= totalRewardPool, "Not enough reward pool on the contract. Wait when DAO will refill it.");

        s.totalRewardPool = totalRewardPool - amount;
        s.rewardBalance[msg.sender] = 0;

        payable(msg.sender).sendValue(amount);
    }

    // #endregion

    // region ----------------- Deal Callbacks -----------------
    function onUnitMovedToDeal(bytes32 commitmentId, bytes32 unitId) external onlyMarket {
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

        // #region init and verify variables
        uint256 currentEpoch_ = core.currentEpoch();

        Commitment storage cc = s.commitments[commitmentId];
        IMarket.ComputePeer memory peer = market.getComputePeer(cc.info.peerId);
        UnitInfo storage unitInfo = cc.unitInfoById[unitId];

        uint256 expiredEpoch = _expiredEpoch(cc);
        // #endregion

        // #region commit snapshot for unit and commitment
        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        CCStatus status = _preCommitCommitmentSnapshot(cc, snapshotCache, peer, currentEpoch_, expiredEpoch);
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        if (status != CCStatus.Active) {
            revert CapacityCommitmentIsNotActive(status);
        }

        _commitUnitSnapshot(cc, unitInfo, currentEpoch_, expiredEpoch, snapshotCache.current.failedEpoch);
        // #endregion

        unitInfo.isInactive = true;
        cc.progress.activeUnitCount--;
        core.setActiveUnitCount(core.activeUnitCount() - 1);

        emit CommitmentStatsUpdated(
            commitmentId,
            cc.progress.totalFailCount,
            cc.finish.exitedUnitCount,
            cc.progress.activeUnitCount,
            cc.progress.nextAdditionalActiveUnitCount,
            currentEpoch_ - 1
        );
        emit UnitDeactivated(commitmentId, unitId);
    }

    function onUnitReturnedFromDeal(bytes32 commitmentId, bytes32 unitId) external onlyMarket {
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

        // #region init and verify variables
        uint256 currentEpoch = core.currentEpoch();
        uint256 startEpoch = currentEpoch + 1;
        uint256 prevEpoch = currentEpoch - 1;

        Commitment storage cc = s.commitments[commitmentId];
        IMarket.ComputePeer memory peer = market.getComputePeer(cc.info.peerId);
        UnitInfo storage unitInfo = cc.unitInfoById[unitId];

        uint256 expiredEpoch = _expiredEpoch(cc);
        // #endregion

        // #region commit snapshot for commitment
        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        CCStatus status = _preCommitCommitmentSnapshot(cc, snapshotCache, peer, currentEpoch, expiredEpoch);
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        // #endregion

        // #region activate unit
        unitInfo.isInactive = false;
        unitInfo.lastSnapshotEpoch = currentEpoch;

        emit UnitActivated(commitmentId, unitId, startEpoch);
        // #endregion

        // if status is not active, then we don't need to update activeUnitCount
        if (status == CCStatus.Inactive || status == CCStatus.Failed) {
            return;
        }

        // add one active unit to global activeUnitCount and commitment activeUnitCount
        cc.progress.nextAdditionalActiveUnitCount += 1;
        core.setActiveUnitCount(core.activeUnitCount() + 1);

        market.setStartEpoch(unitId, startEpoch);

        // we put here prevEpoch because commit snapshot was made for the previous epoch
        emit CommitmentStatsUpdated(
            commitmentId,
            cc.progress.totalFailCount,
            cc.finish.exitedUnitCount,
            cc.progress.activeUnitCount,
            cc.progress.nextAdditionalActiveUnitCount,
            prevEpoch
        );
    }
    // #endregion

    // #region ----------------- Internal View -----------------
    function _expiredEpoch(Commitment storage cc) private view returns (uint256) {
        return cc.info.startEpoch + cc.info.duration;
    }
    // #endregion
    // #region ----------------- Internal Mutable -----------------

    // IMPORTANT: This function affects the off-chain indexer. If you change it, make sure to update the indexer accordingly.
    function _preCommitCommitmentSnapshot(
        Commitment storage cc,
        Snapshot.Cache memory snapshotCache,
        IMarket.ComputePeer memory peer,
        uint256 currentEpoch_,
        uint256 expiredEpoch
    ) private view returns (CCStatus) {
        CCStatus storageStatus = snapshotCache.current.status;
        uint256 lastSnapshotEpoch = snapshotCache.current.snapshotEpoch;
        uint256 snapshotEpoch = currentEpoch_ - 1;

        if (cc.info.startEpoch == 0) {
            return CCStatus.WaitDelegation;
        } else if (cc.info.startEpoch > currentEpoch_) {
            return CCStatus.WaitStart;
        }

        // only active status can have a snapshot and be changed because with other statuses CC can't work
        // also if snapshotEpoch is less or equal to lastSnapshotEpoch, then we have snapshot for this epoch
        if (storageStatus != CCStatus.Active || snapshotEpoch <= lastSnapshotEpoch) {
            return storageStatus;
        }

        CCStatus newStatus = CCStatus.Active;
        // if the snapshotEpoch is greater than expiredEpoch, then you need to take a snapshot only up to expiredEpoch
        uint256 lastWorkingEpoch = expiredEpoch - 1;
        if (snapshotEpoch >= lastWorkingEpoch) {
            snapshotEpoch = lastWorkingEpoch;
            newStatus = CCStatus.Inactive;
        }

        // #region init variables
        uint256 maxFailedRatio_ = core.maxFailedRatio();
        uint256 activeUnitCount_ = snapshotCache.current.activeUnitCount;
        uint256 nextAdditionalActiveUnitCount_ = snapshotCache.current.nextAdditionalActiveUnitCount;
        uint256 totalFailCount = snapshotCache.current.totalFailCount;
        uint256 prevFailCount = totalFailCount;
        uint256 currentSuccessCount = snapshotCache.current.currentSuccessCount;

        // maxFailCount is a number of Epochs when units not send proofs
        // if on unit not send proof per one epoch, it's mean that it's one fail
        // maxFailedRatio is the ratio of failed attempts for all units
        uint256 maxFailCount = maxFailedRatio_ * peer.unitCount;
        uint256 snapshotEpochCount = snapshotEpoch - lastSnapshotEpoch;
        uint256 requiredSuccessCount = activeUnitCount_ * snapshotEpochCount;
        // #endregion

        // #region calculate fail count

        // When unit send min proof per one epoch, it's a one success. successCount is a number of success for all units in the snapshot period
        // if successCount is less than requiredSuccessCount, then some units didn't send min proof per few Epochs
        uint256 snapshotTotalFailCount = 0;
        if (currentSuccessCount < requiredSuccessCount) {
            // snapshotTotalFailCount is a number of fails for all units in the snapshot period
            snapshotTotalFailCount = requiredSuccessCount - currentSuccessCount;
            totalFailCount += snapshotTotalFailCount;
        }

        // if totalFailCount_ is more than maxFailCount, then CC is failed
        if (totalFailCount >= maxFailCount) {
            totalFailCount = maxFailCount;
            uint256 restFailCount = maxFailCount - prevFailCount;
            newStatus = CCStatus.Failed;

            uint256 firstPeriodEpoch = lastSnapshotEpoch + 1;
            uint256 failsInFirstEpoch = activeUnitCount_ - cc.progress.successCountByEpoch[firstPeriodEpoch];

            if (failsInFirstEpoch >= restFailCount) {
                snapshotCache.current.failedEpoch = firstPeriodEpoch;
                snapshotCache.current.remainingFailedUnitsInLastEpoch = restFailCount % failsInFirstEpoch;
            } else {
                // numberOfFillFailedEpoch is a number of epochs when units not send proofs
                uint256 numberOfFillFailedEpoch = 1;
                restFailCount -= failsInFirstEpoch;

                uint256 newActiveUnitCount = activeUnitCount_ + nextAdditionalActiveUnitCount_;

                // TOOD: add currentSuccessCount to calculation
                numberOfFillFailedEpoch += restFailCount / newActiveUnitCount;
                uint256 remainingFailedUnitsInLastEpoch = restFailCount % newActiveUnitCount;

                // Math.ceil(numberOfFillFailedEpoch)
                // if remainingFailedUnitsInLastEpoch is not zero, then we should add one to numberOfFillFailedEpoch because the last epoch is not full
                if (remainingFailedUnitsInLastEpoch != 0) {
                    numberOfFillFailedEpoch += 1;
                }

                snapshotCache.current.failedEpoch = lastSnapshotEpoch + numberOfFillFailedEpoch;
                snapshotCache.current.remainingFailedUnitsInLastEpoch = remainingFailedUnitsInLastEpoch;
            }
        }

        snapshotCache.current.totalFailCount = totalFailCount;
        // #endregion

        // #region update activeUnitCount
        // when unit return from deal, unit need to wait one epoch before it will be active
        // nextAdditionalActiveUnitCount is a number of units that will be active in the next epoch
        uint256 nextAdditionalActiveUnitCount = snapshotCache.current.nextAdditionalActiveUnitCount;

        // update activeUnitCount if it's needed
        if (nextAdditionalActiveUnitCount > 0) {
            snapshotCache.current.activeUnitCount += nextAdditionalActiveUnitCount;
            snapshotCache.current.nextAdditionalActiveUnitCount = 0;
        }

        // #endregion

        // #region update status
        if (newStatus != CCStatus.Active) {
            snapshotCache.current.activeUnitCount = 0;
            snapshotCache.current.status = newStatus;
        }
        // #endregion

        // #region update progress
        snapshotCache.current.snapshotEpoch = snapshotEpoch;
        snapshotCache.current.currentSuccessCount = 0;
        // #endregion

        return newStatus;
    }

    function _postCommitCommitmentSnapshot(
        bytes32 commitmentId,
        Commitment storage cc,
        Snapshot.Cache memory snapshotCache
    ) internal {
        if (snapshotCache.initial.status != snapshotCache.current.status) {
            uint256 initialActiveUnitCount_ =
                snapshotCache.initial.activeUnitCount + snapshotCache.initial.nextAdditionalActiveUnitCount;

            if (snapshotCache.current.status == CCStatus.Failed) {
                emit CommitmentFailed(commitmentId, snapshotCache.current.failedEpoch);

                core.setActiveUnitCount(core.activeUnitCount() - initialActiveUnitCount_);
            } else if (snapshotCache.current.status == CCStatus.Inactive) {
                core.setActiveUnitCount(core.activeUnitCount() - initialActiveUnitCount_);
            }
        }

        snapshotCache.save(cc);
    }

    function _commitUnitSnapshot(
        Commitment storage cc,
        UnitInfo storage unitInfo,
        uint256 currentEpoch,
        uint256 expiredEpoch,
        uint256 failedEpoch
    ) internal {
        CommitmentStorage storage s = _getCommitmentStorage();
        uint256 snapshotEpoch = currentEpoch - 1;

        // #region verify args
        // if unit is inactive, then no need to do anything because it's means that unit is in deal
        if (unitInfo.isInactive) {
            return;
        }

        // if snapshotEpoch is more than expiredEpoch, then we should use expiredEpoch because it means that the commitment is expired before we start making a snapshot
        uint256 lastWorkingEpoch = expiredEpoch - 1;
        if (snapshotEpoch > lastWorkingEpoch) {
            snapshotEpoch = lastWorkingEpoch;
        }

        // if failedEpoch is more than 0 and snapshotEpoch is more than failedEpoch, then we should use failedEpoch because it means that the commitment is failed before we start making a snapshot
        if (failedEpoch != 0 && snapshotEpoch > failedEpoch) {
            snapshotEpoch = failedEpoch;
        }

        // if lastMinProofsEpoch is zero then we should use startEpoch - 1 because (startEpoch - 1) is the first epoch snapshot
        uint256 lastSnapshotEpoch = unitInfo.lastSnapshotEpoch;
        if (lastSnapshotEpoch == 0) {
            lastSnapshotEpoch = cc.info.startEpoch - 1;
        }

        // if snapshotEpoch is less or equal to lastSnapshotEpoch, then we should return false because it means that we already made a snapshot for this epoch
        if (snapshotEpoch <= lastSnapshotEpoch) {
            return;
        }
        // #endregion

        unitInfo.lastSnapshotEpoch = snapshotEpoch;

        // #region slashing
        uint256 slashedCollateral = unitInfo.slashedCollateral;
        uint256 collateralPerUnit_ = cc.info.collateralPerUnit;
        uint256 currentCollateral = collateralPerUnit_ - slashedCollateral;

        // slashingRate is defined by PRECISION
        // Example: if real slashing rate is 0.1% then slashingRate_ = 0.1 * PRECISION
        uint256 slashingRate_ = core.slashingRate();

        // gapsCount is the number of epochs between lastSnapshotEpoch and snapshotEpoch. In this period unit didn't submit any proof
        uint256 gapsCount = snapshotEpoch - lastSnapshotEpoch;

        RewardInfo storage rewardInfo = s.rewardInfoByEpoch[snapshotEpoch];
        uint256 minProofsPerEpoch_ = rewardInfo.minProofsPerEpoch;
        if (minProofsPerEpoch_ != 0 && unitInfo.proofCountByEpoch[snapshotEpoch] >= minProofsPerEpoch_) {
            gapsCount--;
        }

        // if currentCollateral is more than 0, then we should slash
        if (currentCollateral > 0 && gapsCount > 0) {
            uint256 remainingFailedUnitsInLastEpoch = cc.finish.remainingFailedUnitsInLastEpoch;

            if (snapshotEpoch == failedEpoch && remainingFailedUnitsInLastEpoch != 0) {
                uint256 filledRemainingFailedUnitsInLastEpoch = cc.finish.filledRemainingFailedUnitsInLastEpoch;
                if (filledRemainingFailedUnitsInLastEpoch >= remainingFailedUnitsInLastEpoch) {
                    gapsCount -= 1;
                } else {
                    cc.finish.filledRemainingFailedUnitsInLastEpoch = filledRemainingFailedUnitsInLastEpoch + 1;
                }
            }

            slashedCollateral += (gapsCount * collateralPerUnit_ * slashingRate_) / PRECISION;
            if (slashedCollateral > currentCollateral) {
                slashedCollateral = currentCollateral;
            }
            unitInfo.slashedCollateral = slashedCollateral;
        }
        // #endregion

        // #region calculate reward for the last epoch snapshot
        uint256 nextEpochAfterLastSnapshot = lastSnapshotEpoch + 1;
        uint256 lastProofCount = unitInfo.proofCountByEpoch[nextEpochAfterLastSnapshot];
        rewardInfo = s.rewardInfoByEpoch[nextEpochAfterLastSnapshot];
        if (lastProofCount < rewardInfo.minProofsPerEpoch) {
            return;
        }

        uint256 totalSuccessProofs = rewardInfo.totalSuccessProofs;
        if (totalSuccessProofs == 0) {
            return;
        }

        uint256 reward =
            (core.getRewardPool(nextEpochAfterLastSnapshot) * lastProofCount) / rewardInfo.totalSuccessProofs;

        if (reward > 0) {
            cc.vesting.add(reward, nextEpochAfterLastSnapshot, core.vestingPeriodDuration(), core.vestingPeriodCount());
        }

        delete unitInfo.proofCountByEpoch[nextEpochAfterLastSnapshot];
        // #endregion
    }

    // #endregion
}
