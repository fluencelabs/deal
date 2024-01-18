// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Config.sol";
import "./interfaces/IDeal.sol";
import "./interfaces/IWorkerManager.sol";

contract WorkerManager is Config, IWorkerManager {
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;
    using SafeERC20 for IERC20;

    // ------------------ Types ------------------
    struct ComputeProviderInfo {
        uint256 computeUnitCount;
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
        mapping(bytes32 => bool) isComputePeerExist;
        LinkedListWithUniqueKeys.Bytes32List computeUnitsIdsList;
    }

    WorkerManagerStorage private _storage;

    function _getWorkerManagerStorage() private pure returns (WorkerManagerStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;

        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Initializer ------------------
    function __WorkerManager_init(
        ICore globalCore_,
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        address owner_,
        AccessType providersAccessType_,
        address[] calldata providersAccessList_
    ) internal onlyInitializing {
        __Config_init(
            globalCore_,
            appCID_,
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            owner_,
            providersAccessType_,
            providersAccessList_
        );

        __WorkerManager_init_unchained();
    }

    function __WorkerManager_init_unchained() internal onlyInitializing {}

    // ------------------ Internal Mutable Functions ------------------
    function _setWorker(bytes32 computeUnitId, bytes32 workerId) internal returns (uint256) {
        WorkerManagerStorage storage workerStorage = _getWorkerManagerStorage();
        ComputeUnit storage computeUnit = workerStorage.computeUnitById[computeUnitId];

        require(workerId != bytes32(0), "WorkerId can't be empty");

        uint256 workerCount = workerStorage.workerCount;
        if (computeUnit.workerId == bytes32(0)) {
            workerCount++;
            workerStorage.workerCount = workerCount;
        }

        computeUnit.workerId = workerId;

        emit WorkerIdUpdated(computeUnitId, workerId);

        return workerCount;
    }

    function _addComputeUnit(address computeProvider, bytes32 computeUnit, bytes32 peerId) internal {
        WorkerManagerStorage storage workerStorage = _getWorkerManagerStorage();

        // check target compute units count
        uint256 globalComputeUnitCount = workerStorage.computeUnitCount;
        require(globalComputeUnitCount < targetWorkers(), "Target units reached");

        // check peerId isn't exist
        bytes32 id = computeUnit;
        require(workerStorage.computeUnitById[id].provider == address(0x00), "Id already used");

        require(workerStorage.isComputePeerExist[peerId] == false, "PeerId already used");
        workerStorage.isComputePeerExist[peerId] = true;

        // check max units per compute provider
        uint256 computeUnitCountByCP = workerStorage.computeProviderInfo[computeProvider].computeUnitCount;
        require(computeUnitCountByCP < maxWorkersPerProvider(), "Max units per compute provider reached");

        // increase computeUnit count
        workerStorage.computeProviderInfo[computeProvider].computeUnitCount = ++computeUnitCountByCP;
        workerStorage.computeUnitCount = ++globalComputeUnitCount;

        // create ComputeUnit
        workerStorage.computeUnitById[id] = ComputeUnit({
            id: id,
            workerId: bytes32(0),
            peerId: peerId,
            provider: computeProvider,
            joinedEpoch: _globalCore().currentEpoch()
        });

        // add ComputeUnit to list
        workerStorage.computeUnitsIdsList.push(id);

        emit ComputeUnitJoined(id);
    }

    function _removeComputeUnit(bytes32 computeUnitId) internal returns (uint256 workerCount) {
        WorkerManagerStorage storage workerStorage = _getWorkerManagerStorage();

        // check owner
        ComputeUnit memory computeUnit = workerStorage.computeUnitById[computeUnitId];
        address computeProvider = computeUnit.provider;
        require(computeProvider != address(0x00), "ComputeUnit not found");

        // change computeUnit count
        uint256 newComputeUnitCount = workerStorage.computeUnitCount;
        workerStorage.computeProviderInfo[computeProvider].computeUnitCount--;
        workerStorage.computeUnitCount = --newComputeUnitCount;

        workerCount = workerStorage.workerCount;
        if (workerStorage.computeUnitById[computeUnitId].workerId != bytes32(0)) {
            workerCount--;
            workerStorage.workerCount = workerCount;
        }

        workerStorage.isComputePeerExist[computeUnit.peerId] = false;

        // remove ComputeUnit
        delete workerStorage.computeUnitById[computeUnitId];
        workerStorage.computeUnitsIdsList.remove(computeUnitId);

        emit ComputeUnitRemoved(computeUnitId);

        return workerCount;
    }

    // ------------------ Public View Functions ---------------------
    function getComputeUnit(bytes32 id) public view returns (ComputeUnit memory) {
        return _getWorkerManagerStorage().computeUnitById[id];
    }

    function getComputeUnitCount() public view returns (uint256) {
        return _getWorkerManagerStorage().computeUnitCount;
    }

    function getComputeUnitCount(address provider) public view returns (uint256) {
        return _getWorkerManagerStorage().computeProviderInfo[provider].computeUnitCount;
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

    function isComputePeerExist(bytes32 peerId) external view returns (bool) {
        return _getWorkerManagerStorage().isComputePeerExist[peerId];
    }
}
