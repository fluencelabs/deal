// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "src/core/Core.sol";
import "test/utils/DeployDealSystem.sol";

contract OfferTest is Test {
    using SafeERC20 for IERC20;

    DeployDealSystem.Deployment deployment;

    function setUp() external {
        deployment = DeployDealSystem.deployDealSystem();
    }

    function test_OfferDoesNotExist() external {
        vm.expectRevert("Offer doesn't exist");
        deployment.market.getOffer(0);
    }

    function test_ComputePeerDoesNotExist() external {
        vm.expectRevert("Peer doesn't exist");
        deployment.market.getComputePeer(0);
    }

    function test_ComputeUnitDoesNotExist() external {
        vm.expectRevert("Compute unit doesn't exist");
        deployment.market.getComputeUnit(0);
    }

    function test_GetEmptyComputeUnits() external {
        IOffer.ComputeUnitView[] memory units = deployment.market.getComputeUnits(0);
        assertEq(units.length, 0, "Compute units should be empty");
    }

    function test_GetEmptyEffectorInfo() external {
        IOffer.EffectorInfo memory effectorInfo = deployment.market.getEffectorInfo(CIDV1(bytes4(0), bytes32(0)));
        assertEq(effectorInfo.description, "", "Effector description should be empty");
        assertEq(effectorInfo.metadata.prefixes, bytes4(0), "Effector metadata should be empty");
        assertEq(effectorInfo.metadata.hash, bytes32(0), "Effector metadata should be empty");
    }

    function test_SetProviderInfo() external {
        CIDV1 memory metadata = CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)});
        vm.expectRevert("Name should be not empty");
        deployment.market.setProviderInfo("", metadata);

        string memory providerId = "Provider";

        vm.expectEmit(true, false, false, true);
        emit IOffer.ProviderInfoUpdated(address(this), providerId, metadata);
        deployment.market.setProviderInfo(providerId, metadata);

        IOffer.ProviderInfo memory providerInfo = deployment.market.getProviderInfo(address(this));
        assertEq(providerInfo.name, providerId, "Provider description should be equal");
        assertEq(providerInfo.metadata.prefixes, metadata.prefixes, "Provider metadata prefixes should be equal to metadata.prefixes");
        assertEq(providerInfo.metadata.hash, metadata.hash, "Provider metadata hash should be equal to metadata.hash");
        assertFalse(providerInfo.approved, "Provider should not be approved");
    }
}
