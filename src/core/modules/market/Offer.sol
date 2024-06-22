// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/core/modules/BaseModule.sol";
import "./interfaces/IOffer.sol";
import {LibOffer, OfferStorage} from "src/lib/LibOffer.sol";
import {LibCapacity} from "src/lib/LibCapacity.sol";

abstract contract Offer is BaseModule, IOffer {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.Bytes32Set;


    // ----------------- Public View -----------------
    function getProviderInfo(address provider) external view returns (ProviderInfo memory) {
        return LibOffer.getProviderInfo(provider);
    }

    function getOffer(bytes32 offerId) public view returns (Offer memory) {
        return LibOffer.getOffer(offerId);
    }

    function getComputePeer(bytes32 peerId) public view returns (ComputePeer memory) {
        return LibOffer.getComputePeer(peerId);
    }

    function getComputeUnit(bytes32 unitId) public view returns (ComputeUnit memory) {
        return LibOffer.getComputeUnit(unitId);
    }

    function getComputeUnitIds(bytes32 peerId) public view returns (bytes32[] memory) {
        return LibOffer.getComputeUnitIds(peerId);
    }

    function getComputeUnits(bytes32 peerId) external view returns (ComputeUnitView[] memory) {
        OfferStorage storage offerStorage = LibOffer.store();

        bytes32[] memory unitIds = offerStorage.computeUnitIdsByPeerId[peerId].values();
        ComputeUnitView[] memory units = new ComputeUnitView[](unitIds.length);

        ComputePeer storage computePeer = offerStorage.peers[peerId];
        bytes32 commitmentId = computePeer.commitmentId;

        uint256 capacityStartEpoch;
        if (commitmentId != bytes32(0x00)) {
            capacityStartEpoch = LibCapacity.getCommitment(commitmentId).startEpoch;
        }

        for (uint256 i = 0; i < unitIds.length; i++) {
            bytes32 unitId = unitIds[i];
            ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];
            uint256 startEpoch = computeUnit.startEpoch;

            if (startEpoch == 0) {
                startEpoch = capacityStartEpoch;
            }

            units[i] = ComputeUnitView({id: unitId, deal: computeUnit.deal, startEpoch: startEpoch});
        }

        return units;
    }

    function getEffectorInfo(CIDV1 calldata id) external view returns (EffectorInfo memory) {
        return LibOffer.store().effectorInfoById[LibOffer._hashEffectorCID(id)];
    }

    // ----------------- Public Mutable -----------------
    //Register offer and units
    function setProviderInfo(string calldata name, CIDV1 calldata metadata) external {
        require(bytes(name).length > 0, "Name should be not empty");

        LibOffer.store().providers[msg.sender] = ProviderInfo({name: name, metadata: metadata});

        emit ProviderInfoUpdated(msg.sender, name, metadata);
    }

    function registerMarketOffer(
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] calldata effectors,
        RegisterComputePeer[] calldata peers,
        uint256 minProtocolVersion,
        uint256 maxProtocolVersion
    ) external returns (bytes32) {
        OfferStorage storage offerStorage = LibOffer.store();

        address provider = msg.sender;
        bytes32 offerId = keccak256(abi.encodePacked(LibOffer._OFFER_ID_PREFIX, provider, block.number, msg.data));

        require(bytes(offerStorage.providers[provider].name).length > 0, "Provider doesn't exist");
        require(offerStorage.offers[offerId].paymentToken == address(0x00), "Offer already exists");
        require(minPricePerWorkerEpoch > 0, "Min price per epoch should be greater than 0");
        require(address(paymentToken) != address(0x00), "Payment token should be not zero address");
        require(minProtocolVersion >= core.minProtocolVersion(), "Min protocol version too small");
        require(maxProtocolVersion <= core.maxProtocolVersion(), "Max protocol version too big");
        require(minProtocolVersion <= maxProtocolVersion, "Wrong protocol versions");

        // create market offer
        offerStorage.offers[offerId] = Offer({
            provider: provider,
            minPricePerWorkerEpoch: minPricePerWorkerEpoch,
            paymentToken: paymentToken,
            peerCount: 0,
            minProtocolVersion: minProtocolVersion,
            maxProtocolVersion: maxProtocolVersion
        });

        // add effectors to offer
        for (uint256 j = 0; j < effectors.length; j++) {
            bytes32 effector = LibOffer._hashEffectorCID(effectors[j]);
            offerStorage.effectorsByOfferId[offerId].hasEffector[effector] = true;
        }

        emit MarketOfferRegistered(
            provider, offerId, minPricePerWorkerEpoch, paymentToken, effectors, minProtocolVersion, maxProtocolVersion
        );

        uint256 peerLength = peers.length;
        for (uint256 i = 0; i < peerLength; i++) {
            LibOffer._addComputePeerToOffer(offerId, peers[i]);
        }

        return offerId;
    }

    function removeOffer(bytes32 offerId) external {
        OfferStorage storage offerStorage = LibOffer.store();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.provider == msg.sender, "Only owner can change offer");
        require(offer.peerCount == 0, "Offer has compute peers");

        delete offerStorage.offers[offerId];
    }

    function addComputePeers(bytes32 offerId, RegisterComputePeer[] calldata peers) external {
        OfferStorage storage offerStorage = LibOffer.store();

        Offer storage offer = offerStorage.offers[offerId];
        require(offer.provider != address(0x00), "Offer doesn't exist");
        require(offer.provider == msg.sender, "Only owner can change offer");
        require(peers.length > 0, "Peers should not be empty");

        uint256 peerLength = peers.length;
        for (uint256 i = 0; i < peerLength; i++) {
            LibOffer._addComputePeerToOffer(offerId, peers[i]);
        }
    }

    function removeComputePeer(bytes32 peerId) external {
        OfferStorage storage offerStorage = LibOffer.store();
        ComputePeer storage computePeer = offerStorage.peers[peerId];
        bytes32 offerId = computePeer.offerId;
        Offer storage offer = offerStorage.offers[offerId];

        require(offerId != bytes32(0x00), "Peer doesn't exist");
        require(offer.provider == msg.sender, "Only owner can change offer");

        require(computePeer.unitCount == 0, "Peer has compute units");

        offer.peerCount--;
        delete offerStorage.peers[peerId];

        emit PeerRemoved(offerId, peerId);
    }

    function addComputeUnits(bytes32 peerId, bytes32[] calldata unitIds) external {
        require(peerId != bytes32(0x00), "Peer id should be not empty");

        OfferStorage storage offerStorage = LibOffer.store();
        ComputePeer storage computePeer = offerStorage.peers[peerId];

        bytes32 offerId = computePeer.offerId;
        require(offerId != bytes32(0x00), "Peer doesn't exist");

        Offer storage offer = offerStorage.offers[offerId];
        require(offer.provider == msg.sender, "Only owner can change offer");
        require(computePeer.commitmentId == bytes32(0x00), "Peer has commitment");

        LibOffer._addComputeUnitsToPeer(peerId, unitIds);
    }

    function removeComputeUnit(bytes32 unitId) external {
        OfferStorage storage offerStorage = LibOffer.store();
        ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];

        bytes32 peerId = computeUnit.peerId;
        require(peerId != bytes32(0x00), "Compute unit doesn't exist");

        ComputePeer storage computePeer = offerStorage.peers[peerId];
        Offer storage offer = offerStorage.offers[computePeer.offerId];

        require(offer.provider == msg.sender, "Only owner can remove compute unit");
        require(computePeer.commitmentId == bytes32(0x00), "Peer has commitment");
        require(computeUnit.deal == address(0x00), "Compute unit is in deal");

        computePeer.unitCount--;

        require(offerStorage.computeUnitIdsByPeerId[peerId].remove(unitId), "Invalid remove from enumerable set");

        delete offerStorage.computeUnits[unitId];

        emit ComputeUnitRemoved(peerId, unitId);
    }

    // Change offer
    function changeMinPricePerWorkerEpoch(bytes32 offerId, uint256 newMinPricePerWorkerEpoch) external {
        OfferStorage storage offerStorage = LibOffer.store();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.provider == msg.sender, "Only owner can change offer");
        require(newMinPricePerWorkerEpoch > 0, "Min price per epoch should be greater than 0");

        offer.minPricePerWorkerEpoch = newMinPricePerWorkerEpoch;

        emit MinPricePerEpochUpdated(offerId, newMinPricePerWorkerEpoch);
    }

    function changePaymentToken(bytes32 offerId, address newPaymentToken) external {
        OfferStorage storage offerStorage = LibOffer.store();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.provider == msg.sender, "Only owner can change offer");
        require(newPaymentToken != address(0x00), "Payment token should be not zero address");

        offer.paymentToken = newPaymentToken;

        emit PaymentTokenUpdated(offerId, newPaymentToken);
    }

    function addEffector(bytes32 offerId, CIDV1[] calldata newEffectors) external {
        OfferStorage storage offerStorage = LibOffer.store();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.provider == msg.sender, "Only owner can change offer");

        for (uint256 i = 0; i < newEffectors.length; i++) {
            CIDV1 calldata effectorCID = newEffectors[i];
            bytes32 effectorHash = LibOffer._hashEffectorCID(effectorCID);

            require(!offerStorage.effectorsByOfferId[offerId].hasEffector[effectorHash], "Effector already exists");

            offerStorage.effectorsByOfferId[offerId].hasEffector[effectorHash] = true;

            emit EffectorAdded(offerId, effectorCID);
        }
    }

    function removeEffector(bytes32 offerId, CIDV1[] calldata effectors) external {
        OfferStorage storage offerStorage = LibOffer.store();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.provider == msg.sender, "Only owner can change offer");

        for (uint256 i = 0; i < effectors.length; i++) {
            CIDV1 calldata effectorCID = effectors[i];
            bytes32 effectorHash = LibOffer._hashEffectorCID(effectorCID);

            require(offerStorage.effectorsByOfferId[offerId].hasEffector[effectorHash], "Effector doesn't exist");

            offerStorage.effectorsByOfferId[offerId].hasEffector[effectorHash] = false;

            emit EffectorRemoved(offerId, effectorCID);
        }
    }

    // Unit management
    function returnComputeUnitFromDeal(bytes32 unitId) external {
        return LibOffer._returnComputeUnitFromDeal(unitId);
    }

    // Effector info
    function setEffectorInfo(CIDV1 calldata id, string calldata description, CIDV1 calldata metadata)
        external
        onlyCoreOwner
    {
        OfferStorage storage offerStorage = LibOffer.store();
        require(bytes(description).length > 0, "Description should be not empty");

        bytes32 effectorHash = LibOffer._hashEffectorCID(id);
        EffectorInfo storage effectorInfo = offerStorage.effectorInfoById[effectorHash];

        effectorInfo.description = description;
        effectorInfo.metadata = metadata;

        emit EffectorInfoSet(id, description, metadata);
    }

    function removeEffectorInfo(CIDV1 calldata id) external onlyCoreOwner {
        OfferStorage storage offerStorage = LibOffer.store();

        bytes32 effectorHash = LibOffer._hashEffectorCID(id);
        EffectorInfo storage effectorInfo = offerStorage.effectorInfoById[effectorHash];

        require(bytes(effectorInfo.description).length > 0, "Effector info doesn't exist");

        delete offerStorage.effectorInfoById[effectorHash];

        emit EffectorInfoRemoved(id);
    }
}
