// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct MatcherStorage {
    mapping(address => uint256) lastMatchedEpoch;
}

library LibMatcher {
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1.matcher")) - 1);


    function store() internal pure returns (MatcherStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }
}
