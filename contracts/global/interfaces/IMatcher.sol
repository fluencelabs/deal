// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../../deal/interfaces/ICore.sol";
import "../../deal/base/Types.sol";

interface IMatcher {
    function getFreeWorkersSolts(address computeProvider, Multihash calldata peerId) external view returns (uint);

    function matchWithDeal(ICore deal) external;
}
