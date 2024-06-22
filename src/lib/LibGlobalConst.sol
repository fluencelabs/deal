// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct GlobalConstStorage {
    uint256 minDealDepositedEpochs;
    uint256 minDealRematchingEpochs;
    uint256 minProtocolVersion;
    uint256 maxProtocolVersion;
}

library LibGlobalConst {
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1.globalConst")) - 1);

    function store() internal pure returns (GlobalConstStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function minDealDepositedEpochs() internal view returns (uint256) {
        return store().minDealDepositedEpochs;
    }

    function minDealRematchingEpochs() internal view returns (uint256) {
        return store().minDealRematchingEpochs;
    }

    function minProtocolVersion() internal view returns (uint256) {
        return store().minProtocolVersion;
    }

    function maxProtocolVersion() internal view returns (uint256) {
        return store().maxProtocolVersion;
    }
}
