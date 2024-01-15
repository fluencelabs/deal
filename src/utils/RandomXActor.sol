// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.19;

import "solidity-cborutils/CBOR.sol";
import "filecoin-solidity/v0.8/types/CommonTypes.sol";
import "filecoin-solidity/v0.8/utils/Actor.sol";
import "filecoin-solidity/v0.8/utils/CborDecode.sol";
import "src/utils/BytesConverter.sol";

library RandomXActor {
    using CBOR for CBOR.CBORBuffer;
    using BytesConverter for bytes32;
    using BytesConverter for bytes;

    CommonTypes.FilActorId internal constant ActorID = CommonTypes.FilActorId.wrap(17);
    uint256 internal constant RunRandomX = 2044353154;

    /// @notice runs the Fluence actor which runs RandomX with provided K and H and returns it's result.
    /// @param k the K parameter (aka "global" nonce) for RandomX, could up to 60 bytes.
    /// @param h the H parameter (aka "local" nonce) for RandomX, could be an arbitrary string.
    function run(bytes32 k, bytes32 h) internal returns (bytes32) {
        bytes memory se_request = serializeRandomXParameters(k.toBytes(), h.toBytes());

        (int256 ret_code, bytes memory actor_result) =
            Actor.callByID(ActorID, RunRandomX, Misc.CBOR_CODEC, se_request, 0, false);
        require(ret_code == 0, "Fluence actor failed");

        return deserializeActorResult(actor_result).toBytes32();
    }

    function serializeRandomXParameters(bytes memory k, bytes memory h) internal pure returns (bytes memory) {
        uint256 capacity = 0;

        capacity += Misc.getPrefixSize(2);
        capacity += Misc.getBytesSize(k);
        capacity += Misc.getBytesSize(h);
        CBOR.CBORBuffer memory buf = CBOR.create(capacity);

        buf.startFixedArray(2);
        buf.writeBytes(k);
        buf.writeBytes(h);

        return buf.data();
    }

    function deserializeActorResult(bytes memory actor_result) internal pure returns (bytes memory) {
        (uint256 len, uint256 byteIdx) = CBORDecoder.readFixedArray(actor_result, 0);
        require(len == 1, "There should be only one element");

        (bytes memory result,) = CBORDecoder.readBytes(actor_result, byteIdx);
        return result;
    }
}
