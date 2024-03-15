// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/deal/base/Types.sol";
import "src/utils/RandomXProxy.sol";
import "src/utils/BytesConverter.sol";
import "src/utils/Whitelist.sol";
import "./interfaces/ICapacity.sol";
import "./CapacityConst.sol";
import "./Vesting.sol";
import "./Snapshot.sol";
import "forge-std/console.sol";

contract Capacity is
    UUPSUpgradeable,
    MulticallUpgradeable,
    CapacityConst,
    ICapacity
{
    using SafeERC20 for IERC20;
    using BytesConverter for bytes;
    using Address for address payable;
    using Vesting for Vesting.Info;
    using Snapshot for Snapshot.Cache;

    // #region ------------------ Types ------------------
    struct RewardInfo {
        uint256 minRequierdCCProofs;
        uint256 totalSuccessProofs;
    }
    // #endregion

    // #region ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT =
        bytes32(uint256(keccak256("fluence.capacity.storage.v1")) - 1);

    struct CommitmentStorage {
        mapping(bytes32 => Commitment) commitments;
        mapping(uint256 => RewardInfo) rewardInfoByEpoch;
        bytes32 globalNonce;
        bytes32 nextGlobalNonce;
        uint256 changedNonceEpoch;
        mapping(bytes32 => mapping(bytes32 => bool)) isProofSubmittedByUnit;
    }

    function _getCommitmentStorage()
        private
        pure
        returns (CommitmentStorage storage s)
    {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }
    // #endregion

    // #region ------------------ Initializer & Upgradeable ------------------
    constructor(ICore core_) CapacityConst(core_) {}

    function initialize(
        uint256 fltPrice_,
        uint256 usdCollateralPerUnit_,
        uint256 usdTargetRevenuePerEpoch_,
        uint256 minDuration_,
        uint256 minRewardPerEpoch_,
        uint256 maxRewardPerEpoch_,
        uint256 vestingPeriodDuration_,
        uint256 vestingPeriodCount_,
        uint256 slashingRate_,
        uint256 minProofsPerEpoch_,
        uint256 maxProofsPerEpoch_,
        uint256 withdrawEpochsAfterFailed_,
        uint256 maxFailedRatio_,
        bytes32 initGlobalNonce_,
        bytes32 difficulty_,
        uint256 initRewardPool_,
        address randomXProxy_
    ) external initializer {
        __CapacityConst_init(
            fltPrice_,
            usdCollateralPerUnit_,
            usdTargetRevenuePerEpoch_,
            minDuration_,
            minRewardPerEpoch_,
            maxRewardPerEpoch_,
            vestingPeriodDuration_,
            vestingPeriodCount_,
            slashingRate_,
            minProofsPerEpoch_,
            maxProofsPerEpoch_,
            withdrawEpochsAfterFailed_,
            maxFailedRatio_,
            difficulty_,
            initRewardPool_,
            randomXProxy_
        );
        __UUPSUpgradeable_init();
        __Multicall_init();

        CommitmentStorage storage s = _getCommitmentStorage();
        s.globalNonce = initGlobalNonce_;
        s.changedNonceEpoch = core.currentEpoch();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyCoreOwner {}
    // #endregion

    // #region ------------------ Modifiers ------------------
    modifier onlyApproved() {
        require(
            Whitelist(address(core)).isApproved(msg.sender),
            "Whitelist: provider is not approved"
        );
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
        CCStatus status = _preCommitCommitmentSnapshot(
            cc,
            snapshotCache,
            peer,
            core.currentEpoch(),
            _expiredEpoch(cc)
        );

        return status;
    }

    function getCommitment(
        bytes32 commitmentId
    ) external view returns (CommitmentView memory) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        require(
            cc.info.peerId != bytes32(0x00),
            "Capacity commitment doesn't exist"
        );

        return
            CommitmentView({
                status: getStatus(commitmentId),
                peerId: cc.info.peerId,
                collateralPerUnit: cc.info.collateralPerUnit,
                unitCount: core
                    .market()
                    .getComputePeer(cc.info.peerId)
                    .unitCount,
                startEpoch: cc.info.startEpoch,
                endEpoch: cc.info.startEpoch + cc.info.duration,
                rewardDelegatorRate: cc.info.rewardDelegatorRate,
                delegator: cc.info.delegator,
                totalFailCount: cc.progress.totalFailCount,
                failedEpoch: cc.finish.failedEpoch,
                exitedUnitCount: cc.finish.exitedUnitCount
            });
    }

    function totalRewards(
        bytes32 commitmentId
    ) external view returns (uint256) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        return cc.vesting.total();
    }

    function unlockedRewards(
        bytes32 commitmentId
    ) external view returns (uint256) {
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
    // #endregion

    // #region ----------------- Public Mutable -----------------
    function createCommitment(
        bytes32 peerId,
        uint256 duration,
        address delegator,
        uint256 rewardDelegationRate
    ) external onlyApproved returns (bytes32) {
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

        // #region init and verify variables
        IMarket.ComputePeer memory peer = market.getComputePeer(peerId);
        require(
            peer.commitmentId == bytes32(0x00),
            "Peer already has commitment"
        );

        IMarket.Offer memory offer = market.getOffer(peer.offerId);
        address provider = offer.provider;
        require(provider != address(0x00), "Offer doesn't exist");
        require(
            msg.sender == provider,
            "Only provider can create capacity commitment"
        );

        require(
            duration >= minDuration(),
            "Duration should be greater than min capacity commitment duration"
        );
        require(
            rewardDelegationRate > 0,
            "Reward delegation rate should be greater than 0"
        );
        require(
            rewardDelegationRate <= PRECISION,
            "Reward delegation rate should be less or equal 100"
        );
        // #endregion

        // #region create commitment
        uint256 collateralPerUnit = fltCollateralPerUnit();
        bytes32 commitmentId = keccak256(
            abi.encodePacked(
                block.number,
                peerId,
                duration,
                delegator,
                rewardDelegationRate
            )
        );

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

        emit CommitmentCreated(
            peerId,
            commitmentId,
            duration,
            delegator,
            rewardDelegationRate,
            collateralPerUnit
        );
        // #endregion

        return commitmentId;
    }

    function removeCommitment(bytes32 commitmentId) external {
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        bytes32 peerId = cc.info.peerId;

        require(
            getStatus(commitmentId) == CCStatus.WaitDelegation,
            "Capacity commitment is not in WaitDelegation status"
        );

        market.setCommitmentId(peerId, bytes32(0x00));
        delete s.commitments[commitmentId];

        emit CommitmentRemoved(commitmentId);
    }

    function depositCollateral(
        bytes32[] calldata commitmentIds
    ) external payable {
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

            // #region save deposit informaton
            // Indirect potential delegator address update.
            // The flow below is mirrored in subgraph/src/mappings/capacity.ts.
            address delegator = cc.info.delegator;
            if (delegator == address(0x00)) {
                cc.info.delegator = msg.sender;
            } else {
                require(
                    delegator == msg.sender,
                    "Only delegator can lock collateral"
                );
            }

            uint256 startEpoch = currentEpoch_ + 1;

            cc.info.startEpoch = startEpoch;
            cc.progress.snapshotEpoch = currentEpoch_;
            cc.progress.activeUnitCount = unitCount;

            _setActiveUnitCount(activeUnitCount() + unitCount);
            cc.info.status = CCStatus.Active;

            emit CollateralDeposited(commitmentId, collateral);
            emit CommitmentActivated(
                peerId,
                commitmentId,
                startEpoch,
                startEpoch + cc.info.duration,
                market.getComputeUnitIds(peerId)
            );
            // #endregion
        }

        require(totalValue == 0, "Excessive value");
    }

    error RandomXResult(bytes);

    function submitProofs(UnitProof[] calldata proofs) external {
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

        uint256 currentEpoch = core.currentEpoch();

        // #region update global nonce
        if (s.changedNonceEpoch != currentEpoch) {
            s.changedNonceEpoch = currentEpoch;
            s.globalNonce = s.nextGlobalNonce;
        }
        // #endregion

        bytes32[] memory localUnitNonces = new bytes32[](proofs.length);
        bytes32[] memory globalUnitNonces = new bytes32[](proofs.length);

        for (uint256 i = 0; i < proofs.length; i++) {
            // #region init and verify variables
            bytes32 unitId = proofs[i].unitId;
            bytes32 localUnitNonce = proofs[i].localUnitNonce;
            bytes32 resultHash = proofs[i].resultHash;

            localUnitNonces[i] = localUnitNonce;

            IMarket.ComputeUnit memory unit = market.getComputeUnit(unitId);
            IMarket.ComputePeer memory peer = market.getComputePeer(
                unit.peerId
            );
            require(
                peer.owner == msg.sender,
                "Only compute peer owner can submit proof"
            );

            bytes32 commitmentId = peer.commitmentId;
            require(
                commitmentId != bytes32(0x00),
                "Compute unit doesn't have commitment"
            );

            Commitment storage cc = s.commitments[commitmentId];
            require(
                currentEpoch >= cc.info.startEpoch,
                "Capacity commitment is not started"
            );

            UnitInfo storage unitInfo = cc.unitInfoById[unitId];
            uint256 expiredEpoch = _expiredEpoch(cc);
            // #endregion

            // #region commit snapshots
            Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
            CCStatus status = _preCommitCommitmentSnapshot(
                cc,
                snapshotCache,
                peer,
                currentEpoch,
                expiredEpoch
            );
            if (status != CCStatus.Active) {
                revert CapacityCommitmentIsNotActive(status);
            }

            _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
            _commitUnitSnapshot(
                cc,
                unitInfo,
                currentEpoch,
                expiredEpoch,
                snapshotCache.current.failedEpoch
            );
            // #endregion

            // pseudo-random next global nonce
            s.nextGlobalNonce = keccak256(
                abi.encodePacked(
                    s.globalNonce,
                    blockhash(block.number - 1),
                    unitId,
                    localUnitNonce,
                    resultHash
                )
            );

            // #region save localUnitNonce
            bytes32 globalUnitNonce_ = keccak256(
                abi.encodePacked(s.globalNonce, unitId)
            );
            require(
                !s.isProofSubmittedByUnit[globalUnitNonce_][localUnitNonce],
                "Proof is already submitted for this unit"
            );
            s.isProofSubmittedByUnit[globalUnitNonce_][localUnitNonce] = true;

            globalUnitNonces[i] = globalUnitNonce_;
            // #endregion

            // #region save info about proof

            // load unitProofCount and add one because we submit new proof
            uint256 unitProofCount = unitInfo.proofCountByEpoch[currentEpoch] +
                1;
            if (unitProofCount > maxProofsPerEpoch()) {
                revert TooManyProofs();
            }

            uint256 minRequierdCCProofs_ = minProofsPerEpoch();
            if (unitProofCount == minRequierdCCProofs_) {
                // if proofCount is equal to minRequierdCCProofs, then we have one success for the current epoch
                cc.progress.currentSuccessCount += 1;

                // if totalSuccessProofs is zero, then we save minRequierdCCProofs for this epoch.
                // This information will be used for rewards calculation. But we need cache it becouse we can change minRequierdCCProofs for all system.
                uint256 totalSuccessProofs = s
                    .rewardInfoByEpoch[currentEpoch]
                    .totalSuccessProofs;
                if (totalSuccessProofs == 0) {
                    s
                        .rewardInfoByEpoch[currentEpoch]
                        .minRequierdCCProofs = minRequierdCCProofs_;
                }

                s.rewardInfoByEpoch[currentEpoch].totalSuccessProofs =
                    totalSuccessProofs +
                    unitProofCount;
            } else if (unitProofCount > minRequierdCCProofs_) {
                s.rewardInfoByEpoch[currentEpoch].totalSuccessProofs += 1;
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

        // #region check proof
        (bool success, bytes memory result) = randomXProxy().delegatecall(
            abi.encodeWithSelector(
                RandomXProxy.run.selector,
                globalUnitNonces,
                localUnitNonces
            )
        );

        require(success, "RandomXProxy.run failed");

        revert RandomXResult(result);

        require(result.length > 0, "RandomXProxy.run returned empty result");

        bytes32[] memory hashes = abi.decode(result, (bytes32[]));

        require(hashes.length == proofs.length, "Invalid result length");

        for (uint256 i = 0; i < proofs.length; i++) {
            require(hashes[i] == proofs[i].resultHash, "Proof is not valid");
            require(
                hashes[i] <= difficulty(),
                "Proof is bigger than difficulty"
            );
        }
        // #endregion
    }

    function finishCommitment(bytes32 commitmentId) external {
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
        // #endregion

        // #region pre commit commitment snapshot for the previous epoch
        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        CCStatus status = _preCommitCommitmentSnapshot(
            cc,
            snapshotCache,
            peer,
            currentEpoch_,
            expiredEpoch
        );
        if (status != CCStatus.Inactive && status != CCStatus.Failed) {
            revert CapacityCommitmentIsActive(status);
        }
        // #endregion

        require(
            status != CCStatus.Failed ||
                currentEpoch_ >=
                snapshotCache.current.failedEpoch + withdrawEpochsAfterFailed(),
            "Capacity commitment wait withdraw Epochs after failed"
        );

        uint256 unitCount = peer.unitCount;
        require(
            cc.finish.exitedUnitCount == unitCount,
            "For finish commitment all units should be exited"
        );

        // #region post commit commitment snapshot
        snapshotCache.current.status = CCStatus.Removed;
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        market.setCommitmentId(peerId, bytes32(0x00));
        // #endregion

        // #region withdraw collateral
        address payable delegator = payable(cc.info.delegator);
        uint256 collateralPerUnit_ = cc.info.collateralPerUnit;

        uint256 totalCollateral = collateralPerUnit_ * unitCount;
        uint256 slashedCollateral = cc.progress.totalFailCount *
            collateralPerUnit_;
        if (slashedCollateral > totalCollateral) {
            slashedCollateral = totalCollateral;
        }

        totalCollateral -= slashedCollateral;

        delegator.sendValue(totalCollateral);
        // #endregion

        emit CommitmentFinished(commitmentId);
    }

    function removeCUFromCC(
        bytes32 commitmentId,
        bytes32[] calldata unitIds
    ) external {
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
        CCStatus status = _preCommitCommitmentSnapshot(
            cc,
            snapshotCache,
            peer,
            currentEpoch_,
            expiredEpoch
        );
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        if (status != CCStatus.Inactive && status != CCStatus.Failed) {
            revert CapacityCommitmentIsActive(status);
        }

        uint256 failedEpoch = snapshotCache.current.failedEpoch;
        // #endregion

        for (uint256 i = 0; i < unitIds.length; i++) {
            bytes32 unitId = unitIds[i];
            IMarket.ComputeUnit memory unit = market.getComputeUnit(unitId);

            require(
                unit.peerId == peerId,
                "Compute unit doesn't belong to capacity commitment"
            );

            if (unit.deal != address(0x00)) {
                market.returnComputeUnitFromDeal(unitId);
            }

            bool success = _commitUnitSnapshot(
                cc,
                cc.unitInfoById[unitId],
                currentEpoch_,
                expiredEpoch,
                failedEpoch
            );
            if (success) {
                cc.finish.exitedUnitCount += 1;
            }
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
        // #region load contracts and storage
        IMarket market = core.market();
        CommitmentStorage storage s = _getCommitmentStorage();
        // #endregion

        // #region init and verify variables
        uint256 currentEpoch = core.currentEpoch();
        Commitment storage cc = s.commitments[commitmentId];
        IMarket.ComputePeer memory peer = market.getComputePeer(cc.info.peerId);
        // #endregion

        // #region commit commitment snapshot for the previous epoch
        Snapshot.Cache memory snapshotCache = Snapshot.init(cc);
        _preCommitCommitmentSnapshot(
            cc,
            snapshotCache,
            peer,
            currentEpoch,
            _expiredEpoch(cc)
        );
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        if (snapshotCache.current.failedEpoch != 0) {
            currentEpoch = snapshotCache.current.failedEpoch;
        }
        // #endregion

        // #region withdraw reward
        address provider = market.getOffer(peer.offerId).provider;
        uint256 amount = cc.vesting.withdraw(currentEpoch);
        uint256 delegatorReward = (amount * cc.info.rewardDelegatorRate) /
            PRECISION;
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
    // #endregion

    // region ----------------- Deal Callbacks -----------------
    function onUnitMovedToDeal(
        bytes32 commitmentId,
        bytes32 unitId
    ) external onlyMarket {
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
        CCStatus status = _preCommitCommitmentSnapshot(
            cc,
            snapshotCache,
            peer,
            currentEpoch_,
            expiredEpoch
        );
        _postCommitCommitmentSnapshot(commitmentId, cc, snapshotCache);
        if (status != CCStatus.Active) {
            revert CapacityCommitmentIsNotActive(status);
        }

        _commitUnitSnapshot(
            cc,
            unitInfo,
            currentEpoch_,
            expiredEpoch,
            snapshotCache.current.failedEpoch
        );
        // #endregion

        unitInfo.isInactive = true;
        cc.progress.activeUnitCount--;
        _setActiveUnitCount(activeUnitCount() - 1);

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

    function onUnitReturnedFromDeal(
        bytes32 commitmentId,
        bytes32 unitId
    ) external onlyMarket {
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
        CCStatus status = _preCommitCommitmentSnapshot(
            cc,
            snapshotCache,
            peer,
            currentEpoch,
            expiredEpoch
        );
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
        _setActiveUnitCount(activeUnitCount() + 1);

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
    function _expiredEpoch(
        Commitment storage cc
    ) private view returns (uint256) {
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
        if (
            storageStatus != CCStatus.Active ||
            snapshotEpoch <= lastSnapshotEpoch
        ) {
            return storageStatus;
        }

        CCStatus newStatus = CCStatus.Active;
        // if the snapshotEpoch is greater than expiredEpoch, then you need to take a snapshot only up to expiredEpoch
        if (snapshotEpoch >= expiredEpoch) {
            snapshotEpoch = expiredEpoch;
            newStatus = CCStatus.Inactive;
        }

        // #region init variables
        uint256 maxFailedRatio_ = maxFailedRatio();
        uint256 activeUnitCount_ = snapshotCache.current.activeUnitCount;
        uint256 unitCount = peer.unitCount;
        uint256 totalFailCount = snapshotCache.current.totalFailCount;
        uint256 currentSuccessCount = snapshotCache.current.currentSuccessCount;

        // maxFailCount is a number of Epochs when units not send proofs
        // if on unit not send proof per one epoch, it's mean that it's one fail
        // maxFailedRatio is the ratio of failed attempts for all units
        uint256 maxFailCount = maxFailedRatio_ * unitCount;
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
            newStatus = CCStatus.Failed;

            // numberOfFillFailedEpoch is a number of epochs when units not send proofs
            uint256 numberOfFillFailedEpoch = snapshotTotalFailCount /
                activeUnitCount_;
            uint256 remainingFailedUnitsInLastEpoch = snapshotTotalFailCount %
                activeUnitCount_;
            // Math.ceil(numberOfFillFailedEpoch)
            // if remainingFailedUnitsInLastEpoch is not zero, then we should add one to numberOfFillFailedEpoch becouse the last epoch is not full
            if (remainingFailedUnitsInLastEpoch != 0) {
                numberOfFillFailedEpoch += 1;
            }

            // failedEpoch is a epoche number when the commitment was failed
            // if snapshotEpoch is more than one inactive epoch before last Snapshot Epoch, then means between lastSnapshotEpoch and failed Epoch we have few epochs

            snapshotCache.current.failedEpoch =
                lastSnapshotEpoch +
                numberOfFillFailedEpoch;
            snapshotCache
                .current
                .remainingFailedUnitsInLastEpoch = remainingFailedUnitsInLastEpoch;
        }

        snapshotCache.current.totalFailCount = totalFailCount;
        // #endregion

        // #region update activeUnitCount
        // when unit return from deal, unit need to wait one epoch before it will be active
        // nextAdditionalActiveUnitCount is a number of units that will be active in the next epoch
        uint256 nextAdditionalActiveUnitCount = snapshotCache
            .current
            .nextAdditionalActiveUnitCount;

        // update activeUnitCount if it's needed
        if (nextAdditionalActiveUnitCount > 0) {
            snapshotCache
                .current
                .activeUnitCount += nextAdditionalActiveUnitCount;
            snapshotCache.current.nextAdditionalActiveUnitCount = 0;
        }

        // #endregion

        // #region update status
        if (newStatus != CCStatus.Active) {
            snapshotCache.current.activeUnitCount = 0;
            //TODO: _setActiveUnitCount(activeUnitCount() - activeUnitCount_);
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
        uint256 activeUnitCount_ = snapshotCache.current.activeUnitCount;
        uint256 initialActiveUnitCount_ = snapshotCache.initial.activeUnitCount;

        if (activeUnitCount_ == 0 && initialActiveUnitCount_ > 0) {
            _setActiveUnitCount(activeUnitCount() - initialActiveUnitCount_);
        }

        if (
            snapshotCache.initial.status != CCStatus.Failed &&
            snapshotCache.current.status == CCStatus.Failed
        ) {
            emit CommitmentFailed(
                commitmentId,
                snapshotCache.current.failedEpoch
            );
        }

        snapshotCache.save(cc);
    }

    function _commitUnitSnapshot(
        Commitment storage cc,
        UnitInfo storage unitInfo,
        uint256 currentEpoch,
        uint256 expiredEpoch,
        uint256 faildEpoch
    ) internal returns (bool) {
        CommitmentStorage storage s = _getCommitmentStorage();
        uint256 snapshotEpoch = currentEpoch - 1;

        // #region verify args
        // if unit is inactive, then no need to do anything because it's means that unit is in deal
        if (unitInfo.isInactive) {
            return false;
        }

        // if snapshotEpoch is more than expiredEpoch, then we should use expiredEpoch because it means that the commitment is expired before we start making a snapshot
        if (snapshotEpoch > expiredEpoch) {
            snapshotEpoch = expiredEpoch;
        }

        // if faildEpoch is more than 0 and snapshotEpoch is more than faildEpoch, then we should use faildEpoch because it means that the commitment is failed before we start making a snapshot
        if (faildEpoch != 0 && snapshotEpoch > faildEpoch) {
            snapshotEpoch = faildEpoch;
        }

        // if lastMinProofsEpoch is zero then we should use startEpoch - 1 because (startEpoch - 1) is the first 'snapshoted' epoch
        uint256 lastSnapshotEpoch = unitInfo.lastSnapshotEpoch;
        if (lastSnapshotEpoch == 0) {
            lastSnapshotEpoch = cc.info.startEpoch - 1;
            unitInfo.lastSnapshotEpoch = snapshotEpoch;
        }

        // if snapshotEpoch is less or equal to lastSnapshotEpoch, then we should return false because it means that we already made a snapshot for this epoch
        if (snapshotEpoch <= lastSnapshotEpoch) {
            return false;
        }
        // #endregion

        unitInfo.lastSnapshotEpoch = snapshotEpoch;

        // #region slashing
        uint256 slashedCollateral = unitInfo.slashedCollateral;
        uint256 collateralPerUnit_ = cc.info.collateralPerUnit;
        uint256 currentCollateral = collateralPerUnit_ - slashedCollateral;

        // slashingRate is defined by PRECISION
        // Example: if real slashing rate is 0.1% then slashingRate_ = 0.1 * PRECISION
        uint256 slashingRate_ = slashingRate();

        // gapsCount is the number of epochs between lastSnapshotEpoch and snapshotEpoch. In this period unit didn't submit any proof
        uint256 gapsCount = snapshotEpoch - lastSnapshotEpoch;
        if (unitInfo.proofCountByEpoch[snapshotEpoch] >= minProofsPerEpoch()) {
            gapsCount--;
        }

        // if currentCollateral is more than 0, then we should slash
        if (currentCollateral > 0 && gapsCount > 0) {
            uint256 remainingFailedUnitsInLastEpoch = cc
                .finish
                .remainingFailedUnitsInLastEpoch;

            if (
                snapshotEpoch == faildEpoch &&
                remainingFailedUnitsInLastEpoch != 0
            ) {
                uint256 filledRemainingFailedUnitsInLastEpoch = cc
                    .finish
                    .filledRemainingFailedUnitsInLastEpoch;
                if (
                    filledRemainingFailedUnitsInLastEpoch >=
                    remainingFailedUnitsInLastEpoch
                ) {
                    gapsCount -= 1;
                } else {
                    cc.finish.filledRemainingFailedUnitsInLastEpoch =
                        filledRemainingFailedUnitsInLastEpoch +
                        1;
                }
            }

            slashedCollateral +=
                (gapsCount * collateralPerUnit_ * slashingRate_) /
                PRECISION;
            if (slashedCollateral > currentCollateral) {
                slashedCollateral = currentCollateral;
            }
            unitInfo.slashedCollateral = slashedCollateral;
        }
        // #endregion

        // #region calculate reward for the last snapshoted epoch
        uint256 nextEpochAfterSnapshot = lastSnapshotEpoch + 1;
        uint256 lastProofCount = unitInfo.proofCountByEpoch[
            nextEpochAfterSnapshot
        ];
        RewardInfo storage rewardInfo = s.rewardInfoByEpoch[
            nextEpochAfterSnapshot
        ];

        if (lastProofCount < rewardInfo.minRequierdCCProofs) {
            return true;
        }

        uint256 totalSuccessProofs = rewardInfo.totalSuccessProofs;
        if (totalSuccessProofs == 0) {
            return true;
        }

        uint256 reward = (getRewardPool(nextEpochAfterSnapshot) *
            lastProofCount) / rewardInfo.totalSuccessProofs;

        if (reward > 0) {
            cc.vesting.add(
                reward,
                nextEpochAfterSnapshot,
                vestingPeriodDuration(),
                vestingPeriodCount()
            );
        }

        delete unitInfo.proofCountByEpoch[nextEpochAfterSnapshot];
        // #endregion

        return true;
    }
    // #endregion
}
