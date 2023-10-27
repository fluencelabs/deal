// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "../deal/base/Types.sol";
import "../utils/LinkedListWithUniqueKeys.sol";
import "../deal/interfaces/IDeal.sol";

contract MarketOffers is Initializable {
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;

    // ------------------ Types ------------------

    // -------- Inputs --------
    struct RegisterComputePeer {
        bytes32 peerId;
        uint freeUnits;
    }

    // -------- Storage --------
    struct ComputeUnit {
        address deal;
        bytes32 peerId;
    }

    struct ComputePeerInfo {
        bytes32 offerId;
    }

    struct ComputePeer {
        ComputePeerInfo info;
        LinkedListWithUniqueKeys.Bytes32List freeComputeUnitIds;
    }

    struct OfferInfo {
        address owner;
        uint minPricePerWorkerEpoch;
        address paymentToken;
    }

    struct Offer {
        OfferInfo info;
        mapping(bytes32 => bool) hasEffector;
        LinkedListWithUniqueKeys.Bytes32List freePeerIds;
    }

    // ------------------ Events ------------------
    event MarkeOfferRegistered(bytes32 offerId, address owner, uint minPricePerWorkerEpoch, address paymentToken, CIDV1[] effectors);
    event PeerCreated(bytes32 offerId, bytes32 peerId);
    event ComputeUnitCreated(bytes32 offerId, bytes32 peerId, bytes32 unitId);

    event MinPricePerEpochUpdated(bytes32 offerId, uint minPricePerWorkerEpoch);
    event PaymentTokenUpdated(bytes32 offerId, address paymentToken);
    event EffectorAdded(bytes32 offerId, CIDV1 effector);
    event EffectorRemoved(bytes32 offerId, CIDV1 effector);

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

    // ------------------ Constructor ------------------
    // @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ----------------- Internal View -----------------
    function _getOffersList() internal view returns (LinkedListWithUniqueKeys.Bytes32List storage) {
        return _getOfferStorage().offerIds;
    }

    function _getFreeComputeUnitList(bytes32 peerId) internal view returns (LinkedListWithUniqueKeys.Bytes32List storage) {
        return _getOfferStorage().peers[peerId].freeComputeUnitIds;
    }

    function _getFreePeerList(bytes32 offerId) internal view returns (LinkedListWithUniqueKeys.Bytes32List storage) {
        return _getOfferStorage().offers[offerId].freePeerIds;
    }

    function _hasOfferEffectors(bytes32 offerId, CIDV1[] memory effectors) internal view returns (bool) {
        OfferStorage storage offerStorage = _getOfferStorage();

        for (uint i = 0; i < effectors.length; i++) {
            bytes32 effectorHash = keccak256(abi.encodePacked(effectors[i].prefixes, effectors[i].hash));

            if (!offerStorage.offers[offerId].hasEffector[effectorHash]) {
                return false;
            }
        }

        return true;
    }

    function _reserveComputeUnitForDeal(bytes32 unitId, IDeal deal) internal {
        OfferStorage storage offerStorage = _getOfferStorage();
        ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];

        bytes32 peerId = computeUnit.peerId;
        ComputePeer storage computePeer = offerStorage.peers[peerId];
        Offer storage offer = offerStorage.offers[computePeer.info.offerId];

        require(computeUnit.deal == address(0x00), "Compute unit already reserved");
        require(computeUnit.peerId != bytes32(0x00), "Compute unit doesn't exist");

        computeUnit.deal = address(deal);

        computePeer.freeComputeUnitIds.remove(unitId);
        if (computePeer.freeComputeUnitIds.length() == 0) {
            offer.freePeerIds.remove(computePeer.info.offerId);
        }

        deal.addComputeUnit(offer.info.owner, peerId);

        //TODO: mv event from deal to here
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
        uint minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] calldata effectors,
        RegisterComputePeer[] calldata peers
    ) external {
        OfferStorage storage offerStorage = _getOfferStorage();

        require(offerStorage.offers[offerId].info.paymentToken == address(0x00), "Offer already exists");
        require(minPricePerWorkerEpoch > 0, "Min price per epoch should be greater than 0");
        require(address(paymentToken) != address(0x00), "Payment token should be not zero address");

        uint peerLength = peers.length;
        for (uint i = 0; i < peerLength; i++) {
            uint freeUnits = peers[i].freeUnits;
            bytes32 peerId = peers[i].peerId;

            require(offerStorage.peers[peerId].info.offerId == bytes32(0x00), "Peer already exists in another offer");

            // create market offer
            Offer storage offer = offerStorage.offers[offerId];

            offer.info = OfferInfo({ owner: msg.sender, minPricePerWorkerEpoch: minPricePerWorkerEpoch, paymentToken: paymentToken });

            // add effectors to offer
            for (uint j = 0; j < effectors.length; j++) {
                bytes32 effector = keccak256(abi.encodePacked(effectors[j].prefixes, effectors[j].hash));
                offer.hasEffector[effector] = true;
            }

            // create compute peer
            ComputePeer storage computePeer = offerStorage.peers[peerId];
            computePeer.info = ComputePeerInfo({ offerId: offerId });

            for (uint j = 0; j < freeUnits; j++) {
                bytes32 unitId = keccak256(abi.encodePacked(offerId, peerId, j));

                // create compute unit
                offerStorage.computeUnits[unitId] = ComputeUnit({ deal: address(0x00), peerId: peerId });

                // add unit to peer
                computePeer.freeComputeUnitIds.push(unitId);

                emit ComputeUnitCreated(offerId, peerId, unitId);
            }

            // add peer to offer
            offer.freePeerIds.push(peerId);

            emit PeerCreated(offerId, peerId);
        }

        emit MarkeOfferRegistered(offerId, msg.sender, minPricePerWorkerEpoch, paymentToken, effectors);
    }

    function changeMinPricePerWorkerEpoch(bytes32 offerId, uint newMinPricePerWorkerEpoch) external {
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

        for (uint i = 0; i < newEffectors.length; i++) {
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

        for (uint i = 0; i < effectors.length; i++) {
            CIDV1 calldata effectorCID = effectors[i];
            bytes32 effectorHash = keccak256(abi.encodePacked(effectorCID.prefixes, effectorCID.hash));

            require(offer.hasEffector[effectorHash], "Effector  doesn't exist");

            offer.hasEffector[effectorHash] = false;

            emit EffectorRemoved(offerId, effectorCID);
        }
    }
}
