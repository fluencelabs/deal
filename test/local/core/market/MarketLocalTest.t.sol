// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "test/common/core/market/Market.t.sol";
import "test/utils/TestWithLocalDeployment.sol";

contract MarketLocalTest is TestWithLocalDeployment, MarketTest {
    function setUp() public override(TestWithDeployment, MarketTest) {
        super.setUp();
    }
}
