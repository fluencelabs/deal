// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "../../deal/base/Types.sol";
import "../../deal/interfaces/IDeal.sol";

interface ICore {
    function currentEpoch() external view returns (uint256);
}
