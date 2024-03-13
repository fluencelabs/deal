// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "src/core/interfaces/ICore.sol";

contract RandomXProxyMock {
    bytes32 public immutable difficulty;

    constructor(bytes32 difficulty_) {
        difficulty = difficulty_;
    }

    function run(bytes32 k, bytes32[] memory hs) public returns (bytes32[] memory) {
        bytes32[] memory result = new bytes32[](hs.length);
        for (uint256 i = 0; i < hs.length; i++) {
            result[i] = difficulty;
        }

        return result;
    }
}
