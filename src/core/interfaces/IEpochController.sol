// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

interface IEpochController {
    function currentEpoch() external view returns (uint256);
    function epochDuration() external view returns (uint256);
    function initTimestamp() external view returns (uint256);
}
