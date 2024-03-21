// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "forge-std/Script.sol";
import "forge-std/Vm.sol";
import "src/deal/Deal.sol";
import "src/core/Core.sol";
import "src/dev/OwnableFaucet.sol";
import "src/dev/TestERC20.sol";
import "./utils/Depoyments.sol";
import "src/core/Core.sol";
import "src/core/interfaces/ICore.sol";
import "src/core/modules/market/Market.sol";
import "src/core/modules/market/DealFactory.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/capacity/Capacity.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/utils/Multicall3.sol";

contract DeployKras is Depoyments, Script {
    using SafeERC20 for IERC20;

    // ------------------ Default constant ------------------
    address constant USDC = address(0xE277D4cb6e522769e7962FB239d5342138891bE6);

    uint256 constant EPOCH_DURATION = 1 days;
    uint256 constant MIN_DEPOSITED_EPOCHS = 2;
    uint256 constant MIN_REMATCHING_EPOCHS = 2;
    uint256 constant MIN_PROTOCOL_VERSION = 1;
    uint256 constant MAX_PROTOCOL_VERSION = 1;

    uint256 constant FLT_PRICE = 0.5e7; // 0.5 USD
    uint256 constant USD_COLLATERAL_PER_UNIT = 1e7; // 1 USD
    uint256 constant USD_TARGET_REVENUE_PER_EPOCH = 0.33e7; // 10 USD per month, $0.33 per epoch
    uint256 constant MIN_DURATION = 5;
    uint256 constant MIN_REWARD_PER_EPOCH = 100 * 1e18;
    uint256 constant MAX_REWARD_PER_EPOCH = 1000 * 1e18;
    uint256 constant VESTING_PERIOD_DURATION = 2;
    uint256 constant VESTING_PERIOD_COUNT = 6;

    uint256 constant SLASHING_RATE = 0;
    uint256 constant MIN_PROOFS_PER_EPOCH = 30;
    uint256 constant MAX_PROOFS_PER_EPOCH = 50;
    uint256 constant WITHDRAW_EPOCHS_AFTER_FAILED = 0;
    uint256 constant MAX_FAILED_RATIO = 4;

    bytes32 public constant INIT_GLOBAL_NONCE = keccak256("fluence nonce");
    bytes32 public constant DIFFICULTY = 0x0000241FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;
    uint256 constant INIT_REWARD_POOL = 500e18;
    uint256 constant INIT_CC_BALANCE = 30000e18;

    bool constant IS_WHITELIST_ENABLED = true;

    // ------------------ Deploy result ------------------
    string constant DEPLOYMENTS_PATH = "/deployments/";
    string private fullDeploymentsPath;
    // ------------------ Types ------------------

    function setUp() external {
        string memory fileNames = string.concat("kras", ".json");
        fullDeploymentsPath = string.concat(vm.projectRoot(), DEPLOYMENTS_PATH, fileNames);
    }

    function run() external {
        _printENV();

        _setContract("axlUSDC", USDC, bytes32(0x00), bytes32(0x00));

        vm.startBroadcast();
        console.log("\nStart deploying...");
        console.log("Deployer address:", address(msg.sender));

        Multicall3(_deployContract("Multicall3", "Multicall3", abi.encode()));
        address randomXProxy = _deployContract("RandomXProxy", "RandomXProxy", new bytes(0));

        address coreImpl = _deployContract("CoreImpl", "Core", new bytes(0));
        address dealImpl = _deployContract("DealImpl", "Deal", new bytes(0));

        address coreAddr = _deployContract(
            "Core",
            "ERC1967Proxy",
            abi.encode(
                coreImpl,
                abi.encodeWithSelector(
                    Core.initialize.selector,
                    EPOCH_DURATION,
                    MIN_DEPOSITED_EPOCHS,
                    MIN_REMATCHING_EPOCHS,
                    MIN_PROTOCOL_VERSION,
                    MAX_PROTOCOL_VERSION,
                    dealImpl,
                    IS_WHITELIST_ENABLED,
                    FLT_PRICE,
                    USD_COLLATERAL_PER_UNIT,
                    USD_TARGET_REVENUE_PER_EPOCH,
                    MIN_DURATION,
                    MIN_REWARD_PER_EPOCH,
                    MAX_REWARD_PER_EPOCH,
                    VESTING_PERIOD_DURATION,
                    VESTING_PERIOD_COUNT,
                    SLASHING_RATE,
                    MIN_PROOFS_PER_EPOCH,
                    MAX_PROOFS_PER_EPOCH,
                    WITHDRAW_EPOCHS_AFTER_FAILED,
                    MAX_FAILED_RATIO,
                    DIFFICULTY,
                    INIT_REWARD_POOL,
                    randomXProxy
                )
            )
        );

        address marketImpl = _deployContract("MarketImpl", "Market", abi.encode(coreAddr));
        address capacityImpl = _deployContract("CapacityImpl", "Capacity", abi.encode(coreAddr));
        address dealFactoryImpl = _deployContract("DealFactoryImpl", "DealFactory", abi.encode(coreAddr));

        address marketProxy = _deployContract(
            "Market", "ERC1967Proxy", abi.encode(marketImpl, abi.encodeWithSelector(Market.initialize.selector))
        );
        address capacityProxy = _deployContract(
            "Capacity",
            "ERC1967Proxy",
            abi.encode(
                capacityImpl, abi.encodeWithSelector(Capacity.initialize.selector, INIT_GLOBAL_NONCE, randomXProxy)
            )
        );
        address dealFactoryProxy = _deployContract(
            "DealFactory",
            "ERC1967Proxy",
            abi.encode(dealFactoryImpl, abi.encodeWithSelector(DealFactory.initialize.selector))
        );

        (bool success,) = address(capacityProxy).call{value: INIT_CC_BALANCE}(new bytes(0));
        require(success, "DeployKrasContracts: failed to transfer initial CC balance");

        console.log("\nCore deployed, initializing modules as well...");
        ICore(coreAddr).initializeModules(
            ICapacity(capacityProxy), IMarket(marketProxy), IDealFactory(dealFactoryProxy)
        );

        _printDeployments();
        _saveDeployments(fullDeploymentsPath);

        vm.stopBroadcast();
        console.log("\nDeploy finished");
    }

    // ------------------ Internal functions ------------------
    function _printENV() internal view {
        console.log("----------------- ENV -----------------");
        console.log(StdStyle.blue("CHAIN_ID:"), block.chainid);
        console.log(StdStyle.blue("USDC:"), USDC);

        console.log(StdStyle.blue("EPOCH_DURATION:"), EPOCH_DURATION);
        console.log(StdStyle.blue("MIN_DEPOSITED_EPOCHS:"), MIN_DEPOSITED_EPOCHS);
        console.log(StdStyle.blue("MIN_REMATCHING_EPOCHS:"), MIN_REMATCHING_EPOCHS);
        console.log(StdStyle.blue("MIN_PROTOCOL_VERSION:"), MIN_PROTOCOL_VERSION);
        console.log(StdStyle.blue("MAX_PROTOCOL_VERSION:"), MAX_PROTOCOL_VERSION);

        console.log(StdStyle.blue("FLT_PRICE:"), FLT_PRICE);
        console.log(StdStyle.blue("USD_COLLATERAL_PER_UNIT:"), USD_COLLATERAL_PER_UNIT);
        console.log(StdStyle.blue("USD_TARGET_REVENUE_PER_EPOCH:"), USD_TARGET_REVENUE_PER_EPOCH);
        console.log(StdStyle.blue("MIN_DURATION:"), MIN_DURATION);
        console.log(StdStyle.blue("MIN_REWARD_PER_EPOCH:"), MIN_REWARD_PER_EPOCH);
        console.log(StdStyle.blue("MAX_REWARD_PER_EPOCH:"), MAX_REWARD_PER_EPOCH);
        console.log(StdStyle.blue("VESTING_PERIOD_DURATION:"), VESTING_PERIOD_DURATION);
        console.log(StdStyle.blue("VESTING_PERIOD_COUNT:"), VESTING_PERIOD_COUNT);

        console.log(StdStyle.blue("SLASHING_RATE:"), SLASHING_RATE);
        console.log(StdStyle.blue("MIN_PROOFS_PER_EPOCH:"), MIN_PROOFS_PER_EPOCH);
        console.log(StdStyle.blue("MAX_PROOFS_PER_EPOCH:"), MAX_PROOFS_PER_EPOCH);
        console.log(StdStyle.blue("WITHDRAW_EPOCHS_AFTER_FAILED:"), WITHDRAW_EPOCHS_AFTER_FAILED);
        console.log(StdStyle.blue("MAX_FAILED_RATIO:"), MAX_FAILED_RATIO);

        console.log(StdStyle.blue("INIT_GLOBAL_NONCE:"));
        console.logBytes32(INIT_GLOBAL_NONCE);
        console.log(StdStyle.blue("DIFFICULTY:"));
        console.logBytes32(DIFFICULTY);
        console.log(StdStyle.blue("INIT_REWARD_POOL:"), INIT_REWARD_POOL);
        console.log(StdStyle.blue("INIT_CC_BALANCE:"), INIT_CC_BALANCE);

        console.log(StdStyle.blue("IS_WHITELIST_ENABLED:"), IS_WHITELIST_ENABLED);
        console.log("---------------------------------------");
    }
}
