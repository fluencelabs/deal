// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct WhitelistStorage {
    bool isWhitelistEnabled;
    mapping(address => bool) isWhitelisted;
}

library LibWhitelist {
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.whitelist.storage.v1")) - 1);

    function store() internal pure returns (WhitelistStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function isApproved(address account) internal view returns (bool) {
        WhitelistStorage storage s = store();
        return !s.isWhitelistEnabled || s.isWhitelisted[account];
    }
}
