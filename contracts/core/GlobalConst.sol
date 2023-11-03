// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "../utils/OwnableUpgradableDiamond.sol";
import "./interfaces/IGlobalConst.sol";

contract GlobalConst is OwnableUpgradableDiamond, IGlobalConst {
    enum Constant {
        MinDepositedEpoches,
        MinRematchingEpoches
    }

    // ------------------ Events ------------------
    event ConstantsUpdated(Constant constantType, uint value);

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1.globalConstants")) - 1);

    struct GlobalConstStorage {
        address fluenceToken;
        uint minDepositedEpoches;
        uint minRematchingEpoches;
    }

    GlobalConstStorage private _storage;

    function _getGlobalConstStorage() private pure returns (GlobalConstStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Initializer ------------------
    function __GlobalConst_init(address fluenceToken_, uint minDepositedEpoches_, uint minRematchingEpoches_) internal onlyInitializing {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        globalConstantsStorage.fluenceToken = fluenceToken_;
        globalConstantsStorage.minDepositedEpoches = minDepositedEpoches_;
        globalConstantsStorage.minRematchingEpoches = minRematchingEpoches_;
    }

    // ------------------ External View Functions ------------------
    function fluenceToken() public view returns (address) {
        return _getGlobalConstStorage().fluenceToken;
    }

    function minDepositedEpoches() public view returns (uint) {
        return _getGlobalConstStorage().minDepositedEpoches;
    }

    function minRematchingEpoches() public view returns (uint) {
        return _getGlobalConstStorage().minRematchingEpoches;
    }

    // ------------------ External Mutable Functions ------------------
    function setConstant(Constant constantType, uint256 v) external onlyOwner {
        if (constantType == Constant.MinDepositedEpoches) {
            _getGlobalConstStorage().minDepositedEpoches = v;
        } else if (constantType == Constant.MinRematchingEpoches) {
            _getGlobalConstStorage().minRematchingEpoches = v;
        } else {
            revert("GlobalConst: unknown constant type");
        }

        emit ConstantsUpdated(constantType, v);
    }
}
