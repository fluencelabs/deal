// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

import "../base/Types.sol";

struct PAT {
    PATId id;
    Multihash peerId;
    Multihash workerId;
    address owner;
    uint256 collateral;
    uint256 created;
}

interface IWorkersModule {
    function getPATs() external view returns (PAT[] memory);

    function patCount() external view returns (uint256);

    function getPAT(PATId id) external view returns (PAT memory);

    function getUnlockedAmountBy(address owner, uint256 timestamp) external view returns (uint256);

    function createPAT(address owner, Multihash calldata peerId) external;

    function exit(PATId id) external;

    function withdrawCollateral(address owner) external;

    function setWorker(PATId id, Multihash calldata workerId) external;
}
