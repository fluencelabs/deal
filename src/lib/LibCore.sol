// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDeal} from "src/deal/interfaces/IDeal.sol";

struct CoreStorage {
    IDeal dealImpl;
}

library LibCore {
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1")) - 1);

    function store() internal pure returns (CoreStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function dealImpl() internal view returns (IDeal) {
        return store().dealImpl;
    }
}
