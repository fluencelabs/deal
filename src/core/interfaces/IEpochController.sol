// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

interface IEpochController {
    function currentEpoch() external view returns (uint256);
}
