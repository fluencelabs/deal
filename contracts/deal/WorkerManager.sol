// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./Config.sol";
import "./interfaces/IWorkerManager.sol";
import "./WorkerInfoInternal.sol";
import "../utils/WithdrawRequests.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract WorkerManager is Config, WorkerInfoInternal, IWorkerManager {
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;
    using WithdrawRequests for WithdrawRequests.Requests;
    using SafeERC20 for IERC20;

    // ------------------ Constants ------------------
    bytes32 private constant _COMPUTE_UNIT_ID_PREFIX = keccak256("fluence.computeUnit");

    // ------------------ Private Vars ------------------
    uint256 private _computeUnitCount;
    LinkedListWithUniqueKeys.Bytes32List private _freeIndexes;
    mapping(address => OwnerInfo) private _ownersInfo;
    mapping(bytes32 => ComputeUnit) private _computeUnitById;
    LinkedListWithUniqueKeys.Bytes32List private _computeUnitsIdsList;
    mapping(address => WithdrawRequests.Requests) private _withdrawRequests;

    // ------------------ Internal View Functions ---------------------
    function _getComputeUnit(bytes32 id) internal view override returns (ComputeUnit memory) {
        return _computeUnitById[id];
    }

    // ------------------ Public View Functions ---------------------
    function getComputeUnit(bytes32 id) external view returns (ComputeUnit memory) {
        return _getComputeUnit(id);
    }

    function getComputeUnitCount() external view returns (uint256) {
        return _computeUnitCount;
    }

    function getComputeUnits() public view returns (ComputeUnit[] memory) {
        ComputeUnit[] memory computeUnits = new ComputeUnit[](_computeUnitCount);

        uint256 index = 0;
        bytes32 computeUnitId = _computeUnitsIdsList.first();
        while (computeUnitId != bytes32(0)) {
            computeUnits[index] = _computeUnitById[computeUnitId];
            index++;

            computeUnitId = _computeUnitsIdsList.next(computeUnitId);
        }

        return computeUnits;
    }

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256) {
        return _withdrawRequests[owner].getAmountBy(timestamp - globalConfig().withdrawTimeout());
    }

    // ------------------ Public Mutable Functions ---------------------
    function createComputeUnit(address computeProvider, bytes32 peerId) external returns (bytes32) {
        uint256 globalComputeUnitCount = _computeUnitCount;
        require(globalComputeUnitCount < targetWorkers(), "Target workers reached");

        // transfer collateral
        uint256 collateral = collateralPerWorker();
        fluenceToken().safeTransferFrom(msg.sender, address(this), collateral);

        // create ComputeUnit
        bytes32 id = keccak256(abi.encodePacked(_COMPUTE_UNIT_ID_PREFIX, computeProvider, peerId));
        require(_computeUnitById[id].owner == address(0x00), "Id already used");

        uint256 computeUnitCountByOwner = _ownersInfo[computeProvider].computeUnitCount;

        _ownersInfo[computeProvider].computeUnitCount = ++computeUnitCountByOwner;
        _computeUnitCount = ++globalComputeUnitCount;

        uint index = uint(_freeIndexes.first());
        if (index == 0) {
            index = globalComputeUnitCount;
        }

        _computeUnitById[id] = ComputeUnit({
            id: id,
            peerId: peerId,
            index: index,
            workerId: bytes32(0),
            owner: computeProvider,
            collateral: collateral,
            created: block.number
        });

        _computeUnitsIdsList.push(id);

        emit ComputeUnitCreated(id, computeProvider);

        return id;
    }

    function setWorker(bytes32 computeUnitId, bytes32 workerId) external {
        ComputeUnit storage computeUnit = _computeUnitById[computeUnitId];

        if (computeUnit.workerId != bytes32(0)) {
            emit WorkerUnregistred(computeUnitId);
        }

        computeUnit.workerId = workerId;

        emit WorkerRegistred(computeUnitId, workerId);
    }

    function exit(bytes32 computeUnitId) external {
        ComputeUnit storage computeUnit = _computeUnitById[computeUnitId];

        // check owner
        address owner = computeUnit.owner;
        require(owner == msg.sender, "ComputeUnit doesn't exist");

        // change computeUnit count
        uint256 newPatCount = _computeUnitCount;
        _ownersInfo[owner].computeUnitCount--;
        _computeUnitCount = --newPatCount;

        // load modules

        // return collateral and index
        _freeIndexes.push(bytes32(computeUnit.index));
        _withdrawRequests[owner].push(computeUnit.collateral);

        // remove ComputeUnit
        delete _computeUnitById[computeUnitId];
        _computeUnitsIdsList.remove(computeUnitId);

        emit ComputeUnitRemoved(computeUnitId);
    }

    function withdrawCollateral(address owner) external {
        IGlobalConfig gConfig = globalConfig();

        uint256 amount = _withdrawRequests[owner].confirmBy(block.timestamp - gConfig.withdrawTimeout());
        gConfig.fluenceToken().safeTransfer(owner, amount);

        emit CollateralWithdrawn(owner, amount);
    }
}
