// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

/// @title Epoch controller contract interface
/// @dev Epoch controller contract is responsible for changing epochs
interface IEpochController {
    /// @dev Returns current epoch
    /// @return current epoch number
    function currentEpoch() external view returns (uint256);

    /// @dev Returns epoch duration
    /// @return epochDuration in seconds
    function epochDuration() external view returns (uint256);

    /// @dev Returns epoch init timestamp
    /// @return initTimestamp in seconds
    function initTimestamp() external view returns (uint256);
}
