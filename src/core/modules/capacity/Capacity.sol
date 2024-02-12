// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/deal/base/Types.sol";
import "src/utils/RandomXProxy.sol";
import "src/utils/Whitelist.sol";
import "src/utils/BytesConverter.sol";
import "./interfaces/ICapacity.sol";
import "./CapacityConst.sol";
import "forge-std/console.sol";

contract Capacity is UUPSUpgradeable, MulticallUpgradeable, CapacityConst, Whitelist, ICapacity {
    using SafeERC20 for IERC20;
    using BytesConverter for bytes;
    using Address for address payable;

    // #region ------------------ Types ------------------
    struct UnitProofsInfo {
        bool isInactive;
        uint256 lastMinProofsEpoch;
        uint256 slashedCollateral;
        mapping(uint256 => uint256) proofsCountByEpoch;
    }

    struct Commitment {
        CommitmentInfo info;
        Vesting[] vestings;
        mapping(bytes32 => UnitProofsInfo) unitProofsInfoByUnit;
    }

    struct RewardInfo {
        uint256 minRequierdCCProofs;
        uint256 totalSuccessProofs;
    }

    struct Vesting {
        uint256 epoch;
        uint256 cumulativeAmount;
    }
    // #endregion

    // #region ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.capacity.storage.v1")) - 1);

    struct CommitmentStorage {
        mapping(bytes32 => Commitment) commitments;
        mapping(uint256 => RewardInfo) rewardInfoByEpoch;
        bytes32 globalNonce;
        bytes32 nextGlobalNonce;
        uint256 nonceEpochSnapshot;
        mapping(bytes32 => mapping(bytes32 => bool)) isProofSubmittedByUnit;
    }

    function _getCommitmentStorage() private pure returns (CommitmentStorage storage s) {
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
        uint256 vestingDuration_,
        uint256 slashingRate_,
        uint256 minRequierdProofsPerEpoch_,
        uint256 maxProofsPerEpoch_,
        uint256 withdrawEpochesAfterFailed_,
        uint256 maxFailedRatio_,
        bool isWhitelistEnabled_,
        bytes32 initGlobalNonce_,
        bytes32 difficulty_,
        address randomXProxy_
    ) external initializer {
        __Ownable_init(msg.sender);
        __Whitelist_init(isWhitelistEnabled_);
        __CapacityConst_init(
            fltPrice_,
            usdCollateralPerUnit_,
            usdTargetRevenuePerEpoch_,
            minDuration_,
            minRewardPerEpoch_,
            maxRewardPerEpoch_,
            vestingDuration_,
            slashingRate_,
            minRequierdProofsPerEpoch_,
            maxProofsPerEpoch_,
            withdrawEpochesAfterFailed_,
            maxFailedRatio_,
            difficulty_,
            randomXProxy_
        );
        __UUPSUpgradeable_init();
        __Multicall_init();

        CommitmentStorage storage s = _getCommitmentStorage();
        s.globalNonce = initGlobalNonce_;
        s.nonceEpochSnapshot = core.currentEpoch();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyCoreOwner {}
    // #endregion

    // #region ----------------- Public View -----------------
    function getStatus(bytes32 commitmentId) public view returns (CCStatus) {
        CommitmentStorage storage s = _getCommitmentStorage();

        Commitment storage cc = s.commitments[commitmentId];

        uint256 currentEpoch_ = core.currentEpoch();
        if (cc.info.status == CCStatus.Removed) {
            return CCStatus.Removed;
        } else if (cc.info.startEpoch == 0) {
            return CCStatus.WaitDelegation;
        } else if (cc.info.startEpoch > currentEpoch_) {
            return CCStatus.WaitStart;
        } else if (_isFailed(cc, currentEpoch_)) {
            return CCStatus.Failed;
        } else if (currentEpoch_ >= _expiredEpoch(cc)) {
            return CCStatus.Inactive;
        } else {
            return CCStatus.Active;
        }
    }

    function getCommitment(bytes32 commitmentId) external view returns (CommitmentView memory) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        return CommitmentView({
            status: getStatus(commitmentId),
            peerId: cc.info.peerId,
            collateralPerUnit: cc.info.collateralPerUnit,
            unitCount: core.market().getComputePeer(cc.info.peerId).unitCount,
            startEpoch: cc.info.startEpoch,
            endEpoch: cc.info.startEpoch + cc.info.duration,
            rewardDelegatorRate: cc.info.rewardDelegatorRate,
            delegator: cc.info.delegator,
            totalCUFailCount: cc.info.totalCUFailCount,
            failedEpoch: cc.info.failedEpoch,
            exitedUnitCount: cc.info.exitedUnitCount
        });
    }

    function totalRewards(bytes32 commitmentId) external view returns (uint256) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        uint256 length = cc.vestings.length;
        if (length == 0) {
            return 0;
        }

        return cc.vestings[length - 1].cumulativeAmount - cc.info.totalWithdrawnReward;
    }

    function unlockedRewards(bytes32 commitmentId) external view returns (uint256) {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];

        (int256 index,) = _findClosestMinVesting(cc.vestings, core.currentEpoch());
        if (index < 0) {
            return 0;
        }

        return cc.vestings[uint256(index)].cumulativeAmount - cc.info.totalWithdrawnReward;
    }

    function getGlobalNonce() external view returns (bytes32) {
        CommitmentStorage storage s = _getCommitmentStorage();
        if (core.currentEpoch() != s.nonceEpochSnapshot) {
            return s.nextGlobalNonce;
        }

        return s.globalNonce;
    }
    // #endregion

    // #region ----------------- Public Mutable -----------------
    function createCommitment(bytes32 peerId, uint256 duration, address delegator, uint256 rewardDelegationRate)
        external
        returns (bytes32)
    {
        require(isApproved(msg.sender), "Only whitelisted provider can create capacity commitment");

        IMarket market = core.market();

        CommitmentStorage storage s = _getCommitmentStorage();
        IMarket.ComputePeer memory peer = market.getComputePeer(peerId);

        require(peer.commitmentId == bytes32(0x00), "Peer already has commitment");

        IMarket.Offer memory offer = market.getOffer(peer.offerId);

        address provider = offer.provider;
        require(provider != address(0x00), "Offer doesn't exist");
        require(msg.sender == provider, "Only provider can create capacity commitment");

        require(duration >= minDuration(), "Duration should be greater than min capacity commitment duration");
        require(rewardDelegationRate > 0, "Reward delegation rate should be greater than 0");
        require(rewardDelegationRate <= PRECISION, "Reward delegation rate should be less or equal 100");

        bytes32 commitmentId =
            keccak256(abi.encodePacked(block.number, peerId, duration, delegator, rewardDelegationRate));
        uint256 collateralPerUnit = fltCollateralPerUnit();
        s.commitments[commitmentId].info = CommitmentInfo({
            status: CCStatus.WaitDelegation,
            peerId: peerId,
            collateralPerUnit: collateralPerUnit,
            duration: duration,
            rewardDelegatorRate: rewardDelegationRate,
            delegator: delegator,
            currentCUSuccessCount: 0,
            totalCUFailCount: 0,
            snapshotEpoch: 0,
            startEpoch: 0,
            withdrawCCEpochAfterFailed: 0,
            failedEpoch: 0,
            remainingFailsForLastEpoch: 0,
            exitedUnitCount: 0,
            totalWithdrawnReward: 0,
            activeUnitCount: 0,
            nextAdditionalActiveUnitCount: 0
        });
        peer.commitmentId = commitmentId;

        emit CommitmentCreated(peerId, commitmentId, duration, delegator, rewardDelegationRate, collateralPerUnit);

        return commitmentId;
    }

    function removeCommitment(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        IMarket.ComputePeer memory peer = core.market().getComputePeer(cc.info.peerId);

        require(cc.info.startEpoch == 0, "Capacity commitment is created");

        delete s.commitments[commitmentId];
        peer.commitmentId = bytes32(0x00);

        emit CommitmentRemoved(commitmentId);
    }

    function depositCollateral(bytes32[] calldata commitmentIds) external payable {
        IMarket market = core.market();

        CommitmentStorage storage s = _getCommitmentStorage();
        uint256 totalValue = msg.value;

        for (uint256 i = 0; i < commitmentIds.length; i++) {
            bytes32 commitmentId = commitmentIds[i];
            Commitment storage cc = s.commitments[commitmentId];

            bytes32 peerId = cc.info.peerId;
            IMarket.ComputePeer memory peer = market.getComputePeer(peerId);

            require(cc.info.startEpoch == 0, "Capacity commitment is created");

            address delegator = cc.info.delegator;
            if (delegator != address(0x00)) {
                require(delegator == msg.sender, "Only delegator can lock collateral");
            } else {
                cc.info.delegator = msg.sender;
            }

            uint256 currentEpoch_ = core.currentEpoch();
            uint256 startEpoch = currentEpoch_ + 1;

            cc.info.startEpoch = startEpoch;
            cc.info.snapshotEpoch = currentEpoch_;

            uint256 unitCount = peer.unitCount;
            uint256 collateral = unitCount * cc.info.collateralPerUnit;
            totalValue -= collateral;

            cc.info.activeUnitCount = unitCount;
            _setActiveUnitCount(activeUnitCount() + unitCount);

            cc.info.status = CCStatus.Active;

            market.setCommitmentId(peerId, commitmentId);

            emit CollateralDeposited(commitmentId, collateral);
            emit CommitmentActivated(
                peerId, commitmentId, startEpoch, startEpoch + cc.info.duration, market.getComputeUnitIds(peerId)
            );
        }
    }

    function finishCommitment(bytes32 commitmentId) external {
        IMarket market = core.market();

        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        bytes32 peerId = cc.info.peerId;
        IMarket.ComputePeer memory peer = market.getComputePeer(peerId);

        uint256 currentEpoch_ = core.currentEpoch();
        uint256 expiredEpoch = _expiredEpoch(cc);
        CCStatus status = _commitCommitmentSnapshot(cc, peer, currentEpoch_ - 1, expiredEpoch);

        require(status == CCStatus.Inactive || status == CCStatus.Failed, "Capacity commitment is active");
        if (status == CCStatus.Failed) {
            require(
                currentEpoch_ >= cc.info.withdrawCCEpochAfterFailed, "Capacity commitment is not ready for withdraw"
            );
        }

        uint256 unitCount = peer.unitCount;
        require(cc.info.exitedUnitCount == unitCount, "Capacity commitment wait compute units");

        cc.info.status = CCStatus.Removed;

        address payable delegator = payable(cc.info.delegator);
        uint256 collateralPerUnit_ = cc.info.collateralPerUnit;

        uint256 totalCollateral = collateralPerUnit_ * unitCount;
        uint256 slashedCollateral = cc.info.totalCUFailCount * collateralPerUnit_;
        totalCollateral -= slashedCollateral;

        market.setCommitmentId(peerId, bytes32(0x00));

        delegator.sendValue(totalCollateral);

        emit CommitmentFinished(commitmentId);
    }

    function submitProof(bytes32 unitId, bytes32 localUnitNonce, bytes32 targetHash) external {
        IMarket market = core.market();

        CommitmentStorage storage s = _getCommitmentStorage();
        IMarket.ComputeUnit memory unit = market.getComputeUnit(unitId);
        IMarket.ComputePeer memory peer = market.getComputePeer(unit.peerId);
        require(peer.owner == msg.sender, "Only compute peer owner can submit proof");

        bytes32 commitmentId = peer.commitmentId;
        Commitment storage cc = s.commitments[commitmentId];
        require(commitmentId != bytes32(0x00), "Compute unit doesn't have commitment");

        uint256 epoch = core.currentEpoch();
        uint256 expiredEpoch = _expiredEpoch(cc);
        require(epoch >= cc.info.startEpoch, "Capacity commitment is not started");

        CCStatus status = _commitCommitmentSnapshot(cc, peer, epoch - 1, expiredEpoch);
        require(status == CCStatus.Active, "Capacity commitment is not active");

        // update global nonce
        if (s.nonceEpochSnapshot != epoch) {
            s.nonceEpochSnapshot = epoch;
            s.globalNonce = s.nextGlobalNonce;
        }
        s.nextGlobalNonce = keccak256(abi.encodePacked(s.globalNonce, blockhash(block.number - 1)));

        // save localUnitNonce
        bytes32 globalUnitNonce_ = keccak256(abi.encodePacked(s.globalNonce, unitId));
        require(!s.isProofSubmittedByUnit[globalUnitNonce_][localUnitNonce], "Proof is already submitted for this unit");
        s.isProofSubmittedByUnit[globalUnitNonce_][localUnitNonce] = true;

        // save info about proof
        UnitProofsInfo storage unitProofsInfo = cc.unitProofsInfoByUnit[unitId];
        uint256 unitProofsCount = unitProofsInfo.proofsCountByEpoch[epoch];
        unitProofsCount += 1;
        if (unitProofsCount > maxProofsPerEpoch()) {
            revert TooManyProofs();
        }

        uint256 minRequierdCCProofs_ = minRequierdProofsPerEpoch();
        if (unitProofsCount == minRequierdCCProofs_) {
            cc.info.currentCUSuccessCount += 1;
            _commitUnitSnapshot(cc, unitProofsInfo, epoch, expiredEpoch, cc.info.failedEpoch);

            uint256 totalSuccessProofs = s.rewardInfoByEpoch[epoch].totalSuccessProofs;
            if (totalSuccessProofs == 0) {
                s.rewardInfoByEpoch[epoch].minRequierdCCProofs = minRequierdCCProofs_;
            }

            s.rewardInfoByEpoch[epoch].totalSuccessProofs = totalSuccessProofs + unitProofsCount;
        } else if (unitProofsCount > minRequierdCCProofs_) {
            s.rewardInfoByEpoch[epoch].totalSuccessProofs += 1;
        }

        unitProofsInfo.proofsCountByEpoch[epoch] = unitProofsCount;

        // check proof
        (bool success, bytes memory randomXTargetHash) = randomXProxy().delegatecall(
            abi.encodeWithSelector(RandomXProxy.run.selector, globalUnitNonce_, localUnitNonce)
        );

        require(success, "RandomXProxy.run failed");
        require(randomXTargetHash.toBytes32() == targetHash, "Proof is not valid");
        require(targetHash <= difficulty(), "Proof is bigger than difficulty");

        emit CommitmentStatsUpdated(
            commitmentId,
            cc.info.totalCUFailCount,
            cc.info.exitedUnitCount,
            cc.info.activeUnitCount,
            cc.info.nextAdditionalActiveUnitCount,
            epoch
        );

        emit ProofSubmitted(commitmentId, unitId, localUnitNonce);
    }

    function removeCUFromCC(bytes32 commitmentId, bytes32[] calldata unitIds) external {
        IMarket market = core.market();

        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        uint256 currentEpoch_ = core.currentEpoch();
        uint256 expiredEpoch = _expiredEpoch(cc);

        bytes32 peerId = cc.info.peerId;
        IMarket.ComputePeer memory peer = market.getComputePeer(peerId);

        CCStatus status = _commitCommitmentSnapshot(cc, peer, currentEpoch_ - 1, expiredEpoch);
        require(status == CCStatus.Inactive || status == CCStatus.Failed, "Capacity commitment is active");

        uint256 failedEpoch = cc.info.failedEpoch;

        for (uint256 i = 0; i < unitIds.length; i++) {
            bytes32 unitId = unitIds[i];
            IMarket.ComputeUnit memory unit = market.getComputeUnit(unitId);

            require(unit.peerId == peerId, "Compute unit doesn't belong to capacity commitment");

            if (unit.deal != address(0x00)) {
                market.returnComputeUnitFromDeal(unitId);
            }

            bool success =
                _commitUnitSnapshot(cc, cc.unitProofsInfoByUnit[unitId], currentEpoch_, expiredEpoch, failedEpoch);
            if (success) {
                cc.info.exitedUnitCount += 1;
            }
        }

        emit CommitmentStatsUpdated(
            commitmentId,
            cc.info.totalCUFailCount,
            cc.info.exitedUnitCount,
            cc.info.activeUnitCount,
            cc.info.nextAdditionalActiveUnitCount,
            currentEpoch_
        );
    }

    function withdrawReward(bytes32 commitmentId) external {
        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        uint256 epoch = core.currentEpoch();

        IMarket market = core.market();
        IMarket.ComputePeer memory peer = market.getComputePeer(cc.info.peerId);

        _commitCommitmentSnapshot(cc, peer, core.currentEpoch() - 1, _expiredEpoch(cc));
        if (cc.info.failedEpoch != 0) {
            epoch = cc.info.failedEpoch;
        }

        // mv find closest min vesting to offchain
        (int256 index, uint256 length) = _findClosestMinVesting(cc.vestings, epoch);
        require(index >= 0, "Nothing to withdraw");

        Vesting storage vesting = cc.vestings[uint256(index)];
        uint256 totalWithdrawnReward = cc.info.totalWithdrawnReward;
        uint256 amount = vesting.cumulativeAmount - totalWithdrawnReward;

        if (uint256(index) == (length - 1)) {
            cc.vestings[cc.vestings.length - 1].cumulativeAmount = 0;
            cc.info.totalWithdrawnReward = 0;
        } else {
            cc.info.totalWithdrawnReward = totalWithdrawnReward + amount;
        }

        uint256 delegatorReward = (amount * cc.info.rewardDelegatorRate) / PRECISION;
        uint256 providerReward = amount - delegatorReward;

        payable(cc.info.delegator).sendValue(delegatorReward);
        payable(market.getOffer(peer.offerId).provider).sendValue(providerReward);

        emit CommitmentStatsUpdated(
            commitmentId,
            cc.info.totalCUFailCount,
            cc.info.exitedUnitCount,
            cc.info.activeUnitCount,
            cc.info.nextAdditionalActiveUnitCount,
            epoch
        );
        emit RewardWithdrawn(commitmentId, amount);
    }
    // #endregion

    // region ----------------- Deal Callbacks -----------------
    function onUnitMovedToDeal(bytes32 commitmentId, bytes32 unitId) external {
        IMarket market = core.market();

        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        IMarket.ComputePeer memory peer = market.getComputePeer(cc.info.peerId);

        UnitProofsInfo storage unitProofsInfo = cc.unitProofsInfoByUnit[unitId];

        uint256 epoch = core.currentEpoch() - 1;
        uint256 expiredEpoch = _expiredEpoch(cc);
        CCStatus status = _commitCommitmentSnapshot(cc, peer, epoch, expiredEpoch);
        require(status == CCStatus.Active, "Capacity commitment is not active");

        _commitUnitSnapshot(cc, unitProofsInfo, epoch, expiredEpoch, cc.info.failedEpoch);

        unitProofsInfo.isInactive = true;
        cc.info.activeUnitCount--;

        _setActiveUnitCount(activeUnitCount() - 1);

        emit CommitmentStatsUpdated(
            commitmentId,
            cc.info.totalCUFailCount,
            cc.info.exitedUnitCount,
            cc.info.activeUnitCount,
            cc.info.nextAdditionalActiveUnitCount,
            epoch
        );
        emit UnitDeactivated(commitmentId, unitId);
    }

    function onUnitReturnedFromDeal(bytes32 commitmentId, bytes32 unitId) external {
        IMarket market = core.market();

        CommitmentStorage storage s = _getCommitmentStorage();
        Commitment storage cc = s.commitments[commitmentId];
        IMarket.ComputePeer memory peer = market.getComputePeer(cc.info.peerId);

        UnitProofsInfo storage unitProofsInfo = cc.unitProofsInfoByUnit[unitId];

        uint256 epoch = core.currentEpoch();
        uint256 expiredEpoch = _expiredEpoch(cc);
        CCStatus status = _commitCommitmentSnapshot(cc, peer, epoch - 1, expiredEpoch);

        unitProofsInfo.isInactive = false;
        unitProofsInfo.lastMinProofsEpoch = epoch;

        emit UnitActivated(commitmentId, unitId, epoch + 1);

        if (status == CCStatus.Inactive || status == CCStatus.Failed) {
            return;
        }

        cc.info.nextAdditionalActiveUnitCount += 1;

        _setActiveUnitCount(activeUnitCount() + 1);

        market.setStartEpoch(unitId, epoch + 1);
        emit CommitmentStatsUpdated(
            commitmentId,
            cc.info.totalCUFailCount,
            cc.info.exitedUnitCount,
            cc.info.activeUnitCount,
            cc.info.nextAdditionalActiveUnitCount,
            epoch
        );
    }
    // #endregion

    // #region ----------------- Internal View -----------------
    function _isFailed(Commitment storage cc, uint256 currentEpoch_) private view returns (bool) {
        IMarket market = core.market();

        IMarket.ComputePeer memory peer = market.getComputePeer(cc.info.peerId);

        (uint256 failedEpoch,,) = _failedEpoch(
            maxFailedRatio(),
            peer.unitCount,
            cc.info.activeUnitCount,
            cc.info.nextAdditionalActiveUnitCount,
            cc.info.totalCUFailCount,
            cc.info.snapshotEpoch
        );

        return currentEpoch_ >= failedEpoch;
    }

    function _failedEpoch(
        uint256 maxFailedRatio_,
        uint256 unitCount_,
        uint256 activeUnitCount_,
        uint256 nextAdditionalActiveUnitCount_,
        uint256 totalCUFailCount_,
        uint256 lastSnapshotEpoch_
    ) private pure returns (uint256 failedEpoch, uint256 remainingFailsForLastEpoch, uint256 maxFails) {
        maxFails = maxFailedRatio_ * unitCount_;
        uint256 remainingFails = 0;
        if (totalCUFailCount_ < maxFails) {
            remainingFails = maxFails - totalCUFailCount_;
        }

        if (activeUnitCount_ > remainingFails) {
            failedEpoch = lastSnapshotEpoch_ + 1;
        } else {
            remainingFails = remainingFails - activeUnitCount_;
            activeUnitCount_ += nextAdditionalActiveUnitCount_;

            failedEpoch = 1 + lastSnapshotEpoch_ + (remainingFails / activeUnitCount_);
        }

        remainingFailsForLastEpoch = remainingFails % activeUnitCount_;
    }

    function _expiredEpoch(Commitment storage cc) private view returns (uint256) {
        return cc.info.startEpoch + cc.info.duration;
    }

    function _findClosestMinVesting(Vesting[] storage vestings, uint256 epoch)
        internal
        view
        returns (int256 index, uint256 length)
    {
        length = vestings.length;
        index = -1;

        if (length == 0) {
            return (index, length);
        }

        uint256 low = 0;
        uint256 high = length - 1;

        while (low <= high) {
            uint256 mid = (low + high) / 2;

            Vesting storage vesting = vestings[mid];
            uint256 vestingEpoch = vesting.epoch;

            if (epoch > vestingEpoch) {
                index = int256(mid);
                low = mid + 1;
            } else if (epoch < vestingEpoch) {
                if (mid == 0) {
                    return (-1, length);
                } else {
                    high = mid - 1;
                }
            } else {
                return (int256(mid), length);
            }
        }
    }
    // #endregion

    // #region ----------------- Internal Mutable -----------------
    function _commitUnitSnapshot(
        Commitment storage cc,
        UnitProofsInfo storage unitProofsInfo,
        uint256 epoch,
        uint256 expiredEpoch,
        uint256 ccFaildEpoch
    ) internal returns (bool) {
        CommitmentStorage storage s = _getCommitmentStorage();

        if (unitProofsInfo.isInactive) {
            return false;
        }

        uint256 prevEpoch = epoch - 1;
        if (prevEpoch > expiredEpoch) {
            prevEpoch = expiredEpoch;
        }

        if (ccFaildEpoch != 0 && prevEpoch > ccFaildEpoch) {
            prevEpoch = ccFaildEpoch;
        }

        uint256 lastMinProofsEpoch = unitProofsInfo.lastMinProofsEpoch;
        if (lastMinProofsEpoch == 0) {
            lastMinProofsEpoch = cc.info.startEpoch - 1;
        }

        if (prevEpoch <= lastMinProofsEpoch) {
            return false;
        }

        uint256 slashedCollateral = unitProofsInfo.slashedCollateral;
        uint256 collateralPerUnit_ = cc.info.collateralPerUnit;
        uint256 currentAmount = collateralPerUnit_ - slashedCollateral;

        uint256 count = prevEpoch - lastMinProofsEpoch;
        uint256 slashingRate_ = slashingRate();
        if (currentAmount > 0) {
            slashedCollateral += (collateralPerUnit_ * count * slashingRate_) / PRECISION;

            if (prevEpoch == ccFaildEpoch) {
                uint256 remainingFailsForLastEpoch = cc.info.remainingFailsForLastEpoch;
                if (remainingFailsForLastEpoch > 0) {
                    slashedCollateral += (collateralPerUnit_ * slashingRate_) / PRECISION;
                    cc.info.remainingFailsForLastEpoch = remainingFailsForLastEpoch - 1;
                }
            }

            unitProofsInfo.slashedCollateral = slashedCollateral;
        }

        unitProofsInfo.lastMinProofsEpoch = prevEpoch;

        RewardInfo storage rewardInfo = s.rewardInfoByEpoch[lastMinProofsEpoch];
        uint256 reward = 0;

        uint256 totalSuccessProofs = rewardInfo.totalSuccessProofs;

        if (totalSuccessProofs == 0) {
            reward = 0;
        } else {
            reward = (
                getRewardPool(lastMinProofsEpoch)
                    * ((unitProofsInfo.proofsCountByEpoch[lastMinProofsEpoch] * PRECISION) / rewardInfo.totalSuccessProofs)
            ) / PRECISION;
        }

        uint256 vestingLength = cc.vestings.length;
        uint256 cumulativeAmount = 0;
        if (vestingLength > 0) {
            cumulativeAmount = cc.vestings[vestingLength - 1].cumulativeAmount;
        }

        cc.vestings.push(Vesting({epoch: prevEpoch + vestingDuration(), cumulativeAmount: cumulativeAmount + reward}));

        delete unitProofsInfo.proofsCountByEpoch[lastMinProofsEpoch];

        return true;
    }

    function _commitCommitmentSnapshot(
        Commitment storage cc,
        IMarket.ComputePeer memory peer,
        uint256 epoch,
        uint256 expiredEpoch
    ) private returns (CCStatus) {
        CCStatus storageStatus = cc.info.status;
        if (storageStatus != CCStatus.Active) {
            return storageStatus;
        }

        uint256 snapshotEpoch = cc.info.snapshotEpoch;
        require(epoch >= snapshotEpoch, "Epoch is too early");

        CCStatus newStatus = CCStatus.Active;
        if (epoch > expiredEpoch) {
            epoch = expiredEpoch;
            newStatus = CCStatus.Inactive;
        }

        uint256 activeUnitCount_ = cc.info.activeUnitCount;
        uint256 epochCount = epoch - snapshotEpoch;
        uint256 reqSuccessCount = activeUnitCount_ * epochCount;
        uint256 totalFailCountByPeriod = reqSuccessCount - cc.info.currentCUSuccessCount;

        uint256 unitCount = peer.unitCount;
        uint256 maxFailedRatio_ = maxFailedRatio();

        uint256 totalCUFailCount = cc.info.totalCUFailCount;
        totalCUFailCount += totalFailCountByPeriod;

        uint256 nextAdditionalActiveUnitCount = cc.info.nextAdditionalActiveUnitCount;

        (uint256 failedEpoch, uint256 remainingFailsForLastEpoch, uint256 maxFails) = _failedEpoch(
            maxFailedRatio_, unitCount, activeUnitCount_, nextAdditionalActiveUnitCount, totalCUFailCount, snapshotEpoch
        );

        if (nextAdditionalActiveUnitCount > 0) {
            cc.info.activeUnitCount += nextAdditionalActiveUnitCount;
            cc.info.nextAdditionalActiveUnitCount = 0;
        }

        if (epoch >= failedEpoch) {
            totalCUFailCount = maxFails;

            cc.info.failedEpoch = failedEpoch;
            cc.info.remainingFailsForLastEpoch = remainingFailsForLastEpoch;
            cc.info.withdrawCCEpochAfterFailed = failedEpoch + withdrawEpochesAfterFailed();

            newStatus = CCStatus.Failed;
        }

        cc.info.totalCUFailCount = totalCUFailCount;
        cc.info.currentCUSuccessCount = 0;
        cc.info.snapshotEpoch = epoch;

        if (newStatus != CCStatus.Active) {
            cc.info.activeUnitCount = 0;
            _setActiveUnitCount(activeUnitCount() - activeUnitCount_);
            cc.info.status = newStatus;
        }

        return newStatus;
    }
    // #endregion
}
