// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import {IEpochController} from "src/core/interfaces/IEpochController.sol";
import {EpochControllerStorage, LibEpochController} from "src/lib/LibEpochController.sol";

abstract contract EpochController is IEpochController {
    // ------------------ View ------------------
    /// @dev This function mirrored in:
    /// @dev - ts-client/src/dealMatcherClient/dealMatcherClient.ts
    /// @dev - subgraph/src/contracts.ts
    function currentEpoch() external view returns (uint256) {
        return LibEpochController.currentEpoch();
    }

    function epochDuration() external view returns (uint256) {
        return LibEpochController.store().epochDuration;
    }

    function initTimestamp() external view returns (uint256) {
        return LibEpochController.store().initTimestamp;
    }
}
