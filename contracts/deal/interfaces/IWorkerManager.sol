// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "../../utils/LinkedListWithUniqueKeys.sol";

interface IWorkerManager {
    // ------------------ Types ------------------
    struct ComputeUnit {
        bytes32 id;
        bytes32 peerId;
        bytes32 workerId;
        address owner;
        uint256 collateral;
        uint256 created;
    }

    // ------------------ Events ------------------
    event ComputeUnitCreated(bytes32 id, address owner);
    event ComputeUnitRemoved(bytes32 id);

    event WorkerIdUpdated(bytes32 computeUnitId, bytes32 workerId);
    event WorkerRemoved(bytes32 computeUnitId);

    event CollateralWithdrawn(address owner, uint256 amount);

    // ------------------ Public View Functions ---------------------
    function getComputeUnit(bytes32 id) external view returns (ComputeUnit memory);

    function getComputeUnitCount() external view returns (uint256);

    function getComputeUnits() external view returns (ComputeUnit[] memory);

    function getUnlockCollateralEpoch(bytes32 computeUnitId) external view returns (uint256);

    // ------------------ Public Mutable Functions ---------------------
    function createComputeUnit(address computeProvider, bytes32 peerId) external returns (bytes32);

    function setWorker(bytes32 computeUnitId, bytes32 workerId) external;

    function removeWorker(bytes32 computeUnitId) external;

    function withdrawCollateral(bytes32 computeUnitId) external;
}
