// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./DealStorageUtils.sol";
import "./WorkerManager.sol";
import "./interfaces/IDeal.sol";
import "./interfaces/IConfig.sol";
import "../global/interfaces/IGlobalCore.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Deal is WorkerManager, IDeal {
    using BitMaps for BitMaps.BitMap;
    using SafeERC20 for IERC20;
    using DealStorageUtils for DealStorageUtils.Balance;

    // ------------------ Constants ------------------
    uint256 private constant _MIN_EPOCH_FOR_BALANCE_AMOUNT = 2;
    uint256 private constant _EPOCH_FOR_ENDING = 2;

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
    }

    DealStorage private _storage;

    function _getDealStorage() private pure returns (DealStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Constructor ---------------------
    constructor(IGlobalCore globalCore_) Config(globalCore_) {}

    // ------------------ Init ------------------
    function initialize(
        IERC20 paymentToken_,
        uint256 collateralPerWorker_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        IConfig.AccessType accessType_,
        address[] calldata accessList_,
        address owner_
    ) public initializer {
        __Config_init(
            paymentToken_,
            collateralPerWorker_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            accessType_,
            accessList_,
            owner_
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
        Status currentStatus,
        Status newStatus,
        DealStorageUtils.Balance memory balance,
        uint currentEpoch,
        uint maxPaidEpoch,
        uint lastCommitedEpoch,
        uint currentWorkerCount,
        uint pricePerWorkerEpoch_
    ) private pure {
        if (currentStatus == newStatus && currentStatus == Status.ACTIVE) {
            uint amount = (currentEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

            balance.setTotalBalance(balance.getTotalBalance() - amount);
            balance.setLockedBalance(balance.getLockedBalance() + amount);
        } else if (
            (currentStatus == newStatus && newStatus == IStatusController.Status.ACTIVE) ||
            (currentStatus == IStatusController.Status.INACTIVE && newStatus == IStatusController.Status.ACTIVE)
        ) {
            balance.setGapsEpochCount(balance.getGapsEpochCount() + (currentEpoch - lastCommitedEpoch));
        } else if (currentStatus == Status.ACTIVE && newStatus == Status.INACTIVE) {
            uint amount = (maxPaidEpoch - lastCommitedEpoch) * pricePerWorkerEpoch_ * currentWorkerCount;

            balance.setTotalBalance(balance.getTotalBalance() - amount);
            balance.setLockedBalance(balance.getLockedBalance() + amount);
            balance.setGapsEpochCount(balance.getGapsEpochCount() + (currentEpoch - lastCommitedEpoch));
        }
    }

    function _postCommitPeriod(DealStorageUtils.Balance memory balance, Status currentStatus, Status newStatus, uint currentEpoch) private {
        DealStorage storage dealStorage = _getDealStorage();

        balance.commitToStorage(dealStorage);
        dealStorage.lastCommitedEpoch = currentEpoch;

        //TODO: change status
    }

    // ------------------ Public View Functions ------------------
    function getFreeBalance() public view returns (uint256) {
        DealStorage storage dealStorage = _getDealStorage();

        uint currentEpoch = _globalCore().currentEpoch();
        if (currentEpoch > dealStorage.maxPaidEpoch) {
            return 0;
        }

        return (currentEpoch - dealStorage.lastCommitedEpoch) * pricePerWorkerEpoch() * getComputeUnitCount();
    }

    function getRewardAmount(bytes32 computeUnitId) public view returns (uint) {
        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        IStatusController.Status currentStatus = getStatus(); //TODO
        IStatusController.Status newStatus = getStatus(); //TODO

        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getComputeUnitCount();
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            currentStatus,
            newStatus,
            balance,
            currentEpoch,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            workerCount,
            pricePerWorkerEpoch_
        );

        uint reward = (currentEpoch - computeUnitPaymentInfo.startedEpoch) -
            (balance.getGapsEpochCount() - computeUnitPaymentInfo.gapsDelta) *
            pricePerWorkerEpoch_;

        return reward;
    }

    // ------------------ Public Mutable Functions ------------------
    function deposit(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        IStatusController.Status currentStatus = getStatus(); //TODO
        IStatusController.Status newStatus = getStatus(); //TODO

        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getComputeUnitCount();
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            currentStatus,
            newStatus,
            balance,
            currentEpoch,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            workerCount,
            pricePerWorkerEpoch_
        );

        balance.setTotalBalance(balance.getTotalBalance() + amount);

        dealStorage.maxPaidEpoch = _calculateMaxPaidEpoch(currentEpoch, balance.getTotalBalance(), pricePerWorkerEpoch_, workerCount);

        _postCommitPeriod(balance, currentStatus, newStatus, currentEpoch);

        paymentToken().safeTransferFrom(msg.sender, address(this), amount);

        emit Deposited(amount);
    }

    function withdraw(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        IStatusController.Status currentStatus = getStatus(); //TODO
        IStatusController.Status newStatus = getStatus(); //TODO

        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getComputeUnitCount();
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        if (currentStatus == IStatusController.Status.ENDED) {
            require(currentEpoch > endedEpoch() + _EPOCH_FOR_ENDING, "Can't withdraw before 2 epochs after deal end");
            dealStorage.totalBalance -= amount;
        } else {
            DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
            _preCommitPeriod(
                currentStatus,
                newStatus,
                balance,
                currentEpoch,
                dealStorage.maxPaidEpoch,
                dealStorage.lastCommitedEpoch,
                workerCount,
                pricePerWorkerEpoch_
            );

            balance.setTotalBalance(balance.getTotalBalance() - amount);

            uint minBalance = _MIN_EPOCH_FOR_BALANCE_AMOUNT * pricePerWorkerEpoch_ * targetWorkers();
            require(balance.getTotalBalance() >= minBalance, "Free balance needs to cover minimum 2 epochs");

            dealStorage.maxPaidEpoch = _calculateMaxPaidEpoch(currentEpoch, balance.getTotalBalance(), pricePerWorkerEpoch_, workerCount);
            _postCommitPeriod(balance, currentStatus, newStatus, currentEpoch);
        }

        paymentToken().safeTransfer(msg.sender, amount);

        emit Withdrawn(amount);
    }

    function withdrawRewards(bytes32 computeUnitId) external {
        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        IStatusController.Status currentStatus = getStatus(); //TODO
        IStatusController.Status newStatus = getStatus(); //TODO

        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getComputeUnitCount();
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            currentStatus,
            newStatus,
            balance,
            currentEpoch,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            workerCount,
            pricePerWorkerEpoch_
        );

        uint globalGapsEpochCount = balance.getGapsEpochCount();

        uint reward = (currentEpoch - computeUnitPaymentInfo.startedEpoch) -
            (globalGapsEpochCount - computeUnitPaymentInfo.gapsDelta) *
            pricePerWorkerEpoch_;

        require(reward > 0, "No rewards");

        computeUnitPaymentInfo.startedEpoch = currentEpoch;
        computeUnitPaymentInfo.gapsDelta = globalGapsEpochCount;

        balance.setLockedBalance(balance.getLockedBalance() - reward);

        _postCommitPeriod(balance, currentStatus, newStatus, currentEpoch);

        paymentToken().safeTransfer(msg.sender, reward);

        emit RewardWithdrawn(computeUnitId, reward);
    }

    function createComputeUnit(address computeProvider, bytes32 peerId) public returns (bytes32) {
        DealStorage storage dealStorage = _getDealStorage();

        IStatusController.Status currentStatus = getStatus(); //TODO
        IStatusController.Status newStatus = getStatus(); //TODO

        uint currentEpoch = _globalCore().currentEpoch();
        (bytes32 computeUnitId, uint newComputeUnitCount) = _createComputeUnit(currentEpoch, computeProvider, peerId);
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            currentStatus,
            newStatus,
            balance,
            currentEpoch,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            newComputeUnitCount - 1,
            pricePerWorkerEpoch_
        );

        if (currentStatus == Status.INACTIVE && newComputeUnitCount > minWorkers()) {
            _setStatus(Status.ACTIVE); //TODO: verify other rules
        }

        dealStorage.maxPaidEpoch = _calculateMaxPaidEpoch(
            currentEpoch,
            balance.getTotalBalance(),
            pricePerWorkerEpoch_,
            newComputeUnitCount
        );
        _postCommitPeriod(balance, currentStatus, newStatus, currentEpoch);

        computeUnitPaymentInfo.startedEpoch = currentEpoch;
        computeUnitPaymentInfo.gapsDelta = balance.getGapsEpochCount();

        return computeUnitId;
    }

    function removeWorker(bytes32 computeUnitId) public {
        DealStorage storage dealStorage = _getDealStorage();

        IStatusController.Status currentStatus = getStatus(); //TODO
        IStatusController.Status newStatus = getStatus(); //TODO

        uint currentEpoch = _globalCore().currentEpoch();
        uint newComputeUnitCount = _removeComputeUnit(computeUnitId, currentStatus == Status.ENDED ? endedEpoch() : currentEpoch);
        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        _preCommitPeriod(
            currentStatus,
            newStatus,
            balance,
            currentEpoch,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            newComputeUnitCount + 1,
            pricePerWorkerEpoch_
        );

        if (currentStatus == IStatusController.Status.ACTIVE && newComputeUnitCount < minWorkers()) {
            _setStatus(IStatusController.Status.INACTIVE); //TODO: verify other rules
        }

        dealStorage.maxPaidEpoch = _calculateMaxPaidEpoch(
            currentEpoch,
            balance.getTotalBalance(),
            pricePerWorkerEpoch_,
            newComputeUnitCount
        );
        _postCommitPeriod(balance, currentStatus, newStatus, currentEpoch);
    }

    function stop() external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        IStatusController.Status currentStatus = getStatus(); //TODO
        IStatusController.Status newStatus = getStatus(); //TODO

        DealStorageUtils.Balance memory balance = DealStorageUtils.initCache(dealStorage);
        uint currentEpoch = _globalCore().currentEpoch();
        _preCommitPeriod(
            currentStatus,
            newStatus,
            balance,
            currentEpoch,
            dealStorage.maxPaidEpoch,
            dealStorage.lastCommitedEpoch,
            getComputeUnitCount(),
            pricePerWorkerEpoch()
        );
        _postCommitPeriod(balance, currentStatus, newStatus, currentEpoch);

        dealStorage.maxPaidEpoch = currentEpoch;
        _setStatus(IStatusController.Status.ENDED);
    }
}
