// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import "test/utils/TestWithDeployment.sol";
import "test/utils/TestHelper.sol";
import {IOffer} from "src/core/interfaces/IOffer.sol";

contract OfferTest is TestWithDeployment {
    using SafeERC20 for IERC20;

    bytes32 private constant _OFFER_ID_PREFIX = bytes32(uint256(keccak256("fluence.market.offer")) - 1);

    address paymentToken;

    function setUp() external {
        _deploySystem();
        paymentToken = address(deployment.tUSD);
    }

    function _setUpEmptyOffer() private returns (bytes32 retOfferId) {
        deployment.diamondAsMarket.setProviderInfo("test", CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)}));
        retOfferId = deployment.diamondAsMarket.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0),
            DEFAULT_MIN_PROTOCOL_VERSION,
            DEFAULT_MAX_PROTOCOL_VERSION
        );
    }

    function test_OfferDoesNotExist() external {
        vm.expectRevert("Offer doesn't exist");
        deployment.diamondAsMarket.getOffer(0);
    }

    function test_ComputePeerDoesNotExist() external {
        vm.expectRevert("Peer doesn't exist");
        deployment.diamondAsMarket.getComputePeer(0);
    }

    function test_ComputeUnitDoesNotExist() external {
        vm.expectRevert("Compute unit doesn't exist");
        deployment.diamondAsMarket.getComputeUnit(0);
    }

    function test_GetEmptyComputeUnits() external {
        IOffer.ComputeUnitView[] memory units = deployment.diamondAsMarket.getComputeUnits(0);
        assertEq(units.length, 0, "Compute units should be empty");
    }

    function test_GetEmptyEffectorInfo() external {
        IOffer.EffectorInfo memory effectorInfo = deployment.diamondAsMarket.getEffectorInfo(CIDV1(bytes4(0), bytes32(0)));
        assertEq(effectorInfo.description, "", "Effector description should be empty");
        assertEq(effectorInfo.metadata.prefixes, bytes4(0), "Effector metadata should be empty");
        assertEq(effectorInfo.metadata.hash, bytes32(0), "Effector metadata should be empty");
    }

    function test_SetProviderInfo() external {
        CIDV1 memory metadata = CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)});
        vm.expectRevert("Name should be not empty");
        deployment.diamondAsMarket.setProviderInfo("", metadata);

        string memory providerId = "Provider";

        vm.expectEmit(true, false, false, true);
        emit IOffer.ProviderInfoUpdated(address(this), providerId, metadata);
        deployment.diamondAsMarket.setProviderInfo(providerId, metadata);

        IOffer.ProviderInfo memory providerInfo = deployment.diamondAsMarket.getProviderInfo(address(this));
        assertEq(providerInfo.name, providerId, "Provider description should be equal");
        assertEq(
            providerInfo.metadata.prefixes,
            metadata.prefixes,
            "Provider metadata prefixes should be equal to metadata.prefixes"
        );
        assertEq(providerInfo.metadata.hash, metadata.hash, "Provider metadata hash should be equal to metadata.hash");
    }

    function test_EffectorInfo() external {
        CIDV1 memory id = CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)});

        vm.expectRevert("Effector info doesn't exist");
        deployment.diamondAsMarket.removeEffectorInfo(id);

        CIDV1 memory metadata = CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)});
        vm.expectRevert("Description should be not empty");
        deployment.diamondAsMarket.setEffectorInfo(id, "", metadata);

        string memory effectorId = "Effector";

        vm.expectEmit(true, false, false, true);
        emit IOffer.EffectorInfoSet(id, effectorId, metadata);
        deployment.diamondAsMarket.setEffectorInfo(id, effectorId, metadata);

        IOffer.EffectorInfo memory effectorInfo = deployment.diamondAsMarket.getEffectorInfo(metadata);
        assertEq(effectorInfo.description, effectorId, "Effector description should be equal");
        assertEq(
            effectorInfo.metadata.prefixes,
            metadata.prefixes,
            "Effector metadata prefixes should be equal to metadata.prefixes"
        );
        assertEq(effectorInfo.metadata.hash, metadata.hash, "Effector metadata hash should be equal to metadata.hash");

        vm.expectEmit(true, false, false, false);
        emit IOffer.EffectorInfoRemoved(id);
        deployment.diamondAsMarket.removeEffectorInfo(id);

        effectorInfo = deployment.diamondAsMarket.getEffectorInfo(metadata);
        assertEq(effectorInfo.description, "", "Effector description should be empty");
        assertEq(effectorInfo.metadata.prefixes, bytes4(0), "Effector metadata should be empty");
        assertEq(effectorInfo.metadata.hash, bytes32(0), "Effector metadata should be empty");
    }

    function test_CreateOffer() external {
        vm.expectRevert("Offer doesn't exist");
        deployment.diamondAsMarket.getOffer(bytes32(uint256(123)));

        // create offer without provider
        vm.expectRevert("Provider doesn't exist");
        deployment.diamondAsMarket.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0),
            DEFAULT_MIN_PROTOCOL_VERSION,
            DEFAULT_MAX_PROTOCOL_VERSION
        );

        deployment.diamondAsMarket.setProviderInfo("test", CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)}));

        vm.expectRevert("Min price per epoch should be greater than 0");
        deployment.diamondAsMarket.registerMarketOffer(
            0,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0),
            DEFAULT_MIN_PROTOCOL_VERSION,
            DEFAULT_MAX_PROTOCOL_VERSION
        );

        vm.expectRevert("Payment token should be not zero address");
        deployment.diamondAsMarket.registerMarketOffer(
            1,
            address(0),
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0),
            DEFAULT_MIN_PROTOCOL_VERSION,
            DEFAULT_MAX_PROTOCOL_VERSION
        );

        vm.expectRevert("Min protocol version too small");
        deployment.diamondAsMarket.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0),
            DEFAULT_MIN_PROTOCOL_VERSION - 1, // default 1
            DEFAULT_MAX_PROTOCOL_VERSION
        );

        vm.expectRevert("Max protocol version too big");
        deployment.diamondAsMarket.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0),
            DEFAULT_MIN_PROTOCOL_VERSION,
            DEFAULT_MAX_PROTOCOL_VERSION + 1
        );

        vm.expectRevert("Wrong protocol versions");
        deployment.diamondAsMarket.registerMarketOffer(
            1, paymentToken, new CIDV1[](0), new IOffer.RegisterComputePeer[](0), 2, 1
        );

        bytes32 offerId = keccak256(
            abi.encodePacked(
                _OFFER_ID_PREFIX,
                address(this),
                block.number,
                abi.encodeWithSelector(
                    IOffer.registerMarketOffer.selector,
                    1,
                    paymentToken,
                    new CIDV1[](0),
                    new IOffer.RegisterComputePeer[](0),
                    DEFAULT_MIN_PROTOCOL_VERSION,
                    DEFAULT_MAX_PROTOCOL_VERSION
                )
            )
        );

        vm.expectEmit(true, false, false, true);
        emit IOffer.MarketOfferRegistered(
            address(this),
            offerId,
            1,
            paymentToken,
            new CIDV1[](0),
            DEFAULT_MIN_PROTOCOL_VERSION,
            DEFAULT_MAX_PROTOCOL_VERSION
        );
        bytes32 retOfferId = deployment.diamondAsMarket.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0),
            DEFAULT_MIN_PROTOCOL_VERSION,
            DEFAULT_MAX_PROTOCOL_VERSION
        );
        IOffer.Offer memory offer = deployment.diamondAsMarket.getOffer(retOfferId);
        assertEq(offer.provider, address(this), "Provider should be equal to address(this)");
        assertEq(offer.minPricePerWorkerEpoch, 1, "Min price per worker epoch should be equal to 1");
        assertEq(offer.paymentToken, paymentToken, "Payment token should be equal to paymentToken");
        assertEq(offer.peerCount, 0, "Peer count should be equal to 0");
        assertEq(retOfferId, offerId, "OfferId mismatch");

        vm.expectRevert("Offer already exists");
        deployment.diamondAsMarket.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            new IOffer.RegisterComputePeer[](0),
            DEFAULT_MIN_PROTOCOL_VERSION,
            DEFAULT_MAX_PROTOCOL_VERSION
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

        bytes32 offerWithPeersId = deployment.diamondAsMarket.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            peers,
            DEFAULT_MIN_PROTOCOL_VERSION,
            DEFAULT_MAX_PROTOCOL_VERSION
        );

        IOffer.Offer memory offerWithPeers = deployment.diamondAsMarket.getOffer(offerWithPeersId);
        assertEq(offerWithPeers.provider, address(this), "Provider should be equal to address(this)");
        assertEq(offerWithPeers.minPricePerWorkerEpoch, 1, "Min price per worker epoch should be equal to 1");
        assertEq(offerWithPeers.paymentToken, paymentToken, "Payment token should be equal to paymentToken");
        assertEq(offerWithPeers.peerCount, 2, "Peer count should be equal to 2");

        for (uint256 j = 0; j < peers.length; j++) {
            IOffer.ComputePeer memory peer = deployment.diamondAsMarket.getComputePeer(peers[j].peerId);
            assertEq(peer.offerId, offerWithPeersId, "OfferId should be equal to offerWithPeersId");
            assertEq(peer.commitmentId, bytes32(0), "CommitmentId should be equal to 0");
            assertEq(peer.unitCount, 5, "Unit count should be equal to 5");
            assertEq(peer.owner, peers[j].owner, "Owner should be equal to peers[j].owner");
            for (uint256 k = 0; k < peers[j].unitIds.length; k++) {
                IOffer.ComputeUnit memory unit = deployment.diamondAsMarket.getComputeUnit(peers[j].unitIds[k]);
                assertEq(unit.deal, address(0), "Deal should be equal to 0");
                assertEq(unit.peerId, peers[j].peerId, "PeerId should be equal to peers[j].peerId");
                assertEq(unit.startEpoch, 0, "Start epoch should be equal to 0");
            }
        }

        IOffer.ComputeUnitView[] memory units = deployment.diamondAsMarket.getComputeUnits(bytes32(uint256(1)));
        assertEq(units.length, 5, "Compute units should be length of to 5");

        bytes32[] memory computeUnitIds = deployment.diamondAsMarket.getComputeUnitIds(bytes32(uint256(1)));
        assertEq(computeUnitIds.length, 5, "Compute unit ids should be length of to 5");

        vm.prank(address(9933293));
        vm.expectRevert("Only owner can change offer");
        deployment.diamondAsMarket.removeOffer(offerWithPeersId);

        vm.expectRevert("Offer has compute peers");
        deployment.diamondAsMarket.removeOffer(offerWithPeersId);

        vm.expectRevert("Peer doesn't exist");
        deployment.diamondAsMarket.removeComputePeer(bytes32(uint256(5)));

        vm.prank(address(9933293));
        vm.expectRevert("Only owner can change offer");
        deployment.diamondAsMarket.removeComputePeer(bytes32(uint256(1)));

        vm.expectRevert("Peer has compute units");
        deployment.diamondAsMarket.removeComputePeer(bytes32(uint256(1)));

        vm.expectRevert("Compute unit doesn't exist");
        deployment.diamondAsMarket.removeComputeUnit(bytes32(uint256(666)));

        vm.prank(address(9933293));
        vm.expectRevert("Only owner can remove compute unit");
        deployment.diamondAsMarket.removeComputeUnit(unitIds[0]);

        // TODO test "Peer has commitment"
        // TODO test "Compute unit is in deal"

        for (uint256 j = 0; j < unitIds.length; j++) {
            vm.expectEmit(true, true, false, false);
            emit IOffer.ComputeUnitRemoved(bytes32(uint256(1)), unitIds[j]);
            deployment.diamondAsMarket.removeComputeUnit(unitIds[j]);
        }

        for (uint256 j = 0; j < unitIds2.length; j++) {
            vm.expectEmit(true, true, false, false);
            emit IOffer.ComputeUnitRemoved(bytes32(uint256(2)), unitIds2[j]);
            deployment.diamondAsMarket.removeComputeUnit(unitIds2[j]);
        }

        vm.expectEmit(true, true, false, false);
        emit IOffer.PeerRemoved(offerWithPeersId, bytes32(uint256(1)));
        deployment.diamondAsMarket.removeComputePeer(bytes32(uint256(1)));

        vm.expectEmit(true, true, false, false);
        emit IOffer.PeerRemoved(offerWithPeersId, bytes32(uint256(2)));
        deployment.diamondAsMarket.removeComputePeer(bytes32(uint256(2)));
    }

    function test_AddComputePeers() external {
        bytes32 retOfferId = _setUpEmptyOffer();

        vm.expectRevert("Offer doesn't exist");
        deployment.diamondAsMarket.addComputePeers(bytes32(uint256(123)), new IOffer.RegisterComputePeer[](0));

        vm.expectRevert("Only owner can change offer");
        vm.prank(address(9933293));
        deployment.diamondAsMarket.addComputePeers(retOfferId, new IOffer.RegisterComputePeer[](0));

        vm.expectRevert("Peers should not be empty");
        deployment.diamondAsMarket.addComputePeers(retOfferId, new IOffer.RegisterComputePeer[](0));

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
        deployment.diamondAsMarket.addComputePeers(retOfferId, peers);
    }

    function test_AddComputeUnits() external {
        deployment.diamondAsMarket.setProviderInfo("test", CIDV1({prefixes: 0x12345678, hash: bytes32(0x00)}));

        bytes32[] memory unitIds = new bytes32[](5);
        for (uint256 j = 0; j < unitIds.length; j++) {
            unitIds[j] = keccak256(abi.encodePacked(TestHelper.pseudoRandom(abi.encode("unitId", j))));
        }
        IOffer.RegisterComputePeer memory peer = IOffer.RegisterComputePeer({
            peerId: bytes32(uint256(1)),
            unitIds: unitIds,
            owner: address(bytes20(TestHelper.pseudoRandom(abi.encode("peerId-address", 0))))
        });
        IOffer.RegisterComputePeer[] memory peers = new IOffer.RegisterComputePeer[](1);
        peers[0] = peer;

        bytes32[] memory unitIdsToAdd = new bytes32[](5);
        for (uint256 j = 0; j < unitIds.length; j++) {
            unitIdsToAdd[j] = keccak256(abi.encodePacked(TestHelper.pseudoRandom(abi.encode("unitId-toAdd", j))));
        }

        deployment.diamondAsMarket.registerMarketOffer(
            1,
            paymentToken,
            new CIDV1[](0),
            peers,
            DEFAULT_MIN_PROTOCOL_VERSION,
            DEFAULT_MAX_PROTOCOL_VERSION
        );

        vm.expectRevert("Peer doesn't exist");
        deployment.diamondAsMarket.addComputeUnits(bytes32(uint256(123)), unitIdsToAdd);

        vm.expectRevert("Units should be greater than 0");
        deployment.diamondAsMarket.addComputeUnits(peer.peerId, new bytes32[](0));

        vm.expectRevert("Only owner can change offer");
        vm.prank(address(9933293));
        deployment.diamondAsMarket.addComputeUnits(peer.peerId, unitIdsToAdd);

        // TODO "Peer has commitment"

        vm.expectRevert("Compute unit already exists");
        deployment.diamondAsMarket.addComputeUnits(peer.peerId, unitIds);

        vm.expectEmit(true, false, false, true);
        for (uint256 j = 0; j < unitIds.length; j++) {
            emit IOffer.ComputeUnitCreated(peer.peerId, unitIdsToAdd[j]);
        }
        deployment.diamondAsMarket.addComputeUnits(peer.peerId, unitIdsToAdd);

        vm.expectRevert("Compute unit already free");
        deployment.diamondAsMarket.returnComputeUnitFromDeal(unitIdsToAdd[0]);

        vm.expectRevert("Compute unit doesn't exist");
        deployment.diamondAsMarket.returnComputeUnitFromDeal(bytes32(uint256(34343434)));

        // TODO move to another place where matching occurs
        // vm.expectRevert("Only deal or offer owner can remove compute unit from deal");
        // vm.prank(address(43434));
        // deployment.market.returnComputeUnitFromDeal(unitIdsToAdd[0]);

        // TODO match to deal and remove from deal
        // TODO check requires and modifiers for returnComputeUnitFromDeal
    }

    function test_ChangMinPricePerWorkerEpoch() external {
        bytes32 offerId = _setUpEmptyOffer();

        vm.expectRevert("Min price per epoch should be greater than 0");
        deployment.diamondAsMarket.changeMinPricePerWorkerEpoch(offerId, 0);

        vm.expectRevert("Only owner can change offer");
        vm.prank(address(87439843));
        deployment.diamondAsMarket.changeMinPricePerWorkerEpoch(offerId, 2);

        vm.expectEmit(true, false, false, true);
        emit IOffer.MinPricePerEpochUpdated(offerId, 2);
        deployment.diamondAsMarket.changeMinPricePerWorkerEpoch(offerId, 2);
    }

    function test_ChangePaymentToken() external {
        bytes32 offerId = _setUpEmptyOffer();

        vm.expectRevert("Only owner can change offer");
        vm.prank(address(87439843));
        deployment.diamondAsMarket.changePaymentToken(offerId, address(424242));

        vm.expectRevert("Payment token should be not zero address");
        deployment.diamondAsMarket.changePaymentToken(offerId, address(0));

        vm.expectEmit(true, false, false, true);
        emit IOffer.PaymentTokenUpdated(offerId, address(43434));
        deployment.diamondAsMarket.changePaymentToken(offerId, address(43434));
    }

    function test_Effectors() external {
        bytes32 offerId = _setUpEmptyOffer();

        CIDV1[] memory effectors = new CIDV1[](1);
        effectors[0] = CIDV1({prefixes: 0x12345678, hash: bytes32(uint256(12345))});

        vm.expectRevert("Only owner can change offer");
        vm.prank(address(87439843));
        deployment.diamondAsMarket.addEffector(offerId, effectors);

        vm.expectEmit(true, false, false, true);
        emit IOffer.EffectorAdded(offerId, effectors[0]);
        deployment.diamondAsMarket.addEffector(offerId, effectors);

        vm.expectRevert("Effector already exists");
        deployment.diamondAsMarket.addEffector(offerId, effectors);

        vm.expectEmit(true, false, false, true);
        emit IOffer.EffectorRemoved(offerId, effectors[0]);
        deployment.diamondAsMarket.removeEffector(offerId, effectors);

        vm.expectRevert("Effector doesn't exist");
        deployment.diamondAsMarket.removeEffector(offerId, effectors);
    }

    function test_SetCommitmentIdAndStartEpoch() external {
        bytes32 offerId = _setUpEmptyOffer();

        IOffer.RegisterComputePeer[] memory peers = new IOffer.RegisterComputePeer[](1);
        bytes32[] memory unitIds = new bytes32[](1);
        unitIds[0] = bytes32(uint256(43434334));
        address peerUniqueOwner = address(bytes20(TestHelper.pseudoRandom(abi.encode("peerId-address", 0))));
        peers[0] = IOffer.RegisterComputePeer({peerId: bytes32(uint256(1)), unitIds: unitIds, owner: peerUniqueOwner});
        deployment.diamondAsMarket.addComputePeers(offerId, peers);

    }

    // TODO _mvComputeUnitToDeal errors and events, possibly in another test
}
