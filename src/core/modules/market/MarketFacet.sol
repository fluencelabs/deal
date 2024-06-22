// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/core/interfaces/ICore.sol";
import "./Matcher.sol";
import "./interfaces/IMarket.sol";

contract MarketFacet is Matcher, IMarket {
    // TODO DIAMOND I deleted multicall
    constructor(ICore core_) BaseModule(core_) {}
}
