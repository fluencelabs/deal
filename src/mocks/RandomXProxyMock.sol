/*
 * Fluence Compute Marketplace
 *
 * Copyright (C) 2024 Fluence DAO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

pragma solidity ^0.8.19;

contract RandomXProxyMock {
    bytes32 public immutable difficulty;

    constructor(bytes32 difficulty_) {
        difficulty = difficulty_;
    }

    function run(bytes32[] memory ks, bytes32[] memory hs) public returns (bytes32[] memory) {
        require(ks.length == hs.length, "Invalid input length");

        bytes32[] memory result = new bytes32[](ks.length);
        for (uint256 i = 0; i < ks.length; i++) {
            result[i] = difficulty;
        }

        return result;
    }
}
