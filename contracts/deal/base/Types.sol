// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

enum Module {
    None,
    Config,
    Payment,
    Status,
    Workers
}

struct Particle {
    string air;
    string prevData;
    string params;
    string callResults;
}

struct PAT {
    uint256 index;
    address owner;
    uint256 collateral;
    uint256 created;
}

struct PDT {
    string peerId;
    string workerId;
}

struct CIDV1 {
    bytes4 prefixes;
    bytes32 hash;
}

struct Multihash {
    bytes1 hashCode;
    bytes1 length;
    bytes32 value;
}

enum DealStatus {
    WaitingForWorkers,
    Working
}

type PATId is bytes32;
