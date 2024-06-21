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

import "src/utils/OwnableUpgradableDiamond.sol";

contract Whitelist is OwnableUpgradableDiamond {
    // #region ------------------ Events ------------------
    event WhitelistAccessGranted(address account);
    event WhitelistAccessRevoked(address account);
    // #endregion

    // #region ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.whitelist.storage.v1")) - 1);

    struct WhitelistStorage {
        bool isWhitelistEnabled;
        mapping(address => bool) isWhitelisted;
    }

    function _getWhitelistStorage() private pure returns (WhitelistStorage storage s) {
        bytes32 storageSlot = _STORAGE_SLOT;
        assembly {
            s.slot := storageSlot
        }
    }
    // #endregion

    // #region ------------------ Initializer & Upgradeable ------------------
    function __Whitelist_init(bool isWhitelistEnabled) internal onlyInitializing {
        __Whitelist_init_unchained(isWhitelistEnabled);
    }

    function __Whitelist_init_unchained(bool isWhitelistEnabled) internal onlyInitializing {
        _getWhitelistStorage().isWhitelistEnabled = isWhitelistEnabled;
    }

    // #endregion

    // #region ----------------- Public View -----------------
    function isApproved(address account) public view returns (bool) {
        WhitelistStorage storage s = _getWhitelistStorage();
        return !s.isWhitelistEnabled || s.isWhitelisted[account];
    }
    // #endregion

    // #region ----------------- Public Mutable -----------------
    function grantAccess(address account) external onlyOwner {
        _getWhitelistStorage().isWhitelisted[account] = true;

        emit WhitelistAccessGranted(account);
    }

    function revokeAccess(address account) external onlyOwner {
        _getWhitelistStorage().isWhitelisted[account] = false;

        emit WhitelistAccessRevoked(account);
    }
    // #endregion
}
