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

// It creates market example on chain.
// Currently used for sync Network Explorer frontend dev.
// To run this script you also should use the Core Owner (it uses some restricted admin methods).
// It creates differently configurated Deals in terms of access lists.
contract CreateMarket is Depoyments, Script {
    using SafeERC20 for IERC20;

    string constant DEPLOYMENTS_PATH = "/deployments/";
    // It is synced with subgraph: networkConstants.ts
    bytes32[2] effectorSuffixes = [bytes32("Dogu"), "Doge"];
    string[2] effectorDescriptions = ["cURL", "IPFS"];
    IMarket market;
    ICapacity capacity;
    ICore core;
    IERC20 tUSD;
    string envName;

    function setUp() external {
        envName = vm.envString("CONTRACTS_ENV_NAME");
        string memory fileNames = string.concat(envName, ".json");
        string memory fullDeploymentsPath = string.concat(vm.projectRoot(), DEPLOYMENTS_PATH, fileNames);
        _loadDepoyments(fullDeploymentsPath);

        market = IMarket(deployments.contracts["Market"].addr);
        capacity = ICapacity(deployments.contracts["Capacity"].addr);
        core = ICore(deployments.contracts["Core"].addr);
        tUSD = IERC20(deployments.contracts["tUSD"].addr);
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

        market.setProviderInfo("TestProvider", CIDV1({prefixes: 0x12345678, hash: bytes32(0)}));
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
        uint256 startTargetWorkers,
        uint256 startMaxWorkerPerProvider,
        uint256 pricePerWorkerEpoch,
        CIDV1[] memory effectors
    ) internal returns (address[] memory) {
        // TODO: change to another signer. Not deployer could deploy this...

        // (arifmetic progression for target workers) * pricePerWorkerEpoch * core.minDealDepositedEpoches() * dealCount
        uint256 totalApprove = (startTargetWorkers + (startTargetWorkers + dealCount)) / 2 * dealCount
            * pricePerWorkerEpoch * core.minDealDepositedEpoches() * dealCount;
        tUSD.approve(address(market), totalApprove);

        address[] memory createdDeals = new address[](dealCount);
        for (uint32 i = 0; i < dealCount; i++) {
            uint256 newMinWorkers = 1 + i;
            uint256 newTargetWorkers = startTargetWorkers + i;
            uint256 newMaxWorkerPerProvider = startMaxWorkerPerProvider + i;

            // Generate providersAccessList: 1 pseudo and 1 existed.
            CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: pseudoRandom(abi.encode("dealAppCID", i))});
            address[] memory providersAccessList = new address[](2);  // TODO: to const.
            for (uint j = 0; j < 2; j++) {
                if (j % 2 == 0) {
                    providersAccessList[j] = address(this);
                } else {
                    providersAccessList[j] = address(0x0);
                }
            }
            // Add zoo into Deals configuration of whitelists.
            if (i % 3 == 0) {
                IDeal dealCreatedContract = market.deployDeal(
                    appCID,
                    tUSD,
                    newMinWorkers,
                    newTargetWorkers,
                    newMaxWorkerPerProvider,
                    pricePerWorkerEpoch,
                    effectors,
                    IConfig.AccessType.NONE,
                    new address[](0)
                );
                createdDeals[i] = address(dealCreatedContract);
            } else if (i % 2 == 0) {
                IDeal dealCreatedContract = market.deployDeal(
                    appCID,
                    tUSD,
                    newMinWorkers,
                    newTargetWorkers,
                    newMaxWorkerPerProvider,
                    pricePerWorkerEpoch,
                    effectors,
                    IConfig.AccessType.WHITELIST,
                    providersAccessList
                );
                createdDeals[i] = address(dealCreatedContract);
            } else {
                IDeal dealCreatedContract = market.deployDeal(
                    appCID,
                    tUSD,
                    newMinWorkers,
                    newTargetWorkers,
                    newMaxWorkerPerProvider,
                    pricePerWorkerEpoch,
                    effectors,
                    IConfig.AccessType.BLACKLIST,
                    providersAccessList
                );
                createdDeals[i] = address(dealCreatedContract);
            }

        }

        return createdDeals;
    }

    function _createCCs(bytes32[] memory peers) internal returns (bytes32[] memory) {
        uint capacityMinDuration = capacity.minDuration();
        bytes32[] memory commitments = new bytes32[](peers.length);
        // TODO: use another signer (deligator)...
        for (uint i=0; i < peers.length; ++i) {
            commitments[i] = capacity.createCommitment(
                peers[i],
                capacityMinDuration,
                // Delegator will be assigned on deposit.
                address(0),
                1
            );
        }
        return commitments;
    }

    function run() external {
        // Setup foundry run.
        // add tokens for local network, if it is local anvil node.
        if (keccak256(bytes(envName)) == keccak256(bytes("local"))) {
            console.log('envName is local, feed with Eth...');
            vm.deal(address(this), 100 ether);
        }
        vm.startBroadcast();
        console.log("Broadcast from address: %s", address(this));

        CIDV1[] memory effectors = new CIDV1[](10);
        for (uint256 i = 0; i < effectorSuffixes.length; i++) {
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: effectorSuffixes[i]});
            console.log("setEffectorInfo (descriptions): %s", effectorDescriptions[i]);
            // This transaction will broke system coz of https://github.com/graphprotocol/graph-node/issues/5171
            // TODO: uncomment subgraph handlers and return support for events from this transaction.
            market.setEffectorInfo(
                effectors[i],
                effectorDescriptions[i],
                CIDV1({prefixes: 0x12345678, hash: bytes32(0)})
            );
        }

        uint256 offerCount = 10;
        uint256 peerCountPerOffer = 3;
        uint256 unitCountPerPeer = 2;
        uint256 minPricePerWorkerEpoch = 0.01 ether;

        uint256 tokenBalance = tUSD.balanceOf(address(this));
        console.log("tUSD token balance of broadcast runner is: %s", tokenBalance);
        console.log("Eth balance of broadcast runner is: %s", address(this).balance);

        console.log("Register several market offers..");
        (bytes32[] memory offerIds, bytes32[][] memory peerIds, bytes32[][][] memory unitIds) = _registerOffers(
            offerCount, peerCountPerOffer, unitCountPerPeer, effectors, address(tUSD), minPricePerWorkerEpoch
        );

        console.log("Create CC for all peers...");
        for (uint i=0; i < offerIds.length; ++i) {
            bytes32[] memory commitments = _createCCs(peerIds[i]);
        }

        console.log("Create Deals...");
        uint256 dealCount = 10;
        uint256 startTargetWorkers = 60;
        uint256 startMaxWorkerPerProvider = 3;

        address[] memory createdDeals =
            _createDeals(dealCount, startTargetWorkers, startMaxWorkerPerProvider, minPricePerWorkerEpoch, effectors);

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
