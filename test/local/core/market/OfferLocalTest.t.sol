// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "test/common/core/market/Offer.t.sol";
import "test/utils/TestWithLocalDeployment.sol";

contract OfferLocalTest is TestWithLocalDeployment, OfferTest {
    function setUp() override(TestWithDeployment, OfferTest) public {
       super.setUp();
    }
}
