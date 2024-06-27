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

import {IDeal} from "src/deal/interfaces/IDeal.sol";
import {CIDV1} from "src/utils/Common.sol";

/// @title Offer contract interface
/// @dev Offer contract is responsible for managing the offers in the market
interface IOffer {
    struct ProviderInfo {
        string name;
        CIDV1 metadata;
    }

    struct RegisterComputePeer {
        bytes32 peerId;
        address owner;
        bytes32[] unitIds;
    }

    struct Offer {
        address provider;
        uint256 minPricePerWorkerEpoch;
        address paymentToken;
        uint256 peerCount;
        uint256 minProtocolVersion;
        uint256 maxProtocolVersion;
    }

    struct ComputePeer {
        bytes32 offerId;
        bytes32 commitmentId;
        uint256 unitCount;
        address owner;
    }

    struct ComputeUnit {
        address deal;
        bytes32 peerId;
        uint256 startEpoch;
    }

    struct ComputeUnitView {
        bytes32 id;
        address deal;
        uint256 startEpoch;
    }

    struct EffectorInfo {
        string description;
        CIDV1 metadata;
    }

    // ------------------ Events ------------------
    /// @dev Emitted when a provider info is updated
    /// @param provider The provider address
    /// @param name The new name of the provider
    /// @param metadata The new metadata of the provider
    event ProviderInfoUpdated(address indexed provider, string name, CIDV1 metadata);

