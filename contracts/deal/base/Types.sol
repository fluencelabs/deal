// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.17;

struct Particle {
    string air;
    string prevData;
    string params;
    string callResults;
}

struct CIDV1 {
    bytes4 prefixes;
    bytes32 hash;
}
