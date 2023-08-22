// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.21;

interface IEpochManager {
    function epochDuration() external view returns (uint256);

    function currentEpoch() external view returns (uint256);
}
