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

import "solidity-cborutils/CBOR.sol";
import "filecoin-solidity/v0.8/types/CommonTypes.sol";
import "filecoin-solidity/v0.8/utils/Actor.sol";
import "filecoin-solidity/v0.8/utils/CborDecode.sol";
import "src/utils/BytesConverter.sol";

contract RandomXProxy {
    using CBOR for CBOR.CBORBuffer;
    using BytesConverter for bytes32;
    using BytesConverter for bytes;

    CommonTypes.FilActorId internal constant OldActorID = CommonTypes.FilActorId.wrap(0x70768565);
    CommonTypes.FilActorId internal constant NewActorID = CommonTypes.FilActorId.wrap(0x70768562);
    uint256 internal constant RunRandomX = 2044353154;
    uint256 internal constant RunRandomXBatched = 4200016682;

    /// @notice runs the Fluence actor which runs RandomX with provided K and H and returns it's result.
    /// @param ks array of the K parameter (aka "global" nonce) for RandomX, could up to 60 bytes.
    /// @param hs array of the H parameter (aka "local" nonce) for RandomX, could be an arbitrary string.
    function run(bytes32[] memory ks, bytes32[] memory hs) public returns (bytes32[] memory) {
        require(ks.length == hs.length, "Invalid input length");

        bytes memory se_request = _serializeRandomXParameters(ks, hs);

        (int256 ret_code, bytes memory actor_result) =
            Actor.callByID(NewActorID, RunRandomXBatched, Misc.CBOR_CODEC, se_request, 0, false);
        require(ret_code == 0, "Fluence actor failed");

        bytes32[] memory result = _deserializeActorResult(actor_result);
        require(result.length == ks.length, "Invalid result length");

        return result;
    }

    function _serializeRandomXParameters(bytes32[] memory ks, bytes32[] memory hs)
        private
        pure
        returns (bytes memory)
    {
        uint256 capacity = Misc.getPrefixSize(2);

        capacity += Misc.getPrefixSize(ks.length);
        bytes[] memory kBytes = new bytes[](ks.length);
        for (uint256 i = 0; i < ks.length; i++) {
            kBytes[i] = ks[i].toBytes();
            capacity += Misc.getBytesSize(kBytes[i]);
        }

        capacity += Misc.getPrefixSize(hs.length);
        bytes[] memory hBytes = new bytes[](hs.length);
        for (uint256 i = 0; i < hs.length; i++) {
            hBytes[i] = hs[i].toBytes();
            capacity += Misc.getBytesSize(hBytes[i]);
        }

        CBOR.CBORBuffer memory buf = CBOR.create(capacity);

        buf.startFixedArray(2);

        buf.startFixedArray(uint64(ks.length));
        for (uint256 i = 0; i < ks.length; i++) {
            buf.writeBytes(kBytes[i]);
        }

        buf.startFixedArray(uint64(hs.length));
        for (uint256 i = 0; i < hs.length; i++) {
            buf.writeBytes(hBytes[i]);
        }

        return buf.data();
    }

    function _deserializeActorResult(bytes memory actor_result) private pure returns (bytes32[] memory) {
        (uint256 len, uint256 byteIdx) = CBORDecoder.readFixedArray(actor_result, 0);

        require(len == 1, "Invalid tuple length");

        (len, byteIdx) = CBORDecoder.readFixedArray(actor_result, byteIdx);

        bytes32[] memory result = new bytes32[](len);
        for (uint256 i = 0; i < len; i++) {
            (bytes memory item, uint256 idx) = CBORDecoder.readBytes(actor_result, byteIdx);

            result[i] = item.toBytes32();
            byteIdx = idx;
        }

        return result;
    }
}
