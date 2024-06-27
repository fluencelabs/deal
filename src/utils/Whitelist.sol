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

import {OwnableUpgradableDiamond} from "src/utils/OwnableUpgradableDiamond.sol";
import {LibWhitelist} from "src/lib/LibWhitelist.sol";
import {LibDiamond} from "src/lib/LibDiamond.sol";

contract Whitelist is OwnableUpgradableDiamond {
    event WhitelistAccessGranted(address account);
    event WhitelistAccessRevoked(address account);


    function isApproved(address account) external view returns (bool) {
        return LibWhitelist.isApproved(account);
    }

    function grantAccess(address account) external {
        LibDiamond.enforceIsContractOwner();
        LibWhitelist.store().isWhitelisted[account] = true;

        emit WhitelistAccessGranted(account);
    }

    function revokeAccess(address account) external {
        LibDiamond.enforceIsContractOwner();
        LibWhitelist.store().isWhitelisted[account] = false;

        emit WhitelistAccessRevoked(account);
    }
}
