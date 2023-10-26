// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "../utils/InternalOwnable.sol";

abstract contract GlobalConstants is InternalOwnable, Initializable {
    // ------------------ Events ------------------
    event MinDepositForNewDealUpdated(uint minDepositForNewDeal);

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1.globalConstants")) - 1);

    struct GlobalConstantsStorage {
        address fluenceToken;
        uint minDepositForNewDeal;
    }

    GlobalConstantsStorage private _storage;

    function _getGlobalConstantsStorage() private pure returns (GlobalConstantsStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Constructor ------------------
    // @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ------------------ Initializer ------------------
    function __GlobalConstants_init(address fluenceToken_, uint minDepositForNewDeal_) internal onlyInitializing {
        GlobalConstantsStorage storage globalConstantsStorage = _getGlobalConstantsStorage();

        globalConstantsStorage.fluenceToken = fluenceToken_;
        globalConstantsStorage.minDepositForNewDeal = minDepositForNewDeal_;
    }

    // ------------------ External View Functions ------------------
    function fluenceToken() public view returns (address) {
        return _getGlobalConstantsStorage().fluenceToken;
    }

    function minDepositForNewDeal() public view returns (uint) {
        return _getGlobalConstantsStorage().minDepositForNewDeal;
    }

    // ------------------ External Mutable Functions ------------------
    function setMinDepositForNewDeal(uint minDepositForNewDeal_) external onlyOwner {
        _getGlobalConstantsStorage().minDepositForNewDeal = minDepositForNewDeal_;

        emit MinDepositForNewDealUpdated(minDepositForNewDeal_);
    }
}
