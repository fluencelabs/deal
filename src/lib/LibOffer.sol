// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IOffer} from "src/core/modules/market/interfaces/IOffer.sol";
import {LibCapacity} from "src/lib/LibCapacity.sol";
import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {CIDV1} from "src/utils/Common.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {OwnableUpgradableDiamond} from "src/utils/OwnableUpgradableDiamond.sol";

struct Effectors {
    mapping(bytes32 => bool) hasEffector;
}

struct OfferStorage {
    mapping(address => IOffer.ProviderInfo) providers;
    mapping(bytes32 => IOffer.Offer) offers;
    mapping(bytes32 => IOffer.ComputePeer) peers;
    mapping(bytes32 => IOffer.ComputeUnit) computeUnits;
    mapping(bytes32 => Effectors) effectorsByOfferId;
    mapping(bytes32 => EnumerableSet.Bytes32Set) computeUnitIdsByPeerId;
    mapping(bytes32 => IOffer.EffectorInfo) effectorInfoById;
}


library LibOffer {
    using EnumerableSet for EnumerableSet.Bytes32Set;
    bytes32 internal constant _OFFER_ID_PREFIX = bytes32(uint256(keccak256("fluence.market.offer")) - 1);
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.market.storage.v1")) - 1);

    function store() internal pure returns (OfferStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }

    function getProviderInfo(address provider) internal view returns (IOffer.ProviderInfo memory) {
        return store().providers[provider];
    }

    function getOffer(bytes32 offerId) internal view returns (IOffer.Offer memory) {
        IOffer.Offer storage offer = store().offers[offerId];
        require(offer.provider != address(0x00), "Offer doesn't exist");

        return offer;
    }

    function getComputePeer(bytes32 peerId) internal view returns (IOffer.ComputePeer memory) {
        IOffer.ComputePeer storage computePeer = store().peers[peerId];
        require(computePeer.offerId != bytes32(0x00), "Peer doesn't exist");

        return computePeer;
    }

    function getComputeUnit(bytes32 unitId) public view returns (IOffer.ComputeUnit memory) {
        IOffer.ComputeUnit storage computeUnit = store().computeUnits[unitId];
        require(computeUnit.peerId != bytes32(0x00), "Compute unit doesn't exist");

        return computeUnit;
    }

    function getComputeUnitIds(bytes32 peerId) public view returns (bytes32[] memory) {
        return store().computeUnitIdsByPeerId[peerId].values();
    }

    function _getOffer(bytes32 offerId) internal view returns (IOffer.Offer storage) {
        return store().offers[offerId];
    }

    function _getComputePeer(bytes32 peerId) internal view returns (IOffer.ComputePeer storage) {
        return store().peers[peerId];
    }

    function _getComputeUnit(bytes32 unitId) internal view returns (IOffer.ComputeUnit storage) {
        return store().computeUnits[unitId];
    }

    function _hasOfferEffectors(bytes32 offerId, CIDV1[] memory effectors) internal view returns (bool) {
        OfferStorage storage offerStorage = store();

        for (uint256 i = 0; i < effectors.length; i++) {
            bytes32 effectorHash = _hashEffectorCID(effectors[i]);

            if (!offerStorage.effectorsByOfferId[offerId].hasEffector[effectorHash]) {
                return false;
            }
        }

        return true;
    }

    function _hashEffectorCID(CIDV1 memory effectorCID) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(effectorCID.prefixes, effectorCID.hash));
    }

    function _addComputePeerToOffer(bytes32 offerId, IOffer.RegisterComputePeer calldata peer) internal {
        OfferStorage storage offerStorage = store();

        IOffer.ComputePeer storage computePeer = offerStorage.peers[peer.peerId];
        IOffer.Offer storage offer = offerStorage.offers[offerId];

        require(computePeer.offerId == bytes32(0x00), "Peer already exists in another offer");
        require(peer.peerId != bytes32(0x00), "Peer id should be not empty");

        computePeer.offerId = offerId;
        computePeer.owner = peer.owner;

        emit IOffer.PeerCreated(offerId, peer.peerId, peer.owner);
        offer.peerCount++;

        _addComputeUnitsToPeer(peer.peerId, peer.unitIds);
    }

    function _addComputeUnitsToPeer(bytes32 peerId, bytes32[] calldata unitIds) internal {
        OfferStorage storage offerStorage = store();
        IOffer.ComputePeer storage computePeer = offerStorage.peers[peerId];

        uint256 indexOffset = computePeer.unitCount;
        uint256 unitCount = unitIds.length;

        require(unitCount > 0, "Units should be greater than 0");

        for (uint256 i = 0; i < unitCount; i++) {
            bytes32 unitId = unitIds[i];

            require(unitId != bytes32(0x00), "Unit id should be not empty");
            require(offerStorage.computeUnits[unitId].peerId == bytes32(0x00), "Compute unit already exists");

            // create compute unit
            offerStorage.computeUnits[unitId] = IOffer.ComputeUnit({deal: address(0x00), peerId: peerId, startEpoch: 0});
            require(offerStorage.computeUnitIdsByPeerId[peerId].add(unitId), "Invalid add to enumerable set");

            emit IOffer.ComputeUnitCreated(peerId, unitId);
        }

        computePeer.unitCount = indexOffset + unitCount;
    }

    function _mvComputeUnitToDeal(bytes32 unitId, IDeal deal) internal {
        OfferStorage storage offerStorage = store();
        IOffer.ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];

        bytes32 peerId = computeUnit.peerId;
        IOffer.ComputePeer storage computePeer = offerStorage.peers[peerId];

        bytes32 offerId = computePeer.offerId;
        IOffer.Offer storage offer = offerStorage.offers[offerId];

        require(computeUnit.peerId != bytes32(0x00), "Compute unit doesn't exist");
        require(computeUnit.deal == address(0x00), "Compute unit already reserved");

        computeUnit.deal = address(deal);

        deal.addComputeUnit(offer.provider, unitId, peerId);

        // We may have CU not in any CC but this CU still could be matched (through whitelist).
        //  Thus, we ought to check if we need to mv CU from capacity.
        if (computePeer.commitmentId != bytes32(0x00)) {
            LibCapacity.onUnitMovedToDeal(computePeer.commitmentId, unitId);
        }

        emit IOffer.ComputeUnitAddedToDeal(unitId, deal, computeUnit.peerId);
    }

    function setCommitmentId(bytes32 peerId, bytes32 commitmentId) internal {
        OfferStorage storage offerStorage = store();
        IOffer.ComputePeer storage computePeer = offerStorage.peers[peerId];

        computePeer.commitmentId = commitmentId;
    }

    function setStartEpoch(bytes32 unitId, uint256 startEpoch) internal {
        OfferStorage storage offerStorage = store();
        IOffer.ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];

        computeUnit.startEpoch = startEpoch;
    }

    function _returnComputeUnitFromDeal(bytes32 unitId) internal {
        OfferStorage storage offerStorage = store();
        IOffer.ComputeUnit storage computeUnit = offerStorage.computeUnits[unitId];

        bytes32 peerId = computeUnit.peerId;
        IDeal deal = IDeal(computeUnit.deal);

        require(peerId != bytes32(0x00), "Compute unit doesn't exist");
        require(address(deal) != address(0x00), "Compute unit already free");

        IOffer.ComputePeer storage computePeer = offerStorage.peers[peerId];

        bytes32 offerId = computePeer.offerId;
        IOffer.Offer storage offer = offerStorage.offers[offerId];

        // TODO DIAMOND MOVE UPPER
        require(
            offer.provider == msg.sender
            || computePeer.owner == msg.sender
            || OwnableUpgradableDiamond(address(deal)).owner() == msg.sender,
            "Only deal owner, peer owner and provider can remove compute unit from deal"
        );

        computeUnit.deal = address(0x00);

        deal.removeComputeUnit(unitId);

        if (computePeer.commitmentId != bytes32(0x00)) {
            LibCapacity.onUnitReturnedFromDeal(computePeer.commitmentId, unitId);
        }

        emit IOffer.ComputeUnitRemovedFromDeal(unitId, deal, peerId);
    }
}
