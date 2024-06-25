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

library BytesConverter {
    error BytesLengthMismatch(uint256 expected, uint256 actual);

    function toBytes(bytes32 _data) internal pure returns (bytes memory) {
        bytes memory result = new bytes(32);
        for (uint256 i = 0; i < 32; i++) {
            result[i] = _data[i];
        }
        return result;
    }

    function toBytes32(bytes memory _data) internal pure returns (bytes32) {
        if (_data.length != 32) {
            revert BytesLengthMismatch(32, _data.length);
        }

        bytes32 result;
        for (uint256 i = 0; i < 32; i++) {
            result |= bytes32(_data[i]) >> (i * 8);
        }
        return result;
    }
}
