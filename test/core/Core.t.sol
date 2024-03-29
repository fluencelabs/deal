// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "src/core/Core.sol";
import "test/utils/DeployDealSystem.sol";

contract CoreTest is Test {
    using SafeERC20 for IERC20;

    event Initialized(uint8 version); // version is 255 for _disableInitializers
    event DealImplSet(IDeal dealImpl);

    error OwnableUnauthorizedAccount(address account);

    address constant NOT_AN_OWNER = address(1234);

    DeployDealSystem.Deployment deployment;

    function setUp() external {
        deployment = DeployDealSystem.deployDealSystem();
    }

    function test_CoreHasInitializedValues() external {
        assertNotEq(address(deployment.core.dealImpl()), address(0), "Deal impl not initialized in Core");
        assertEq(deployment.core.epochDuration(), DeployDealSystem.DEFAULT_EPOCH_DURATION, "Epoch duration not set");
        assertEq(
            deployment.core.minDealDepositedEpochs(),
            DeployDealSystem.DEFAULT_MIN_DEPOSITED_EPOCHS,
            "Min deal deposited Epochs not set"
        );
        assertEq(
            deployment.core.minDealRematchingEpochs(),
            DeployDealSystem.DEFAULT_MIN_REMATCHING_EPOCHS,
            "Min deal rematching Epochs not set"
        );
    }

    function test_InitializerIsDisabledForImplementation() external {
        address randomX = address(new RandomXProxy());
        vm.expectEmit(false, false, false, true);
        emit Initialized(type(uint8).max); // _disableInitializers emits this, @see Initializable.sol
        Core coreImpl = new Core(); // there is _disableInitializers() in the constructor
        IDeal dealImpl = deployment.core.dealImpl();
        vm.expectRevert("Initializable: contract is already initialized");
        coreImpl.initialize(
            DeployDealSystem.DEFAULT_EPOCH_DURATION,
            DeployDealSystem.DEFAULT_MIN_DEPOSITED_EPOCHS,
            DeployDealSystem.DEFAULT_MIN_REMATCHING_EPOCHS,
            DeployDealSystem.DEFAULT_MIN_PROTOCOL_VERSION,
            DeployDealSystem.DEFAULT_MAX_PROTOCOL_VERSION,
            dealImpl,
            false,
            DeployDealSystem.DEFAULT_FLT_PRICE,
            DeployDealSystem.DEFAULT_USD_COLLATERAL_PER_UNIT,
            DeployDealSystem.DEFAULT_USD_TARGET_REVENUE_PER_EPOCH,
            DeployDealSystem.DEFAULT_MIN_DURATION,
            DeployDealSystem.DEFAULT_MIN_REWARD_PER_EPOCH,
            DeployDealSystem.DEFAULT_MAX_REWARD_PER_EPOCH,
            DeployDealSystem.DEFAULT_VESTING_PERIOD_DURATION,
            DeployDealSystem.DEFAULT_VESTING_PERIOD_COUNT,
            DeployDealSystem.DEFAULT_SLASHING_RATE,
            DeployDealSystem.DEFAULT_MIN_REQUIERD_PROOFS_PER_EPOCH,
            DeployDealSystem.DEFAULT_MAX_PROOFS_PER_EPOCH,
            DeployDealSystem.DEFAULT_WITHDRAW_EPOCHS_AFTER_FAILED,
            DeployDealSystem.DEFAULT_MAX_FAILED_RATIO,
            DeployDealSystem.DEFAULT_DIFFICULTY_TARGET,
            DeployDealSystem.DEFAULT_INIT_REWARD_POOL,
            randomX
        );
    }

    function test_InitializeModules() external {
        // initialized in DeployDealSystem, lets's check it
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

        IDeal newDealImpl = new Deal();

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
        Core coreImpl = new Core();
        deployment.core.upgradeTo(address(coreImpl));

        // ownable check
        coreImpl = new Core();
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, NOT_AN_OWNER));
        vm.prank(NOT_AN_OWNER);
        deployment.core.upgradeTo(address(coreImpl));
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
