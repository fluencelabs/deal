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

import "src/deal/interfaces/IDeal.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CIDV1} from "src/utils/Common.sol";
import "src/deal/interfaces/IConfig.sol";

/// @title Deal factory contract interface
/// @dev Deal factory contract is responsible for creating deals
interface IDealFactory {
    // ----------------- Events -----------------
    /// @dev Emitted when a new deal is created
    /// @param owner The owner of the deal
    /// @param deal The deal address
    /// @param createdAtEpoch The creation time of the deal in Epochs
    /// @param paymentToken The payment token of the deal. User can choose any ERC20 token for payment
    /// @param minWorkers The min workers of the deal. Deel will be activated only if the number of workers is greater
    /// @param targetWorkers The target workers of the deal. It's the max number of workers for the deal
    /// @param maxWorkersPerProvider The max workers per provider of the deal
    /// @param pricePerWorkerEpoch The price per worker per epoch of the deal
    /// @param effectors The effectors of the deal
    /// @param appCID The app cid of the deal
    /// @param providersAccessType_ The providers access type of the deal (None, Whitelist, Blacklist)
    /// @param providersAccessList_ The providers access list of the deal
    /// @param protocolVersion_ Protocol version
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
        address[] providersAccessList_,
        uint256 protocolVersion_
    );

    function initialize() external;

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
    /// @param protocolVersion_ Protocol version
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
        address[] calldata providersAccessList_,
        uint256 protocolVersion_
    ) external returns (IDeal);
}
