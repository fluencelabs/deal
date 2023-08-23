// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "./interfaces/IEpochManager.sol";

contract EpochManager is IEpochManager {
    uint256 public epochDuration;

    constructor(uint256 epochDuration_) {
        epochDuration = epochDuration_;
    }

    function currentEpoch() external view returns (uint256) {
        return block.timestamp / epochDuration;
    }
}
