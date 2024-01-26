// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "forge-std/console.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
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
