// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

import "../../deal/interfaces/ICore.sol";
import "../../deal/base/Types.sol";

interface IMatcher {
    function getFreeWorkersSolts(bytes32 peerId) external view returns (uint);

    function matchWithDeal(ICore deal) external;
}
