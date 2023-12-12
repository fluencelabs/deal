// SPDX-License-Identifier: UNLICENSED
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

contract DeployContracts is Depoyments, Script {
    using SafeERC20 for IERC20;

    // ------------------ Local ENV constant ------------------
    uint256 constant LOCAL_CHAIN_ID = 31337;
    string constant DEFAULT_ANVIL_MNEMONIC = "test test test test test test test test test test test junk";
    uint256 constant LOCAL_tFLT_BALANCE = 1000000 ether;
    uint256 constant LOCAL_tUSD_BALANCE = 1000000 ether;

    // ------------------ Default constant ------------------
    uint256 constant DEFAULT_EPOCH_DURATION = 15;
    uint256 constant DEFAULT_MIN_DEPOSITED_EPOCHES = 2;
    uint256 constant DEFAULT_MIN_REMATCHING_EPOCHES = 2;

    // ------------------ Deploy result ------------------
    string constant DEPLOYMENTS_PATH = "/deployments/";
    string private fullDeploymentsPath;
    // ------------------ Types ------------------

    struct ENV {
        uint256 chainId;
        uint256 epochDuration;
        uint256 minDepositedEpoches;
        uint256 minRematchingEpoches;
    }

    function setUp() external {
        string memory fileNames = string.concat(Strings.toString(block.chainid), ".json");
        fullDeploymentsPath = string.concat(vm.projectRoot(), DEPLOYMENTS_PATH, fileNames);
    }

    function run() external {
        ENV memory env = _loadENV();

        _startDeploy();
        (IERC20 tFLT, IERC20 tUSD) = _deployTestTokens();

        _deployMulticall3();

        if (env.chainId == LOCAL_CHAIN_ID) {
            string memory mnemonic = vm.envOr("ANVIL_MNEMONIC", DEFAULT_ANVIL_MNEMONIC);
            for (uint32 i = 0; i < 10; i++) {
                address addr = vm.rememberKey(vm.deriveKey(mnemonic, i));
                tFLT.safeTransfer(addr, LOCAL_tFLT_BALANCE);
                tUSD.safeTransfer(addr, LOCAL_tUSD_BALANCE);
            }
        } else {
            (address faucet, bool isNew) = _deployTestFaucet(tFLT, tUSD);
            if (isNew) {
                tFLT.safeTransfer(address(faucet), type(uint256).max);
                tUSD.safeTransfer(address(faucet), type(uint256).max);
            }
        }

        _deployCore(tFLT, env.epochDuration, env.minDepositedEpoches, env.minRematchingEpoches);
        _stopDeploy();
    }

    // ------------------ Internal functions ------------------

    function _loadENV() internal returns (ENV memory) {
        uint256 chainId = block.chainid;
        uint256 epochDuration = vm.envOr("EPOCH_DURATION", DEFAULT_EPOCH_DURATION);
        uint256 minDepositedEpoches = vm.envOr("MIN_DEPOSITED_EPOCHES", DEFAULT_MIN_DEPOSITED_EPOCHES);
        uint256 minRematchingEpoches = vm.envOr("MIN_REMATCHING_EPOCHES", DEFAULT_MIN_REMATCHING_EPOCHES);

        console.log("----------------- ENV -----------------");
        console.log(StdStyle.blue("CHAIN_ID:"), block.chainid);
        console.log(StdStyle.blue("EPOCH_DURATION:"), epochDuration);
        console.log(StdStyle.blue("MIN_DEPOSITED_EPOCHES:"), minDepositedEpoches);
        console.log(StdStyle.blue("MIN_REMATCHING_EPOCHES:"), minRematchingEpoches);

        return ENV({
            chainId: chainId,
            epochDuration: epochDuration,
            minDepositedEpoches: minDepositedEpoches,
            minRematchingEpoches: minRematchingEpoches
        });
    }

    function _deployTestTokens() internal returns (IERC20 tFLT, IERC20 tUSD) {
        bytes memory args = abi.encode("Fluence Token", "tFLT");
        tFLT = IERC20(_deployContract("tFLT", "TestERC20", args));

        args = abi.encode("USD Token", "tUSD");
        tUSD = IERC20(_deployContract("tUSD", "TestERC20", args));
    }

    function _deployMulticall3() internal returns (Multicall3 multicall) {
        bytes memory args = abi.encode();
        multicall = Multicall3(_deployContract("Multicall3", "Multicall3", args));
    }

    function _deployTestFaucet(IERC20 tFLT, IERC20 tUSD) internal returns (address faucet, bool isNew) {
        bytes memory args = abi.encode(tFLT, tUSD);
        return _tryDeployContract("Faucet", "OwnableFaucet", args);
    }

    function _deployCore(IERC20 flt, uint256 epochDuration, uint256 minDepositedEpoches, uint256 minRematchingEpoches)
        internal
    {
        address coreImpl = _deployContract("CoreImpl", "Core", new bytes(0));
        address dealImpl = _deployContract("DealImpl", "Deal", new bytes(0));

        bytes memory args = abi.encode(
            coreImpl,
            abi.encodeWithSelector(
                Core.initialize.selector, flt, epochDuration, minDepositedEpoches, minRematchingEpoches, dealImpl
            )
        );
        _deployContract("Core", "ERC1967Proxy", args);
    }

    function _startDeploy() internal {
        bool isTestnet = vm.envOr("TEST", false);
        if (!isTestnet) {
            _loadDepoyments(fullDeploymentsPath);
        }

        vm.startBroadcast();
        console.log("\nStart deploying...");
    }

    function _stopDeploy() internal {
        bool isTestnet = vm.envOr("TEST", false);

        if (!isTestnet) {
            _printDeployments();
            _saveDeployments(fullDeploymentsPath);
        }

        vm.stopBroadcast();
        console.log("\nDeploy finished");
    }
}
