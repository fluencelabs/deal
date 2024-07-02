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
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "src/deal/interfaces/IConfig.sol";
import "src/dev/test/interfaces/IConfigWithPublicInternals.sol";

import "test/utils/TestWithDeployment.sol";
import "test/utils/TestHelper.sol";

contract ConfigContract is TestWithDeployment {
    using SafeERC20 for IERC20;

    struct ConfigContractParams {
        ICore globalCore;
        CIDV1 appCID;
        IERC20 paymentToken;
        uint256 minWorkers;
        uint256 targetWorkers;
        uint256 maxWorkersPerProvider;
        uint256 pricePerWorkerEpoch;
        CIDV1[] effectors;
    }

    // ------------------ Variables ------------------
    IConfigWithPublicInternals config;
    ConfigContractParams configParams;

    // ------------------ Test ------------------
    function setUp() public {
        _deploySystem();

        configParams.globalCore = deployment.core;
        configParams.appCID = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("appCID", 0))});
        configParams.paymentToken = IERC20(address(deployment.tUSD));
        configParams.minWorkers = 1;
        configParams.targetWorkers = 2;
        configParams.maxWorkersPerProvider = 3;
        configParams.pricePerWorkerEpoch = 4;

        for (uint256 i = 0; i < 10; i++) {
            configParams.effectors.push(
                CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("effector", i))})
            );
        }

        IConfigWithPublicInternals configImpl =
            IConfigWithPublicInternals(deployCode("out/ConfigWithPublicInternals.sol/ConfigWithPublicInternals.json"));

        config = IConfigWithPublicInternals(
            address(
                new ERC1967Proxy(
                    address(configImpl),
                    abi.encodeWithSelector(
                        configImpl.Config_init.selector,
                        configParams.globalCore,
                        configParams.appCID,
                        configParams.paymentToken,
                        configParams.minWorkers,
                        configParams.targetWorkers,
                        configParams.maxWorkersPerProvider,
                        configParams.pricePerWorkerEpoch,
                        configParams.effectors,
                        address(this),
                        IConfig.AccessType.NONE,
                        new address[](0)
                    )
                )
            )
        );
    }

    function test_InitContract() public {
        assertEq(address(config.globalCore()), address(configParams.globalCore));

        CIDV1 memory appCID = config.appCID();
        assertEq(appCID.prefixes, configParams.appCID.prefixes);
        assertEq(appCID.hash, configParams.appCID.hash);

        assertEq(address(config.paymentToken()), address(configParams.paymentToken));

        assertEq(config.minWorkers(), configParams.minWorkers);
        assertEq(config.targetWorkers(), configParams.targetWorkers);
        assertEq(config.maxWorkersPerProvider(), configParams.maxWorkersPerProvider);
        assertEq(config.pricePerWorkerEpoch(), configParams.pricePerWorkerEpoch);

        CIDV1[] memory effectors = config.effectors();
        assertEq(effectors.length, configParams.effectors.length);
        for (uint256 i = 0; i < configParams.effectors.length; i++) {
            assertEq(effectors[i].prefixes, configParams.effectors[i].prefixes);
            assertEq(effectors[i].hash, configParams.effectors[i].hash);
        }
    }

    function test_SetAppCID() public {
        CIDV1 memory newAppCID =
            CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("newAppCID", 0))});
        config.setAppCID(newAppCID);

        CIDV1 memory appCID = config.appCID();
        assertEq(appCID.prefixes, newAppCID.prefixes);
        assertEq(appCID.hash, newAppCID.hash);
    }
}
