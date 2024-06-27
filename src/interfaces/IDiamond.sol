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
