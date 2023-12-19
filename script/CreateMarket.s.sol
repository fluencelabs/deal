// // // SPDX-License-Identifier: UNLICENSED
// // pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";
// import "forge-std/Script.sol";
// import "forge-std/Vm.sol";
// import "src/deal/Deal.sol";
// import "src/deal/interfaces/IDeal.sol";
// import "src/core/Core.sol";
// import "src/core/Market.sol";
// import "src/dev/OwnableFaucet.sol";
// import "src/dev/TestERC20.sol";
// import "src/deal/base/Types.sol";
// import "./utils/Depoyments.sol";

// contract CreateMarket is Depoyments, Script {
//     //     using SafeERC20 for IERC20;

//     //     string constant DEPLOYMENTS_PATH = "/ts-client/deployments/";
//     //     string private fullDeploymentsPath;

//     // TODO: get from env as in hardhat?
//     uint256 MIN_DEPOSITED_EPOCHES = 2;

//     //     function setUp() external {
//     //         string memory fileNames = string.concat(Strings.toString(block.chainid), ".json");
//     //         fullDeploymentsPath = string.concat(vm.projectRoot(), DEPLOYMENTS_PATH, fileNames);
//     //     }

//     bytes32[4] effectorSuffixes = [bytes32("Dogu"), "Doge", "Dog", "KotenokGav"];

//     function _createOffers(
//         uint32 offersNumber,
//         Core core,
//         address fltAddress,
//         CIDV1[] memory effectors,
//         uint256 pricePerWorkerEpoch
//     ) internal {
//         for (uint32 i = 0; i < offersNumber; i++) {
//             bytes32 offerId = _pseudoRandom("offerId", i);
//             console.log(StdStyle.blue("current i:"), i);
//             console.log("Register with offerId...");
//             console.logBytes32(offerId);

//             //             Market.RegisterComputePeer[] memory registerComputePeers = new Market.RegisterComputePeer[](3);
//             //             for (uint256 j = 0; j < 3; j++) {
//             //                 registerComputePeers[j] = IMarket.RegisterComputePeer({
//             //                     peerId: _pseudoRandom(string.concat("peerId", Strings.toString(i)), j),
//             //                     freeUnits: 3
//             //                 });
//             //             }

//             console.log("Call registerMarketOffer...");
//             core.registerMarketOffer(offerId, pricePerWorkerEpoch, fltAddress, effectors, registerComputePeers);
//         }
//     }

//     function _createDeals(
//         uint256 dealsToCreate,
//         Core core,
//         ERC20 fltContract,
//         uint256 minWorkers,
//         uint256 targetWorkers,
//         uint256 pricePerWorkerEpoch,
//         uint256 maxWorkerPerProvider,
//         CIDV1[] memory effectors,
//         IConfig.AccessType accessType,
//         address[] memory accessList
//     ) internal returns (address[] memory) {
//         // TODO: change to another signer. Not deployer could deploy this...
//         address[] memory createdDeals = new address[](dealsToCreate);
//         for (uint32 i = 0; i < dealsToCreate; i++) {
//             uint256 newMaxWorkerPerProvider = maxWorkerPerProvider + i;
//             uint256 newMinWorkers = minWorkers + i;
//             uint256 newTargetWorkers = targetWorkers + i;
//             CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: _pseudoRandom("dealAppCID", i)});

//             uint256 minDeposit = newTargetWorkers * pricePerWorkerEpoch * MIN_DEPOSITED_EPOCHES;
//             console.log(
//                 "Idempotent FLT token approve for minDeposit = %s for Core [in situ there is only 1 transaction should be done].",
//                 minDeposit
//             );
//             fltContract.approve(address(core), minDeposit);

//             IDeal dealCreatedContract = core.deployDeal(
//                 appCID,
//                 fltContract,
//                 newMinWorkers,
//                 newTargetWorkers,
//                 newMaxWorkerPerProvider,
//                 pricePerWorkerEpoch,
//                 effectors,
//                 accessType,
//                 accessList
//             );
//             createdDeals[i] = address(dealCreatedContract);
//         }

//         return createdDeals;
//     }

//     function run() external {
//         _loadDepoyments(fullDeploymentsPath);

//         address coreAddress = deployments.contracts["Core"].addr;
//         Core core = Core(coreAddress);
//         address fltAddress = deployments.contracts["tFLT"].addr;
//         ERC20 fltContract = ERC20(fltAddress);
//         CIDV1[] memory effectors = new CIDV1[](10);
//         for (uint256 i = 0; i < effectorSuffixes.length; i++) {
//             effectors[i] = CIDV1({prefixes: 0x12345678, hash: effectorSuffixes[i]});
//         }

//         uint256 pricePerWorkerEpoch = 0.01 ether;

//         // Setup foundry run.
//         vm.startBroadcast();
//         console.log("Broadcast from address: %s", address(this));
//         uint256 tokenBalance = fltContract.balanceOf(address(this));
//         console.log("Token balance of broadcast runner is: %s", tokenBalance);

//         console.log("Register several market offers");
//         _createOffers(10, core, fltAddress, effectors, pricePerWorkerEpoch);
//         console.log("Registered several offers...");

//         console.log("Create Deals...");
//         uint256 minWorkers = 60;
//         uint256 targetWorkers = 60;
//         uint256 maxWorkerPerProvider = 3;
//         IConfig.AccessType accessType = IConfig.AccessType.NONE;
//         address[] memory accessList;

//         address[] memory createdDeals = _createDeals(
//             10,
//             core,
//             fltContract,
//             minWorkers,
//             targetWorkers,
//             pricePerWorkerEpoch,
//             maxWorkerPerProvider,
//             effectors,
//             accessType,
//             accessList
//         );
//         console.log("The first of created Deals: ", createdDeals[0]);

//         vm.stopBroadcast();
//     }

//     function _pseudoRandom(string memory seed, uint256 index) internal view returns (bytes32) {
//         return keccak256(abi.encodePacked(blockhash(block.number - 1), seed, index));
//     }
// }
