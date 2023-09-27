// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../deal/base/Types.sol";
import "../../../deal/interfaces/IDeal.sol";

interface IMatcherConfig {
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
    function getFreeWorkersSolts(bytes32 peerId) external view returns (uint);

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
