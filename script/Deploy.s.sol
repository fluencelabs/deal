// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "forge-std/Script.sol";
import "./utils/Deployment.sol";
import "src/core/Core.sol";
import "src/core/interfaces/ICore.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";
import "src/utils/Multicall3.sol";

contract DeployContracts is Deployment, Script {
    using SafeERC20 for IERC20;

    // ------------------ Local ENV constant ------------------
    uint256 constant LOCAL_CHAIN_ID = 31337;
    string constant DEFAULT_ANVIL_MNEMONIC = "test test test test test test test test test test test junk";
    uint256 constant LOCAL_tUSD_BALANCE = 1000000 ether;

    // ------------------ Default constant ------------------
    // need to make it longer than integration tests, so 3600s
    uint256 constant DEFAULT_EPOCH_DURATION = 3600 seconds;
    uint256 constant DEFAULT_MIN_DEPOSITED_EPOCHS = 2;
    uint256 constant DEFAULT_MIN_REMATCHING_EPOCHS = 2;
    uint256 constant DEFAULT_MIN_PROTOCOL_VERSION = 1;
    uint256 constant DEFAULT_MAX_PROTOCOL_VERSION = 1;

    uint256 constant DEFAULT_FLT_PRICE = 1 * PRECISION; // 1 USD
    uint256 constant DEFAULT_USD_COLLATERAL_PER_UNIT = PRECISION / 10; // 0.1 USD
    uint256 constant DEFAULT_USD_TARGET_REVENUE_PER_EPOCH = PRECISION / 10 * 3; // 0.3 USD
    uint256 constant DEFAULT_MIN_DURATION = 10;
    uint256 constant DEFAULT_MIN_REWARD_PER_EPOCH = 100 ether;
    uint256 constant DEFAULT_MAX_REWARD_PER_EPOCH = 200 ether;
    uint256 constant DEFAULT_VESTING_PERIOD_DURATION = 3;
    uint256 constant DEFAULT_VESTING_PERIOD_COUNT = 6;
    uint256 constant DEFAULT_SLASHING_RATE = PRECISION / 100; // 1%
    uint256 constant DEFAULT_MIN_PROOFS_PER_EPOCH = 2;
    uint256 constant DEFAULT_MAX_PROOFS_PER_EPOCH = 5;
    uint256 constant DEFAULT_WITHDRAW_EPOCHS_AFTER_FAILED = 2;
    uint256 constant DEFAULT_MAX_FAILED_RATIO = 10;
    bool constant DEFAULT_IS_WHITELIST_ENABLED = false;
    bytes32 public constant DEFAULT_INIT_GLOBAL_NONCE = keccak256("init_global_nonce");
    bytes32 public constant DEFAULT_DIFFICULTY = 0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    uint256 constant DEFAULT_INIT_REWARD_POOL = 10 ether;
    uint256 constant DEFAULT_INIT_CC_BALANCE = DEFAULT_INIT_REWARD_POOL * 100;
    bool constant IS_MOCKED_RANDOMX = true;

    // ------------------ Deploy result ------------------
    string constant DEPLOYMENTS_PATH = "/deployments/";
    string private fullDeploymentsPath;
    // ------------------ Types ------------------

    struct ENV {
        uint256 chainId;
        uint256 epochDuration;
        uint256 minDepositedEpochs;
        uint256 minRematchingEpochs;
        uint256 minProtocolVersion;
        uint256 maxProtocolVersion;
        uint256 fltPrice;
        uint256 usdCollateralPerUnit;
        uint256 usdTargetRevenuePerEpoch;
        uint256 minDuration;
        uint256 minRewardPerEpoch;
        uint256 maxRewardPerEpoch;
        uint256 vestingPeriodDuration;
        uint256 vestingPeriodCount;
        uint256 slashingRate;
        uint256 minProofsPerEpoch;
        uint256 maxProofsPerEpoch;
        uint256 withdrawEpochsAfterFailed;
        uint256 maxFailedRatio;
        bool isWhitelistEnabled;
        bytes32 initGlobalNonce;
        bytes32 difficulty;
        uint256 initRewardPool;
        uint256 initCCBalance;
        bool isMockedRandomX;
    }

    function setUp() external {
        string memory envName = vm.envString("CONTRACTS_ENV_NAME");
        string memory fileNames = string.concat(envName, ".json");
        fullDeploymentsPath = string.concat(vm.projectRoot(), DEPLOYMENTS_PATH, fileNames);
    }

    function run() external {
        ENV memory env = _loadENV();

        _startDeploy();
        IERC20 tUSD = _deployTestTokens();

        // Deploy Multicall3 as **helper** contract to fetch info only from the chain.
        // Thus, this contract is not belongs to Fluence contract ecosystem.
        _deployMulticall3();

        if (env.chainId == LOCAL_CHAIN_ID) {
            string memory mnemonic = vm.envOr("ANVIL_MNEMONIC", DEFAULT_ANVIL_MNEMONIC);
            for (uint32 i = 0; i < 10; i++) {
                address addr = vm.rememberKey(vm.deriveKey(mnemonic, i));
                tUSD.safeTransfer(addr, LOCAL_tUSD_BALANCE);
            }
        } else {
            (address faucet, bool isNew) = _deployTestFaucet(tUSD);
            if (isNew) {
                tUSD.safeTransfer(address(faucet), 1_000_000_000_000 ether);
            }
        }

        _deployCore(
            env.epochDuration,
            env.minDepositedEpochs,
            env.minRematchingEpochs,
            env.minProtocolVersion,
            env.maxProtocolVersion,
            env.fltPrice,
            env.usdCollateralPerUnit,
            env.usdTargetRevenuePerEpoch,
            env.minDuration,
            env.minRewardPerEpoch,
            env.maxRewardPerEpoch,
            env.vestingPeriodDuration,
            env.vestingPeriodCount,
            env.slashingRate,
            env.minProofsPerEpoch,
            env.maxProofsPerEpoch,
            env.withdrawEpochsAfterFailed,
            env.maxFailedRatio,
            env.isWhitelistEnabled,
            env.initGlobalNonce,
            env.difficulty,
            env.initRewardPool,
            env.initCCBalance,
            env.isMockedRandomX
        );
        _stopDeploy();
    }

    // ------------------ Internal functions ------------------
    function _loadENV() internal view returns (ENV memory) {
        uint256 chainId = block.chainid;

        uint256 epochDuration = vm.envOr("EPOCH_DURATION", DEFAULT_EPOCH_DURATION);
        uint256 minDepositedEpochs = vm.envOr("MIN_DEPOSITED_EPOCHS", DEFAULT_MIN_DEPOSITED_EPOCHS);
        uint256 minRematchingEpochs = vm.envOr("MIN_REMATCHING_EPOCHS", DEFAULT_MIN_REMATCHING_EPOCHS);
        uint256 minProtocolVersion = vm.envOr("MIN_PROTOCOL_VERSION", DEFAULT_MIN_PROTOCOL_VERSION);
        uint256 maxProtocolVersion = vm.envOr("MAX_PROTOCOL_VERSION", DEFAULT_MAX_PROTOCOL_VERSION);

        uint256 fltPice = vm.envOr("FLT_PRICE", DEFAULT_FLT_PRICE);
        uint256 usdCollateralPerUnit = vm.envOr("USD_COLLATERAL_PER_UNIT", DEFAULT_USD_COLLATERAL_PER_UNIT);
        uint256 usdTargetRevenuePerEpoch =
            vm.envOr("USD_TARGET_REVENUE_PER_EPOCH", DEFAULT_USD_TARGET_REVENUE_PER_EPOCH);
        uint256 minDuration = vm.envOr("MIN_DURATION", DEFAULT_MIN_DURATION);
        uint256 minRewardPerEpoch = vm.envOr("MIN_REWARD_PER_EPOCH", DEFAULT_MIN_REWARD_PER_EPOCH);
        uint256 maxRewardPerEpoch = vm.envOr("MAX_REWARD_PER_EPOCH", DEFAULT_MAX_REWARD_PER_EPOCH);
        uint256 vestingPeriodDuration = vm.envOr("VESTING_PERIOD_DURATION", DEFAULT_VESTING_PERIOD_DURATION);
        uint256 vestingPeriodCount = vm.envOr("VESTING_PERIOD_COUNT", DEFAULT_VESTING_PERIOD_COUNT);
        uint256 slashingRate = vm.envOr("SLASHING_RATE", DEFAULT_SLASHING_RATE);
        uint256 minProofsPerEpoch = vm.envOr("MIN_PROOFS_PER_EPOCH", DEFAULT_MIN_PROOFS_PER_EPOCH);
        uint256 maxProofsPerEpoch = vm.envOr("MAX_PROOFS_PER_EPOCH", DEFAULT_MAX_PROOFS_PER_EPOCH);
        uint256 withdrawEpochsAfterFailed =
            vm.envOr("WITHDRAW_EPOCHS_AFTER_FAILED", DEFAULT_WITHDRAW_EPOCHS_AFTER_FAILED);
        uint256 maxFailedRatio = vm.envOr("MAX_FAILED_RATIO", DEFAULT_MAX_FAILED_RATIO);
        bool isWhitelistEnabled = vm.envOr("IS_WHITELIST_ENABLED", DEFAULT_IS_WHITELIST_ENABLED);
        bytes32 initGlobalNonce = vm.envOr("INIT_GLOBAL_NONCE", DEFAULT_INIT_GLOBAL_NONCE);
        bytes32 difficulty = vm.envOr("DIFFICULTY", DEFAULT_DIFFICULTY);
        uint256 initRewardPool = vm.envOr("INIT_REWARD_POOL", DEFAULT_INIT_REWARD_POOL);
        uint256 initCCBalance = vm.envOr("INIT_CC_BALANCE", DEFAULT_INIT_CC_BALANCE);
        bool isMockedRandomX = vm.envOr("IS_MOCKED_RANDOMX", IS_MOCKED_RANDOMX);

        console.log("----------------- ENV -----------------");
        console.log(StdStyle.blue("CHAIN_ID:"), block.chainid);
        console.log(StdStyle.blue("EPOCH_DURATION:"), epochDuration);
        console.log(StdStyle.blue("MIN_DEPOSITED_EPOCHS:"), minDepositedEpochs);
        console.log(StdStyle.blue("MIN_REMATCHING_EPOCHS:"), minRematchingEpochs);
        console.log(StdStyle.blue("MIN_PROTOCOL_VERSION:"), minProtocolVersion);
        console.log(StdStyle.blue("MAX_PROTOCOL_VERSION:"), maxProtocolVersion);

        console.log(StdStyle.blue("FLT_PRICE:"), fltPice);
        console.log(StdStyle.blue("USD_COLLATERAL_PER_UNIT:"), usdCollateralPerUnit);
        console.log(StdStyle.blue("USD_TARGET_REVENUE_PER_EPOCH:"), usdTargetRevenuePerEpoch);
        console.log(StdStyle.blue("MIN_DURATION:"), minDuration);
        console.log(StdStyle.blue("MIN_REWARD_PER_EPOCH:"), minRewardPerEpoch);
        console.log(StdStyle.blue("MAX_REWARD_PER_EPOCH:"), maxRewardPerEpoch);
        console.log(StdStyle.blue("VESTING_PERIOD_DURATION:"), vestingPeriodDuration);
        console.log(StdStyle.blue("VESTING_PERIOD_COUNT:"), vestingPeriodCount);
        console.log(StdStyle.blue("SLASHING_RATE:"), slashingRate);
        console.log(StdStyle.blue("MIN_PROOFS_PER_EPOCH:"), minProofsPerEpoch);
        console.log(StdStyle.blue("MAX_PROOFS_PER_EPOCH:"), maxProofsPerEpoch);
        console.log(StdStyle.blue("WITHDRAW_EPOCHS_AFTER_FAILED:"), withdrawEpochsAfterFailed);
        console.log(StdStyle.blue("MAX_FAILED_RATIO:"), maxFailedRatio);
        console.log(StdStyle.blue("IS_WHITELIST_ENABLED:"), isWhitelistEnabled);
        console.log(StdStyle.blue("INIT_GLOBAL_NONCE:"));
        console.logBytes32(initGlobalNonce);
        console.log(StdStyle.blue("DIFFICULTY:"));
        console.logBytes32(difficulty);
        console.log(StdStyle.blue("INIT_REWARD_POOL:"), initRewardPool);
        console.log(StdStyle.blue("IS_MOCKED_RANDOMX:"), isMockedRandomX);
        console.log("---------------------------------------");

        return ENV({
            chainId: chainId,
            epochDuration: epochDuration,
            minDepositedEpochs: minDepositedEpochs,
            minRematchingEpochs: minRematchingEpochs,
            minProtocolVersion: minProtocolVersion,
            maxProtocolVersion: maxProtocolVersion,
            fltPrice: fltPice,
            usdCollateralPerUnit: usdCollateralPerUnit,
            usdTargetRevenuePerEpoch: usdTargetRevenuePerEpoch,
            minDuration: minDuration,
            minRewardPerEpoch: minRewardPerEpoch,
            maxRewardPerEpoch: maxRewardPerEpoch,
            vestingPeriodDuration: vestingPeriodDuration,
            vestingPeriodCount: vestingPeriodCount,
            slashingRate: slashingRate,
            minProofsPerEpoch: minProofsPerEpoch,
            maxProofsPerEpoch: maxProofsPerEpoch,
            withdrawEpochsAfterFailed: withdrawEpochsAfterFailed,
            maxFailedRatio: maxFailedRatio,
            isWhitelistEnabled: isWhitelistEnabled,
            initGlobalNonce: initGlobalNonce,
            difficulty: difficulty,
            initRewardPool: initRewardPool,
            initCCBalance: initCCBalance,
            isMockedRandomX: isMockedRandomX
        });
    }

    function _deployTestTokens() internal returns (IERC20 tUSD) {
        bytes memory args = abi.encode("USD Token", "axlUSDC", 6);
        tUSD = IERC20(_deployContract("axlUSDC", "TestERC20", args));
    }

    function _deployMulticall3() internal returns (Multicall3 multicall) {
        bytes memory args = abi.encode();
        multicall = Multicall3(_deployContract("Multicall3", "Multicall3", args));
    }

    function _deployTestFaucet(IERC20 tUSD) internal returns (address faucet, bool isNew) {
        bytes memory args = abi.encode(tUSD);
        return _tryDeployContract("Faucet", "OwnableFaucet", args);
    }

    function _deployCore(
        uint256 epochDuration_,
        uint256 minDepositedEpochs_,
        uint256 minRematchingEpochs_,
        uint256 minProtocolVersion_,
        uint256 maxProtocolVersion_,
        uint256 fltPrice_,
        uint256 usdCollateralPerUnit_,
        uint256 usdTargetRevenuePerEpoch_,
        uint256 minDuration_,
        uint256 minRewardPerEpoch_,
        uint256 maxRewardPerEpoch_,
        uint256 vestingPeriodDuration_,
        uint256 vestingPeriodCount_,
        uint256 slashingRate_,
        uint256 minProofsPerEpoch_,
        uint256 maxProofsPerEpoch_,
        uint256 withdrawEpochsAfterFailed_,
        uint256 maxFailedRatio_,
        bool isWhitelistEnabled_,
        bytes32 initGlobalNonce_,
        bytes32 difficulty_,
        uint256 initRewardPool_,
        uint256 initCCBalance_,
        bool isMockedRandomX_
    ) internal {
        address coreImpl = _deployContract("CoreImpl", "Core", new bytes(0));
        address dealImpl = _deployContract("DealImpl", "Deal", new bytes(0));

        address randomXProxy;
        if (isMockedRandomX_) {
            randomXProxy = _deployContract("RandomXProxy", "RandomXProxyMock", abi.encode(difficulty_));
        } else {
            randomXProxy = _deployContract("RandomXProxy", "RandomXProxy", new bytes(0));
        }

        bool needToRedeployMarket = _doNeedToRedeploy("MarketImpl", "Market");
        bool needToRedeployCapacity = _doNeedToRedeploy("CapacityImpl", "Capacity");

        bool needToRedeployDealFactory = _doNeedToRedeploy("DealFactoryImpl", "DealFactory");

        (address coreAddr, bool isNewCore) = _tryDeployContract(
            "Core",
            "ERC1967Proxy",
            abi.encode(
                coreImpl,
                abi.encodeWithSelector(
                    Core.initialize.selector,
                    epochDuration_,
                    minDepositedEpochs_,
                    minRematchingEpochs_,
                    minProtocolVersion_,
                    maxProtocolVersion_,
                    dealImpl,
                    isWhitelistEnabled_,
                    ICapacityConst.CapacityConstInitArgs({
                        fltPrice: fltPrice_,
                        usdCollateralPerUnit: usdCollateralPerUnit_,
                        usdTargetRevenuePerEpoch: usdTargetRevenuePerEpoch_,
                        minDuration: minDuration_,
                        minRewardPerEpoch: minRewardPerEpoch_,
                        maxRewardPerEpoch: maxRewardPerEpoch_,
                        vestingPeriodDuration: vestingPeriodDuration_,
                        vestingPeriodCount: vestingPeriodCount_,
                        slashingRate: slashingRate_,
                        minProofsPerEpoch: minProofsPerEpoch_,
                        maxProofsPerEpoch: maxProofsPerEpoch_,
                        withdrawEpochsAfterFailed: withdrawEpochsAfterFailed_,
                        maxFailedRatio: maxFailedRatio_,
                        difficulty: difficulty_,
                        initRewardPool: initRewardPool_,
                        randomXProxy: randomXProxy,
                        oracle: address(0)
                    })
                )
            ),
            needToRedeployMarket || needToRedeployCapacity || needToRedeployDealFactory
        );

        address marketImpl = _deployContract("MarketImpl", "Market", abi.encode(coreAddr), isNewCore);
        address capacityImpl = _deployContract("CapacityImpl", "Capacity", abi.encode(coreAddr), isNewCore);

        address dealFactoryImpl = _deployContract("DealFactoryImpl", "DealFactory", abi.encode(coreAddr), isNewCore);

        address marketProxy = _deployContract(
            "Market", "ERC1967Proxy", abi.encode(marketImpl, abi.encodeWithSelector(IMarket.initialize.selector))
        );

        address capacityProxy = _deployContract(
            "Capacity",
            "ERC1967Proxy",
            abi.encode(
                capacityImpl, abi.encodeWithSelector(ICapacity.initialize.selector, initGlobalNonce_, randomXProxy)
            )
        );

        address dealFactoryProxy = _deployContract(
            "DealFactory",
            "ERC1967Proxy",
            abi.encode(dealFactoryImpl, abi.encodeWithSelector(IDealFactory.initialize.selector))
        );

        if (needToRedeployCapacity) {
            (bool success,) = address(capacityProxy).call{value: initCCBalance_}(new bytes(0));
            require(success, "Failed to transfer initial CC balance");
        }

        if (isNewCore) {
            console.log("\nCore deployed, initializing modules as well...");
            ICore(coreAddr).initializeModules(
                ICapacity(capacityProxy), IMarket(marketProxy), IDealFactory(dealFactoryProxy)
            );
        }

        // TODO: if needToRedeployMarket, needToRedeployCapacity or needToRedeployDealFactory
        //   - impl proxy should be update with impl.
        if (!isNewCore && (needToRedeployMarket || needToRedeployCapacity || needToRedeployDealFactory)) {
            revert("Update not implemented yet.");
        }
    }

    function _startDeploy() internal virtual {
        bool isTestnet = vm.envOr("TEST", false);
        if (!isTestnet) {
            _loadDeployment(fullDeploymentsPath);
        }

        vm.startBroadcast();
        console.log("\nStart deploying...");
    }

    function _stopDeploy() internal virtual {
        bool isTestnet = vm.envOr("TEST", false);

        if (!isTestnet) {
            _printDeployments();
            _saveDeployment(fullDeploymentsPath);
        }

        vm.stopBroadcast();
        console.log("\nDeploy finished");
    }
}
