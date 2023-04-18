// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../../deal/interfaces/ICore.sol";

interface IMatcher {
    function matchWithDeal(ICore deal, address[] calldata resources, uint[] calldata workersCount_) external;
}
