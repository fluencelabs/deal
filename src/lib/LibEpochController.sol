// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct EpochControllerStorage {
    uint256 initTimestamp;
    uint256 epochDuration;
}

library LibEpochController {
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1.epochController")) - 1);

    function store() internal pure returns (EpochControllerStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function currentEpoch() internal view returns (uint256) {
        EpochControllerStorage storage epochControllerStorage = store();
        return 1 + (block.timestamp - epochControllerStorage.initTimestamp) / epochControllerStorage.epochDuration;
    }
}
