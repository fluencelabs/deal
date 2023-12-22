// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "src/utils/OwnableUpgradableDiamond.sol";
import "src/utils/LinkedListWithUniqueKeys.sol";
import "src/deal/base/Types.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/core/modules/BaseModule.sol";
import "./interfaces/IOffer.sol";
import "forge-std/console.sol";

contract Offer is BaseModule, IOffer {
    using SafeERC20 for IERC20;
    using LinkedListWithUniqueKeys for LinkedListWithUniqueKeys.Bytes32List;
    using EnumerableSet for EnumerableSet.Bytes32Set;

    // ------------------ Constants ------------------
    bytes32 private constant _OFFER_ID_PREFIX = bytes32(uint256(keccak256("fluence.market.offer")) - 1);

    // ------------------ Types ------------------
    struct Effectors {
        mapping(bytes32 => bool) hasEffector;
    }

    // ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1")) - 1);

    struct OfferStorage {
        mapping(bytes32 => Offer) offers;
        mapping(bytes32 => ComputePeer) peers;
        mapping(bytes32 => ComputeUnit) computeUnits;
        mapping(bytes32 => Effectors) effectorsByOfferId;
        mapping(bytes32 => EnumerableSet.Bytes32Set) computeUnitIdsByPeerId;
    }

    OfferStorage private _storage;

    function _getOfferStorage() private pure returns (OfferStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    // ----------------- Public View -----------------
    function getOffer(bytes32 offerId) public view returns (Offer memory) {
        Offer storage offer = _getOfferStorage().offers[offerId];
        require(offer.provider != address(0x00), "Offer doesn't exist");

        return offer;
    }

    function getComputePeer(bytes32 peerId) public view returns (ComputePeer memory) {
        ComputePeer storage computePeer = _getOfferStorage().peers[peerId];
        require(computePeer.offerId != bytes32(0x00), "Peer doesn't exist");

        return computePeer;
    }

    function getComputeUnit(bytes32 unitId) public view returns (ComputeUnit memory) {
        ComputeUnit storage computeUnit = _getOfferStorage().computeUnits[unitId];
        require(computeUnit.peerId != bytes32(0x00), "Compute unit doesn't exist");

        return computeUnit;
    }

    function getComputeUnitIds(bytes32 peerId) public view returns (bytes32[] memory) {
        return _getOfferStorage().computeUnitIdsByPeerId[peerId].values();
    }

    // ----------------- Public Mutable -----------------
    //Register offer and units
    function registerMarketOffer(
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] calldata effectors,
        RegisterComputePeer[] calldata peers
    ) external returns (bytes32) {
        OfferStorage storage offerStorage = _getOfferStorage();

        address provider = msg.sender;
        bytes32 offerId = keccak256(abi.encodePacked(_OFFER_ID_PREFIX, provider, block.number, msg.data));

        require(offerStorage.offers[offerId].paymentToken == address(0x00), "Offer already exists");
        require(minPricePerWorkerEpoch > 0, "Min price per epoch should be greater than 0");
        require(address(paymentToken) != address(0x00), "Payment token should be not zero address");

        // create market offer
        offerStorage.offers[offerId] =
            Offer({provider: provider, minPricePerWorkerEpoch: minPricePerWorkerEpoch, paymentToken: paymentToken});

        // add effectors to offer
        for (uint256 j = 0; j < effectors.length; j++) {
            bytes32 effector = keccak256(abi.encodePacked(effectors[j].prefixes, effectors[j].hash));
            offerStorage.effectorsByOfferId[offerId].hasEffector[effector] = true;
        }

        emit MarketOfferRegistered(provider, offerId, minPricePerWorkerEpoch, paymentToken, effectors);

        uint256 peerLength = peers.length;
        for (uint256 i = 0; i < peerLength; i++) {
            _addComputePeerToOffer(offerId, peers[i]);
        }

        return offerId;
    }

    function addComputePeers(bytes32 offerId, RegisterComputePeer[] calldata peers) external {
        OfferStorage storage offerStorage = _getOfferStorage();

        Offer storage offer = offerStorage.offers[offerId];
        require(offer.provider != address(0x00), "Offer doesn't exist");
        require(offer.provider == msg.sender, "Only owner can change offer");

        uint256 peerLength = peers.length;
        for (uint256 i = 0; i < peerLength; i++) {
            _addComputePeerToOffer(offerId, peers[i]);
        }
    }

    function addComputeUnits(bytes32 peerId, bytes32[] calldata unitIds) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        ComputePeer storage computePeer = offerStorage.peers[peerId];
        bytes32 offerId = computePeer.offerId;
        Offer storage offer = offerStorage.offers[offerId];

        require(computePeer.owner == address(0x00), "Peer doesn't exist");
        require(offer.provider == msg.sender, "Only owner can change offer");
        require(computePeer.commitmentId == bytes32(0x00), "Peer has commitment");

        _addComputeUnitsToPeer(peerId, unitIds);
    }

    function removeComputeUnit(bytes32 unitId) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];

        bytes32 peerId = computeUnit.peerId;
        ComputePeer storage computePeer = offerStorage.peers[peerId];
        Offer storage offer = offerStorage.offers[computePeer.offerId];

        require(offer.provider == msg.sender, "Only owner can remove compute unit");
        require(computePeer.commitmentId == bytes32(0x00), "Peer has commitment");
        require(computeUnit.deal == address(0x00), "Compute unit is in deal");

        computePeer.unitCount--;

        offerStorage.computeUnitIdsByPeerId[peerId].remove(unitId);

        delete offerStorage.computeUnits[unitId];
        // TODO: event and support in the subgraph.
    }

    // Change offer
    function changeMinPricePerWorkerEpoch(bytes32 offerId, uint256 newMinPricePerWorkerEpoch) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.provider == msg.sender, "Only owner can change offer");
        require(newMinPricePerWorkerEpoch > 0, "Min price per epoch should be greater than 0");

        offer.minPricePerWorkerEpoch = newMinPricePerWorkerEpoch;

        emit MinPricePerEpochUpdated(offerId, newMinPricePerWorkerEpoch);
    }

    function changePaymentToken(bytes32 offerId, address newPaymentToken) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.provider == msg.sender, "Only owner can change offer");
        require(newPaymentToken != address(0x00), "Payment token should be not zero address");

        offer.paymentToken = newPaymentToken;

        emit PaymentTokenUpdated(offerId, newPaymentToken);
    }

    function addEffector(bytes32 offerId, CIDV1[] calldata newEffectors) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.provider == msg.sender, "Only owner can change offer");

        for (uint256 i = 0; i < newEffectors.length; i++) {
            CIDV1 calldata effectorCID = newEffectors[i];
            bytes32 effectorHash = keccak256(abi.encodePacked(effectorCID.prefixes, effectorCID.hash));

            require(!offerStorage.effectorsByOfferId[offerId].hasEffector[effectorHash], "Effector already exists");

            offerStorage.effectorsByOfferId[offerId].hasEffector[effectorHash] = true;

            emit EffectorAdded(offerId, effectorCID);
        }
    }

    function removeEffector(bytes32 offerId, CIDV1[] calldata effectors) external {
        OfferStorage storage offerStorage = _getOfferStorage();
        Offer storage offer = offerStorage.offers[offerId];

        require(offer.provider == msg.sender, "Only owner can change offer");

        for (uint256 i = 0; i < effectors.length; i++) {
            CIDV1 calldata effectorCID = effectors[i];
            bytes32 effectorHash = keccak256(abi.encodePacked(effectorCID.prefixes, effectorCID.hash));

            require(offerStorage.effectorsByOfferId[offerId].hasEffector[effectorHash], "Effector  doesn't exist");

            offerStorage.effectorsByOfferId[offerId].hasEffector[effectorHash] = false;

            emit EffectorRemoved(offerId, effectorCID);
        }
    }

    // Unit management
    function returnComputeUnitFromDeal(bytes32 unitId) public onlyCapacity {
        OfferStorage storage offerStorage = _getOfferStorage();
        ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];

        bytes32 peerId = computeUnit.peerId;
        IDeal deal = IDeal(computeUnit.deal);

        require(peerId != bytes32(0x00), "Compute unit doesn't exist");
        require(address(deal) != address(0x00), "Compute unit already free");

        ComputePeer storage computePeer = offerStorage.peers[peerId];

        bytes32 offerId = computePeer.offerId;
        Offer storage offer = offerStorage.offers[offerId];

        require(
            OwnableUpgradableDiamond(address(deal)).owner() == msg.sender || offer.provider == msg.sender,
            "Only deal or offer owner can remove compute unit from deal"
        );

        computeUnit.deal = address(0x00);

        deal.removeComputeUnit(unitId);

        emit ComputeUnitRemovedFromDeal(unitId, deal, peerId);
    }

    function setCommitmentId(bytes32 peerId, bytes32 commitmentId) external onlyCapacity {
        OfferStorage storage offerStorage = _getOfferStorage();
        ComputePeer storage computePeer = offerStorage.peers[peerId];

        computePeer.commitmentId = commitmentId;
    }

    // ----------------- Internal View -----------------
    function _getOffer(bytes32 offerId) internal view returns (Offer storage) {
        return _getOfferStorage().offers[offerId];
    }

    function _getComutePeer(bytes32 peerId) internal view returns (ComputePeer storage) {
        return _getOfferStorage().peers[peerId];
    }

    function _getComputeUnit(bytes32 unitId) internal view returns (ComputeUnit storage) {
        return _getOfferStorage().computeUnits[unitId];
    }

    function _hasOfferEffectors(bytes32 offerId, CIDV1[] memory effectors) internal view returns (bool) {
        OfferStorage storage offerStorage = _getOfferStorage();

        for (uint256 i = 0; i < effectors.length; i++) {
            bytes32 effectorHash = keccak256(abi.encodePacked(effectors[i].prefixes, effectors[i].hash));

            if (!offerStorage.effectorsByOfferId[offerId].hasEffector[effectorHash]) {
                return false;
            }
        }

        return true;
    }

    // ----------------- Internal Mutable -----------------
    function _addComputePeerToOffer(bytes32 offerId, RegisterComputePeer calldata peer) internal {
        OfferStorage storage offerStorage = _getOfferStorage();

        ComputePeer storage computePeer = offerStorage.peers[peer.peerId];

        require(computePeer.offerId == bytes32(0x00), "Peer already exists in another offer");

        computePeer.offerId = offerId;
        computePeer.owner = peer.owner;

        emit PeerCreated(offerId, peer.peerId, peer.owner);

        _addComputeUnitsToPeer(peer.peerId, peer.unitIds);

        computePeer.unitCount = peer.unitIds.length;
    }

    function _addComputeUnitsToPeer(bytes32 peerId, bytes32[] memory unitIds) internal {
        OfferStorage storage offerStorage = _getOfferStorage();
        ComputePeer storage computePeer = offerStorage.peers[peerId];

        uint256 indexOffset = computePeer.unitCount;
        uint256 unitCount = unitIds.length;

        require(unitCount > 0, "Units should be greater than 0");

        for (uint256 i = 0; i < unitCount; i++) {
            bytes32 unitId = unitIds[i];

            require(offerStorage.computeUnits[unitId].peerId == bytes32(0x00), "Compute unit already exists");

            // create compute unit
            offerStorage.computeUnits[unitId] = ComputeUnit({deal: address(0x00), peerId: peerId});
            offerStorage.computeUnitIdsByPeerId[peerId].add(unitId);

            emit ComputeUnitCreated(peerId, unitId);
        }

        computePeer.unitCount = indexOffset + unitCount;
    }

    function _mvComputeUnitToDeal(bytes32 unitId, IDeal deal) internal {
        OfferStorage storage offerStorage = _getOfferStorage();
        ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];

        bytes32 peerId = computeUnit.peerId;
        ComputePeer storage computePeer = offerStorage.peers[peerId];

        bytes32 offerId = computePeer.offerId;
        Offer storage offer = offerStorage.offers[offerId];

        require(computeUnit.peerId != bytes32(0x00), "Compute unit doesn't exist");
        require(computeUnit.deal == address(0x00), "Compute unit already reserved");

        computeUnit.deal = address(deal);

        deal.addComputeUnit(offer.provider, unitId, peerId);

        emit ComputeUnitAddedToDeal(unitId, deal, computeUnit.peerId);
    }
}
