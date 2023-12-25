// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "src/deal/interfaces/IDeal.sol";
import "src/deal/base/Types.sol";

interface IOffer {
    // ------------------ Types ------------------
    struct RegisterComputePeer {
        bytes32 peerId;
        address owner;
        bytes32[] unitIds;
    }

    struct Offer {
        address provider;
        uint256 minPricePerWorkerEpoch;
        address paymentToken;
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

    // ------------------ Events ------------------
    event MarketOfferRegistered(
        address indexed provider,
        bytes32 offerId,
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] effectors
    );
    event PeerCreated(bytes32 indexed offerId, bytes32 peerId, address owner);
    event ComputeUnitCreated(bytes32 indexed peerId, bytes32 unitId);

    event MinPricePerEpochUpdated(bytes32 indexed offerId, uint256 minPricePerWorkerEpoch);
    event PaymentTokenUpdated(bytes32 indexed offerId, address paymentToken);
    event EffectorAdded(bytes32 indexed offerId, CIDV1 effector);
    event EffectorRemoved(bytes32 indexed offerId, CIDV1 effector);

    event ComputeUnitAddedToDeal(bytes32 indexed unitId, IDeal deal, bytes32 peerId);
    event ComputeUnitRemovedFromDeal(bytes32 indexed unitId, IDeal deal, bytes32 peerId);

    // ----------------- Public View -----------------
    function getOffer(bytes32 offerId) external view returns (Offer memory);

    function getComputePeer(bytes32 peerId) external view returns (ComputePeer memory);

    function getComputeUnit(bytes32 unitId) external view returns (ComputeUnit memory);

    function getComputeUnitIds(bytes32 peerId) external view returns (bytes32[] memory);

    // ----------------- Public Mutable -----------------
    // ---- Register offer and units ----
    function registerMarketOffer(
        uint256 minPricePerWorkerEpoch,
        address paymentToken,
        CIDV1[] calldata effectors,
        RegisterComputePeer[] calldata peers
    ) external returns (bytes32 offerId);

    function addComputePeers(bytes32 offerId, RegisterComputePeer[] calldata peers) external;

    function addComputeUnits(bytes32 peerId, bytes32[] calldata unitIds) external;

    function removeComputeUnit(bytes32 unitId) external;

    function setCommitmentId(bytes32 peerId, bytes32 commitmentId) external;

    // ---- Change offer ----
    function changeMinPricePerWorkerEpoch(bytes32 offerId, uint256 newMinPricePerWorkerEpoch) external;

    function changePaymentToken(bytes32 offerId, address newPaymentToken) external;

    function addEffector(bytes32 offerId, CIDV1[] calldata newEffectors) external;

    function removeEffector(bytes32 offerId, CIDV1[] calldata effectors) external;

    // ---- Unit management ----
    function returnComputeUnitFromDeal(bytes32 unitId) external;
}
