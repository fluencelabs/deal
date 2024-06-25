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

import {Test} from "forge-std/Test.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CIDV1} from "src/utils/Common.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {ICore} from "src/core/interfaces/ICore.sol";
import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {IConfig} from "src/deal/interfaces/IConfig.sol";
import {IDealFactory} from "src/core/interfaces/IDealFactory.sol";
import {IDiamond} from "src/interfaces/IDiamond.sol";
import {IGlobalConst} from "src/core/interfaces/IGlobalConst.sol";

import "./TestWithDeployment.sol";

library TestHelper {
    struct DealParams {
        CIDV1 appCID;
        IERC20 paymentToken;
        uint256 minWorkers;
        uint256 targetWorkers;
        uint256 maxWorkersPerProvider;
        uint256 pricePerWorkerEpoch;
        CIDV1[] effectors;
        uint256 protocolVersion;
    }

    struct DeployDealParams {
        uint256 minWorkers;
        uint256 maxWorkersPerProvider;
        uint256 targetWorkers;
        uint256 pricePerWorkerEpoch;
        uint256 depositAmount;
        uint256 protocolVersion;
    }

    function pseudoRandom(bytes memory seed) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(blockhash(block.number - 1), seed));
    }

    function generateProviders(uint256 count)
        internal
        view
        returns (address[] memory computeProviders, bytes32[] memory peerIds, bytes32[] memory unitIds)
    {
        computeProviders = new address[](count);
        peerIds = new bytes32[](count);
        unitIds = new bytes32[](count);

        for (uint256 i = 0; i < count; i++) {
            computeProviders[i] = address(bytes20(pseudoRandom(abi.encode("provider", i))));
            peerIds[i] = pseudoRandom(abi.encode("peerId", i));
            unitIds[i] = pseudoRandom(abi.encode("unitId", i));
        }
    }

    function deployDeal(TestWithDeployment.Deployment storage deployment, DeployDealParams memory params)
        internal
        returns (IDeal, DealParams memory)
    {
        CIDV1[] memory effectors = new CIDV1[](10);
        for (uint256 i = 0; i < 10; i++) {
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("effector", i))});
        }

        CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("appCID", 0))});

        DealParams memory dealParams = DealParams({
            appCID: appCID,
            paymentToken: IERC20(address(deployment.tUSD)),
            minWorkers: params.minWorkers,
            targetWorkers: params.targetWorkers,
            maxWorkersPerProvider: params.maxWorkersPerProvider,
            pricePerWorkerEpoch: params.pricePerWorkerEpoch,
            effectors: effectors,
            protocolVersion: params.protocolVersion
        });

        IDeal deal = IDealFactory(address(deployment.diamond)).deployDeal(
            dealParams.appCID,
            dealParams.paymentToken,
            params.depositAmount,
            dealParams.minWorkers,
            dealParams.targetWorkers,
            dealParams.maxWorkersPerProvider,
            dealParams.pricePerWorkerEpoch,
            effectors,
            IConfig.AccessType.NONE,
            new address[](0),
            dealParams.protocolVersion
        );

        return (deal, dealParams);
    }

    function deployDealWithoutFactory(
        TestWithDeployment.Deployment storage deployment,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        uint256 deposit_
    ) internal returns (IDeal) {
        ERC1967Proxy proxy = new ERC1967Proxy(
            address(deployment.dealImpl),
            abi.encodeWithSelector(
                IDeal.initialize.selector,
                deployment.diamond,
                CIDV1({prefixes: 0x12345678, hash: pseudoRandom(abi.encode("appCID", 0))}),
                IERC20(address(deployment.tUSD)),
                minWorkers_,
                targetWorkers_,
                maxWorkersPerProvider_,
                pricePerWorkerEpoch_,
                new CIDV1[](0),
                IConfig.AccessType.NONE,
                new address[](0),
                1
            )
        );

        IDeal deal = IDeal(address(proxy));

        deployment.tUSD.approve(address(deal), deposit_);
        deal.deposit(deposit_);

        return deal;
    }

    function deployDealWithoutFactory(
        TestWithDeployment.Deployment storage deployment,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_
    ) internal returns (IDeal) {
        uint256 deposit_ = IGlobalConst(address(deployment.diamond)).minDealDepositedEpochs() * pricePerWorkerEpoch_ * targetWorkers_;
        return deployDealWithoutFactory(
            deployment, minWorkers_, targetWorkers_, maxWorkersPerProvider_, pricePerWorkerEpoch_, deposit_
        );
    }
}
