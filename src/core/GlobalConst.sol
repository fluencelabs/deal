// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/utils/OwnableUpgradableDiamond.sol";
import "src/core/EpochController.sol";
import "./interfaces/IGlobalConst.sol";

uint256 constant PRECISION = 10000000; // min: 0.0000001

contract GlobalConst is OwnableUpgradableDiamond, EpochController, IGlobalConst {
    IERC20 public immutable fluenceToken;

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1.globalConst")) - 1);

    struct GlobalConstStorage {
        uint256 minDealDepositedEpoches;
        uint256 minDealRematchingEpoches;
    }

    GlobalConstStorage private _storage;

    function _getGlobalConstStorage() private pure returns (GlobalConstStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Initializer ------------------
    constructor(IERC20 fluenceToken_) {
        fluenceToken = fluenceToken_;
    }

    function __GlobalConst_init(uint256 minDealDepositedEpoches_, uint256 minDealRematchingEpoches_)
        internal
        onlyInitializing
    {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        globalConstantsStorage.minDealDepositedEpoches = minDealDepositedEpoches_;
        globalConstantsStorage.minDealRematchingEpoches = minDealRematchingEpoches_;
    }

    // ------------------ External View Functions ------------------
    function precision() public view override returns (uint256) {
        return PRECISION;
    }

    function minDealDepositedEpoches() public view override returns (uint256) {
        return _getGlobalConstStorage().minDealDepositedEpoches;
    }

    function minDealRematchingEpoches() public view override returns (uint256) {
        return _getGlobalConstStorage().minDealRematchingEpoches;
    }

    // ------------------ External Mutable Functions ------------------
    function setConstant(ConstantType constantType, uint256 v) external onlyOwner {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        if (constantType == ConstantType.MinDealDepositedEpoches) {
            globalConstantsStorage.minDealDepositedEpoches = v;
        } else if (constantType == ConstantType.MinDealRematchingEpoches) {
            globalConstantsStorage.minDealRematchingEpoches = v;
        } else {
            revert("GlobalConst: unknown constant type");
        }

        emit ConstantUpdated(constantType, v);
    }
}
