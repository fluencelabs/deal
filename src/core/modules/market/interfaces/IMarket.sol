// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./IDealFactory.sol";
import "./IOffer.sol";

interface IMarket is IDealFactory, IOffer {
    function initialize(ICore core) external;
}
