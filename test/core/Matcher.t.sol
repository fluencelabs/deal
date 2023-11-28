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
        uint256 count,
        CIDV1[] memory effectors,
        address paymentToken,
        uint256 minPricePerWorkerEpoch,
        uint256 unitCountPerPeer
    ) internal returns (bytes32[] memory offerIds) {
        offerIds = new bytes32[](count);

        for (uint256 i = 0; i < count; i++) {
            bytes32 offerId = Random.pseudoRandom(abi.encode("offerId", i));

            Market.RegisterComputePeer[] memory peers = new Market.RegisterComputePeer[](10);
            for (uint256 j = 0; j < 10; j++) {
                peers[j] = Market.RegisterComputePeer({
                    peerId: Random.pseudoRandom(abi.encode(offerId, "peers", j)),
                    freeUnits: unitCountPerPeer
                });
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
        uint256 offerCount = 10;
        uint256 unitCountPerPeer = 5;
        uint256 freeUnitCount = offerCount * unitCountPerPeer;
        CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: Random.pseudoRandom(abi.encode("appCID"))});

        DealMock dealMock = new DealMock(
            pricePerWorkerEpoch,
            paymentToken,
            offerCount * unitCountPerPeer,
            effectors,
            appCID,
            creationBlock
        );

        bytes32[] memory offerIds =
            _registerOffers(offerCount, effectors, paymentToken, pricePerWorkerEpoch, unitCountPerPeer);

        //deployment.core.matchDeal(IDeal(address(dealMock)));

        //TODO: add expect
        //TODO: event test
    }
}

contract DealMock {
    uint256 public pricePerWorkerEpoch;
    address public paymentToken;
    uint256 public freeWorkerSlots;
    CIDV1 public appCID;
    uint256 public creationBlock;

    CIDV1[] internal _effectors;

    mapping(bytes32 => bool) public unitExists;
    mapping(bytes32 => address) public computeProviderByUnitId;

    constructor(
        uint256 _pricePerWorkerEpoch,
        address _paymentToken,
        uint256 _freeWorkerSlots,
        CIDV1[] memory effectors_,
        CIDV1 memory _appCID,
        uint256 _creationBlock
    ) {
        pricePerWorkerEpoch = _pricePerWorkerEpoch;
        paymentToken = _paymentToken;
        freeWorkerSlots = _freeWorkerSlots;
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
        require(freeWorkerSlots > 0, "No free worker slots");

        unitExists[unitId] = true;
        computeProviderByUnitId[unitId] = computeProvider;

        freeWorkerSlots--;
    }
}
