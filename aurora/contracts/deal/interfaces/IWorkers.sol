// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../base/Types.sol";

interface IWorkers {
    function workersCount() external view returns (uint256);

    function getNextWorkerIndex() external view returns (uint256);

    function getPATIndex(PATId id) external view returns (uint256);

    function getPATOwner(PATId id) external view returns (address);

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256);

    function createPAT(address owner, address payer) external;

    function removePAT(PATId id) external;

    function withdraw(address owner) external;
}
