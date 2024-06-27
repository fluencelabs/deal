// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import {IGlobalConst} from "src/core/interfaces/IGlobalConst.sol";
import {GlobalConstStorage, LibGlobalConst} from "src/lib/LibGlobalConst.sol";
import {CapacityConst} from "src/core/CapacityConst.sol";
import {LibDiamond} from "src/lib/LibDiamond.sol";
import {PRECISION} from "src/utils/Common.sol";


abstract contract GlobalConst is IGlobalConst, CapacityConst {
    function precision() public pure override returns (uint256) {
        return PRECISION;
    }

    function minDealDepositedEpochs() external view override returns (uint256) {
        return LibGlobalConst.minDealDepositedEpochs();
    }

    function minDealRematchingEpochs() external view override returns (uint256) {
        return LibGlobalConst.minDealRematchingEpochs();
    }

    function minProtocolVersion() external view override returns (uint256) {
        return LibGlobalConst.minProtocolVersion();
    }

    function maxProtocolVersion() external view override returns (uint256) {
        return LibGlobalConst.maxProtocolVersion();
    }

    function setConstant(ConstantType constantType, uint256 v) external {
        LibDiamond.enforceIsContractOwner();
        GlobalConstStorage storage globalConstantsStorage = LibGlobalConst.store();

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
