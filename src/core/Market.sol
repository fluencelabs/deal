// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "src/deal/base/Types.sol";
import "src/utils/LinkedListWithUniqueKeys.sol";
import "src/deal/interfaces/IDeal.sol";

contract Market is Initializable {
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;

    // ------------------ Types ------------------

    // -------- Inputs --------
    struct RegisterComputePeer {
        bytes32 peerId;
        uint256 freeUnits;
    }

    // -------- Storage --------
    struct ComputeUnit {
        address deal;
        bytes32 peerId;
    }

    struct ComputePeerInfo {
        bytes32 offerId;
        uint256 lastUnitIndex;
    }

    struct ComputePeer {
        ComputePeerInfo info;
        LinkedListWithUniqueKeys.Bytes32List freeComputeUnitIds;
    }

    struct OfferInfo {
        address owner;
        uint256 minPricePerWorkerEpoch;
        address paymentToken;
    }

    struct Offer {
        OfferInfo info;
        mapping(bytes32 => bool) hasEffector;
        LinkedListWithUniqueKeys.Bytes32List freePeerIds;
    }

    // ------------------ Events ------------------
    event MarketOfferRegistered(
        bytes32 offerId, address owner, uint256 minPricePerWorkerEpoch, address paymentToken, CIDV1[] effectors
    );
    event PeerCreated(bytes32 offerId, bytes32 peerId);
    event ComputeUnitCreated(bytes32 offerId, bytes32 peerId, bytes32 unitId);

    event MinPricePerEpochUpdated(bytes32 offerId, uint256 minPricePerWorkerEpoch);
    event PaymentTokenUpdated(bytes32 offerId, address paymentToken);
    event EffectorAdded(bytes32 offerId, CIDV1 effector);
    event EffectorRemoved(bytes32 offerId, CIDV1 effector);

    event ComputeUnitAddedToDeal(bytes32 unitId, IDeal deal);
    event ComputeUnitRemovedFromDeal(bytes32 unitId, IDeal deal);

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1.offer")) - 1);

    struct OfferStorage {
        LinkedListWithUniqueKeys.Bytes32List offerIds;
        mapping(bytes32 => Offer) offers;
        mapping(bytes32 => ComputePeer) peers;
        mapping(bytes32 => ComputeUnit) computeUnits;
    }

    OfferStorage private _storage;

    function _getOfferStorage() private pure returns (OfferStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ----------------- Internal View -----------------
    function _getOffersList() internal view returns (LinkedListWithUniqueKeys.Bytes32List storage) {
        return _getOfferStorage().offerIds;
    }

    function _getFreeComputeUnitList(bytes32 peerId)
        internal
        view
        returns (LinkedListWithUniqueKeys.Bytes32List storage)
    {
        return _getOfferStorage().peers[peerId].freeComputeUnitIds;
    }

    function _getFreePeerList(bytes32 offerId) internal view returns (LinkedListWithUniqueKeys.Bytes32List storage) {
        return _getOfferStorage().offers[offerId].freePeerIds;
    }

    function _hasOfferEffectors(bytes32 offerId, CIDV1[] memory effectors) internal view returns (bool) {
        OfferStorage storage offerStorage = _getOfferStorage();

        for (uint256 i = 0; i < effectors.length; i++) {
            bytes32 effectorHash = keccak256(abi.encodePacked(effectors[i].prefixes, effectors[i].hash));

            if (!offerStorage.offers[offerId].hasEffector[effectorHash]) {
                return false;
            }
        }

        return true;
    }

    // ----------------- Internal Mutable -----------------
    function _addComputePeerToOffer(bytes32 offerId, RegisterComputePeer calldata peer) internal {
        OfferStorage storage offerStorage = _getOfferStorage();
        Offer storage offer = offerStorage.offers[offerId];

        ComputePeer storage computePeer = offerStorage.peers[peer.peerId];

        require(computePeer.info.offerId == bytes32(0x00), "Peer already exists in another offer");

        computePeer.info = ComputePeerInfo({offerId: offerId, lastUnitIndex: peer.freeUnits - 1});

        _addComputeUnitsToPeer(offerId, peer.peerId, peer.freeUnits);

        // add peer to offer
        offer.freePeerIds.push(peer.peerId);

        emit PeerCreated(offerId, peer.peerId);
    }

    function _addComputeUnitsToPeer(bytes32 offerId, bytes32 peerId, uint256 freeUnits) internal {
        OfferStorage storage offerStorage = _getOfferStorage();
        ComputePeer storage computePeer = offerStorage.peers[peerId];

        uint256 indexOffset = computePeer.info.lastUnitIndex + 1;
        for (uint256 i = 0; i < freeUnits; i++) {
            bytes32 unitId = keccak256(abi.encodePacked(offerId, peerId, i + indexOffset));

            // create compute unit
            offerStorage.computeUnits[unitId] = ComputeUnit({deal: address(0x00), peerId: peerId});

            // add unit to peer
            computePeer.freeComputeUnitIds.push(unitId);

            emit ComputeUnitCreated(offerId, peerId, unitId);
        }
    }

    function _mvComputeUnitToDeal(bytes32 unitId, IDeal deal) internal {
        OfferStorage storage offerStorage = _getOfferStorage();
        ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];

        bytes32 peerId = computeUnit.peerId;
        ComputePeer storage computePeer = offerStorage.peers[peerId];
        Offer storage offer = offerStorage.offers[computePeer.info.offerId];

        require(computeUnit.peerId != bytes32(0x00), "Compute unit doesn't exist");
        require(computeUnit.deal == address(0x00), "Compute unit already reserved");

        computeUnit.deal = address(deal);

        computePeer.freeComputeUnitIds.remove(unitId);
        if (computePeer.freeComputeUnitIds.length() == 0) {
            offer.freePeerIds.remove(peerId);
        }

        deal.addComputeUnit(offer.info.owner, unitId);

        emit ComputeUnitAddedToDeal(unitId, deal);
    }

    // ----------------- Public View -----------------
    function getOffer(bytes32 offerId) public view returns (OfferInfo memory) {
        return _getOfferStorage().offers[offerId].info;
    }

    function getPeer(bytes32 peerId) public view returns (ComputePeerInfo memory) {
        return _getOfferStorage().peers[peerId].info;
    }

    function getComputeUnit(bytes32 unitId) public view returns (ComputeUnit memory) {
        return _getOfferStorage().computeUnits[unitId];
    }

    // ----------------- Public Mutable -----------------
    function registerMarketOffer(
        bytes32 offerId,
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] calldata effectors,
        RegisterComputePeer[] calldata peers
    ) external {
        OfferStorage storage offerStorage = _getOfferStorage();

        require(offerStorage.offers[offerId].info.paymentToken == address(0x00), "Offer already exists");
        require(minPricePerWorkerEpoch > 0, "Min price per epoch should be greater than 0");
        require(address(paymentToken) != address(0x00), "Payment token should be not zero address");

        // create market offer
        Offer storage offer = offerStorage.offers[offerId];

        offer.info =
            OfferInfo({owner: msg.sender, minPricePerWorkerEpoch: minPricePerWorkerEpoch, paymentToken: paymentToken});

        // add effectors to offer
        for (uint256 j = 0; j < effectors.length; j++) {
            bytes32 effector = keccak256(abi.encodePacked(effectors[j].prefixes, effectors[j].hash));
            offer.hasEffector[effector] = true;
        }

        uint256 peerLength = peers.length;
        for (uint256 i = 0; i < peerLength; i++) {
            _addComputePeerToOffer(offerId, peers[i]);
        }

        offerStorage.offerIds.push(offerId);

        emit MarketOfferRegistered(offerId, msg.sender, minPricePerWorkerEpoch, paymentToken, effectors);
    }

    function addComputePeers(bytes32 offerId, RegisterComputePeer[] calldata peers) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        OfferInfo storage offer = offerStorage.offers[offerId].info;

        require(offer.owner == msg.sender, "Only owner can change offer");

        uint256 peerLength = peers.length;
        for (uint256 i = 0; i < peerLength; i++) {
            _addComputePeerToOffer(offerId, peers[i]);
        }
    }

    function addFreeUnits(bytes32 offerId, bytes32 peerId, uint256 freeUnits) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        OfferInfo storage offer = offerStorage.offers[offerId].info;
        ComputePeerInfo storage computePeer = offerStorage.peers[peerId].info;

        require(offer.owner == msg.sender, "Only owner can change offer");
        require(freeUnits > 0, "Free units should be greater than 0");
        require(computePeer.offerId == offerId, "Peer doesn't exist");

        _addComputeUnitsToPeer(offerId, peerId, freeUnits);
    }

    function changeMinPricePerWorkerEpoch(bytes32 offerId, uint256 newMinPricePerWorkerEpoch) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        OfferInfo storage offer = offerStorage.offers[offerId].info;

        require(offer.owner == msg.sender, "Only owner can change offer");
        require(newMinPricePerWorkerEpoch > 0, "Min price per epoch should be greater than 0");

        offer.minPricePerWorkerEpoch = newMinPricePerWorkerEpoch;

        emit MinPricePerEpochUpdated(offerId, newMinPricePerWorkerEpoch);
    }

    function changePaymentToken(bytes32 offerId, address newPaymentToken) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        OfferInfo storage offer = offerStorage.offers[offerId].info;

        require(offer.owner == msg.sender, "Only owner can change offer");
        require(newPaymentToken != address(0x00), "Payment token should be not zero address");

        offer.paymentToken = newPaymentToken;

        emit PaymentTokenUpdated(offerId, newPaymentToken);
    }

    function addEffector(bytes32 offerId, CIDV1[] calldata newEffectors) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.info.owner == msg.sender, "Only owner can change offer");

        for (uint256 i = 0; i < newEffectors.length; i++) {
            CIDV1 calldata effectorCID = newEffectors[i];
            bytes32 effectorHash = keccak256(abi.encodePacked(effectorCID.prefixes, effectorCID.hash));

            require(!offer.hasEffector[effectorHash], "Effector already exists");

            offer.hasEffector[effectorHash] = true;

            emit EffectorAdded(offerId, effectorCID);
        }
    }

    function removeEffector(bytes32 offerId, CIDV1[] calldata effectors) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.info.owner == msg.sender, "Only owner can change offer");

        for (uint256 i = 0; i < effectors.length; i++) {
            CIDV1 calldata effectorCID = effectors[i];
            bytes32 effectorHash = keccak256(abi.encodePacked(effectorCID.prefixes, effectorCID.hash));

            require(offer.hasEffector[effectorHash], "Effector  doesn't exist");

            offer.hasEffector[effectorHash] = false;

            emit EffectorRemoved(offerId, effectorCID);
        }
    }

    function returnComputeUnitFromDeal(bytes32 unitId) public {
        OfferStorage storage offerStorage = _getOfferStorage();
        ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];

        bytes32 peerId = computeUnit.peerId;
        IDeal deal = IDeal(computeUnit.deal);

        require(peerId != bytes32(0x00), "Compute unit doesn't exist");
        require(address(deal) != address(0x00), "Compute unit already free");

        ComputePeer storage computePeer = offerStorage.peers[peerId];
        Offer storage offer = offerStorage.offers[computePeer.info.offerId];

        require(
            OwnableUpgradableDiamond(address(deal)).owner() == msg.sender || offer.info.owner == msg.sender,
            "Only deal or offer owner can remove compute unit from deal"
        );

        computeUnit.deal = address(0x00);

        computePeer.freeComputeUnitIds.push(unitId);
        if (computePeer.freeComputeUnitIds.length() == 0) {
            offer.freePeerIds.push(computePeer.info.offerId);
        }

        deal.removeComputeUnit(unitId);

        emit ComputeUnitRemovedFromDeal(unitId, deal);
    }
}
