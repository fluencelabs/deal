pragma solidity ^0.8.17;

contract EpochManager {
    uint256 public epochDuration;

    constructor(uint256 epochDuration_) {
        epochDuration = epochDuration_;
    }

    function getEpoch() external view returns (uint256) {
        return block.timestamp / epochDuration;
    }
}
