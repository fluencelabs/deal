/*
 * Fluence Compute Marketplace
 *
 * Copyright (C) 2024 Fluence DAO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "forge-std/StdCheats.sol";

import "src/deal/interfaces/IConfig.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/core/modules/market/interfaces/IMarket.sol";
import "src/core/modules/market/interfaces/IOffer.sol";

import "test/utils/TestWithDeployment.sol";
import "test/utils/TestHelper.sol";

contract MatcherTest is TestWithDeployment {
    using SafeERC20 for IERC20;

    // ------------------ Events ------------------
    event ComputeUnitMatched(
        bytes32 indexed peerId, IDeal deal, bytes32 unitId, uint256 dealCreationBlock, CIDV1 appCID
    );

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
                minPricePerWorkerEpoch, paymentToken, effectors, peers, minProtocolVersion, maxProtocolVersion
            );

            uint256 amount;
            bytes32[] memory commitmentIds = new bytes32[](peerCountPerOffer);

            for (uint256 j = 0; j < peerCountPerOffer; j++) {
                bytes32 commitmentId =
                    deployment.capacity.createCommitment(peerIds[i][j], deployment.core.minDuration(), address(this), 1);
                commitmentIds[j] = commitmentId;

                amount += deployment.capacity.getCommitment(commitmentId).collateralPerUnit * unitIds[i][j].length;
            }

            deployment.capacity.depositCollateral{value: amount}(commitmentIds);
        }
    }

    // ------------------ Test ------------------
    function setUp() public {
        _deploySystem();
    }

    struct MatcherTestParams {
        DealMock deal;
        uint256 offerCount;
        uint256 unitCountPerPeer;
        uint256 peerCountPerOffer;
        uint256 minProtocolVersion;
        uint256 maxProtocolVersion;
    }

    // Simple positive test.
    function test_Match() public {
        DealMock.InitArgs memory args;
        args.effectors = new CIDV1[](10);
        for (uint256 i = 0; i < args.effectors.length; i++) {
            args.effectors[i] = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("effector", i))});
        }

        MatcherTestParams memory params = MatcherTestParams({
            deal: DealMock(address(0)),
            offerCount: 3,
            unitCountPerPeer: 1,
            peerCountPerOffer: 3,
            minProtocolVersion: DEFAULT_MIN_PROTOCOL_VERSION,
            maxProtocolVersion: DEFAULT_MAX_PROTOCOL_VERSION
        });

        args.appCID = CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("appCID"))});
        args.paymentToken = address(deployment.tUSD);
        args.pricePerWorkerEpoch = 1 ether;
        args.minWorkers = 1;
        args.maxWorkersPerProvider = params.unitCountPerPeer * params.peerCountPerOffer * params.offerCount;
        args.protocolVersion = DEFAULT_MIN_PROTOCOL_VERSION;
        args.owner = address(this);
        args.creationBlock = block.number;

        // Total workers: offerCount * unitCountPerPeer * peerCountPerOffer. Thus, we have CU in excess.
        args.targetWorkers = params.offerCount * params.peerCountPerOffer * 1;

        params.deal = new DealMock(args);

        (bytes32[] memory offerIds, bytes32[][] memory peerIds, bytes32[][][] memory unitIds) = _registerOffersAndCC(
            params.offerCount,
            params.peerCountPerOffer,
            params.unitCountPerPeer,
            args.effectors,
            args.paymentToken,
            args.pricePerWorkerEpoch,
            params.minProtocolVersion,
            params.maxProtocolVersion
        );

        StdCheats.skip(uint256(deployment.core.epochDuration()));
        // Convert units 3D array to 2D array.
        // Choose the first targetWorkers.
        bytes32[][] memory unitIds2D = new bytes32[][](offerIds.length);
        uint256 chosenComputeUnits = 0;
        for (uint256 i = 0; i < offerIds.length; i++) {
            // Dynamically choose array size.
            if ((params.peerCountPerOffer * params.unitCountPerPeer) < (args.targetWorkers - chosenComputeUnits)) {
                unitIds2D[i] = new bytes32[](params.peerCountPerOffer * params.unitCountPerPeer);
            } else {
                unitIds2D[i] = new bytes32[](args.targetWorkers - chosenComputeUnits);
            }

            uint256 currentUnitIdx = 0;
            for (uint256 j = 0; j < peerIds[i].length; j++) {
                if (chosenComputeUnits == args.targetWorkers) {
                    break;
                }
                for (uint256 k = 0; k < unitIds[i][j].length; k++) {
                    if (chosenComputeUnits == args.targetWorkers) {
                        break;
                    }
                    unitIds2D[i][currentUnitIdx] = unitIds[i][j][k];
                    currentUnitIdx += 1;
                    chosenComputeUnits += 1;

                    vm.expectEmit(true, true, true, true, address(deployment.market));
                    emit ComputeUnitMatched(
                        peerIds[i][j], IDeal(address(params.deal)), unitIds[i][j][k], args.creationBlock, args.appCID
                    );
                }
            }
        }
        deployment.market.matchDeal(IDeal(address(params.deal)), offerIds, unitIds2D);

        assertEq(params.deal.getComputeUnitCount(), args.targetWorkers, "Wrong number of compute units");
        uint256 currentUnit = 0;
        for (uint256 i = 0; i < offerIds.length; i++) {
            bytes32 offerId = offerIds[i];
            IMarket.Offer memory offer = deployment.market.getOffer(offerId);

            for (uint256 j = 0; j < peerIds[i].length; j++) {
                for (uint256 k = 0; k < unitIds[i][j].length; k++) {
                    bytes32 unitId = unitIds[i][j][k];

                    if (currentUnit < args.targetWorkers) {
                        // We should found out that those CU are matched.
                        assertEq(deployment.market.getComputeUnit(unitId).deal, address(params.deal), "Wrong deal");
                        assertEq(params.deal.computeProviderByUnitId(unitId), offer.provider, "Wrong compute provider");
                        assertEq(params.deal.peerIdByUnitId(unitId), peerIds[i][j], "Wrong peer id");
                        assertTrue(params.deal.unitExists(unitId), "Unit does not exist");
                    } else {
                        // We should found out that those CU are still free.
                        assertEq(deployment.market.getComputeUnit(unitId).deal, address(0), "Expected no deal.");
                        assertEq(params.deal.computeProviderByUnitId(unitId), address(0), "Expected no provider.");
                        assertEq(params.deal.peerIdByUnitId(unitId), bytes32(0), "Expected no peer id.");
                        assertTrue(!params.deal.unitExists(unitId), "Expected unitExists == false.");
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
    address public owner;
    uint256 private protocolVersion;

    CIDV1[] internal _effectors;

    mapping(bytes32 => bool) public unitExists;
    mapping(bytes32 => address) public computeProviderByUnitId;
    mapping(bytes32 => bytes32) public peerIdByUnitId;
    mapping(address => uint256) public computeUnitCountByProvider;
    mapping(bytes32 => bool) public isComputePeerExist;

    struct InitArgs {
        uint256 pricePerWorkerEpoch;
        address paymentToken;
        uint256 targetWorkers;
        uint256 maxWorkersPerProvider;
        uint256 minWorkers;
        CIDV1[] effectors;
        CIDV1 appCID;
        uint256 creationBlock;
        uint256 protocolVersion;
        address owner;
    }

    constructor(InitArgs memory args) {
        pricePerWorkerEpoch = args.pricePerWorkerEpoch;
        paymentToken = args.paymentToken;
        targetWorkers = args.targetWorkers;
        maxWorkersPerProvider = args.maxWorkersPerProvider;
        minWorkers = args.minWorkers;
        for (uint256 i = 0; i < args.effectors.length; i++) {
            _effectors.push(args.effectors[i]);
        }
        appCID = args.appCID;
        creationBlock = args.creationBlock;
        protocolVersion = args.protocolVersion;
        owner = args.owner;
    }

    function effectors() external view returns (CIDV1[] memory) {
        return _effectors;
    }

    function getStatus() external pure returns (IDeal.Status) {
        return IDeal.Status.NOT_ENOUGH_WORKERS;
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
