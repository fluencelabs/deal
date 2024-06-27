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

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {OwnableUpgradableDiamond} from "src/utils/OwnableUpgradableDiamond.sol";
import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {ICore} from "src/core/interfaces/ICore.sol";
import {IConfig} from "src/deal/interfaces/IConfig.sol";
import {CIDV1} from "src/utils/Common.sol";
import {DealProxy} from "src/deal/DealProxy.sol";
import {IDealFactory} from "src/core/interfaces/IDealFactory.sol";
import {LibEpochController} from "src/lib/LibEpochController.sol";
import {LibDealFactory, DealFactoryStorage} from "src/lib/LibDealFactory.sol";
import {LibGlobalConst} from "src/lib/LibGlobalConst.sol";

/*
 * @dev On init mas.sender becomes owner.
 */
contract DealFactoryFacet is IDealFactory {
    using SafeERC20 for IERC20;

    function hasDeal(IDeal deal) external view returns (bool) {
        return LibDealFactory.store().hasDeal[deal];
    }

    // ----------------- Mutable -----------------
    function deployDeal(
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 depositAmount_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        IConfig.AccessType providersAccessType_,
        address[] calldata providersAccessList_,
        uint256 protocolVersion_
    ) external returns (IDeal) {
        DealFactoryStorage storage dealFactoryStorage = LibDealFactory.store();

        IDeal deal = IDeal(
            address(
                new DealProxy(
                    ICore(address(this)),
                    abi.encodeWithSelector(
                        IDeal.initialize.selector,
                        address(this),
                        appCID_,
                        paymentToken_,
                        minWorkers_,
                        targetWorkers_,
                        maxWorkersPerProvider_,
                        pricePerWorkerEpoch_,
                        effectors_,
                        providersAccessType_,
                        providersAccessList_,
                        protocolVersion_
                    )
                )
            )
        );

        dealFactoryStorage.hasDeal[deal] = true;

        uint256 minAmount = pricePerWorkerEpoch_ * targetWorkers_ * LibGlobalConst.minDealDepositedEpochs();

        require(depositAmount_ >= minAmount, "Deposit amount is less than minimum required");

        paymentToken_.safeTransferFrom(msg.sender, address(this), depositAmount_);
        paymentToken_.safeApprove(address(deal), depositAmount_);
        deal.deposit(depositAmount_);

        OwnableUpgradableDiamond(address(deal)).transferOwnership(msg.sender);

        emit DealCreated(
            msg.sender,
            deal,
            LibEpochController.currentEpoch(),
            paymentToken_,
            minWorkers_,
            targetWorkers_,
            maxWorkersPerProvider_,
            pricePerWorkerEpoch_,
            effectors_,
            appCID_,
            providersAccessType_,
            providersAccessList_,
            protocolVersion_
        );

        return deal;
    }
}