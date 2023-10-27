// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./DealStorageUtils.sol";
import "./WorkerManager.sol";
import "./interfaces/IDeal.sol";
import "./interfaces/IConfig.sol";
import "../core/interfaces/ICore.sol";
import "../utils/OwnableUpgradableDiamond.sol";

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract Deal is UUPSUpgradeable, WorkerManager, IDeal {
    using BitMaps for BitMaps.BitMap;
    using SafeERC20 for IERC20;
    using DealStorageUtils for DealStorageUtils.Balance;

    // ------------------ Constants ------------------
    uint256 private constant _MIN_DPOSITED_EPOCHS = 2;
    uint256 private constant _WAIT_EPOCHS_AFTER_ENDING = 2;

    // ------------------ Types ------------------
    struct ComputeUnitPaymentInfo {
        uint256 startedEpoch;
        uint256 gapsDelta;
    }

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1.deal")) - 1);

    struct DealStorage {
        uint totalBalance;
        uint lockedBalance;
        uint gapsEpochCount;
        uint256 maxPaidEpoch;
        uint256 lastCommitedEpoch;
        mapping(bytes32 => ComputeUnitPaymentInfo) cUnitPaymentInfo;
        bool isEnded;
        uint endedEpoch;
    }

    DealStorage private _storage;

    function _getDealStorage() private pure returns (DealStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Constructor ---------------------
    constructor(ICore globalCore_) Config(globalCore_) {
        _disableInitializers();
    }

    // ------------------ Init ------------------
    function initialize(
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        IConfig.AccessType accessType_,
        address[] calldata accessList_
    ) public initializer {
        __Config_init(
            appCID_,
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            accessType_,
            accessList_,
            msg.sender
        );
    }

    // ------------------ Privat Functions ------------------
    function _calculateMaxPaidEpoch(
        uint currentEpoch,
        uint totalBalance,
        uint pricePerWorkerEpoch_,
        uint workerCount
    ) private pure returns (uint256) {
        return currentEpoch + totalBalance / (pricePerWorkerEpoch_ * workerCount);
    }

    function _preCommitPeriod(
        DealStorageUtils.Balance memory balance,
        uint currentEpoch,
        uint maxPaidEpoch,
        uint lastCommitedEpoch,
        uint currentWorkerCount,
        uint pricePerWorkerEpoch_
    ) private pure {
        if (maxPaidEpoch != 0 && currentEpoch > maxPaidEpoch && maxPaidEpoch > lastCommitedEpoch) {
            uint amount = (maxPaidEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

            balance.setTotalBalance(balance.getTotalBalance() - amount);
            balance.setLockedBalance(balance.getLockedBalance() + amount);
            balance.setGapsEpochCount(balance.getGapsEpochCount() + (currentEpoch - maxPaidEpoch));
        } else if (maxPaidEpoch == 0 || (currentEpoch > maxPaidEpoch && lastCommitedEpoch >= maxPaidEpoch)) {
            balance.setGapsEpochCount(balance.getGapsEpochCount() + (currentEpoch - lastCommitedEpoch));
        } else if (maxPaidEpoch != 0 && currentEpoch <= maxPaidEpoch) {
            uint amount = (currentEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

            balance.setTotalBalance(balance.getTotalBalance() - amount);
            balance.setLockedBalance(balance.getLockedBalance() + amount);
        }
    }

    function _postCommitPeriod(
        DealStorageUtils.Balance memory balance,
        uint currentEpoch,
        uint prevWorkerCount,
        uint newWorkerCount,
        uint minWorkerCount,
        uint pricePerWorkerEpoch_
    ) private {
        DealStorage storage dealStorage = _getDealStorage();

        if (prevWorkerCount >= minWorkerCount && newWorkerCount < minWorkerCount) {
            dealStorage.maxPaidEpoch = 0;
            emit MaxPaidEpochUpdated(0);
        } else if (newWorkerCount >= minWorkerCount) {
            uint maxPaidEpoch = _calculateMaxPaidEpoch(currentEpoch, balance.getTotalBalance(), pricePerWorkerEpoch_, newWorkerCount);
            dealStorage.maxPaidEpoch = maxPaidEpoch;

            emit MaxPaidEpochUpdated(maxPaidEpoch);
        }

        balance.commitToStorage(dealStorage);
        dealStorage.lastCommitedEpoch = currentEpoch;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    // ------------------ Public View Functions ------------------
    function getStatus() public view returns (Status) {
        DealStorage storage dealStorage = _getDealStorage();

        if (dealStorage.isEnded) {
            return Status.ENDED;
        }

        if (getWorkerCount() < minWorkers()) {
            return Status.INACTIVE;
        } else if (_globalCore().currentEpoch() > dealStorage.maxPaidEpoch) {
            return Status.INACTIVE;
        } else {
            return Status.ACTIVE;
        }
    }

    function getFreeBalance() public view returns (uint256) {
        DealStorage storage dealStorage = _getDealStorage();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            balance,
            _globalCore().currentEpoch(),
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            getWorkerCount(),
            pricePerWorkerEpoch()
        );

        return balance.getTotalBalance();
    }

    function getRewardAmount(bytes32 computeUnitId) public view returns (uint) {
        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getWorkerCount();
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(balance, currentEpoch, dealStorage.maxPaidEpoch, dealStorage.lastCommitedEpoch, workerCount, pricePerWorkerEpoch_);

        uint reward = ((currentEpoch - computeUnitPaymentInfo.startedEpoch) -
            (balance.getGapsEpochCount() - computeUnitPaymentInfo.gapsDelta)) * pricePerWorkerEpoch_;

        return reward;
    }

    function getMaxPaidEpoch() public view returns (uint256) {
        return _getDealStorage().maxPaidEpoch;
    }

    // ------------------ Public Mutable Functions ------------------
    function deposit(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getWorkerCount();
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        uint maxPaidEpoch = dealStorage.maxPaidEpoch;

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(balance, currentEpoch, maxPaidEpoch, dealStorage.lastCommitedEpoch, workerCount, pricePerWorkerEpoch_);

        balance.setTotalBalance(balance.getTotalBalance() + amount);

        _postCommitPeriod(balance, currentEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch_);

        paymentToken().safeTransferFrom(msg.sender, address(this), amount);

        emit Deposited(amount);
    }

    function withdraw(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getWorkerCount();
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        if (dealStorage.isEnded) {
            require(currentEpoch > dealStorage.endedEpoch + _WAIT_EPOCHS_AFTER_ENDING, "Can't withdraw before 2 epochs after deal end");
            dealStorage.totalBalance -= amount;
        } else {
            DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
            _preCommitPeriod(
                balance,
                currentEpoch,
                dealStorage.maxPaidEpoch,
                dealStorage.lastCommitedEpoch,
                workerCount,
                pricePerWorkerEpoch_
            );

            balance.setTotalBalance(balance.getTotalBalance() - amount);

            uint minBalance = _MIN_DPOSITED_EPOCHS * pricePerWorkerEpoch_ * targetWorkers();
            require(balance.getTotalBalance() >= minBalance, "Free balance needs to cover minimum 2 epochs");

            _postCommitPeriod(balance, currentEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch_);
        }

        paymentToken().safeTransfer(msg.sender, amount);

        emit Withdrawn(amount);
    }

    function withdrawRewards(bytes32 computeUnitId) external {
        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getWorkerCount();
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(balance, currentEpoch, dealStorage.maxPaidEpoch, dealStorage.lastCommitedEpoch, workerCount, pricePerWorkerEpoch_);

        uint globalGapsEpochCount = balance.getGapsEpochCount();

        uint reward = ((currentEpoch - computeUnitPaymentInfo.startedEpoch) - (globalGapsEpochCount - computeUnitPaymentInfo.gapsDelta)) *
            pricePerWorkerEpoch_;

        require(reward > 0, "No rewards");

        computeUnitPaymentInfo.startedEpoch = currentEpoch;
        computeUnitPaymentInfo.gapsDelta = globalGapsEpochCount;

        balance.setLockedBalance(balance.getLockedBalance() - reward);

        //TODO: fix double check prev state
        _postCommitPeriod(balance, currentEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch_);

        paymentToken().safeTransfer(msg.sender, reward);

        emit RewardWithdrawn(computeUnitId, reward);
    }

    function setWorker(bytes32 computeUnitId, bytes32 workerId) public {
        DealStorage storage dealStorage = _getDealStorage();

        //TODO: fix double get worker count
        uint prevWorkerCount = getWorkerCount();
        uint newWorkerCounts = _setWorker(computeUnitId, workerId);

        uint currentEpoch = _globalCore().currentEpoch();
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        uint maxPaidEpoch = dealStorage.maxPaidEpoch;
        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(balance, currentEpoch, maxPaidEpoch, dealStorage.lastCommitedEpoch, prevWorkerCount, pricePerWorkerEpoch_);

        _postCommitPeriod(balance, currentEpoch, prevWorkerCount, newWorkerCounts, minWorkers(), pricePerWorkerEpoch_);

        computeUnitPaymentInfo.startedEpoch = currentEpoch;
        computeUnitPaymentInfo.gapsDelta = balance.getGapsEpochCount();
    }

    function removeComputeUnit(bytes32 computeUnitId) public {
        DealStorage storage dealStorage = _getDealStorage();

        uint currentEpoch = _globalCore().currentEpoch();
        //TODO: fix double get worker count
        uint prevWorkerCount = getWorkerCount();
        uint newWorkerCount = _removeComputeUnit(computeUnitId);
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();
        uint maxPaidEpoch = _getDealStorage().maxPaidEpoch;

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(balance, currentEpoch, maxPaidEpoch, dealStorage.lastCommitedEpoch, prevWorkerCount, pricePerWorkerEpoch_);

        _postCommitPeriod(balance, currentEpoch, prevWorkerCount, newWorkerCount, minWorkers(), pricePerWorkerEpoch_);
    }

    function stop() external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        uint currentEpoch = _globalCore().currentEpoch();
        uint maxPaidEpoch = _getDealStorage().maxPaidEpoch;

        uint workerCount = getWorkerCount();

        _preCommitPeriod(balance, currentEpoch, maxPaidEpoch, dealStorage.lastCommitedEpoch, workerCount, pricePerWorkerEpoch());
        _postCommitPeriod(balance, currentEpoch, workerCount, workerCount, minWorkers(), pricePerWorkerEpoch());

        //TODO: fix double write maxPaidEpoch
        dealStorage.maxPaidEpoch = 0;
        emit MaxPaidEpochUpdated(currentEpoch);

        dealStorage.isEnded = true;
        dealStorage.endedEpoch = currentEpoch;

        emit DealEnded(currentEpoch);
    }
}
