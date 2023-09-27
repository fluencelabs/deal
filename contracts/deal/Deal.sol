// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./WorkerManager.sol";
import "./interfaces/IDeal.sol";
import "./interfaces/IConfig.sol";
import "../global/interfaces/IGlobalCore.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Deal is WorkerManager, IDeal {
    using BitMaps for BitMaps.BitMap;
    using SafeERC20 for IERC20;

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
        uint256 totalBalance;
        uint256 lockedBalance;
        uint256 maxActiveEpoch;
        uint256 lastFixedEpoch;
        uint256 gapsEpochCount;
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
    function _calculateMaxActiveEpoch(
        uint currentEpoch,
        uint totalBalance,
        uint pricePerWorkerEpoch_,
        uint workerCount
    ) private pure returns (uint256) {
        return currentEpoch + totalBalance / (pricePerWorkerEpoch_ * workerCount);
    }

    function _commitPeriod(Status currentStatus, uint currentEpoch, uint workerCount) private returns (uint256 totalBalance) {
        DealStorage storage dealStorage = _getDealStorage();

        uint lastFixedEpoch = dealStorage.lastFixedEpoch;
        uint maxActiveEpoch = dealStorage.maxActiveEpoch;
        totalBalance = dealStorage.totalBalance;
        uint _pricePerWorkerEpoch = pricePerWorkerEpoch();
        if (currentEpoch <= maxActiveEpoch && currentStatus == IStatusController.Status.ACTIVE) {
            uint amount = (currentEpoch - lastFixedEpoch) * _pricePerWorkerEpoch * workerCount;

            totalBalance -= amount;
            dealStorage.totalBalance = totalBalance;
            dealStorage.lockedBalance += amount;
        } else if (lastFixedEpoch < maxActiveEpoch && currentStatus == IStatusController.Status.ACTIVE) {
            uint amount = (currentEpoch - maxActiveEpoch) * _pricePerWorkerEpoch * workerCount;

            totalBalance -= amount;
            dealStorage.totalBalance = totalBalance;
            dealStorage.lockedBalance += amount;
            dealStorage.gapsEpochCount += currentEpoch - maxActiveEpoch;
        } else {
            // (currentStatus == IStatusController.Status.INACTIVE) or (lastFixedEpoch >= maxActiveEpoch)
            dealStorage.gapsEpochCount += currentEpoch - lastFixedEpoch;
        }

        dealStorage.lastFixedEpoch = lastFixedEpoch;
    }

    // ------------------ Public View Functions ------------------
    function getFreeBalance() public view returns (uint256) {
        DealStorage storage dealStorage = _getDealStorage();

        uint currentEpoch = _globalCore().currentEpoch();
        if (currentEpoch > dealStorage.maxActiveEpoch) {
            return 0;
        }

        return (currentEpoch - dealStorage.lastFixedEpoch) * pricePerWorkerEpoch() * getComputeUnitCount();
    }

    function getRewardAmount(bytes32 computeUnitId) public view returns (uint) {
        IWorkerManager.ComputeUnit memory computeUnit = getComputeUnit(computeUnitId);

        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        uint startedWorkerEpoch = computeUnitPaymentInfo.startedEpoch;

        if (startedWorkerEpoch == 0) {
            startedWorkerEpoch = computeUnit.created;
        }

        uint globalStartedEpoch = startedEpoch();
        if (globalStartedEpoch > startedWorkerEpoch) {
            startedWorkerEpoch = globalStartedEpoch;
        }

        uint currentEpoch = _globalCore().currentEpoch();
        uint maxEpoch = dealStorage.maxActiveEpoch;
        if (maxEpoch > currentEpoch) {
            maxEpoch = currentEpoch;
        }

        uint reward = ((maxEpoch - startedWorkerEpoch) - (dealStorage.gapsEpochCount - computeUnitPaymentInfo.gapsDelta)) *
            pricePerWorkerEpoch();

        return reward;
    }

    // ------------------ Public Mutable Functions ------------------
    function depositToPaymentBalance(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();

        IStatusController.Status status = getStatus();
        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getComputeUnitCount();

        uint totalBalance = _commitPeriod(status, currentEpoch, workerCount);
        totalBalance += amount;

        dealStorage.totalBalance = totalBalance;
        dealStorage.maxActiveEpoch = _calculateMaxActiveEpoch(currentEpoch, totalBalance, pricePerWorkerEpoch(), workerCount);

        paymentToken().safeTransferFrom(msg.sender, address(this), amount);

        emit DepositedToPaymentBalance(amount);
    }

    function withdrawFromPaymentBalance(uint256 amount) external onlyOwner {
        DealStorage storage dealStorage = _getDealStorage();
        IStatusController.Status status = getStatus();
        uint currentEpoch = _globalCore().currentEpoch();

        if (status == IStatusController.Status.ENDED) {
            require(currentEpoch > endedEpoch() + _EPOCH_FOR_ENDING, "Can't withdraw before 2 epochs after deal end");
        }

        uint pricePerWorkerEpoch_ = pricePerWorkerEpoch();
        uint targetWorkers_ = targetWorkers();

        if (status != IStatusController.Status.ENDED) {
            uint minBalance = _MIN_EPOCH_FOR_BALANCE_AMOUNT * pricePerWorkerEpoch_ * targetWorkers_;
            require(minBalance >= _MIN_EPOCH_FOR_BALANCE_AMOUNT, "Free balance needs to cover minimum 2 epochs");
        }

        uint workerCount = getComputeUnitCount();

        uint totalBalance = _commitPeriod(status, currentEpoch, workerCount);
        totalBalance -= amount;

        dealStorage.totalBalance = totalBalance;
        dealStorage.maxActiveEpoch = _calculateMaxActiveEpoch(currentEpoch, totalBalance, pricePerWorkerEpoch_, workerCount);

        paymentToken().safeTransfer(msg.sender, amount);

        emit WithdrawnFromPaymentBalance(amount);
    }

    function withdrawReward(bytes32 computeUnitId) external {
        DealStorage storage dealStorage = _getDealStorage();
        ComputeUnitPaymentInfo storage computeUnitPaymentInfo = dealStorage.cUnitPaymentInfo[computeUnitId];

        uint workerCount = getComputeUnitCount();
        IStatusController.Status status = getStatus();
        uint currentEpoch = _globalCore().currentEpoch();

        //TODO: using _commitPeriod() in this method we have to get storage value again
        _commitPeriod(status, currentEpoch, workerCount);

        //TODO: globalGapsEpoch we need to get from storage again = 100 GAS
        uint globalGapsEpochCount = dealStorage.gapsEpochCount;

        uint reward = (currentEpoch - computeUnitPaymentInfo.startedEpoch) -
            (globalGapsEpochCount - computeUnitPaymentInfo.gapsDelta) *
            pricePerWorkerEpoch();

        require(reward > 0, "No reward");

        computeUnitPaymentInfo.startedEpoch = currentEpoch;
        computeUnitPaymentInfo.gapsDelta = globalGapsEpochCount;

        dealStorage.lockedBalance -= reward;
        paymentToken().safeTransfer(msg.sender, reward);

        emit RewardWithdrawn(computeUnitId, reward);
    }

    function createComputeUnit(address computeProvider, bytes32 peerId) public override(IWorkerManager, WorkerManager) returns (bytes32) {
        DealStorage storage dealStorage = _getDealStorage();

        IStatusController.Status status = getStatus();
        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getComputeUnitCount();

        //TODO: using _commitPeriod() in this method we have to get storage value again
        _commitPeriod(status, currentEpoch, workerCount);
        bytes32 computeUnitId = super.createComputeUnit(computeProvider, peerId);

        dealStorage.maxActiveEpoch = _calculateMaxActiveEpoch(currentEpoch, dealStorage.totalBalance, pricePerWorkerEpoch(), workerCount);

        return computeUnitId;
    }

    function removeWorker(bytes32 computeUnitId) public override(IWorkerManager, WorkerManager) {
        DealStorage storage dealStorage = _getDealStorage();

        IStatusController.Status status = getStatus();
        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getComputeUnitCount();

        //TODO: using _commitPeriod() in this method we have to get storage value again
        _commitPeriod(status, currentEpoch, workerCount);
        super.removeWorker(computeUnitId);

        dealStorage.maxActiveEpoch = _calculateMaxActiveEpoch(currentEpoch, dealStorage.totalBalance, pricePerWorkerEpoch(), workerCount);
    }

    function stop() external onlyOwner {
        IStatusController.Status status = getStatus();
        uint currentEpoch = _globalCore().currentEpoch();
        uint workerCount = getComputeUnitCount();

        _commitPeriod(status, currentEpoch, workerCount);

        DealStorage storage dealStorage = _getDealStorage();
        dealStorage.maxActiveEpoch = currentEpoch;

        _setStatus(IStatusController.Status.ENDED);
    }
}
