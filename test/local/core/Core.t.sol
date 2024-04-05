// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "src/core/interfaces/ICore.sol";
import "src/core/interfaces/ICapacityConst.sol";
import "test/utils/TestWithLocalDeployment.sol";

contract CoreTest is TestWithLocalDeployment {
    using SafeERC20 for IERC20;

    event Initialized(uint8 version); // version is 255 for _disableInitializers
    event DealImplSet(IDeal dealImpl);

    error OwnableUnauthorizedAccount(address account);

    address constant NOT_AN_OWNER = address(1234);

    function test_CoreHasInitializedValues() external {
        assertNotEq(address(deployment.core.dealImpl()), address(0), "Deal impl not initialized in Core");
        assertEq(deployment.core.epochDuration(), TestWithLocalDeployment.DEFAULT_EPOCH_DURATION, "Epoch duration not set");
        assertEq(
            deployment.core.minDealDepositedEpochs(),
            TestWithLocalDeployment.DEFAULT_MIN_DEPOSITED_EPOCHS,
            "Min deal deposited Epochs not set"
        );
        assertEq(
            deployment.core.minDealRematchingEpochs(),
            TestWithLocalDeployment.DEFAULT_MIN_REMATCHING_EPOCHS,
            "Min deal rematching Epochs not set"
        );
    }

    function test_InitializerIsDisabledForImplementation() external {
        vm.expectEmit(false, false, false, true);
        emit Initialized(type(uint8).max); // _disableInitializers emits this, @see Initializable.sol

        ICore coreImpl = ICore(deployCode("out/Core.sol/Core.json")); // there is _disableInitializers() in the constructor
        IDeal dealImpl = deployment.core.dealImpl();

        try coreImpl.initialize(
            TestWithLocalDeployment.DEFAULT_EPOCH_DURATION,
            TestWithLocalDeployment.DEFAULT_MIN_DEPOSITED_EPOCHS,
            TestWithLocalDeployment.DEFAULT_MIN_REMATCHING_EPOCHS,
            TestWithLocalDeployment.DEFAULT_MIN_PROTOCOL_VERSION,
            TestWithLocalDeployment.DEFAULT_MAX_PROTOCOL_VERSION,
            dealImpl,
            false,
            ICapacityConst.CapacityConstInitArgs({
                fltPrice: TestWithLocalDeployment.DEFAULT_FLT_PRICE,
                usdCollateralPerUnit: TestWithLocalDeployment.DEFAULT_USD_COLLATERAL_PER_UNIT,
                usdTargetRevenuePerEpoch: TestWithLocalDeployment.DEFAULT_USD_TARGET_REVENUE_PER_EPOCH,
                minDuration: TestWithLocalDeployment.DEFAULT_MIN_DURATION,
                minRewardPerEpoch: TestWithLocalDeployment.DEFAULT_MIN_REWARD_PER_EPOCH,
                maxRewardPerEpoch: TestWithLocalDeployment.DEFAULT_MAX_REWARD_PER_EPOCH,
                vestingPeriodDuration: TestWithLocalDeployment.DEFAULT_VESTING_PERIOD_DURATION,
                vestingPeriodCount: TestWithLocalDeployment.DEFAULT_VESTING_PERIOD_COUNT,
                slashingRate: TestWithLocalDeployment.DEFAULT_SLASHING_RATE,
                minProofsPerEpoch: TestWithLocalDeployment.DEFAULT_MIN_REQUIERD_PROOFS_PER_EPOCH,
                maxProofsPerEpoch: TestWithLocalDeployment.DEFAULT_MAX_PROOFS_PER_EPOCH,
                withdrawEpochsAfterFailed: TestWithLocalDeployment.DEFAULT_WITHDRAW_EPOCHS_AFTER_FAILED,
                maxFailedRatio: TestWithLocalDeployment.DEFAULT_MAX_FAILED_RATIO,
                difficulty: TestWithLocalDeployment.DEFAULT_DIFFICULTY_TARGET,
                initRewardPool: TestWithLocalDeployment.DEFAULT_INIT_REWARD_POOL,
                randomXProxy: deployCode("out/RandomXProxy.sol/RandomXProxy.json"),
                oracle: TestWithLocalDeployment.DEFAULT_ORACLE
            })
        ) {
            assertEq(true, false, "Expected revert");
        } catch Error(string memory reason) {
            assertEq(reason, "Initializable: contract is already initialized");
        }
    }

    function test_InitializeModules() external {
        // initialized in TestWithLocalDeployment, lets's check it
        assertNotEq(address(deployment.core.capacity()), address(0), "Capacity not initialized in Core");
        assertNotEq(address(deployment.core.market()), address(0), "Market not initialized in Core");
        assertNotEq(address(deployment.core.dealFactory()), address(0), "DealFactory not initialized in Core");

        // and try again - shall fail
        vm.expectRevert("Core: modules already initialized");
        deployment.core.initializeModules(ICapacity(address(111)), IMarket(address(222)), IDealFactory(address(333)));
    }

    function test_SetDealImplementation() external {
        vm.expectRevert("New deal implementation is not a contract");
        deployment.core.setDealImpl(IDeal(address(123)));

        IDeal newDealImpl = IDeal(deployCode("out/Deal.sol/Deal.json"));

        // ownable check
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, NOT_AN_OWNER));
        vm.prank(NOT_AN_OWNER);
        deployment.core.setDealImpl(newDealImpl);

        // valid owner
        vm.expectEmit(false, false, false, true);
        emit DealImplSet(newDealImpl);
        deployment.core.setDealImpl(newDealImpl);
    }

    function test_Upgrade() external {
        ICore coreImpl = ICore(deployCode("out/Core.sol/Core.json"));
        UUPSUpgradeable(address(deployment.core)).upgradeTo(address(coreImpl));

        // ownable check
        coreImpl = ICore(deployCode("out/Core.sol/Core.json"));
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, NOT_AN_OWNER));
        vm.prank(NOT_AN_OWNER);
        UUPSUpgradeable(address(deployment.core)).upgradeTo(address(coreImpl));
    }

    function test_GlobalConst() external {
        assertEq(deployment.core.precision(), 10_000_000, "Wrong precision");

        deployment.core.setConstant(IGlobalConst.ConstantType.MinDealDepositedEpochs, 100);
        assertEq(deployment.core.minDealDepositedEpochs(), 100, "Min deal deposited Epochs not set");

        deployment.core.setConstant(IGlobalConst.ConstantType.MinDealRematchingEpochs, 200);
        assertEq(deployment.core.minDealRematchingEpochs(), 200, "Min deal rematching Epochs not set");

        // ownable test
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, NOT_AN_OWNER));
        vm.prank(NOT_AN_OWNER);
        deployment.core.setConstant(IGlobalConst.ConstantType.MinDealDepositedEpochs, 300);

        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, NOT_AN_OWNER));
        vm.prank(NOT_AN_OWNER);
        deployment.core.setConstant(IGlobalConst.ConstantType.MinDealRematchingEpochs, 400);
    }
}
