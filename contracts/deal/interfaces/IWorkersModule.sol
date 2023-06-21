// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../base/Types.sol";

interface IWorkersModule {
    function workersCount() external view returns (uint256);

    function getNextWorkerIndex() external view returns (uint256);

    function getPATIndex(PATId id) external view returns (uint256);

    function getPATOwner(PATId id) external view returns (address);

    function getPDT(PATId id) external view returns (string memory peerId, string memory workerId);

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256);

    function join() external;

    function joinViaMatcher(address owner) external;

    function exit(PATId id) external;

    function withdrawCollateral(address owner) external;

    function setPDT(PATId id, string calldata peerId, string calldata workerId) external;
}
