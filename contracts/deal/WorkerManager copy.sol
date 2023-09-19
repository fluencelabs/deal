// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./interfaces/IWorkerManager.sol";

abstract contract WorkerInfoInternal {
    // ------------------ Public View Functions ---------------------
    function _getComputeUnit(bytes32 id) internal view virtual returns (IWorkerManager.ComputeUnit memory);
}
