// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/deal/base/Types.sol";

interface IOffer {
    // ------------------ Types ------------------
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
    }

    struct ComputeUnitView {
        bytes32 id;
        address deal;
    }

    struct EffectorInfo {
        string description;
        CIDV1 metadata;
    }

    // ------------------ Events ------------------
    event ProviderInfoUpdated(address indexed provider, string name, CIDV1 metadata);

    event MarketOfferRegistered(
        address indexed provider,
        bytes32 offerId,
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] effectors
    );
    event PeerCreated(bytes32 indexed offerId, bytes32 peerId, address owner);
    event PeerRemoved(bytes32 indexed offerId, bytes32 indexed peerId);
    event ComputeUnitCreated(bytes32 indexed peerId, bytes32 unitId);
    event ComputeUnitRemoved(bytes32 indexed peerId, bytes32 indexed unitId);

    event MinPricePerEpochUpdated(bytes32 indexed offerId, uint256 minPricePerWorkerEpoch);
    event PaymentTokenUpdated(bytes32 indexed offerId, address paymentToken);
    event EffectorAdded(bytes32 indexed offerId, CIDV1 effector);
    event EffectorRemoved(bytes32 indexed offerId, CIDV1 effector);

    event ComputeUnitAddedToDeal(bytes32 indexed unitId, IDeal deal, bytes32 peerId);
    event ComputeUnitRemovedFromDeal(bytes32 indexed unitId, IDeal deal, bytes32 peerId);

    event EffectorInfoSet(CIDV1 indexed id, string description, CIDV1 metadata);
    event EffectorInfoRemoved(CIDV1 indexed id);

    // ----------------- Public View -----------------
    function getProviderInfo(address provider) external view returns (ProviderInfo memory);
    function getOffer(bytes32 offerId) external view returns (Offer memory);
    function getComputePeer(bytes32 peerId) external view returns (ComputePeer memory);
    function getComputeUnit(bytes32 unitId) external view returns (ComputeUnit memory);
    function getComputeUnitIds(bytes32 peerId) external view returns (bytes32[] memory);
    function getComputeUnits(bytes32 peerId) external view returns (ComputeUnitView[] memory);
    function getEffectorInfo(CIDV1 calldata id) external view returns (EffectorInfo memory);

    // ----------------- Public Mutable -----------------
    //Register offer and units
    function setProviderInfo(string calldata name, CIDV1 calldata metadata) external;
    function registerMarketOffer(
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] calldata effectors,
        RegisterComputePeer[] calldata peers
    ) external returns (bytes32);
    function removeOffer(bytes32 offerId) external;
    function addComputePeers(bytes32 offerId, RegisterComputePeer[] calldata peers) external;
    function removeComputePeer(bytes32 peerId) external;
    function addComputeUnits(bytes32 peerId, bytes32[] calldata unitIds) external;
    function removeComputeUnit(bytes32 unitId) external;

    // Change offer
    function changeMinPricePerWorkerEpoch(bytes32 offerId, uint256 newMinPricePerWorkerEpoch) external;
    function changePaymentToken(bytes32 offerId, address newPaymentToken) external;
    function addEffector(bytes32 offerId, CIDV1[] calldata newEffectors) external;
    function removeEffector(bytes32 offerId, CIDV1[] calldata effectors) external;

    // Unit management
    function returnComputeUnitFromDeal(bytes32 unitId) external;
    function setCommitmentId(bytes32 peerId, bytes32 commitmentId) external;

    // Effector info
    function setEffectorInfo(CIDV1 calldata id, string calldata description, CIDV1 calldata metadata) external;
    function removeEffectorInfo(CIDV1 calldata id) external;
}
