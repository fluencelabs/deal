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
import "src/utils/Multicall3.sol";
import "src/core/Core.sol";
import "src/core/interfaces/ICore.sol";
import "src/core/modules/market/Market.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/capacity/Capacity.sol";
import "src/core/modules/capacity/interfaces/ICapacity.sol";

contract DeployContracts is Depoyments, Script {
    using SafeERC20 for IERC20;

    // ------------------ Local ENV constant ------------------
    uint256 constant LOCAL_CHAIN_ID = 31337;
    string constant DEFAULT_ANVIL_MNEMONIC = "test test test test test test test test test test test junk";
    uint256 constant LOCAL_tFLT_BALANCE = 1000000 ether;
    uint256 constant LOCAL_tUSD_BALANCE = 1000000 ether;

    // ------------------ Default constant ------------------
    uint256 constant DEFAULT_EPOCH_DURATION = 15 seconds;
    uint256 constant DEFAULT_FLT_PRICE = 1 * PRECISION; // 1 USD
    uint256 constant DEFAULT_MIN_DEPOSITED_EPOCHES = 2;
    uint256 constant DEFAULT_MIN_REMATCHING_EPOCHES = 2;
    uint256 constant DEFAULT_MIN_PROTOCOL_VERSION = 1;
    uint256 constant DEFAULT_MAX_PROTOCOL_VERSION = 1;
    uint256 constant DEFAULT_USD_COLLATERAL_PER_UNIT = 1 * PRECISION; // 1 USD
    uint256 constant DEFAULT_USD_TARGET_REVENUE_PER_EPOCH = 1_000 * PRECISION; // 1 USD
    uint256 constant DEFAULT_MIN_DURATION = 5 minutes;
    uint256 constant DEFAULT_MIN_REWARD_PER_EPOCH = 1 ether;
    uint256 constant DEFAULT_MAX_REWARD_PER_EPOCH = 1 ether;
    uint256 constant DEFAULT_VESTING_DURATION = 1 minutes;
    uint256 constant DEFAULT_SLASHING_RATE = 1_000_000; // 0.1 = 10% = 1000000
    uint256 constant DEFAULT_MIN_REQUIERD_PROOFS_PER_EPOCH = 2;
    uint256 constant DEFAULT_MAX_PROOFS_PER_EPOCH = 5;
    uint256 constant DEFAULT_WITHDRAW_EPOCHES_AFTER_FAILED = 2;
    uint256 constant DEFAULT_MAX_FAILED_RATIO = 40;
    bool constant DEFAULT_IS_WHITELIST_ENABLED = false;
    bytes32 public constant DEFAULT_DIFFICULTY = 0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    bytes32 public constant DEFAULT_INIT_GLOBAL_NONCE = keccak256("init_global_nonce");
    bool constant IS_MOCKED_RANDOMX = true;

    // ------------------ Deploy result ------------------
    string constant DEPLOYMENTS_PATH = "/deployments/";
    string private fullDeploymentsPath;
    // ------------------ Types ------------------

    struct ENV {
        uint256 chainId;
        uint256 epochDuration;
        uint256 fltPrice;
        uint256 minDepositedEpoches;
        uint256 minRematchingEpoches;
        uint256 minProtocolVersion;
        uint256 maxProtocolVersion;
        uint256 usdCollateralPerUnit;
        uint256 usdTargetRevenuePerEpoch;
        uint256 minDuration;
        uint256 minRewardPerEpoch;
        uint256 maxRewardPerEpoch;
        uint256 vestingDuration;
        uint256 slashingRate;
        uint256 minRequierdProofsPerEpoch;
        uint256 maxProofsPerEpoch;
        uint256 withdrawEpochesAfterFailed;
        uint256 maxFailedRatio;
        bool isWhitelistEnabled;
        bytes32 difficulty;
        bytes32 initGlobalNonce;
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
            env.fltPrice,
            env.minDepositedEpoches,
            env.minRematchingEpoches,
            env.minProtocolVersion,
            env.maxProtocolVersion,
            env.usdCollateralPerUnit,
            env.usdTargetRevenuePerEpoch,
            env.minDuration,
            env.minRewardPerEpoch,
            env.maxRewardPerEpoch,
            env.vestingDuration,
            env.slashingRate,
            env.minRequierdProofsPerEpoch,
            env.maxProofsPerEpoch,
            env.withdrawEpochesAfterFailed,
            env.maxFailedRatio,
            env.isWhitelistEnabled,
            env.difficulty,
            env.initGlobalNonce,
            env.isMockedRandomX
        );
        _stopDeploy();
    }

    // ------------------ Internal functions ------------------
    function _loadENV() internal view returns (ENV memory) {
        uint256 chainId = block.chainid;
        uint256 epochDuration = vm.envOr("EPOCH_DURATION", DEFAULT_EPOCH_DURATION);
        uint256 fltPice = vm.envOr("FLT_PRICE", DEFAULT_FLT_PRICE);
        uint256 minDepositedEpoches = vm.envOr("MIN_DEPOSITED_EPOCHES", DEFAULT_MIN_DEPOSITED_EPOCHES);
        uint256 minRematchingEpoches = vm.envOr("MIN_REMATCHING_EPOCHES", DEFAULT_MIN_REMATCHING_EPOCHES);
        uint256 minProtocolVersion = vm.envOr("MIN_PROTOCOL_VERSION", DEFAULT_MIN_PROTOCOL_VERSION);
        uint256 maxProtocolVersion = vm.envOr("MAX_PROTOCOL_VERSION", DEFAULT_MAX_PROTOCOL_VERSION);
        uint256 usdCollateralPerUnit = vm.envOr("USD_COLLATERAL_PER_UNIT", DEFAULT_USD_COLLATERAL_PER_UNIT);
        uint256 usdTargetRevenuePerEpoch =
            vm.envOr("USD_TARGET_REVENUE_PER_EPOCH", DEFAULT_USD_TARGET_REVENUE_PER_EPOCH);
        uint256 minDuration = vm.envOr("MIN_DURATION", DEFAULT_MIN_DURATION);
        uint256 minRewardPerEpoch = vm.envOr("MIN_REWARD_PER_EPOCH", DEFAULT_MIN_REWARD_PER_EPOCH);
        uint256 maxRewardPerEpoch = vm.envOr("MAX_REWARD_PER_EPOCH", DEFAULT_MAX_REWARD_PER_EPOCH);
        uint256 vestingDuration = vm.envOr("VESTING_DURATION", DEFAULT_VESTING_DURATION);
        uint256 slashingRate = vm.envOr("SLASHING_RATE", DEFAULT_SLASHING_RATE);
        uint256 minRequierdProofsPerEpoch =
            vm.envOr("MIN_REQUIERD_PROOFS_PER_EPOCH", DEFAULT_MIN_REQUIERD_PROOFS_PER_EPOCH);
        uint256 maxProofsPerEpoch = vm.envOr("MAX_PROOFS_PER_EPOCH", DEFAULT_MAX_PROOFS_PER_EPOCH);
        uint256 withdrawEpochesAfterFailed =
            vm.envOr("WITHDRAW_EPOCHES_AFTER_FAILED", DEFAULT_WITHDRAW_EPOCHES_AFTER_FAILED);
        uint256 maxFailedRatio = vm.envOr("MAX_FAILED_RATIO", DEFAULT_MAX_FAILED_RATIO);
        bool isWhitelistEnabled = vm.envOr("IS_WHITELIST_ENABLED", DEFAULT_IS_WHITELIST_ENABLED);
        bytes32 difficulty = vm.envOr("DIFFICULTY", DEFAULT_DIFFICULTY);
        bytes32 initGlobalNonce = vm.envOr("INIT_GLOBAL_NONCE", DEFAULT_INIT_GLOBAL_NONCE);
        bool isMockedRandomX = vm.envOr("IS_MOCKED_RANDOMX", IS_MOCKED_RANDOMX);

        console.log("----------------- ENV -----------------");
        console.log(StdStyle.blue("CHAIN_ID:"), block.chainid);
        console.log(StdStyle.blue("EPOCH_DURATION:"), epochDuration);
        console.log(StdStyle.blue("MIN_DEPOSITED_EPOCHES:"), minDepositedEpoches);
        console.log(StdStyle.blue("MIN_REMATCHING_EPOCHES:"), minRematchingEpoches);
        console.log(StdStyle.blue("MIN_PROTOCOL_VERSION:"), minProtocolVersion);
        console.log(StdStyle.blue("MAX_PROTOCOL_VERSION:"), maxProtocolVersion);
        console.log(StdStyle.blue("USD_COLLATERAL_PER_UNIT:"), usdCollateralPerUnit);
        console.log(StdStyle.blue("USD_TARGET_REVENUE_PER_EPOCH:"), usdTargetRevenuePerEpoch);
        console.log(StdStyle.blue("MIN_DURATION:"), minDuration);
        console.log(StdStyle.blue("MIN_REWARD_PER_EPOCH:"), minRewardPerEpoch);
        console.log(StdStyle.blue("MAX_REWARD_PER_EPOCH:"), maxRewardPerEpoch);
        console.log(StdStyle.blue("VESTING_DURATION:"), vestingDuration);
        console.log(StdStyle.blue("SLASHING_RATE:"), slashingRate);
        console.log(StdStyle.blue("MIN_REQUIERD_PROOFS_PER_EPOCH:"), minRequierdProofsPerEpoch);
        console.log(StdStyle.blue("MAX_PROOFS_PER_EPOCH:"), maxProofsPerEpoch);
        console.log(StdStyle.blue("WITHDRAW_EPOCHES_AFTER_FAILED:"), withdrawEpochesAfterFailed);
        console.log(StdStyle.blue("MAX_FAILED_RATIO:"), maxFailedRatio);
        console.log(StdStyle.blue("IS_WHITELIST_ENABLED:"), isWhitelistEnabled);
        console.log(StdStyle.blue("DIFFICULTY:"));
        console.logBytes32(difficulty);
        console.log(StdStyle.blue("INIT_GLOBAL_NONCE:"));
        console.logBytes32(initGlobalNonce);
        console.log(StdStyle.blue("IS_MOCKED_RANDOMX:"), isMockedRandomX);
        console.log("---------------------------------------");

        return ENV({
            chainId: chainId,
            epochDuration: epochDuration,
            fltPrice: fltPice,
            minDepositedEpoches: minDepositedEpoches,
            minRematchingEpoches: minRematchingEpoches,
            minProtocolVersion: minProtocolVersion,
            maxProtocolVersion: maxProtocolVersion,
            usdCollateralPerUnit: usdCollateralPerUnit,
            usdTargetRevenuePerEpoch: usdTargetRevenuePerEpoch,
            minDuration: minDuration,
            minRewardPerEpoch: minRewardPerEpoch,
            maxRewardPerEpoch: maxRewardPerEpoch,
            vestingDuration: vestingDuration,
            slashingRate: slashingRate,
            minRequierdProofsPerEpoch: minRequierdProofsPerEpoch,
            maxProofsPerEpoch: maxProofsPerEpoch,
            withdrawEpochesAfterFailed: withdrawEpochesAfterFailed,
            maxFailedRatio: maxFailedRatio,
            isWhitelistEnabled: isWhitelistEnabled,
            difficulty: difficulty,
            initGlobalNonce: initGlobalNonce,
            isMockedRandomX: isMockedRandomX
        });
    }

    function _deployTestTokens() internal returns (IERC20 tUSD) {
        bytes memory args = abi.encode("USD Token", "tUSD", 6);
        tUSD = IERC20(_deployContract("tUSD", "TestERC20", args));
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
        uint256 fltPrice_,
        uint256 minDepositedEpoches_,
        uint256 minRematchingEpoches_,
        uint256 minProtocolVersion_,
        uint256 maxProtocolVersion_,
        uint256 usdCollateralPerUnit_,
        uint256 usdTargetRevenuePerEpoch_,
        uint256 minDuration_,
        uint256 minRewardPerEpoch_,
        uint256 maxRewardPerEpoch_,
        uint256 vestingDuration_,
        uint256 slashingRate_,
        uint256 minRequierdProofsPerEpoch_,
        uint256 maxProofsPerEpoch_,
        uint256 withdrawEpochesAfterFailed_,
        uint256 maxFailedRatio_,
        bool isWhitelistEnabled_,
        bytes32 difficulty_,
        bytes32 initGlobalNonce_,
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

        (address coreAddr, bool isNewCore) = _tryDeployContract(
            "Core",
            "ERC1967Proxy",
            abi.encode(
                coreImpl,
                abi.encodeWithSelector(
                    Core.initialize.selector,
                    epochDuration_,
                    minDepositedEpoches_,
                    minRematchingEpoches_,
                    minProtocolVersion_,
                    maxProtocolVersion_,
                    dealImpl
                )
            ),
            needToRedeployMarket || needToRedeployCapacity
        );

        address marketImpl = _deployContract("MarketImpl", "Market", abi.encode(coreAddr), isNewCore);
        address capacityImpl = _deployContract("CapacityImpl", "Capacity", abi.encode(coreAddr), isNewCore);

        address marketProxy = _deployContract(
            "Market", "ERC1967Proxy", abi.encode(marketImpl, abi.encodeWithSelector(Market.initialize.selector))
        );

        address capacityProxy = _deployContract(
            "Capacity",
            "ERC1967Proxy",
            abi.encode(
                capacityImpl,
                abi.encodeWithSelector(
                    Capacity.initialize.selector,
                    fltPrice_,
                    usdCollateralPerUnit_,
                    usdTargetRevenuePerEpoch_,
                    minDuration_,
                    minRewardPerEpoch_,
                    maxRewardPerEpoch_,
                    vestingDuration_,
                    slashingRate_,
                    minRequierdProofsPerEpoch_,
                    maxProofsPerEpoch_,
                    withdrawEpochesAfterFailed_,
                    maxFailedRatio_,
                    isWhitelistEnabled_,
                    initGlobalNonce_,
                    difficulty_,
                    randomXProxy
                )
            )
        );

        if (isNewCore) {
            console.log("\nCore deployed, initializing modules as well...");
            ICore(coreAddr).initializeModules(ICapacity(capacityProxy), IMarket(marketProxy));
        }

        // TODO: if needToRedeployMarket or needToRedeployCapacity - impl proxy should be update with impl.
        if (!isNewCore && (needToRedeployMarket || needToRedeployCapacity)) {
            revert("Update not implemented yet.");
        }
    }

    function _startDeploy() internal virtual {
        bool isTestnet = vm.envOr("TEST", false);
        if (!isTestnet) {
            _loadDepoyments(fullDeploymentsPath);
        }

        vm.startBroadcast();
        console.log("\nStart deploying...");
    }

    function _stopDeploy() internal virtual {
        bool isTestnet = vm.envOr("TEST", false);

        if (!isTestnet) {
            _printDeployments();
            _saveDeployments(fullDeploymentsPath);
        }

        vm.stopBroadcast();
        console.log("\nDeploy finished");
    }
}