    /// @dev Emitted when a new offer is registered
    /// @param provider The provider address
    /// @param offerId The offer id
    /// @param minPricePerWorkerEpoch The min price per worker per epoch which the provider specify for the matching with the deal
    /// @param paymentToken The payment token of the offer
    /// @param effectors The effectors of the offer
    event MarketOfferRegistered(
        address indexed provider,
        bytes32 offerId,
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] effectors,
        uint256 minProtocolVersion,
        uint256 maxProtocolVersion
    );

    /// @dev Emitted when a peer created for an offer
    event PeerCreated(bytes32 indexed offerId, bytes32 peerId, address owner);

    /// @dev Emitted when a peer removed from an offer
    /// @param offerId The offer id
    /// @param peerId The peer id
    event PeerRemoved(bytes32 indexed offerId, bytes32 indexed peerId);

    /// @dev Emitted when a compute unit created for a peer
    /// @param peerId The peer id
    /// @param unitId The compute unit id
    event ComputeUnitCreated(bytes32 indexed peerId, bytes32 unitId);

    /// @dev Emitted when a compute unit removed from a peer
    /// @param peerId The peer id
    /// @param unitId The compute unit id
    event ComputeUnitRemoved(bytes32 indexed peerId, bytes32 indexed unitId);

    /// @dev Emitted when the min price per worker per epoch of an offer is updated
    /// @param offerId The offer id
    /// @param minPricePerWorkerEpoch The new min price per worker per epoch
    event MinPricePerEpochUpdated(bytes32 indexed offerId, uint256 minPricePerWorkerEpoch);

    /// @dev Emitted when the payment token of an offer is updated
    /// @param offerId The offer id
    /// @param paymentToken The new payment token
    event PaymentTokenUpdated(bytes32 indexed offerId, address paymentToken);

    /// @dev Emitted when an effector added to an offer
    /// @param offerId The offer id
    /// @param effector The effector cid
    event EffectorAdded(bytes32 indexed offerId, CIDV1 effector);

    /// @dev Emitted when an effector removed from an offer
    /// @param offerId The offer id
    /// @param effector The effector cid
    event EffectorRemoved(bytes32 indexed offerId, CIDV1 effector);

    /// @dev Emitted when a compute unit added to a peer
    /// @param unitId The compute unit id
    /// @param deal The deal address
    /// @param peerId The peer id
    event ComputeUnitAddedToDeal(bytes32 indexed unitId, IDeal deal, bytes32 peerId);

    /// @dev Emitted when a compute unit removed from a peer
    /// @param unitId The compute unit id
    /// @param deal The deal address
    /// @param peerId The peer id
    event ComputeUnitRemovedFromDeal(bytes32 indexed unitId, IDeal deal, bytes32 peerId);

    /// @dev Emitted when the effector info is set. Effector info can be added by the contract owner
    /// @param id The effector cid
    /// @param description The description of the effector
    /// @param metadata The metadata of the effector
    event EffectorInfoSet(CIDV1 id, string description, CIDV1 metadata);

    /// @dev Emitted when the effector info is removed
    /// @param id The effector cid
    event EffectorInfoRemoved(CIDV1 id);

    // ----------------- Public View -----------------
    /// @dev Returns the provider info
    /// @param provider The provider address
    /// @return providerInfo The provider info
    function getProviderInfo(address provider) external view returns (ProviderInfo memory);

    /// @dev Returns the offer info
    /// @param offerId The offer id
    /// @return offer The offer info
    function getOffer(bytes32 offerId) external view returns (Offer memory);

    /// @dev Returns the compute peer info
    function getComputePeer(bytes32 peerId) external view returns (ComputePeer memory);

    /// @dev Returns the compute unit info
    function getComputeUnit(bytes32 unitId) external view returns (ComputeUnit memory);

    /// @dev Returns the compute unit ids of a peer
    function getComputeUnitIds(bytes32 peerId) external view returns (bytes32[] memory);

    /// @dev Returns the compute units info of a peer
    function getComputeUnits(bytes32 peerId) external view returns (ComputeUnitView[] memory);

    /// @dev Returns the effector info
    /// @param id The effector cid
    function getEffectorInfo(CIDV1 calldata id) external view returns (EffectorInfo memory);

    // ----------------- Public Mutable -----------------
    //Register offer and units
    /// @dev Set the provider info
    /// @param name The name of the provider
    /// @param metadata The metadata of the provider
    function setProviderInfo(string calldata name, CIDV1 calldata metadata) external;

    /// @dev Register a new offer
    /// @param minPricePerWorkerEpoch The min price per worker per epoch which the provider specify for the matching with the deal
    /// @param paymentToken The payment token of the offer
    /// @param effectors The effectors of the offer
    /// @param peers The compute peers of the offer
    function registerMarketOffer(
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] calldata effectors,
        RegisterComputePeer[] calldata peers,
        uint256 minProtocolVersion,
        uint256 maxProtocolVersion
    ) external returns (bytes32);

    /// @dev Remove an offer.
    /// @dev Only owner can change offer after all Peers removed (and CUs before).
    function removeOffer(bytes32 offerId) external;

    /// @dev Add compute peers to an offer
    function addComputePeers(bytes32 offerId, RegisterComputePeer[] calldata peers) external;

    /// @dev Remove compute peers from an offer after all CUs removed.
    /// @dev Only owner can remove Peer.
    function removeComputePeer(bytes32 peerId) external;

    /// @dev Add compute units to a peer
    function addComputeUnits(bytes32 peerId, bytes32[] calldata unitIds) external;

    /// @dev Remove compute units from a peer.
    /// @dev Only owner can remove Compute Unit that not in Deal and in CC.
    function removeComputeUnit(bytes32 unitId) external;

    // Change offer
    /// @dev Change the min price per worker per epoch of an offer
    function changeMinPricePerWorkerEpoch(bytes32 offerId, uint256 newMinPricePerWorkerEpoch) external;

    /// @dev Change the payment token of an offer
    function changePaymentToken(bytes32 offerId, address newPaymentToken) external;

    /// @dev Add effectors to an offer
    function addEffector(bytes32 offerId, CIDV1[] calldata newEffectors) external;

    /// @dev Remove effectors from an offer
    function removeEffector(bytes32 offerId, CIDV1[] calldata effectors) external;

    // Unit management
    /// @dev Return the compute unit from a deal
    function returnComputeUnitFromDeal(bytes32 unitId) external;

    // Effector info
    /// @dev Set the effector info. Effector info can be added by the contract owner
    function setEffectorInfo(CIDV1 calldata id, string calldata description, CIDV1 calldata metadata) external;

    /// @dev Remove the effector info. Effector info can be removed by the contract owner
    function removeEffectorInfo(CIDV1 calldata id) external;
}
