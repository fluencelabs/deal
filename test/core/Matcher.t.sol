// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "src/core/Core.sol";
import "src/deal/interfaces/IConfig.sol";
import "src/deal/interfaces/IDeal.sol";
import "test/utils/DeployDealSystem.sol";
import "src/core/Market.sol";
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
            bytes32 offerId = Random.pseudoRandom(abi.encode("offerId", i));
            offerIds[i] = offerId;

            peerIds[i] = new bytes32[](peerCountPerOffer);
            unitIds[i] = new bytes32[][](peerCountPerOffer);

            Market.RegisterComputePeer[] memory peers = new Market.RegisterComputePeer[](peerCountPerOffer);
            for (uint256 j = 0; j < peerCountPerOffer; j++) {
                bytes32 peerId = Random.pseudoRandom(abi.encode(offerId, "peerId", j));
                peerIds[i][j] = peerId;
                peers[j] = Market.RegisterComputePeer({peerId: peerId, freeUnits: unitCountPerPeer});

                unitIds[i][j] = new bytes32[](unitCountPerPeer);
                for (uint256 k = 0; k < unitCountPerPeer; k++) {
                    unitIds[i][j][k] = keccak256(abi.encodePacked(offerId, peerId, k));
                }
            }

            deployment.core.registerMarketOffer(offerId, minPricePerWorkerEpoch, paymentToken, effectors, peers);
        }
    }

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
    }

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
        uint256 targetWorkers = offerCount * peerCountPerOffer;
        CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: Random.pseudoRandom(abi.encode("appCID"))});

        DealMock dealMock =
            new DealMock(pricePerWorkerEpoch, paymentToken, targetWorkers, effectors, appCID, creationBlock);

        (bytes32[] memory offerIds, bytes32[][] memory peerIds, bytes32[][][] memory unitIds) = _registerOffers(
            offerCount, peerCountPerOffer, unitCountPerPeer, effectors, paymentToken, pricePerWorkerEpoch
        );

        deployment.core.matchDeal(IDeal(address(dealMock)));

        assertEq(dealMock.getComputeUnitCount(), targetWorkers, "Wrong number of compute units");
        for (uint256 i = 0; i < offerIds.length; i++) {
            bytes32 offerId = offerIds[i];
            Market.OfferInfo memory offer = deployment.core.getOffer(offerId);
            for (uint256 j = 0; j < peerIds[i].length; j++) {
                bytes32 unitId = unitIds[i][j][0];
                assertEq(deployment.core.getComputeUnit(unitId).deal, address(dealMock));
                assertEq(dealMock.computeProviderByUnitId(unitId), offer.owner, "Wrong compute provider");
                assertTrue(dealMock.unitExists(unitId), "Unit does not exist");
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

    function addComputeUnit(address computeProvider, bytes32 unitId) external {
        require(!unitExists[unitId], "Unit already exists");

        unitExists[unitId] = true;
        computeProviderByUnitId[unitId] = computeProvider;

        getComputeUnitCount++;
    }
}
