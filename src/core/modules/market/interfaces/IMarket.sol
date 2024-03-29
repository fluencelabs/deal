// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./IOffer.sol";
import "./IMatcher.sol";

/// @title Market contract interface
/// @dev Market contract is responsible for managing the deals and offers
interface IMarket is IOffer, IMatcher {
    function initialize() external;
}
