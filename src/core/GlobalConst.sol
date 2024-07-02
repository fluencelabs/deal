/*
 * Fluence Compute Marketplace
 *
 * Copyright (C) 2024 Fluence DAO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

pragma solidity ^0.8.19;

import "./CapacityConst.sol";
import "./interfaces/IGlobalConst.sol";


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
