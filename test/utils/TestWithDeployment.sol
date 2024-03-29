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

import {PRECISION} from "src/utils/Common.sol";

contract TestWithDeployment is Test {
    // ------------------ Types ------------------
    struct Deployment {
        bool initialized;
        IERC20 tUSD;
        IDeal dealImpl;
        ICore core;
        IMarket market;
        ICapacity capacity;
        IDealFactory dealFactory;
    }

    // ------------------ Constants ------------------
    uint256 public constant DEFAULT_EPOCH_DURATION = 1 days;
    uint256 public constant DEFAULT_FLT_PRICE = 10 * PRECISION; // 10 USD
    uint256 public constant DEFAULT_MIN_DEPOSITED_EPOCHS = 2;
    uint256 public constant DEFAULT_MIN_REMATCHING_EPOCHS = 2;
    uint256 public constant DEFAULT_MIN_PROTOCOL_VERSION = 1;
    uint256 public constant DEFAULT_MAX_PROTOCOL_VERSION = 1;
    uint256 public constant DEFAULT_USD_COLLATERAL_PER_UNIT = 100 * PRECISION; // 100 USD
    uint256 public constant DEFAULT_USD_TARGET_REVENUE_PER_EPOCH = 2000 * PRECISION; // 2000 USD
    uint256 public constant DEFAULT_MIN_DURATION = 1 days;
    uint256 public constant DEFAULT_MIN_REWARD_PER_EPOCH = 10000;
    uint256 public constant DEFAULT_MAX_REWARD_PER_EPOCH = 1;
    uint256 public constant DEFAULT_VESTING_PERIOD_DURATION = 10;
    uint256 public constant DEFAULT_VESTING_PERIOD_COUNT = 6;
    uint256 public constant DEFAULT_SLASHING_RATE = 100000; // 0.01 = 1% = 100000
    uint256 public constant DEFAULT_MIN_REQUIERD_PROOFS_PER_EPOCH = 3;
    uint256 public constant DEFAULT_MAX_PROOFS_PER_EPOCH = 5;
    uint256 public constant DEFAULT_WITHDRAW_EPOCHS_AFTER_FAILED = 2;
    uint256 public constant DEFAULT_MAX_FAILED_RATIO = 10;
    uint256 public constant DEFAULT_INIT_REWARD_POOL = 1000 ether;
    bool public constant DEFAULT_IS_WHITELIST_ENABLED = false;
    bytes32 public constant DEFAULT_DIFFICULTY_TARGET =
        0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    bytes32 public constant DEFAULT_INIT_GLOBAL_NONCE = keccak256("init_global_nonce");

    // ------------------ Variables ------------------
    Deployment public deployment;

    function _deploySystem() internal {
        deployment.tUSD = IERC20(deployCode("out/TestERC20.sol/TestERC20.json", abi.encode("Test USD", "tUSD", 8)));

        IDeal dealImpl = IDeal(deployCode("out/Deal.sol/Deal.json"));
        ICore coreImpl = ICore(deployCode("out/Core.sol/Core.json"));

        ICore core = ICore(
            address(
                new ERC1967Proxy(
                    address(coreImpl),
                    abi.encodeWithSelector(
                        ICore.initialize.selector,
                        DEFAULT_EPOCH_DURATION,
                        DEFAULT_MIN_DEPOSITED_EPOCHS,
                        DEFAULT_MIN_REMATCHING_EPOCHS,
                        DEFAULT_MIN_PROTOCOL_VERSION,
                        DEFAULT_MAX_PROTOCOL_VERSION,
                        dealImpl,
                        DEFAULT_IS_WHITELIST_ENABLED,
                        ICapacityConst.CapacityConstInitArgs({
                            fltPrice: DEFAULT_FLT_PRICE,
                            usdCollateralPerUnit: DEFAULT_USD_COLLATERAL_PER_UNIT,
                            usdTargetRevenuePerEpoch: DEFAULT_USD_TARGET_REVENUE_PER_EPOCH,
                            minDuration: DEFAULT_MIN_DURATION,
                            minRewardPerEpoch: DEFAULT_MIN_REWARD_PER_EPOCH,
                            maxRewardPerEpoch: DEFAULT_MAX_REWARD_PER_EPOCH,
                            vestingPeriodDuration: DEFAULT_VESTING_PERIOD_DURATION,
                            vestingPeriodCount: DEFAULT_VESTING_PERIOD_COUNT,
                            slashingRate: DEFAULT_SLASHING_RATE,
                            minProofsPerEpoch: DEFAULT_MIN_REQUIERD_PROOFS_PER_EPOCH,
                            maxProofsPerEpoch: DEFAULT_MAX_PROOFS_PER_EPOCH,
                            withdrawEpochsAfterFailed: DEFAULT_WITHDRAW_EPOCHS_AFTER_FAILED,
                            maxFailedRatio: DEFAULT_MAX_FAILED_RATIO,
                            difficulty: DEFAULT_DIFFICULTY_TARGET,
                            initRewardPool: DEFAULT_INIT_REWARD_POOL,
                            randomXProxy: deployCode("out/RandomXProxy.sol/RandomXProxy.json")
                        })
                    )
                )
            )
        );

        deployment.core = core;
        deployment.dealImpl = dealImpl;

        deployment.market = IMarket(
            address(
                new ERC1967Proxy(
                    deployCode("out/Market.sol/Market.json", abi.encode(address(core))),
                    abi.encodeWithSelector(IMarket.initialize.selector, dealImpl)
                )
            )
        );

        deployment.capacity = ICapacity(
            payable(
                address(
                    new ERC1967Proxy(
                        deployCode("out/Capacity.sol/Capacity.json", abi.encode(address(core))),
                        abi.encodeWithSelector(ICapacity.initialize.selector, DEFAULT_INIT_GLOBAL_NONCE)
                    )
                )
            )
        );

        deployment.dealFactory = IDealFactory(
            address(
                new ERC1967Proxy(
                    deployCode("out/DealFactory.sol/DealFactory.json", abi.encode(address(core))),
                    abi.encodeWithSelector(IDealFactory.initialize.selector)
                )
            )
        );

        core.initializeModules(deployment.capacity, deployment.market, deployment.dealFactory);

        deployment.initialized = true;
    }
}
