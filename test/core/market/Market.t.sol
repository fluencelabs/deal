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

import "test/utils/TestWithDeployment.sol";
import "test/utils/TestHelper.sol";

import "src/core/modules/market/interfaces/IMarket.sol";

contract MarketTest is TestWithDeployment {
    using SafeERC20 for IERC20;

    // ------------------ Constants ------------------
    bytes32 private constant _OFFER_ID_PREFIX = bytes32(uint256(keccak256("fluence.market.offer")) - 1);

    // ------------------ Events ------------------
    event MarketOfferRegistered(
        address indexed provider,
        bytes32 offerId,
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] effectors,
        uint256 minProtocolVersion,
        uint256 maxProtocolVersion
    );
    event PeerCreated(bytes32 indexed offerId, bytes32 peerId, address owner);
    event ComputeUnitCreated(bytes32 indexed peerId, bytes32 unitId);

    // Init variables
    IMarket.RegisterComputePeer[] registerPeers;
    uint256 minPricePerWorkerEpoch;
    address paymentToken;
    CIDV1[] effectors;
    uint256 minProtocolVersion;
    uint256 maxProtocolVersion;

    // ------------------ Test ------------------
    function setUp() public {
        bool initialized = deployment.initialized;
        _deploySystem();

        if (initialized) {
            return;
        }

        paymentToken = address(deployment.tUSD);
        minPricePerWorkerEpoch = 1000;
        minProtocolVersion = DEFAULT_MIN_PROTOCOL_VERSION;
        maxProtocolVersion = DEFAULT_MAX_PROTOCOL_VERSION;

        for (uint256 i = 0; i < 10; i++) {
            effectors.push(CIDV1({prefixes: 0x12345678, hash: TestHelper.pseudoRandom(abi.encode("effector", i))}));
        }

        for (uint256 i = 0; i < 10; i++) {
            bytes32 peerId = TestHelper.pseudoRandom(abi.encode("peerId", i));

            bytes32[] memory unitIds = new bytes32[](5);
            for (uint256 j = 0; j < unitIds.length; j++) {
                unitIds[j] = keccak256(abi.encodePacked(TestHelper.pseudoRandom(abi.encode(peerId, "unitId", i, j))));
            }

            registerPeers.push(
                IOffer.RegisterComputePeer({
                    peerId: peerId,
                    unitIds: unitIds,
                    owner: address(bytes20(TestHelper.pseudoRandom(abi.encode("peerId-address", i))))
                })
            );
        }
    }

    function test_RegisterMarketOffer() public {
        bytes32 offerId = keccak256(
            abi.encodePacked(
                _OFFER_ID_PREFIX,
                address(this),
                block.number,
                abi.encodeWithSelector(
                    IOffer.registerMarketOffer.selector,
                    minPricePerWorkerEpoch,
                    paymentToken,
                    effectors,
                    registerPeers,
                    minProtocolVersion,
                    maxProtocolVersion
                )
            )
        );

        // Register offer
        deployment.market.setProviderInfo("test", CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)}));

        vm.expectEmit(true, true, false, true, address(deployment.market));
        emit MarketOfferRegistered(
            address(this),
            offerId,
            minPricePerWorkerEpoch,
            paymentToken,
            effectors,
            minProtocolVersion,
            maxProtocolVersion
        );

        for (uint256 i = 0; i < registerPeers.length; i++) {
            IOffer.RegisterComputePeer memory registerPeer = registerPeers[i];

            vm.expectEmit(true, true, false, true, address(deployment.market));
            emit PeerCreated(offerId, registerPeer.peerId, registerPeer.owner);

            for (uint256 j = 0; j < registerPeer.unitIds.length; j++) {
                bytes32 unitId = registerPeer.unitIds[j];

                vm.expectEmit(true, true, false, true, address(deployment.market));
                emit ComputeUnitCreated(registerPeer.peerId, unitId);
            }
        }

        bytes32 retOfferId = deployment.market.registerMarketOffer(
            minPricePerWorkerEpoch, paymentToken, effectors, registerPeers, minProtocolVersion, maxProtocolVersion
        );

        assertEq(retOfferId, offerId, "OfferId mismatch");
    }

    function test_GetOfferPeersUnits() public {
        deployment.market.setProviderInfo("test", CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)}));
        bytes32 offerId = deployment.market.registerMarketOffer(
            minPricePerWorkerEpoch, paymentToken, effectors, registerPeers, minProtocolVersion, maxProtocolVersion
        );

        IMarket.Offer memory offer = deployment.market.getOffer(offerId);
        assertEq(offer.provider, address(this));
        assertEq(offer.minPricePerWorkerEpoch, minPricePerWorkerEpoch);
        assertEq(offer.paymentToken, paymentToken);
        assertEq(offer.minProtocolVersion, minProtocolVersion);
        assertEq(offer.maxProtocolVersion, maxProtocolVersion);

        for (uint256 i = 0; i < registerPeers.length; i++) {
            IMarket.RegisterComputePeer memory registerPeer = registerPeers[i];
            IMarket.ComputePeer memory computePeer = deployment.market.getComputePeer(registerPeer.peerId);

            require(computePeer.offerId == offerId, "OfferId mismatch");
            require(computePeer.unitCount == registerPeer.unitIds.length, "NextUnitIndex mismatch");
            require(computePeer.owner == registerPeer.owner, "Owner mismatch");

            for (uint256 j = 0; j < registerPeer.unitIds.length; j++) {
                bytes32 unitId = registerPeer.unitIds[j];
                IMarket.ComputeUnit memory computeUnit = deployment.market.getComputeUnit(unitId);

                require(computeUnit.peerId == registerPeer.peerId, "PeerId mismatch");
                require(computeUnit.deal == address(0), "Deal address mismatch");
            }
        }
    }
}
