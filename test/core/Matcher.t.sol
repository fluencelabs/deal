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
import "test/utils/TestHelper.sol";
import "forge-std/StdCheats.sol";

contract MatcherTest is Test {
    using SafeERC20 for IERC20;

    // ------------------ Events ------------------
    event ComputeUnitMatched(
        bytes32 indexed peerId, IDeal deal, bytes32 unitId, uint256 dealCreationBlock, CIDV1 appCID
    );

    // ------------------ Variables ------------------
    DeployDealSystem.Deployment deployment;

    // ------------------ Internals ------------------

    function _registerOffersAndCC(
        uint256 offerCount,
        uint256 peerCountPerOffer,
        uint256 unitCountPerPeer,
        CIDV1[] memory effectors,
        address paymentToken,
        uint256 minPricePerWorkerEpoch,
        uint256 minProtocolVersion,
        uint256 maxProtocolVersion
    ) internal returns (bytes32[] memory offerIds, bytes32[][] memory peerIds, bytes32[][][] memory unitIds) {
        offerIds = new bytes32[](offerCount);
        peerIds = new bytes32[][](offerCount);
        unitIds = new bytes32[][][](offerCount);

        for (uint256 i = 0; i < offerCount; i++) {
            peerIds[i] = new bytes32[](peerCountPerOffer);
            unitIds[i] = new bytes32[][](peerCountPerOffer);

            IOffer.RegisterComputePeer[] memory peers = new IOffer.RegisterComputePeer[](peerCountPerOffer);
            for (uint256 j = 0; j < peerCountPerOffer; j++) {
                bytes32 peerId = TestHelper.pseudoRandom(abi.encode(i, "peerId", j));
                peerIds[i][j] = peerId;

                unitIds[i][j] = new bytes32[](unitCountPerPeer);
                for (uint256 k = 0; k < unitIds[i][j].length; k++) {
                    unitIds[i][j][k] = TestHelper.pseudoRandom(abi.encode(peerId, "unitId", k));
                }

                peers[j] = IOffer.RegisterComputePeer({peerId: peerId, unitIds: unitIds[i][j], owner: address(this)});
            }

            deployment.market.setProviderInfo("test", CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)}));
            offerIds[i] = deployment.market.registerMarketOffer(
                minPricePerWorkerEpoch,
                paymentToken,
                effectors,
                peers,
                minProtocolVersion,
                maxProtocolVersion
            );

            uint256 amount;
            bytes32[] memory commitmentIds = new bytes32[](peerCountPerOffer);

            for (uint256 j = 0; j < peerCountPerOffer; j++) {
                bytes32 commitmentId = deployment.capacity.createCommitment(
                    peerIds[i][j], deployment.capacity.minDuration(), address(this), 1
                );
                commitmentIds[j] = commitmentId;

                amount += deployment.capacity.getCommitment(commitmentId).collateralPerUnit * unitIds[i][j].length;
            }

            deployment.capacity.depositCollateral{value: amount}(commitmentIds);
        }
    }

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
    }

    // Simple positive test.
    function test_Match() public {
        CIDV1[] memory effectors = new CIDV1[](10);
        for (uint256 i = 0; i < effectors.length; i++) {
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("effector", i))});
        }

        address paymentToken = address(deployment.tUSD);
        uint256 creationBlock = block.number;
        uint256 pricePerWorkerEpoch = 1 ether;
        uint256 offerCount = 3;
        uint256 unitCountPerPeer = 1;
        uint256 peerCountPerOffer = 3;
        uint256 minWorkers = 1;
        uint256 maxWorkersPerProvider = unitCountPerPeer * peerCountPerOffer * offerCount;
        uint256 protocolVersion = DeployDealSystem.DEFAULT_MIN_PROTOCOL_VERSION;
        uint256 minProtocolVersion = DeployDealSystem.DEFAULT_MIN_PROTOCOL_VERSION;
        uint256 maxProtocolVersion = DeployDealSystem.DEFAULT_MAX_PROTOCOL_VERSION;

        // Total workers: offerCount * unitCountPerPeer * peerCountPerOffer. Thus, we have CU in excess.
        uint256 targetWorkers = offerCount * peerCountPerOffer * 1;
        CIDV1 memory appCID = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("appCID"))});

        DealMock dealMock = new DealMock(
            pricePerWorkerEpoch,
            paymentToken,
            targetWorkers,
            maxWorkersPerProvider,
            minWorkers,
            effectors,
            appCID,
            creationBlock,
            protocolVersion
        );

        (bytes32[] memory offerIds, bytes32[][] memory peerIds, bytes32[][][] memory unitIds) = _registerOffersAndCC(
            offerCount,
            peerCountPerOffer,
            unitCountPerPeer,
            effectors,
            paymentToken,
            pricePerWorkerEpoch,
            minProtocolVersion,
            maxProtocolVersion
        );

        StdCheats.skip(uint256(deployment.core.epochDuration()));

        // Convert units 3D array to 2D array.
        // Choose the first targetWorkers.
        bytes32[][] memory unitIds2D = new bytes32[][](offerIds.length);
        uint256 chosenComputeUnits = 0;
        for (uint256 i = 0; i < offerIds.length; i++) {
            // Dynamically choose array size.
            if ((peerCountPerOffer * unitCountPerPeer) < (targetWorkers - chosenComputeUnits)) {
                unitIds2D[i] = new bytes32[](peerCountPerOffer * unitCountPerPeer);
            } else {
                unitIds2D[i] = new bytes32[](targetWorkers - chosenComputeUnits);
            }

            uint256 currentUnitIdx = 0;
            for (uint256 j = 0; j < peerIds[i].length; j++) {
                if (chosenComputeUnits == targetWorkers) {
                    break;
                }
                for (uint256 k = 0; k < unitIds[i][j].length; k++) {
                    if (chosenComputeUnits == targetWorkers) {
                        break;
                    }
                    unitIds2D[i][currentUnitIdx] = unitIds[i][j][k];
                    currentUnitIdx += 1;
                    chosenComputeUnits += 1;

                    vm.expectEmit(true, true, true, true, address(deployment.market));
                    emit ComputeUnitMatched(
                        peerIds[i][j], IDeal(address(dealMock)), unitIds[i][j][k], creationBlock, appCID
                    );
                }
            }
        }
        deployment.market.matchDeal(IDeal(address(dealMock)), offerIds, unitIds2D);

        assertEq(dealMock.getComputeUnitCount(), targetWorkers, "Wrong number of compute units");
        uint256 currentUnit = 0;
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
    }
}

