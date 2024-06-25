// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "src/core/interfaces/ICore.sol";
import "src/core/interfaces/ICapacityConst.sol";
import "test/utils/TestWithDeployment.sol";

contract CoreTest is TestWithDeployment {
    using SafeERC20 for IERC20;

    event Initialized(uint8 version); // version is 255 for _disableInitializers
    event DealImplSet(IDeal dealImpl);

    error OwnableUnauthorizedAccount(address account);

    address constant NOT_AN_OWNER = address(1234);

    function setUp() external {
        _deploySystem();
    }

    function test_CoreHasInitializedValues() external {
        assertNotEq(address(deployment.diamondAsCore.dealImpl()), address(0), "Deal impl not initialized in Core");
        assertEq(deployment.diamondAsCore.epochDuration(), TestWithDeployment.DEFAULT_EPOCH_DURATION, "Epoch duration not set");
        assertEq(
            deployment.diamondAsCore.minDealDepositedEpochs(),
            TestWithDeployment.DEFAULT_MIN_DEPOSITED_EPOCHS,
            "Min deal deposited Epochs not set"
        );
        assertEq(
            deployment.diamondAsCore.minDealRematchingEpochs(),
            TestWithDeployment.DEFAULT_MIN_REMATCHING_EPOCHS,
            "Min deal rematching Epochs not set"
        );
    }

    function test_SetDealImplementation() external {
        vm.expectRevert("New deal implementation is not a contract");
        deployment.diamondAsCore.setDealImpl(IDeal(address(123)));

        IDeal newDealImpl = IDeal(deployCode("out/Deal.sol/Deal.json"));

        // ownable check
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, NOT_AN_OWNER));
        vm.prank(NOT_AN_OWNER);
        deployment.diamondAsCore.setDealImpl(newDealImpl);

        // valid owner
        vm.expectEmit(false, false, false, true);
        emit DealImplSet(newDealImpl);
        deployment.diamondAsCore.setDealImpl(newDealImpl);
    }

    // TODO test diamond cut

    function test_GlobalConst() external {
        assertEq(deployment.diamondAsCore.precision(), 10_000_000, "Wrong precision");

        deployment.diamondAsCore.setConstant(IGlobalConst.ConstantType.MinDealDepositedEpochs, 100);
        assertEq(deployment.diamondAsCore.minDealDepositedEpochs(), 100, "Min deal deposited Epochs not set");

        deployment.diamondAsCore.setConstant(IGlobalConst.ConstantType.MinDealRematchingEpochs, 200);
        assertEq(deployment.diamondAsCore.minDealRematchingEpochs(), 200, "Min deal rematching Epochs not set");

        // ownable test
        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, NOT_AN_OWNER));
        vm.prank(NOT_AN_OWNER);
        deployment.diamondAsCore.setConstant(IGlobalConst.ConstantType.MinDealDepositedEpochs, 300);

        vm.expectRevert(abi.encodeWithSelector(OwnableUnauthorizedAccount.selector, NOT_AN_OWNER));
        vm.prank(NOT_AN_OWNER);
        deployment.diamondAsCore.setConstant(IGlobalConst.ConstantType.MinDealRematchingEpochs, 400);
    }
}
