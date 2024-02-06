// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/core/interfaces/ICore.sol";

contract RandomXProxyMock {
    bytes32 public immutable difficulty;

    constructor(bytes32 difficulty_) {
        difficulty = difficulty_;
    }

    function run(bytes32 k, bytes32 h) public view returns (bytes32) {
        return difficulty;
    }
}
