// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;


library String {
    function equals(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
