// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/utils/OwnableUpgradableDiamond.sol";
import "src/core/EpochController.sol";
import "./CapacityConst.sol";
import "./interfaces/IGlobalConst.sol";
import "./interfaces/ICapacityConst.sol";

uint256 constant PRECISION = 10000000; // min: 0.0000001

contract GlobalConst is IGlobalConst, CapacityConst {
    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.core.storage.v1.globalConst")) - 1);

    struct GlobalConstStorage {
        uint256 minDealDepositedEpochs;
        uint256 minDealRematchingEpochs;
        uint256 minProtocolVersion;
        uint256 maxProtocolVersion;
    }

    function _getGlobalConstStorage() private pure returns (GlobalConstStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ------------------ Initializer ------------------
    function __GlobalConst_init(
        uint256 minDealDepositedEpochs_,
        uint256 minDealRematchingEpochs_,
        uint256 minProtocolVersion_,
        uint256 maxProtocolVersion_
    ) internal onlyInitializing {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        globalConstantsStorage.minDealDepositedEpochs = minDealDepositedEpochs_;
        globalConstantsStorage.minDealRematchingEpochs = minDealRematchingEpochs_;
        globalConstantsStorage.minProtocolVersion = minProtocolVersion_;
        globalConstantsStorage.maxProtocolVersion = maxProtocolVersion_;
    }

    // ------------------ External View Functions ------------------
    function precision() public pure override returns (uint256) {
        return PRECISION;
    }

    function minDealDepositedEpochs() public view override returns (uint256) {
        return _getGlobalConstStorage().minDealDepositedEpochs;
    }

    function minDealRematchingEpochs() public view override returns (uint256) {
        return _getGlobalConstStorage().minDealRematchingEpochs;
    }

    function minProtocolVersion() public view override returns (uint256) {
        return _getGlobalConstStorage().minProtocolVersion;
    }

    function maxProtocolVersion() public view override returns (uint256) {
        return _getGlobalConstStorage().maxProtocolVersion;
    }

    // ------------------ External Mutable Functions ------------------
    function setConstant(ConstantType constantType, uint256 v) external onlyOwner {
        GlobalConstStorage storage globalConstantsStorage = _getGlobalConstStorage();

        if (constantType == ConstantType.MinDealDepositedEpochs) {
            globalConstantsStorage.minDealDepositedEpochs = v;
        } else if (constantType == ConstantType.MinDealRematchingEpochs) {
            globalConstantsStorage.minDealRematchingEpochs = v;
        } else {
            revert("GlobalConst: unknown constant type");
        }

        emit ConstantUpdated(constantType, v);
    }
}
