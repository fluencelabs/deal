// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./Config.sol";
import "./interfaces/IWorkerManager.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract WorkerManager is Config, IWorkerManager {
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;
    using SafeERC20 for IERC20;

    // ------------------ Types ------------------
    struct ComputeProviderInfo {
        uint256 computeUnitCount;
        LinkedListWithUniqueKeys.Bytes32List computeUnitsIds;
    }

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.deal.storage.v1.workerManager")) - 1);

    struct WorkerManagerStorage {
        // global area
        uint256 computeUnitCount;
        uint256 workerCount;
        mapping(address => ComputeProviderInfo) computeProviderInfo;
        // compute units area
        mapping(bytes32 => ComputeUnit) computeUnitById;
        LinkedListWithUniqueKeys.Bytes32List computeUnitsIdsList;
        mapping(bytes32 => uint256) collateralWithdrawEpochByComputeUnitId;
    }

    WorkerManagerStorage private _storage;

    function _getWorkerManagerStorage() private pure returns (WorkerManagerStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;

        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Constants ------------------
    bytes32 private constant _COMPUTE_UNIT_ID_PREFIX = keccak256("fluence.computeUnit.");
    uint256 private constant _WITHDRAW_EPOCH_TIMEOUT = 2;

    // ------------------ Internal View Functions ------------------
    function _calculateUnitId(address computeProvider, bytes32 peerId) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_COMPUTE_UNIT_ID_PREFIX, computeProvider, peerId));
    }

    // ------------------ Internal Mutable Functions ------------------

    function _setWorker(bytes32 computeUnitId, bytes32 workerId) internal returns (uint256) {
        WorkerManagerStorage storage workerStorage = _getWorkerManagerStorage();
        ComputeUnit storage computeUnit = workerStorage.computeUnitById[computeUnitId];

        require(workerId != bytes32(0), "WorkerId can't be empty");

        uint workerCount = workerStorage.workerCount;
        if (computeUnit.workerId == bytes32(0)) {
            workerCount++;
            workerStorage.workerCount = workerCount;
        }

        computeUnit.workerId = workerId;

        emit WorkerIdUpdated(computeUnitId, workerId);

        return workerCount;
    }

    function _removeComputeUnit(bytes32 computeUnitId, uint lastWorkedEpoch) public returns (uint workerCount) {
        WorkerManagerStorage storage workerStorage = _getWorkerManagerStorage();

        // check owner
        address computeProvider = workerStorage.computeUnitById[computeUnitId].owner;
        require(computeProvider != address(0x00), "ComputeUnit not found");
        require(computeProvider == msg.sender || msg.sender == owner(), "Only provider or deal owner can remove worker");

        // change computeUnit count
        uint256 newComputeUnitCount = workerStorage.computeUnitCount;
        workerStorage.computeProviderInfo[computeProvider].computeUnitCount--;
        workerStorage.computeUnitCount = --newComputeUnitCount;

        workerStorage.collateralWithdrawEpochByComputeUnitId[computeUnitId] = lastWorkedEpoch + _WITHDRAW_EPOCH_TIMEOUT;

        // remove ComputeUnit
        workerStorage.computeUnitsIdsList.remove(computeUnitId);

        workerCount = workerStorage.workerCount;
        if (workerStorage.computeUnitById[computeUnitId].workerId != bytes32(0)) {
            workerCount--;
            workerStorage.workerCount = workerCount;
        }

        emit ComputeUnitRemoved(computeUnitId);

        return workerCount;
    }

    // ------------------ Public View Functions ---------------------
    function hasPeer(address computeProvider, bytes32 peerId) public view returns (bool) {
        bytes32 computeUnitId = _calculateUnitId(computeProvider, peerId);
        return _getWorkerManagerStorage().computeUnitById[computeUnitId].peerId != bytes32(0);
    }

    function getComputeUnit(bytes32 id) public view returns (ComputeUnit memory) {
        return _getWorkerManagerStorage().computeUnitById[id];
    }

    function getComputeUnitCount() public view returns (uint256) {
        return _getWorkerManagerStorage().computeUnitCount;
    }

    function getComputeUnits() public view returns (ComputeUnit[] memory) {
        WorkerManagerStorage storage workerStorage = _getWorkerManagerStorage();

        ComputeUnit[] memory computeUnits = new ComputeUnit[](workerStorage.computeUnitCount);

        uint256 index = 0;
        bytes32 computeUnitId = workerStorage.computeUnitsIdsList.first();
        while (computeUnitId != bytes32(0)) {
            computeUnits[index] = workerStorage.computeUnitById[computeUnitId];
            index++;

            computeUnitId = workerStorage.computeUnitsIdsList.next(computeUnitId);
        }

        return computeUnits;
    }

    function getWorkerCount() public view returns (uint256) {
        return _getWorkerManagerStorage().workerCount;
    }

    function getUnlockCollateralEpoch(bytes32 computeUnitId) external view returns (uint256) {
        return _getWorkerManagerStorage().collateralWithdrawEpochByComputeUnitId[computeUnitId];
    }

    // ------------------ Public Mutable Functions ---------------------

    function createComputeUnit(address computeProvider, bytes32 peerId) public returns (bytes32) {
        WorkerManagerStorage storage workerStorage = _getWorkerManagerStorage();

        // check target compute units count
        uint256 globalComputeUnitCount = workerStorage.computeUnitCount;
        require(globalComputeUnitCount < targetWorkers(), "Target units reached");

        // check peerId isn't exist
        bytes32 id = _calculateUnitId(computeProvider, peerId);
        require(workerStorage.computeUnitById[id].owner == address(0x00), "Id already used");

        // check max units per compute provider
        uint256 computeUnitCountByCP = workerStorage.computeProviderInfo[computeProvider].computeUnitCount;
        require(computeUnitCountByCP < maxWorkersPerProvider(), "Max units per compute provider reached");

        // increase computeUnit count
        workerStorage.computeProviderInfo[computeProvider].computeUnitCount = ++computeUnitCountByCP;
        workerStorage.computeUnitCount = ++globalComputeUnitCount;

        // get required collateral
        uint256 collateral = collateralPerWorker();

        // create ComputeUnit
        workerStorage.computeUnitById[id] = ComputeUnit({
            id: id,
            peerId: peerId,
            workerId: bytes32(0),
            owner: computeProvider,
            collateral: collateral,
            created: _globalCore().currentEpoch()
        });

        // add ComputeUnit to list
        workerStorage.computeUnitsIdsList.push(id);

        emit ComputeUnitCreated(id, computeProvider);

        // transfer collateral
        fluenceToken().safeTransferFrom(msg.sender, address(this), collateral);

        return id;
    }

    function withdrawCollateral(bytes32 computeUnitId) external {
        WorkerManagerStorage storage workerStorage = _getWorkerManagerStorage();

        require(
            workerStorage.collateralWithdrawEpochByComputeUnitId[computeUnitId] <= _globalCore().currentEpoch(),
            "Collateral not available"
        );

        // get collateral and compute provider
        uint256 amount = workerStorage.computeUnitById[computeUnitId].collateral;
        address computeProvider = workerStorage.computeUnitById[computeUnitId].owner;

        // reset collateral withdraw info
        workerStorage.collateralWithdrawEpochByComputeUnitId[computeUnitId] = 0;

        // transfer collateral
        fluenceToken().safeTransfer(computeProvider, amount);

        delete workerStorage.computeUnitById[computeUnitId];

        emit CollateralWithdrawn(computeProvider, amount);
    }
}
