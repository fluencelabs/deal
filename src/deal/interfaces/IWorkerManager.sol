// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/utils/LinkedListWithUniqueKeys.sol";

interface IWorkerManager {
    // ------------------ Types ------------------
    struct ComputeUnit {
        bytes32 id;
        bytes32 workerId;
        bytes32 peerId;
        address provider;
        uint256 joinedEpoch;
    }

    // ------------------ Events ------------------
    event ComputeUnitJoined(bytes32 unitId);
    event ComputeUnitRemoved(bytes32 unitId);
    event WorkerIdUpdated(bytes32 computeUnitId, bytes32 workerId);

    // ------------------ Public View Functions ---------------------
    function getComputeUnit(bytes32 id) external view returns (ComputeUnit memory);
    function getComputeUnitCount() external view returns (uint256);
    function getComputeUnitCount(address provider) external view returns (uint256);
    function getComputeUnits() external view returns (ComputeUnit[] memory);
    function getWorkerCount() external view returns (uint256);
    function isComputePeerExist(bytes32 peerId) external view returns (bool);
}
