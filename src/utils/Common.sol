// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

uint256 constant PRECISION = 1e7; // min: 0.0000001

struct CIDV1 {
    bytes4 prefixes;
    bytes32 hash;
}
