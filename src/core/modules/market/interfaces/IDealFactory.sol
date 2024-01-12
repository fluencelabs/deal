// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/deal/base/Types.sol";
import "src/deal/interfaces/IDeal.sol";

interface IDealFactory {
    // ----------------- Events -----------------
    event DealCreated(
        address indexed owner,
        IDeal deal,
        uint256 createdAtEpoch,
        IERC20 paymentToken,
        uint256 minWorkers,
        uint256 targetWorkers,
        uint256 maxWorkersPerProvider,
        uint256 pricePerWorkerEpoch,
        CIDV1[] effectors,
        CIDV1 appCID
    );

    // ----------------- View -----------------
    function hasDeal(IDeal deal) external view returns (bool);

    // ----------------- Mutable -----------------
    function deployDeal(
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_
    ) external returns (IDeal);
}
