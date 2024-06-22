// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./interfaces/IGlobalConst.sol";
import {GlobalConstStorage, LibGlobalConst} from "../lib/LibGlobalConst.sol";
import {CapacityConst} from "./CapacityConst.sol";
import {LibDiamond} from "src/lib/LibDiamond.sol";
import {PRECISION} from "src/utils/Common.sol";


contract GlobalConst is IGlobalConst, CapacityConst {
    function precision() public pure override returns (uint256) {
        return PRECISION;
    }

    function minDealDepositedEpochs() public view override returns (uint256) {
        return LibGlobalConst.store().minDealDepositedEpochs;
    }

    function minDealRematchingEpochs() public view override returns (uint256) {
        return LibGlobalConst.store().minDealRematchingEpochs;
    }

    function minProtocolVersion() public view override returns (uint256) {
        return LibGlobalConst.store().minProtocolVersion;
    }

    function maxProtocolVersion() public view override returns (uint256) {
        return LibGlobalConst.store().maxProtocolVersion;
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
