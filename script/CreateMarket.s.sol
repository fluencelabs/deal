// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "forge-std/Script.sol";
import "forge-std/Vm.sol";
import "src/deal/Deal.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/core/Core.sol";
import "src/core/modules/market/Market.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/dev/OwnableFaucet.sol";
import "src/dev/TestERC20.sol";
import "src/deal/base/Types.sol";
import "./utils/Depoyments.sol";

contract CreateMarket is Depoyments, Script {
    using SafeERC20 for IERC20;

    string constant DEPLOYMENTS_PATH = "/deployments/";
    bytes32[4] effectorSuffixes = [bytes32("Dogu"), "Doge", "Dog", "KotenokGav"];
    IMarket market;
    ICore core;
    IERC20 tFLT;

    function setUp() external {
        string memory envName = vm.envString("CONTRACTS_ENV_NAME");
        string memory fileNames = string.concat(envName, ".json");
        string memory fullDeploymentsPath = string.concat(vm.projectRoot(), DEPLOYMENTS_PATH, fileNames);
        _loadDepoyments(fullDeploymentsPath);

        market = IMarket(deployments.contracts["Market"].addr);
        core = ICore(deployments.contracts["Core"].addr);
        tFLT = IERC20(deployments.contracts["tFLT"].addr);
    }

    function _registerOffers(
        uint256 offerCount,
        uint256 peerCountPerOffer,
        uint256 unitCountPerPeer,
        CIDV1[] memory effectors,
        address paymentToken,
        uint256 minPricePerWorkerEpoch
    ) internal returns (bytes32[] memory offerIds, bytes32[][] memory peerIds, bytes32[][][] memory unitIds) {
        offerIds = new bytes32[](offerCount);
        peerIds = new bytes32[][](offerCount);
        unitIds = new bytes32[][][](offerCount);

        for (uint256 i = 0; i < offerCount; i++) {
            peerIds[i] = new bytes32[](peerCountPerOffer);
            unitIds[i] = new bytes32[][](peerCountPerOffer);

            IOffer.RegisterComputePeer[] memory peers = new IOffer.RegisterComputePeer[](peerCountPerOffer);
            for (uint256 j = 0; j < peerCountPerOffer; j++) {
                bytes32 peerId = pseudoRandom(abi.encode(i, "peerId", j));
                peerIds[i][j] = peerId;

                unitIds[i][j] = new bytes32[](unitCountPerPeer);
                for (uint256 k = 0; k < unitIds[i][j].length; k++) {
                    unitIds[i][j][k] = pseudoRandom(abi.encode(peerId, "unitId", k));
                }

                peers[j] = IOffer.RegisterComputePeer({peerId: peerId, unitIds: unitIds[i][j], owner: address(this)});
            }

            offerIds[i] = market.registerMarketOffer(minPricePerWorkerEpoch, paymentToken, effectors, peers);

            console.log("Register with offerId...");
            console.logBytes32(offerIds[i]);
        }
    }

    function _createDeals(
        uint256 dealCount,
        uint256 startMinWorkers,
        uint256 startTargetWorkers,
        uint256 startMaxWorkerPerProvider,
        uint256 pricePerWorkerEpoch,
        CIDV1[] memory effectors
    ) internal returns (address[] memory) {
        // TODO: change to another signer. Not deployer could deploy this...

        // (arifmetic progression for target workers) * pricePerWorkerEpoch * core.minDealDepositedEpoches() * dealCount
        uint256 totalApprove = (startTargetWorkers + (startTargetWorkers + dealCount)) / 2 * dealCount
            * pricePerWorkerEpoch * core.minDealDepositedEpoches() * dealCount;
        tFLT.approve(address(market), totalApprove);

        address[] memory createdDeals = new address[](dealCount);
        for (uint32 i = 0; i < dealCount; i++) {
            uint256 newMinWorkers = 1 + i;
            uint256 newTargetWorkers = startTargetWorkers + i;
            uint256 newMaxWorkerPerProvider = startMaxWorkerPerProvider + i;

            CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: pseudoRandom(abi.encode("dealAppCID", i))});
            IDeal dealCreatedContract = market.deployDeal(
                appCID,
                tFLT,
                newMinWorkers,
                newTargetWorkers,
                newMaxWorkerPerProvider,
                pricePerWorkerEpoch,
                effectors,
                IConfig.AccessType.NONE,
                new address[](0)
            );
            createdDeals[i] = address(dealCreatedContract);
        }

        return createdDeals;
    }

    function run() external {
        CIDV1[] memory effectors = new CIDV1[](10);
        for (uint256 i = 0; i < effectorSuffixes.length; i++) {
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: effectorSuffixes[i]});
        }

        uint256 offerCount = 10;
        uint256 peerCountPerOffer = 3;
        uint256 unitCountPerPeer = 2;
        uint256 minPricePerWorkerEpoch = 0.01 ether;

        // Setup foundry run.
        vm.startBroadcast();
        console.log("Broadcast from address: %s", address(this));

        uint256 tokenBalance = tFLT.balanceOf(address(this));
        console.log("Token balance of broadcast runner is: %s", tokenBalance);

        console.log("Register several market offers..");
        _registerOffers(
            offerCount, peerCountPerOffer, unitCountPerPeer, effectors, address(tFLT), minPricePerWorkerEpoch
        );

        console.log("Create Deals...");
        uint256 dealCount = 10;
        uint256 startMinWorkers = 60;
        uint256 startTargetWorkers = 60;
        uint256 startMaxWorkerPerProvider = 3;

        address[] memory createdDeals = _createDeals(
            dealCount, startMinWorkers, startTargetWorkers, startMaxWorkerPerProvider, minPricePerWorkerEpoch, effectors
        );

        console.log("Created deals:");
        for (uint256 i = 0; i < createdDeals.length; i++) {
            console.log(createdDeals[i]);
        }

        vm.stopBroadcast();
    }

    function pseudoRandom(bytes memory seed) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(blockhash(block.number - 1), seed));
    }
}
