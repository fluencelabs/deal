// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../base/Types.sol";

struct PAT {
    bytes32 id;
    bytes32 peerId;
    bytes32 workerId;
    address owner;
    uint256 collateral;
    uint256 created;
}

interface IWorkersModule {
    // ----------------- View -----------------
    function getPAT(bytes32 id) external view returns (PAT memory);

    function getPATCount() external view returns (uint256);

    function getPATs() external view returns (PAT[] memory);

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256);

    // ----------------- View -----------------
    function createPAT(address owner, bytes32 peerId) external;

    function exit(bytes32 id) external;

    function withdrawCollateral(address owner) external;

    function setWorker(bytes32 id, bytes32 workerId) external;
}
