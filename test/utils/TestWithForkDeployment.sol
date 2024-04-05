// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import "src/core/interfaces/ICore.sol";
import "src/core/interfaces/ICapacityConst.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/market/interfaces/IDealFactory.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/dev/test/MintableTestERC20.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "src/utils/Whitelist.sol";

import "./TestWithDeployment.sol";

import "script/utils/DeploymentJson.sol";

contract TestWithForkDeployment is TestWithDeployment {
    using DeploymentJson for DeploymentJson.DeploymentInfo; 

    DeploymentJson.DeploymentInfo private _deploymentInfo;

    function _deploy() internal override {
        vm.selectFork(vm.createFork("kras"));

        _deploymentInfo.load(vm, "kras");

        deployment.tUSD = IERC20(_deploymentInfo.contracts["axlUSDC"].addr);
        deployment.core = ICore(_deploymentInfo.contracts["Core"].addr);
        deployment.dealImpl = IDeal(_deploymentInfo.contracts["DealImpl"].addr);
        deployment.market = IMarket(_deploymentInfo.contracts["Market"].addr);
        deployment.capacity = ICapacity(_deploymentInfo.contracts["Capacity"].addr);

        deployment.dealFactory = IDealFactory(_deploymentInfo.contracts["DealFactory"].addr);

        deployment.initialized = true;

        MintableTestERC20 fakeERC20 = new MintableTestERC20();
        vm.etch(address(deployment.tUSD), address(fakeERC20).code);
        MintableTestERC20(address(deployment.tUSD)).mint(msg.sender, 100000 * 1e18);

        vm.prank(OwnableUpgradableDiamond(address(deployment.core)).owner());
        Whitelist(address(deployment.core)).grantAccess(msg.sender);

        console.log(Whitelist(address(deployment.core)).isApproved(msg.sender));
        vm.deal(msg.sender, 100000 * 1e18);
    }
}
