// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDeal} from "src/deal/interfaces/IDeal.sol";

struct DealFactoryStorage {
    mapping(IDeal => bool) hasDeal;
}

library LibDealFactory {
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1.dealFactory")) - 1);

    function store() internal pure returns (DealFactoryStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }
}
