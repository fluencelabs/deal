// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "forge-std/Vm.sol";
import "src/core/Core.sol";
import "test/utils/DeployDealSystem.sol";
import "src/core/Market.sol";
import "test/utils/Random.sol";

contract MarketTest is Test {
    using SafeERC20 for IERC20;

    // ------------------ Constants ------------------
    bytes32 private constant _OFFER_ID_PREFIX = bytes32(uint256(keccak256("fluence.core.market.offer")) - 1);

    // ------------------ Events ------------------
    event MarketOfferRegistered(
        address indexed provider,
        bytes32 offerId,
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] effectors
    );
    event PeerCreated(bytes32 indexed offerId, bytes32 peerId, address owner);
    event ComputeUnitCreated(bytes32 indexed peerId, bytes32 unitId);

    // ------------------ Variables ------------------
    DeployDealSystem.Deployment deployment;

    // Init variables
    Market.RegisterComputePeer[] registerPeers;
    uint256 minPricePerWorkerEpoch;
    address paymentToken;
    CIDV1[] effectors;

    // ------------------ Test ------------------
    function setUp() public {
        bool initialized = deployment.initialized;
        deployment = DeployDealSystem.deployDealSystem();

        if (initialized) {
            return;
        }

        paymentToken = address(deployment.tUSD);
        minPricePerWorkerEpoch = 1000;

        for (uint256 i = 0; i < 10; i++) {
            effectors.push(CIDV1({prefixes: 0x12345678, hash: Random.pseudoRandom(abi.encode("effector", i))}));
        }

        for (uint256 i = 0; i < 10; i++) {
            registerPeers.push(
                IMarket.RegisterComputePeer({
                    peerId: Random.pseudoRandom(abi.encode("peerId", i)),
                    unitCount: (i + 1) * 5,
                    owner: address(bytes20(Random.pseudoRandom(abi.encode("peerId-address", i))))
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
                    Market.registerMarketOffer.selector, minPricePerWorkerEpoch, paymentToken, effectors, registerPeers
                )
            )
        );

        vm.expectEmit(true, true, false, true, address(deployment.core));
        emit MarketOfferRegistered(address(this), offerId, minPricePerWorkerEpoch, paymentToken, effectors);

        for (uint256 i = 0; i < registerPeers.length; i++) {
            Market.RegisterComputePeer memory registerPeer = registerPeers[i];

            vm.expectEmit(true, true, false, true, address(deployment.core));
            emit PeerCreated(offerId, registerPeer.peerId, registerPeer.owner);

            for (uint256 j = 0; j < registerPeer.unitCount; j++) {
                bytes32 unitId = keccak256(abi.encodePacked(offerId, registerPeer.peerId, j));

                vm.expectEmit(true, true, false, true, address(deployment.core));
                emit ComputeUnitCreated(registerPeer.peerId, unitId);
            }
        }

        // Register offer
        bytes32 retOfferId =
            deployment.core.registerMarketOffer(minPricePerWorkerEpoch, paymentToken, effectors, registerPeers);

        assertEq(retOfferId, offerId, "OfferId mismatch");
    }

    function test_GetOfferPeersUnits() public {
        bytes32 offerId =
            deployment.core.registerMarketOffer(minPricePerWorkerEpoch, paymentToken, effectors, registerPeers);

        Market.Offer memory offer = deployment.core.getOffer(offerId);
        assertEq(offer.provider, address(this));
        assertEq(offer.minPricePerWorkerEpoch, minPricePerWorkerEpoch);
        assertEq(offer.paymentToken, paymentToken);

        for (uint256 i = 0; i < registerPeers.length; i++) {
            Market.RegisterComputePeer memory registerPeer = registerPeers[i];
            Market.ComputePeer memory computePeer = deployment.core.getComputePeer(registerPeer.peerId);

            require(computePeer.offerId == offerId, "OfferId mismatch");
            require(computePeer.unitCount == registerPeer.unitCount, "NextUnitIndex mismatch");
            require(computePeer.owner == registerPeer.owner, "Owner mismatch");

            for (uint256 j = 0; j < registerPeer.unitCount; j++) {
                bytes32 unitId = keccak256(abi.encodePacked(offerId, registerPeer.peerId, j));
                Market.ComputeUnit memory computeUnit = deployment.core.getComputeUnit(unitId);

                require(computeUnit.peerId == registerPeer.peerId, "PeerId mismatch");
                require(computeUnit.deal == address(0), "Deal address mismatch");
            }
        }
    }
}
