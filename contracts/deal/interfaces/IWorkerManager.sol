// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "../../utils/LinkedListWithUniqueKeys.sol";

interface IWorkerManager {
    // ------------------ Types ------------------
    struct ComputeUnit {
        bytes32 id;
        bytes32 workerId;
        address owner;
        uint256 joinedEpoch;
    }

    // ------------------ Events ------------------
    event ComputeUnitJoined(bytes32 unitId);
    event ComputeUnitExited(bytes32 unitId);

    event WorkerIdUpdated(bytes32 computeUnitId, bytes32 workerId);

    // ------------------ Public View Functions ---------------------
    function getComputeUnit(bytes32 id) external view returns (ComputeUnit memory);

    function getComputeUnitCount() external view returns (uint256);

    function getComputeUnits() external view returns (ComputeUnit[] memory);

    function getWorkerCount() external view returns (uint256);

    // ------------------ Public Mutable Functions ---------------------
    function addComputeUnit(address computeProvider, bytes32 peerId) external returns (bytes32);

    function removeComputeUnit(bytes32 computeUnitId) external;

    function setWorker(bytes32 computeUnitId, bytes32 workerId) external;
}
