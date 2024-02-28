// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/deal/base/Types.sol";
import "src/deal/interfaces/IDeal.sol";

/// @title Deal factory contract interface
/// @dev Deal factory contract is responsible for creating deals
interface IDealFactory {
    // ----------------- Events -----------------
    /// @dev Emitted when a new deal is created
    /// @param owner The owner of the deal
    /// @param deal The deal address
    /// @param createdAtEpoch The creation time of the deal in epoches
    /// @param paymentToken The payment token of the deal. User can choose any ERC20 token for payment
    /// @param minWorkers The min workers of the deal. Deel will be activated only if the number of workers is greater
    /// @param targetWorkers The target workers of the deal. It's the max number of workers for the deal
    /// @param maxWorkersPerProvider The max workers per provider of the deal
    /// @param pricePerWorkerEpoch The price per worker per epoch of the deal
    /// @param effectors The effectors of the deal
    /// @param appCID The app cid of the deal
    /// @param providersAccessType_ The providers access type of the deal (None, Whitelist, Blacklist)
    /// @param providersAccessList_ The providers access list of the deal
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
        CIDV1 appCID,
        IConfig.AccessType providersAccessType_,
        address[] providersAccessList_
    );

    // ----------------- View -----------------
    /// @dev Returns true if the deal exists
    /// @param deal The deal address
    function hasDeal(IDeal deal) external view returns (bool);

    // ----------------- Mutable -----------------
    /// @dev Creates a new deal
    /// @param appCID_ The app cid of the deal
    /// @param paymentToken_ The payment token of the deal. User can choose any ERC20 token for payment
    /// @param depositAmount_ The deposit amount of the deal
    /// @param minWorkers_ The min workers of the deal. Deel will be activated only if the number of workers is greater
    /// @param targetWorkers_ The target workers of the deal. It's the max number of workers for the deal
    /// @param maxWorkersPerProvider_ The max workers per provider of the deal
    /// @param pricePerWorkerEpoch_ The price per worker per epoch of the deal
    /// @param effectors_ The effectors of the deal
    /// @param providersAccessType_ The providers access type of the deal (None, Whitelist, Blacklist)
    /// @param providersAccessList_ The providers access list of the deal
    /// @return The deal address
    function deployDeal(
        CIDV1 calldata appCID_,
        IERC20 paymentToken_,
        uint256 depositAmount_,
        uint256 minWorkers_,
        uint256 targetWorkers_,
        uint256 maxWorkersPerProvider_,
        uint256 pricePerWorkerEpoch_,
        CIDV1[] calldata effectors_,
        IConfig.AccessType providersAccessType_,
        address[] calldata providersAccessList_
    ) external returns (IDeal);
}
