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

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CIDV1} from "src/utils/Common.sol";

/// @title Config contract interface
/// @dev Config contract is responsible for managing the configuration of the deal
interface IConfig {
    // ------------------ Types ------------------
    enum AccessType {
        NONE,
        WHITELIST,
        BLACKLIST
    }

    // ------------------ Events ------------------
    /// @dev Emitted when the app CID is changed
    /// @param newAppCID The new app CID
    event AppCIDChanged(CIDV1 newAppCID);

    /// @dev Emitted when the providers access type is changed
    /// @param newAccessType The new access type
    event ProvidersAccessTypeChanged(AccessType newAccessType);

    /// @dev Emitted when a provider is added to the access list
    /// @param provider The provider address
    event ProviderAddedToAccessList(address provider);

    /// @dev Emitted when a provider is removed from the access list
    /// @param provider The provider address
    event ProviderRemovedFromAccessList(address provider);

    // ------------------ View Functions ---------------------
    /// @dev Returns the payment token address
    function paymentToken() external view returns (IERC20);

    /// @dev Returns the creation block of the deal
    function creationBlock() external view returns (uint256);

    /// @dev Returns the price per worker per epoch
    function pricePerWorkerEpoch() external view returns (uint256);

    /// @dev Returns the max number of workers
    function targetWorkers() external view returns (uint256);

    /// @dev Returns the min number of workers
    function minWorkers() external view returns (uint256);

    /// @dev Returns the effector CIDs
    function effectors() external view returns (CIDV1[] memory);

    /// @dev Returns the app CID
    function appCID() external view returns (CIDV1 memory);

    /// @dev Returns the max number of workers per provider
    function maxWorkersPerProvider() external view returns (uint256);

    /// @dev Returns the providers access type
    function providersAccessType() external view returns (AccessType);

    /// @dev Returns the boolean indicating whether the provider is allowed or not
    function isProviderAllowed(address account) external view returns (bool);

    // ------------------ Mutable Functions ------------------
    /// @dev Sets the app CID
    function setAppCID(CIDV1 calldata appCID_) external;

    /// @dev Change the providers access type
    function changeProvidersAccessType(AccessType accessType) external;

    /// @dev Adds a provider to the access list
    function addProviderToAccessList(address provider) external;

    /// @dev Removes a provider from the access list
    function removeProviderFromAccessList(address provider) external;
}
