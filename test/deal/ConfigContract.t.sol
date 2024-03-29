// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "forge-std/console.sol";
import "src/deal/interfaces/IConfig.sol";
import "test/utils/DeployDealSystem.sol";
import "test/utils/TestHelper.sol";

contract ConfigContract is Test {
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

    // ------------------ Types ------------------
    struct DealParams {
        CIDV1 appCID;
        IERC20 paymentToken;
        uint256 minWorkers;
        uint256 targetWorkers;
        uint256 maxWorkersPerProvider;
        uint256 pricePerWorkerEpoch;
        CIDV1[] effectors;
    }

    // ------------------ Variables ------------------
    DeployDealSystem.Deployment deployment;
    ConfigTestContract config;
    ConfigContractParams configParams;

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();

        CIDV1[] memory effectors = new CIDV1[](10);
        for (uint256 i = 0; i < 10; i++) {
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("effector", i))});
        }

        configParams = ConfigContractParams({
            globalCore: deployment.core,
            appCID: CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("appCID", 0))}),
            paymentToken: IERC20(address(deployment.tUSD)),
            minWorkers: 1,
            targetWorkers: 2,
            maxWorkersPerProvider: 3,
            pricePerWorkerEpoch: 4,
            effectors: effectors
        });

        ConfigTestContract configImpl = new ConfigTestContract();

        ERC1967Proxy proxy = new ERC1967Proxy(
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
        );

        config = ConfigTestContract(address(proxy));
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

contract ConfigTestContract is Initializable, Config {
    function Config_init(
        ICore globalCore_,
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
            globalCore_,
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

    function globalCore() public view returns (ICore) {
        return _globalCore();
    }
}
