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

import {Config} from "src/deal/Config.sol";
import {ICore} from "src/core/interfaces/ICore.sol";
import {IConfigWithPublicInternals} from "src/dev/test/interfaces/IConfigWithPublicInternals.sol";
import {IDiamond} from "src/interfaces/IDiamond.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CIDV1} from "src/utils/Common.sol";


contract ConfigWithPublicInternals is Initializable, Config, IConfigWithPublicInternals {
    function Config_init(
        IDiamond diamond_,
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        address owner_,
        AccessType providersAccessType_,
        address[] calldata providersAccessList_
    ) public initializer {
        __Config_init(
            diamond_,
            appCID_,
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            owner_,
            providersAccessType_,
            providersAccessList_
        );
    }

    function diamond() public view returns (IDiamond) {
        return IDiamond(payable(_diamond()));
    }
}
