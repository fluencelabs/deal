pragma solidity ^0.8.17;

contract EpochManager {
    uint256 public constant EPOCH_DURATION = 1 hours;

    function getEpoch() external view returns (uint256) {
        return block.timestamp / EPOCH_DURATION;
    }
}
