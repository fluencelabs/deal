// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {CIDV1} from "src/utils/Common.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {IConfig} from "src/deal/interfaces/IConfig.sol";
import {IDiamond} from "src/interfaces/IDiamond.sol";
import {IConfigWithPublicInternals} from "src/dev/test/interfaces/IConfigWithPublicInternals.sol";
import {TestWithDeployment} from "test/utils/TestWithDeployment.sol";
import {TestHelper} from "test/utils/TestHelper.sol";


contract ConfigContract is TestWithDeployment {
    using SafeERC20 for IERC20;

    struct ConfigContractParams {
        IDiamond diamond;
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

        configParams.diamond = deployment.diamond;
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
                        configParams.diamond,
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
        assertEq(address(config.diamond()), address(configParams.diamond));

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
