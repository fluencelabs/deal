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
import "src/core/modules/market/Market.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/capacity/Capacity.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";

library DeployDealSystem {
    // ------------------ Types ------------------
    struct Deployment {
        bool initialized;
        IERC20 tFLT;
        IERC20 tUSD;
        Core core;
        Market market;
        Capacity capacity;
    }

    // ------------------ Constants ------------------
    uint256 public constant DEFAULT_EPOCH_DURATION = 1 days;
    uint256 public constant DEFAULT_FLT_PRICE = 10 * PRECISION; // 10 USD
    uint256 public constant DEFAULT_MIN_DEPOSITED_EPOCHES = 2;
    uint256 public constant DEFAULT_MIN_REMATCHING_EPOCHES = 2;
    uint256 public constant DEFAULT_USD_COLLATERAL_PER_UNIT = 100 * PRECISION; // 100 USD
    uint256 public constant DEFAULT_USD_TARGET_REVENUE_PER_EPOCH = 10 * PRECISION; // 10 USD
    uint256 public constant DEFAULT_MIN_DURATION = 100; // 100 epochs
    uint256 public constant DEFAULT_MIN_REWARD_PER_EPOCH = 10000;
    uint256 public constant DEFAULT_MAX_REWARD_PER_EPOCH = 1;
    uint256 public constant DEFAULT_VESTING_DURATION = 2 days;
    uint256 public constant DEFAULT_SLASHING_RATE = 100000; // 0.01 = 1% = 100000
    uint256 public constant DEFAULT_MIN_REQUIERD_PROOFS_PER_EPOCH = 3;
    uint256 public constant DEFAULT_MAX_PROOFS_PER_EPOCH = 5;
    uint256 public constant DEFAULT_WITHDRAW_EPOCHES_AFTER_FAILED = 2;
    uint256 public constant DEFAULT_MAX_FAILED_RATIO = 1;

    // ------------------ Variables ------------------
    function deployDealSystem() internal returns (Deployment memory deployment) {
        deployment.tFLT = IERC20(new TestERC20("Test FLT", "tFLT"));
        deployment.tUSD = IERC20(new TestERC20("Test USD", "tUSD"));

        Deal dealImpl = new Deal();
        Core coreImpl = new Core();

        deployment.core = Core(
            address(
                new ERC1967Proxy(
                    address(coreImpl),
                    abi.encodeWithSelector(
                        Core.initialize.selector,
                        DEFAULT_EPOCH_DURATION,
                        deployment.tFLT,
                        DEFAULT_FLT_PRICE,
                        DEFAULT_MIN_DEPOSITED_EPOCHES,
                        DEFAULT_MIN_REMATCHING_EPOCHES,
                        DEFAULT_USD_COLLATERAL_PER_UNIT,
                        DEFAULT_USD_TARGET_REVENUE_PER_EPOCH,
                        DEFAULT_MIN_DURATION,
                        DEFAULT_MIN_REWARD_PER_EPOCH,
                        DEFAULT_MAX_REWARD_PER_EPOCH,
                        DEFAULT_VESTING_DURATION,
                        DEFAULT_SLASHING_RATE,
                        DEFAULT_MIN_REQUIERD_PROOFS_PER_EPOCH,
                        DEFAULT_MAX_PROOFS_PER_EPOCH,
                        DEFAULT_WITHDRAW_EPOCHES_AFTER_FAILED,
                        DEFAULT_MAX_FAILED_RATIO
                    )
                )
            )
        );

        deployment.market = Market(
            address(
                new ERC1967Proxy(
                    address(new Market()), abi.encodeWithSelector(Market.initialize.selector, deployment.core, dealImpl)
                )
            )
        );

        deployment.capacity = Capacity(address(new ERC1967Proxy(address(new Capacity()))));

        deployment.core.initializeModules(deployment.capacity, deployment.market);

        deployment.initialized = true;
    }
}
