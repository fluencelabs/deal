// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/MulticallUpgradeable.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "src/core/interfaces/ICore.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "./DealSnapshot.sol";
import "./WorkerManager.sol";
import "./interfaces/IDeal.sol";
import "./interfaces/IConfig.sol";
import "forge-std/console.sol";

contract Deal is MulticallUpgradeable, WorkerManager, IDeal {
    using SafeERC20 for IERC20;
    using DealSnapshot for DealSnapshot.Cache;

    // ------------------ Types ------------------
    struct ComputeUnitPaymentInfo {
        uint256 snapshotEpoch;
        uint256 gapsDelta;
    }

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1")) - 1);

    struct DealStorage {
        uint256 totalBalance;
        uint256 lockedBalance;
        uint256 gapsEpochCount;
        uint256 maxPaidEpoch;
        uint256 lastCommitedEpoch;
        mapping(bytes32 => ComputeUnitPaymentInfo) cUnitPaymentInfo;
        uint256 endedEpoch;
        uint256 protocolVersion;
    }

    function _getDealStorage() private pure returns (DealStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Modifiers ------------------
    modifier onlyCoreOwner() {
        require(msg.sender == OwnableUpgradableDiamond(address(_globalCore())).owner(), "Only core owner can call");
        _;
    }

    // ------------------ Constructor ---------------------
    constructor() {
        _disableInitializers();
    }

    // ------------------ Init ------------------
    function initialize(
        ICore globalCore_,
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        AccessType providersAccessType_,
        address[] calldata providersAccessList_,
        uint256 protocolVersion_
    ) public initializer {
        __WorkerManager_init(
            globalCore_,
            appCID_,
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            msg.sender,
            providersAccessType_,
            providersAccessList_
        );
        _getDealStorage().protocolVersion = protocolVersion_;
        __Multicall_init();

        uint256 prevEpoch = _globalCore().currentEpoch() - 1;

        DealStorage storage dealStorage = _getDealStorage();
        dealStorage.lastCommitedEpoch = prevEpoch;
    }

    // ------------------ Public View Functions ------------------
    function getStatus() public view returns (Status) {
        DealStorage storage dealStorage = _getDealStorage();

        DealSnapshot.Cache memory snapshot = _preCommitPeriod();

        if (snapshot.isEnded()) {
            return Status.ENDED;
        }

        uint256 maxPaidEpoch = dealStorage.maxPaidEpoch;
        if (maxPaidEpoch != 0 && snapshot.getCurrentEpoch() > maxPaidEpoch) {
            return Status.INSUFFICIENT_FUNDS;
        }

        if (
            snapshot.getTotalBalance()
                < (_globalCore().minDealDepositedEpochs() * snapshot.getPricePerWorkerEpoch() * targetWorkers())
        ) {
            return Status.SMALL_BALANCE;
        } else if (snapshot.getCurrentWorkerCount() < minWorkers()) {
            return Status.NOT_ENOUGH_WORKERS;
        } else {
            return Status.ACTIVE;
        }
    }

    function getFreeBalance() public view returns (uint256) {
        DealSnapshot.Cache memory snapshot = _preCommitPeriod();

        return snapshot.getTotalBalance();
    }

    function getRewardAmount(bytes32 computeUnitId) public view returns (uint256) {
        DealSnapshot.Cache memory snapshot = _preCommitPeriod();
        ComputeUnit memory unit = getComputeUnit(computeUnitId);

        return _getRewardAmount(computeUnitId, unit.workerId, snapshot);
    }

    function getMaxPaidEpoch() public view returns (uint256) {
        return _getDealStorage().maxPaidEpoch;
    }
    // endregion

    function getProtocolVersion() public view returns (uint256) {
        return _getDealStorage().protocolVersion;
    }

    // ------------------ Public Mutable Functions ------------------
    function deposit(uint256 amount) external onlyOwner {
        require(getStatus() != Status.ENDED, "Deal is ended");

        DealSnapshot.Cache memory snapshot = _preCommitPeriod();

        snapshot.setTotalBalance(snapshot.getTotalBalance() + amount);

        _postCommitPeriod(snapshot, snapshot.getCurrentWorkerCount());

        paymentToken().safeTransferFrom(msg.sender, address(this), amount);

        emit Deposited(amount);
    }

    function withdraw(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        DealSnapshot.Cache memory snapshot = _preCommitPeriod();

        uint256 minBalance =
            _globalCore().minDealDepositedEpochs() * snapshot.getPricePerWorkerEpoch() * targetWorkers();
        snapshot.setTotalBalance(snapshot.getTotalBalance() - amount);

        uint256 newTotalBalance = snapshot.getTotalBalance();
        if (snapshot.isEnded() && newTotalBalance < minBalance) {
            require(
                snapshot.getCurrentEpoch() > dealStorage.endedEpoch + _globalCore().minDealDepositedEpochs(),
                "Can't withdraw before minDealDepositedEpochs after deal end"
            );
            dealStorage.totalBalance -= amount;
        } else {
            require(newTotalBalance >= minBalance, "Free balance needs to cover minDealDepositedEpochs");
        }

        _postCommitPeriod(snapshot, snapshot.getCurrentWorkerCount());

        paymentToken().safeTransfer(msg.sender, amount);

        emit Withdrawn(amount);
    }

    function addComputeUnit(address computeProvider, bytes32 computeUnitId, bytes32 peerId) public onlyMarket {
        require(getStatus() != Status.ENDED, "Deal is ended");

        _addComputeUnit(computeProvider, computeUnitId, peerId);
    }

    function setWorker(bytes32 computeUnitId, bytes32 workerId) public {
        require(workerId != bytes32(0), "WorkerId can't be empty");

        DealStorage storage dealStorage = _getDealStorage();

        ICore core = _globalCore();
        ComputeUnit memory unit = getComputeUnit(computeUnitId);
        IMarket.ComputePeer memory marketPeer = core.market().getComputePeer(unit.peerId);

        require(msg.sender == unit.provider || msg.sender == marketPeer.owner, "Only provider or owner can set worker");

        DealSnapshot.Cache memory snapshot = _preCommitPeriod();

        uint256 prevWorkerCount = snapshot.getCurrentWorkerCount();
        uint256 newWorkerCounts = _setWorker(computeUnitId, workerId);

        _postCommitPeriod(snapshot, newWorkerCounts);

        Status status = getStatus();
        require(status != Status.ENDED && status != Status.INSUFFICIENT_FUNDS, "Deal is not active");

        if (prevWorkerCount == newWorkerCounts) {
            return;
        }

        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];
        computeUnitPaymentInfo.snapshotEpoch = snapshot.getSnapshotEpoch();
        computeUnitPaymentInfo.gapsDelta = snapshot.getGapsEpochCount();
    }

    function removeComputeUnit(bytes32 computeUnitId) public onlyMarket {
        DealStorage storage dealStorage = _getDealStorage();

        ComputeUnit memory unit = getComputeUnit(computeUnitId);
        DealSnapshot.Cache memory snapshot = _preCommitPeriod();

        _withdrawReward(computeUnitId, unit.peerId, unit.provider, snapshot);

        uint256 newWorkerCount = _removeComputeUnit(computeUnitId);
        _postCommitPeriod(snapshot, newWorkerCount);

        delete dealStorage.cUnitPaymentInfo[computeUnitId];
    }

    function withdrawRewards(bytes32 computeUnitId) external {
        ComputeUnit memory unit = getComputeUnit(computeUnitId);
        DealSnapshot.Cache memory snapshot = _preCommitPeriod();

        IMarket market = _globalCore().market();
        IMarket.ComputePeer memory marketPeer = market.getComputePeer(unit.peerId);
        IMarket.Offer memory marketOffer = market.getOffer(marketPeer.offerId);

        require(
            marketPeer.owner == msg.sender || marketOffer.provider == msg.sender, "Only provider or owner can withdraw"
        );

        _withdrawReward(computeUnitId, unit.peerId, unit.provider, snapshot);

        _postCommitPeriod(snapshot, snapshot.getCurrentWorkerCount());
    }

    function stop() external onlyOwner {
        require(getStatus() != Status.ENDED, "Deal is not active");
        DealStorage storage dealStorage = _getDealStorage();

        DealSnapshot.Cache memory snapshot = _preCommitPeriod();
        _postCommitPeriod(snapshot, snapshot.getCurrentWorkerCount());

        uint256 currentEpoch = _globalCore().currentEpoch();
        if (dealStorage.maxPaidEpoch > currentEpoch) {
            dealStorage.maxPaidEpoch = currentEpoch;
            emit MaxPaidEpochUpdated(currentEpoch);
        }

        dealStorage.endedEpoch = currentEpoch;
        emit DealEnded(currentEpoch);
    }
    // endregion

    // region ------------------ Privat Functions ------------------

    function _preCommitPeriod() internal view returns (DealSnapshot.Cache memory snapshot) {
        DealStorage storage dealStorage = _getDealStorage();
        uint256 currentEpoch = _globalCore().currentEpoch();
        uint256 commitEpoch = currentEpoch - 1;

        uint256 endedEpoch = dealStorage.endedEpoch;
        bool isEnded = false;
        if (endedEpoch != 0) {
            commitEpoch = endedEpoch;
            isEnded = true;
        }

        uint256 currentWorkerCount = getWorkerCount();
        uint256 pricePerWorkerEpoch_ = pricePerWorkerEpoch();
        snapshot =
            DealSnapshot.init(dealStorage, currentEpoch, commitEpoch, isEnded, pricePerWorkerEpoch_, currentWorkerCount);

        uint256 lastCommitedEpoch = dealStorage.lastCommitedEpoch;
        if (commitEpoch <= lastCommitedEpoch) {
            return snapshot;
        }

        uint256 maxPaidEpoch = dealStorage.maxPaidEpoch;

        // if commitEpoch > maxPaidEpoch, this means that the deposit has run out and we need to write off balance and write gaps
        if (commitEpoch > maxPaidEpoch) {
            // but if lastCommitedEpoch >= maxPaidEpoch this means that we spend balance before and we need only write gaps
            if (lastCommitedEpoch >= maxPaidEpoch) {
                snapshot.setGapsEpochCount(snapshot.getGapsEpochCount() + (commitEpoch - lastCommitedEpoch));
            } else {
                // if lastCommitedEpoch < maxPaidEpoch, this means that we didn't record it before
                uint256 amount = (maxPaidEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

                snapshot.setTotalBalance(snapshot.getTotalBalance() - amount); // write off balance
                snapshot.setLockedBalance(snapshot.getLockedBalance() + amount); // record locked balance for rewards
                snapshot.setGapsEpochCount(snapshot.getGapsEpochCount() + (commitEpoch - maxPaidEpoch)); // write gaps
            }
        } else {
            // commitEpoch <= maxPaidEpoch, this means that we we need to record only active Epochs and write off balances. We don't have a gaps.
            uint256 amount = (commitEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

            snapshot.setTotalBalance(snapshot.getTotalBalance() - amount); // write off balance
            snapshot.setLockedBalance(snapshot.getLockedBalance() + amount); // record locked balance for rewards
        }
    }

    function _postCommitPeriod(DealSnapshot.Cache memory snapshot, uint256 newWorkerCount) internal {
        DealStorage storage dealStorage = _getDealStorage();
        snapshot.commitToStorage(dealStorage);

        uint256 commitEpoch = snapshot.getSnapshotEpoch();
        if (!snapshot.isEnded()) {
            uint256 minWorkerCount = minWorkers();
            if (newWorkerCount >= minWorkerCount) {
                uint256 maxPaidEpoch = commitEpoch;
                maxPaidEpoch =
                    commitEpoch + snapshot.getTotalBalance() / (snapshot.getPricePerWorkerEpoch() * newWorkerCount);

                dealStorage.maxPaidEpoch = maxPaidEpoch;
                emit MaxPaidEpochUpdated(maxPaidEpoch);
            } else if (snapshot.getCurrentWorkerCount() >= minWorkerCount && newWorkerCount < minWorkerCount) {
                dealStorage.maxPaidEpoch = 0;
                emit MaxPaidEpochUpdated(0);
            }
        }

        dealStorage.lastCommitedEpoch = commitEpoch;
    }

    function _getRewardAmount(bytes32 unitId, bytes32 workerId, DealSnapshot.Cache memory snapshot)
        internal
        view
        returns (uint256 reward)
    {
        if (workerId == bytes32(0)) {
            return 0;
        }

        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[unitId];

        uint256 epochs = (snapshot.getSnapshotEpoch() - computeUnitPaymentInfo.snapshotEpoch);
        uint256 gapsDelta = (snapshot.getGapsEpochCount() - computeUnitPaymentInfo.gapsDelta);

        reward = (epochs - gapsDelta) * snapshot.getPricePerWorkerEpoch();
    }

    function _withdrawReward(bytes32 unitId, bytes32 workerId, address provider, DealSnapshot.Cache memory snapshot)
        internal
    {
        uint256 reward = _getRewardAmount(unitId, workerId, snapshot);
        if (reward == 0) {
            return;
        }

        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[unitId];
        computeUnitPaymentInfo.snapshotEpoch = snapshot.getSnapshotEpoch();
        computeUnitPaymentInfo.gapsDelta = snapshot.getGapsEpochCount();

        snapshot.setLockedBalance(snapshot.getLockedBalance() - reward);

        paymentToken().safeTransfer(provider, reward);

        emit RewardWithdrawn(unitId, reward);
    }
    // endregion
}
