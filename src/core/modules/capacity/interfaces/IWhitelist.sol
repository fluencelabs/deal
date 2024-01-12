// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

interface IWhitelist {
    // #region ------------------ Events ------------------
    event AddedToWhitelist(address account);
    event RemovedFromWhitelist(address account);
    // #endregion

    // #region ----------------- Public View -----------------
    function hasAccess(address account) external view returns (bool);
    // #endregion

    // #region ----------------- Public Mutable -----------------
    function addToWhitelist(address account) external;
    function removeFromWhitelist(address account) external;
    // #endregion
}
