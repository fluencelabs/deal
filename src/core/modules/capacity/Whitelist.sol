// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "forge-std/console.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "src/core/modules/capacity/interfaces/IWhitelist.sol";
import "src/utils/OwnableUpgradableDiamond.sol";

contract Whitelist is IWhitelist, OwnableUpgradableDiamond {
    // #region ------------------ Storage ------------------
    bytes32 private constant _STORAGE_SLOT = bytes32(uint256(keccak256("fluence.capacity.storage.v1.whitelist")) - 1);

    struct WhitelistStorage {
        bool isWhitelistEnabled;
        mapping(address => bool) isWhitelisted;
    }

    WhitelistStorage private _storage;

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
    function hasAccess(address account) external view returns (bool) {
        WhitelistStorage storage s = _getWhitelistStorage();
        return !s.isWhitelistEnabled || s.isWhitelisted[account];
    }
    // #endregion

    // #region ----------------- Public Mutable -----------------
    function addToWhitelist(address account) external onlyOwner {
        _getWhitelistStorage().isWhitelisted[account] = true;

        emit AddedToWhitelist(account);
    }

    function removeFromWhitelist(address account) external onlyOwner {
        _getWhitelistStorage().isWhitelisted[account] = false;

        emit RemovedFromWhitelist(account);
    }
    // #endregion
}
