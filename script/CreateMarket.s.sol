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
import "src/core/Market.sol";
import "src/dev/OwnableFaucet.sol";
import "src/dev/TestERC20.sol";
import "src/deal/base/Types.sol";
import "./utils/Depoyments.sol";

contract CreateMarket is Depoyments, Script {
    using SafeERC20 for IERC20;

    string constant DEPLOYMENTS_PATH = "/ts-client/deployments/";
    string private fullDeploymentsPath;

    string constant DEFAULT_ANVIL_MNEMONIC = "test test test test test test test test test test test junk";

    function setUp() external {
        string memory fileNames = string.concat(Strings.toString(block.chainid), ".json");
        fullDeploymentsPath = string.concat(vm.projectRoot(), DEPLOYMENTS_PATH, fileNames);
    }

    function run() external {
        _loadDepoyments(fullDeploymentsPath);

        Core core = Core(deployments.contracts["Core"].addr);
        address fltAddress = deployments.contracts["tFLT"].addr;
        CIDV1[] memory effectors = new CIDV1[](10);
        for (uint256 i = 0; i < 10; i++) {
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: _pseudoRandom("effector", i)});
        }

        uint256 pricePerWorkerEpoch = 0.01 ether;
        string memory mnemonic = vm.envOr("ANVIL_MNEMONIC", DEFAULT_ANVIL_MNEMONIC);
        for (uint32 i = 0; i < 10; i++) {
            bytes32 offerId = _pseudoRandom("offerId", i);

            uint256 privateKey = vm.deriveKey(mnemonic, i);
            vm.startBroadcast(privateKey);

            Market.RegisterComputePeer[] memory registerComputePeers = new Market.RegisterComputePeer[](3);
            for (uint256 j = 0; j < 3; j++) {
                registerComputePeers[j] = Market.RegisterComputePeer({
                    peerId: _pseudoRandom(string.concat("peerId", Strings.toString(i)), j),
                    freeUnits: 3
                });
            }

            core.registerMarketOffer(offerId, pricePerWorkerEpoch, fltAddress, effectors, registerComputePeers);

            vm.stopBroadcast();
        }
    }

    function _pseudoRandom(string memory seed, uint256 index) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(blockhash(block.number - 1), seed, index));
    }
}
