// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import {Matcher} from "src/core/modules/market/Matcher.sol";
import {IMarket} from "src/core/interfaces/IMarket.sol";

contract MarketFacet is Matcher, IMarket {

}