contract DealMock {
    uint256 public pricePerWorkerEpoch;
    address public paymentToken;
    CIDV1 public appCID;
    uint256 public creationBlock;
    uint256 public computeUnitCount;
    uint256 public targetWorkers;
    uint256 public maxWorkersPerProvider;
    uint256 public minWorkers;
    uint256 private protocolVersion;

    CIDV1[] internal _effectors;

    mapping(bytes32 => bool) public unitExists;
    mapping(bytes32 => address) public computeProviderByUnitId;
    mapping(bytes32 => bytes32) public peerIdByUnitId;
    mapping(address => uint256) public computeUnitCountByProvider;
    mapping(bytes32 => bool) public isComputePeerExist;

    constructor(
        uint256 _pricePerWorkerEpoch,
        address _paymentToken,
        uint256 _targetWorkers,
        uint256 _maxWorkersPerProvider,
        uint256 _minWorkers,
        CIDV1[] memory effectors_,
        CIDV1 memory _appCID,
        uint256 _creationBlock,
        uint256 protocolVersion_
    ) {
        pricePerWorkerEpoch = _pricePerWorkerEpoch;
        paymentToken = _paymentToken;
        targetWorkers = _targetWorkers;
        maxWorkersPerProvider = _maxWorkersPerProvider;
        minWorkers = _minWorkers;
        _effectors = effectors_;
        appCID = _appCID;
        creationBlock = _creationBlock;
        protocolVersion = protocolVersion_;
    }

    function effectors() external view returns (CIDV1[] memory) {
        return _effectors;
    }

    function getStatus() external pure returns (IDeal.Status) {
        return IDeal.Status.INACTIVE;
    }

    function addComputeUnit(address computeProvider, bytes32 unitId, bytes32 peerId) external {
        require(!unitExists[unitId], "Unit already exists");

        unitExists[unitId] = true;
        computeProviderByUnitId[unitId] = computeProvider;
        peerIdByUnitId[unitId] = peerId;
        isComputePeerExist[peerId] = true;

        computeUnitCountByProvider[computeProvider]++;
        computeUnitCount++;
    }

    function providersAccessType() external pure returns (IConfig.AccessType) {
        return IConfig.AccessType.NONE;
    }

    function isProviderAllowed(address) external pure returns (bool) {
        return true;
    }

    function getComputeUnitCount() external view returns (uint256) {
        return computeUnitCount;
    }

    function getComputeUnitCount(address provider) external view returns (uint256) {
        return computeUnitCountByProvider[provider];
    }

    function getProtocolVersion() external view returns (uint256) {
        return protocolVersion;
    }
}
