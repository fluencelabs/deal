// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "forge-std/console.sol";
import "src/core/Core.sol";
import "test/utils/DeployDealSystem.sol";
import "src/core/Market.sol";
import "test/utils/Random.sol";

contract MarketTest is Test {
    using SafeERC20 for IERC20;

    // ------------------ Variables ------------------
    DeployDealSystem.Deployment deployment;

    // ------------------ Test ------------------
    function setUp() public {
        deployment = DeployDealSystem.deployDealSystem();
    }

    function test_RegisterMarketOffer() public {
        bytes32 offerId = Random.pseudoRandom(abi.encode("offerId", 0));
        uint256 minPricePerWorkerEpoch = 1;
        address paymentToken = address(deployment.tUSD);
        CIDV1[] memory effectors = new CIDV1[](10);
        for (uint256 i = 0; i < 10; i++) {
            effectors[i] = CIDV1({prefixes: 0x12345678, hash: Random.pseudoRandom(abi.encode("effector", i))});
        }

        Market.RegisterComputePeer[] memory peers = new Market.RegisterComputePeer[](10);
        for (uint256 i = 0; i < 10; i++) {
            peers[i] = Market.RegisterComputePeer({
                peerId: Random.pseudoRandom(abi.encode("peerId", i)),
                freeUnits: (i + 1) * 5
            });
        }

        deployment.core.registerMarketOffer(offerId, minPricePerWorkerEpoch, paymentToken, effectors, peers);

        Market.OfferInfo memory offer = deployment.core.getOffer(offerId);
        assertEq(offer.owner, address(this));
        assertEq(offer.paymentToken, paymentToken);
        assertEq(offer.minPricePerWorkerEpoch, minPricePerWorkerEpoch);

        for (uint256 i = 0; i < peers.length; i++) {
            Market.RegisterComputePeer memory registerPeer = peers[i];
            Market.ComputePeerInfo memory computePeer = deployment.core.getPeer(registerPeer.peerId);

            require(computePeer.offerId == offerId, "OfferId mismatch");
            require(computePeer.unitCount == registerPeer.freeUnits, "NextUnitIndex mismatch");

            for (uint256 j = 0; j < registerPeer.freeUnits; j++) {
                bytes32 unitId = keccak256(abi.encodePacked(offerId, registerPeer.peerId, j));
                Market.ComputeUnit memory computeUnit = deployment.core.getComputeUnit(unitId);

                require(computeUnit.peerId == registerPeer.peerId, "PeerId mismatch");
                require(computeUnit.deal == address(0), "Deal address mismatch");
            }
        }

        //TODO: event test
    }
}
