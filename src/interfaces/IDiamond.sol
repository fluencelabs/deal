// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {ICapacityConst} from "src/core/interfaces/ICapacityConst.sol";

interface IDiamond {
    struct CoreParams {
        uint256 epochDuration;
        IDeal dealImpl;
        bool isWhitelistEnabled;
        ICapacityConst.CapacityConstInitArgs capacityConstInitArgs;
    }

    struct CapacityParams {
        bytes32 initGlobalNonce;
    }

    struct GlobalConstParams {
        uint256 minDealDepositedEpochs;
        uint256 minDealRematchingEpochs;
        uint256 minProtocolVersion;
        uint256 maxProtocolVersion;
    }

    fallback() external payable;

    receive() external payable;
}
