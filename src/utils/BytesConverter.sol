// SPDX-License-Identifier: Apache-2.0

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
            result |= bytes32(_data[i] & 0xFF) >> (i * 8);
        }
        return result;
    }
}
