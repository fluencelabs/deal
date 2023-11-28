// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "src/dev/TestERC20.sol";
import "src/core/Core.sol";
import "src/deal/Deal.sol";

library DeployDealSystem {
    // ------------------ Types ------------------
    struct Deployment {
        bool initialized;
        IERC20 tFLT;
        IERC20 tUSD;
        Core core;
    }

    // ------------------ Constants ------------------
    uint256 internal constant DEFAULT_EPOCH_DURATION = 1 days;
    uint256 internal constant DEFAULT_MIN_DEPOSITED_EPOCHES = 2;
    uint256 internal constant DEFAULT_MIN_REMATCHING_EPOCHES = 2;

    // ------------------ Variables ------------------
    function deployDealSystem() internal returns (Deployment memory deployment) {
        deployment.tFLT = IERC20(new TestERC20("Test FLT", "tFLT"));
        deployment.tUSD = IERC20(new TestERC20("Test USD", "tUSD"));

        Deal dealImpl = new Deal();
        Core coreImpl = new Core();

        deployment.core = Core(
            address(
                new ERC1967Proxy(address(coreImpl), abi.encodeWithSelector(
                Core.initialize.selector,
                deployment.tFLT,
                DEFAULT_EPOCH_DURATION,
                DEFAULT_MIN_DEPOSITED_EPOCHES,
                DEFAULT_MIN_REMATCHING_EPOCHES,
                dealImpl
                ))
            )
        );

        deployment.initialized = true;
    }
}
