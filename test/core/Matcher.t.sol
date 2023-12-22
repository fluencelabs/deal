// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "src/core/Core.sol";
import "src/deal/interfaces/IConfig.sol";
import "src/deal/interfaces/IDeal.sol";
import "test/utils/DeployDealSystem.sol";
import "src/core/modules/market/Market.sol";
import "src/core/modules/market/interfaces/IOffer.sol";
import "test/utils/Random.sol";

contract MatcherTest is Test {
    using SafeERC20 for IERC20;

    // ------------------ Variables ------------------
    DeployDealSystem.Deployment deployment;

    // ------------------ Internals ------------------

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
                bytes32 peerId = Random.pseudoRandom(abi.encode(i, "peerId", j));
                peerIds[i][j] = peerId;

                unitIds[i][j] = new bytes32[](unitCountPerPeer);
                for (uint256 k = 0; k < unitIds[i][j].length; k++) {
                    unitIds[i][j][k] = Random.pseudoRandom(abi.encode(peerId, "unitId", k));
                }

                peers[j] = IOffer.RegisterComputePeer({peerId: peerId, unitIds: unitIds[i][j], owner: address(this)});
            }

            offerIds[i] = deployment.market.registerMarketOffer(minPricePerWorkerEpoch, paymentToken, effectors, peers);
        }
    }

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
    }

    function _returnFirstNComputeUnits(
        uint n, bytes32[] memory offerIds, bytes32[][] memory peerIds, bytes32[][][] memory unitIds) internal returns (bytes32[] memory) {
        bytes32[] memory chosenComputeUnits = new bytes32[](n);
        uint currentIdx = 0;
        for (uint256 i = 0; i < offerIds.length; i++) {
            for (uint256 j = 0; j < peerIds.length; j++) {
                for (uint256 k = 0; k < unitIds[i][j].length; k++) {
                    chosenComputeUnits[currentIdx] = unitIds[i][j][k];
                    currentIdx += 1;
                    if (currentIdx == n) {
                        return chosenComputeUnits;
                    }
                }
            }
        }
        return chosenComputeUnits;
    }

    // Simple positive test.
    function test_Match() public {
        CIDV1[] memory effectors = new CIDV1[](10);
        for (uint256 i = 0; i < effectors.length; i++) {
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: Random.pseudoRandom(abi.encode("effector", i))});
        }

        address paymentToken = address(deployment.tUSD);
        uint256 creationBlock = block.number;
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 offerCount = 3;
        uint256 unitCountPerPeer = 2;
        uint256 peerCountPerOffer = 3;
        // Total workers: offerCount * unitCountPerPeer * peerCountPerOffer. Thus, we have CU in excess.
        uint256 targetWorkers = offerCount * peerCountPerOffer;
        CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: Random.pseudoRandom(abi.encode("appCID"))});

        DealMock dealMock =
            new DealMock(pricePerWorkerEpoch, paymentToken, targetWorkers, effectors, appCID, creationBlock);

        (bytes32[] memory offerIds, bytes32[][] memory peerIds, bytes32[][][] memory unitIds) = _registerOffers(
            offerCount, peerCountPerOffer, unitCountPerPeer, effectors, paymentToken, pricePerWorkerEpoch
        );

        // Choose the first targetWorkers CU from already deployed and push them to match.
        bytes32[] memory unitIdsMatched = _returnFirstNComputeUnits(targetWorkers, offerIds, peerIds, unitIds);
        deployment.market.matchDeal(IDeal(address(dealMock)), unitIdsMatched);

        assertEq(dealMock.getComputeUnitCount(), targetWorkers, "Wrong number of compute units");
        uint currentUnit = 0;
        for (uint256 i = 0; i < offerIds.length; i++) {
            bytes32 offerId = offerIds[i];
            Market.Offer memory offer = deployment.market.getOffer(offerId);
            for (uint256 j = 0; j < peerIds[i].length; j++) {
                for (uint256 k = 0; k < unitIds[i][j].length; k++) {
                    bytes32 unitId = unitIds[i][j][k];

                    if (currentUnit < targetWorkers) {
                        // We should found out that those CU are matched.
                        assertEq(deployment.market.getComputeUnit(unitId).deal, address(dealMock), "Wrong deal");
                        assertEq(dealMock.computeProviderByUnitId(unitId), offer.provider, "Wrong compute provider");
                        assertEq(dealMock.peerIdByUnitId(unitId), peerIds[i][j], "Wrong peer id");
                        assertTrue(dealMock.unitExists(unitId), "Unit does not exist");
                    } else {
                        // We should found out that those CU are still free.
                        assertEq(deployment.market.getComputeUnit(unitId).deal, address(0), "Expected no deal.");
                        assertEq(dealMock.computeProviderByUnitId(unitId), address(0), "Expected no provider.");
                        assertEq(dealMock.peerIdByUnitId(unitId), bytes32(0), "Expected no peer id.");
                        assertTrue(!dealMock.unitExists(unitId), "Expected unitExists == false.");
                    }
                    currentUnit += 1;
                }
            }
        }

        //TODO: event test
    }
}

contract DealMock {
    uint256 public pricePerWorkerEpoch;
    address public paymentToken;
    CIDV1 public appCID;
    uint256 public creationBlock;
    uint256 public getComputeUnitCount;
    uint256 public targetWorkers;

    CIDV1[] internal _effectors;

    mapping(bytes32 => bool) public unitExists;
    mapping(bytes32 => address) public computeProviderByUnitId;
    mapping(bytes32 => bytes32) public peerIdByUnitId;

    constructor(
        uint256 _pricePerWorkerEpoch,
        address _paymentToken,
        uint256 _targetWorkers,
        CIDV1[] memory effectors_,
        CIDV1 memory _appCID,
        uint256 _creationBlock
    ) {
        pricePerWorkerEpoch = _pricePerWorkerEpoch;
        paymentToken = _paymentToken;
        targetWorkers = _targetWorkers;
        _effectors = effectors_;
        appCID = _appCID;
        creationBlock = _creationBlock;
    }

    function accessType() external view returns (IConfig.AccessType) {
        return IConfig.AccessType.NONE;
    }

    function isInAccessList(address addr) external view returns (bool) {
        return false;
    }

    function effectors() external view returns (CIDV1[] memory) {
        return _effectors;
    }

    function addComputeUnit(address computeProvider, bytes32 unitId, bytes32 peerId) external {
        console.logBytes32(unitId);
        require(!unitExists[unitId], "Unit already exists");

        unitExists[unitId] = true;
        computeProviderByUnitId[unitId] = computeProvider;
        peerIdByUnitId[unitId] = peerId;

        getComputeUnitCount++;
    }
}
