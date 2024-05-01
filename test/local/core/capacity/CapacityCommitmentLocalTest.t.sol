// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

import "test/common/core/capacity/CapacityCommitment.t.sol";
import "test/utils/TestWithLocalDeployment.sol";

contract CapacityCommitmentLocalTest is TestWithLocalDeployment, CapacityCommitmentTest {
    function setUp() override(TestWithDeployment,CapacityCommitmentTest) public {
       super.setUp();
    }
}
