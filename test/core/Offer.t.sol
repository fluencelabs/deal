// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test, console2} from "forge-std/Test.sol";
import "test/utils/DeployDealSystem.sol";
import "test/utils/TestHelper.sol";

contract OfferTest is Test {
    using SafeERC20 for IERC20;

    bytes32 private constant _OFFER_ID_PREFIX = bytes32(uint256(keccak256("fluence.market.offer")) - 1);

    DeployDealSystem.Deployment deployment;
    address paymentToken;

    function setUp() external {
        deployment = DeployDealSystem.deployDealSystem();
        paymentToken = address(deployment.tUSD);
    }

    function test_OfferDoesNotExist() external {
        vm.expectRevert("Offer doesn't exist");
        deployment.market.getOffer(0);
    }

    function test_ComputePeerDoesNotExist() external {
        vm.expectRevert("Peer doesn't exist");
        deployment.market.getComputePeer(0);
    }

    function test_ComputeUnitDoesNotExist() external {
        vm.expectRevert("Compute unit doesn't exist");
        deployment.market.getComputeUnit(0);
    }

    function test_GetEmptyComputeUnits() external {
        IOffer.ComputeUnitView[] memory units = deployment.market.getComputeUnits(0);
        assertEq(units.length, 0, "Compute units should be empty");
    }

    function test_GetEmptyEffectorInfo() external {
        IOffer.EffectorInfo memory effectorInfo = deployment.market.getEffectorInfo(CIDV1(bytes4(0), bytes32(0)));
        assertEq(effectorInfo.description, "", "Effector description should be empty");
        assertEq(effectorInfo.metadata.prefixes, bytes4(0), "Effector metadata should be empty");
        assertEq(effectorInfo.metadata.hash, bytes32(0), "Effector metadata should be empty");
    }

    function test_SetProviderInfo() external {
        CIDV1 memory metadata = CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)});
        vm.expectRevert("Name should be not empty");
        deployment.market.setProviderInfo("", metadata);

        string memory providerId = "Provider";

        vm.expectEmit(true, false, false, true);
        emit IOffer.ProviderInfoUpdated(address(this), providerId, metadata);
        deployment.market.setProviderInfo(providerId, metadata);

        IOffer.ProviderInfo memory providerInfo = deployment.market.getProviderInfo(address(this));
        assertEq(providerInfo.name, providerId, "Provider description should be equal");
        assertEq(providerInfo.metadata.prefixes, metadata.prefixes, "Provider metadata prefixes should be equal to metadata.prefixes");
        assertEq(providerInfo.metadata.hash, metadata.hash, "Provider metadata hash should be equal to metadata.hash");
        assertFalse(providerInfo.approved, "Provider should not be approved");
    }

    function test_EffectorInfo() external {
        CIDV1 memory id = CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)});

        vm.expectRevert("Effector info doesn't exist");
        deployment.market.removeEffectorInfo(id);

        CIDV1 memory metadata = CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)});
        vm.expectRevert("Description should be not empty");
        deployment.market.setEffectorInfo(id, "", metadata);

        string memory effectorId = "Effector";

        vm.expectEmit(true, false, false, true);
        emit IOffer.EffectorInfoSet(id, effectorId, metadata);
        deployment.market.setEffectorInfo(id, effectorId, metadata);

        IOffer.EffectorInfo memory effectorInfo = deployment.market.getEffectorInfo(metadata);
        assertEq(effectorInfo.description, effectorId, "Effector description should be equal");
        assertEq(effectorInfo.metadata.prefixes, metadata.prefixes, "Effector metadata prefixes should be equal to metadata.prefixes");
        assertEq(effectorInfo.metadata.hash, metadata.hash, "Effector metadata hash should be equal to metadata.hash");

        vm.expectEmit(true, false, false, false);
        emit IOffer.EffectorInfoRemoved(id);
        deployment.market.removeEffectorInfo(id);

        effectorInfo = deployment.market.getEffectorInfo(metadata);
        assertEq(effectorInfo.description, "", "Effector description should be empty");
        assertEq(effectorInfo.metadata.prefixes, bytes4(0), "Effector metadata should be empty");
        assertEq(effectorInfo.metadata.hash, bytes32(0), "Effector metadata should be empty");
    }

    function test_CreateOffer() external {
        vm.expectRevert("Offer doesn't exist");
        deployment.market.getOffer(bytes32(uint256(123)));

        // create offer without provider
        vm.expectRevert("Provider doesn't exist");
        deployment.market.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0)
        );

        deployment.market.setProviderInfo("test", CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)}));

        vm.expectRevert("Min price per epoch should be greater than 0");
        deployment.market.registerMarketOffer(
            0,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0)
        );

        vm.expectRevert("Payment token should be not zero address");
        deployment.market.registerMarketOffer(
            1,
            address(0),
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0)
        );

        bytes32 offerId = keccak256(
            abi.encodePacked(
                _OFFER_ID_PREFIX,
                address(this),
                block.number,
                abi.encodeWithSelector(
                    IOffer.registerMarketOffer.selector, 1, paymentToken, new CIDV1[](0), new IOffer.RegisterComputePeer[](0)
                )
            )
        );

        vm.expectEmit(true, false, false, true);
        emit IOffer.MarketOfferRegistered(address(this), offerId, 1, paymentToken, new CIDV1[](0));
        bytes32 retOfferId = deployment.market.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0)
        );
        IOffer.Offer memory offer = deployment.market.getOffer(retOfferId);
        assertEq(offer.provider, address(this), "Provider should be equal to address(this)");
        assertEq(offer.minPricePerWorkerEpoch, 1, "Min price per worker epoch should be equal to 1");
        assertEq(offer.paymentToken, paymentToken, "Payment token should be equal to paymentToken");
        assertEq(offer.peerCount, 0, "Peer count should be equal to 0");
        assertEq(retOfferId, offerId, "OfferId mismatch");

        vm.expectRevert("Offer already exists");
        deployment.market.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0)
        );

        // testing creating offer with compute peers
        IOffer.RegisterComputePeer[] memory peers = new IOffer.RegisterComputePeer[](2);
        bytes32[] memory unitIds = new bytes32[](5);
        for (uint256 j = 0; j < unitIds.length; j++) {
            unitIds[j] = keccak256(abi.encodePacked(TestHelper.pseudoRandom(abi.encode("unitId", j))));
        }
        peers[0] = IOffer.RegisterComputePeer({
            peerId: bytes32(uint256(1)),
            unitIds: unitIds,
            owner: address(bytes20(TestHelper.pseudoRandom(abi.encode("peerId-address", 0))))
        });
        bytes32[] memory unitIds2 = new bytes32[](5);
        for (uint256 j = 0; j < unitIds2.length; j++) {
            unitIds2[j] = keccak256(abi.encodePacked(TestHelper.pseudoRandom(abi.encode("unitId-2", j))));
        }
        peers[1] = IOffer.RegisterComputePeer({
            peerId: bytes32(uint256(2)),
            unitIds: unitIds2,
            owner: address(bytes20(TestHelper.pseudoRandom(abi.encode("peerId-address", 1))))
        });

        bytes32 offerWithPeersId = deployment.market.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            peers
        );

        IOffer.Offer memory offerWithPeers = deployment.market.getOffer(offerWithPeersId);
        assertEq(offerWithPeers.provider, address(this), "Provider should be equal to address(this)");
        assertEq(offerWithPeers.minPricePerWorkerEpoch, 1, "Min price per worker epoch should be equal to 1");
        assertEq(offerWithPeers.paymentToken, paymentToken, "Payment token should be equal to paymentToken");
        assertEq(offerWithPeers.peerCount, 2, "Peer count should be equal to 2");

        for (uint256 j = 0; j < peers.length; j++) {
            IOffer.ComputePeer memory peer = deployment.market.getComputePeer(peers[j].peerId);
            assertEq(peer.offerId, offerWithPeersId, "OfferId should be equal to offerWithPeersId");
            assertEq(peer.commitmentId, bytes32(0), "CommitmentId should be equal to 0");
            assertEq(peer.unitCount, 5, "Unit count should be equal to 5");
            assertEq(peer.owner, peers[j].owner, "Owner should be equal to peers[j].owner");
            for (uint256 k = 0; k < peers[j].unitIds.length; k++) {
                IOffer.ComputeUnit memory unit = deployment.market.getComputeUnit(peers[j].unitIds[k]);
                assertEq(unit.deal, address(0), "Deal should be equal to 0");
                assertEq(unit.peerId, peers[j].peerId, "PeerId should be equal to peers[j].peerId");
                assertEq(unit.startEpoch, 0, "Start epoch should be equal to 0");
            }
        }

        IOffer.ComputeUnitView[] memory units = deployment.market.getComputeUnits(bytes32(uint256(1)));
        assertEq(units.length, 5, "Compute units should be equal to 5");

        vm.prank(address(9933293));
        vm.expectRevert("Only owner can change offer");
        deployment.market.removeOffer(offerWithPeersId);

        vm.expectRevert("Offer has compute peers");
        deployment.market.removeOffer(offerWithPeersId);

        vm.expectRevert("Peer doesn't exist");
        deployment.market.removeComputePeer(bytes32(uint256(5)));

        vm.prank(address(9933293));
        vm.expectRevert("Only owner can change offer");
        deployment.market.removeComputePeer(bytes32(uint256(1)));

        vm.expectRevert("Peer has compute units");
        deployment.market.removeComputePeer(bytes32(uint256(1)));

        vm.expectRevert("Compute unit doesn't exist");
        deployment.market.removeComputeUnit(bytes32(uint256(666)));

        vm.prank(address(9933293));
        vm.expectRevert("Only owner can remove compute unit");
        deployment.market.removeComputeUnit(unitIds[0]);

        // TODO test "Peer has commitment"
        // TODO test "Compute unit is in deal"

        for (uint256 j = 0; j < unitIds.length; j++) {
            vm.expectEmit(true, true, false, false);
            emit IOffer.ComputeUnitRemoved(bytes32(uint256(1)), unitIds[j]);
            deployment.market.removeComputeUnit(unitIds[j]);
        }

        for (uint256 j = 0; j < unitIds2.length; j++) {
            vm.expectEmit(true, true, false, false);
            emit IOffer.ComputeUnitRemoved(bytes32(uint256(2)), unitIds2[j]);
            deployment.market.removeComputeUnit(unitIds2[j]);
        }

        vm.expectEmit(true, true, false, false);
        emit IOffer.PeerRemoved(offerWithPeersId, bytes32(uint256(1)));
        deployment.market.removeComputePeer(bytes32(uint256(1)));

        vm.expectEmit(true, true, false, false);
        emit IOffer.PeerRemoved(offerWithPeersId, bytes32(uint256(2)));
        deployment.market.removeComputePeer(bytes32(uint256(2)));
    }

    function test_AddComputePeers() external {
        deployment.market.setProviderInfo("test", CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)}));
        bytes32 retOfferId = deployment.market.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0)
        );

        vm.expectRevert("Offer doesn't exist");
        deployment.market.addComputePeers(bytes32(uint256(123)), new IOffer.RegisterComputePeer[](0));

        vm.expectRevert("Only owner can change offer");
        vm.prank(address(9933293));
        deployment.market.addComputePeers(retOfferId, new IOffer.RegisterComputePeer[](0));

        vm.expectRevert("Peers should not be empty");
        deployment.market.addComputePeers(retOfferId, new IOffer.RegisterComputePeer[](0));

        IOffer.RegisterComputePeer[] memory peers = new IOffer.RegisterComputePeer[](2);
        bytes32[] memory unitIds = new bytes32[](5);
        for (uint256 j = 0; j < unitIds.length; j++) {
            unitIds[j] = keccak256(abi.encodePacked(TestHelper.pseudoRandom(abi.encode("unitId", j))));
        }
        peers[0] = IOffer.RegisterComputePeer({
            peerId: bytes32(uint256(1)),
            unitIds: unitIds,
            owner: address(bytes20(TestHelper.pseudoRandom(abi.encode("peerId-address", 0))))
        });
        bytes32[] memory unitIds2 = new bytes32[](5);
        for (uint256 j = 0; j < unitIds2.length; j++) {
            unitIds2[j] = keccak256(abi.encodePacked(TestHelper.pseudoRandom(abi.encode("unitId-2", j))));
        }
        peers[1] = IOffer.RegisterComputePeer({
            peerId: bytes32(uint256(2)),
            unitIds: unitIds2,
            owner: address(bytes20(TestHelper.pseudoRandom(abi.encode("peerId-address", 1))))
        });

        vm.expectEmit(true, false, false, true);
        emit IOffer.PeerCreated(retOfferId, peers[0].peerId, peers[0].owner);
        emit IOffer.PeerCreated(retOfferId, peers[1].peerId, peers[1].owner);
        deployment.market.addComputePeers(retOfferId, peers);
    }

    function test_AddComputeUnits() external {
        
    }
}
