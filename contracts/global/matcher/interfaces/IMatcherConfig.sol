// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../deal/base/Types.sol";
import "../../../deal/interfaces/IDeal.sol";

interface IMatcherConfig {
    // ----------------- Types -----------------
    struct ComputeProvider {
        uint minPricePerEpoch;
        uint maxCollateral;
        IERC20 paymentToken;
        uint totalFreeWorkerSlots;
    }

    struct ComputePeer {
        uint freeWorkerSlots;
    }

    // ----------------- Events -----------------
    event ComputeProviderRegistered(
        address computeProvider,
        uint minPricePerEpoch,
        uint maxCollateral,
        IERC20 paymentToken,
        CIDV1[] effectors
    );
    event ComputeProviderRemoved(address computeProvider);

    event WorkersSlotsChanged(bytes32 peerId, uint newWorkerSlots);
    event MinPricePerEpochChanged(address computeProvider, uint newMinPricePerEpoch);
    event MaxCollateralChanged(address computeProvider, uint newMaxCollateral);
    event PaymentTokenChanged(address computeProvider, IERC20 newPaymentToken);
    event EffectorAdded(address computeProvider, CIDV1 effector);
    event EffectorRemoved(address computeProvider, CIDV1 effector);

    // ----------------- View -----------------
    function getComputeProviderInfo(address provider) external view returns (ComputeProvider memory);

    function getPeersByComputeProvider(address provider) external view returns (bytes32[] memory peerIds, ComputePeer[] memory);

    function getComputePeerInfo(bytes32 peerId) external view returns (ComputePeer memory);

    // ----------------- Mutable -----------------
    function registerComputeProvider(uint minPricePerEpoch, uint maxCollateral, IERC20 paymentToken, CIDV1[] calldata effectors) external;

    function addWorkersSlots(bytes32 peerId, uint workerSlots) external;

    function subWorkersSlots(bytes32 peerId, uint workerSlots) external;

    function changeMinPricePerEpoch(uint newMinPricePerEpoch) external;

    function changeMaxCollateral(uint newMaxCollateral) external;

    function changePaymentToken(IERC20 newPaymentToken, uint newMaxCollateral) external;

    function addEffector(CIDV1 calldata effector) external;

    function removeEffector(CIDV1 calldata effector) external;

    function removeComputeProvider() external;
}
