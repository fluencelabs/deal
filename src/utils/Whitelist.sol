// SPDX-License-Identifier: Apache-2.0

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
