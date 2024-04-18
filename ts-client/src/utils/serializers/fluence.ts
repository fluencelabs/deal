// Fluence specific serializers.
import { digest } from "multiformats";
import { base58btc } from "multiformats/bases/base58";

const PEER_BYTE58_PREFIX = new Uint8Array([0, 36, 8, 1, 18, 32]);
const BASE_58_PREFIX = "z";

// Serialize PeerId bytes58 to uint 8 Array (at this stage it is enough to send it
//  to contract as peerId argument that will parse it to bytes32).
export function peerIdByte58ToUint8Array(peerId: string) {
  return digest
    .decode(base58btc.decode(BASE_58_PREFIX + peerId))
    .bytes.subarray(PEER_BYTE58_PREFIX.length);
}

// Serialize PeerId bytes58 to contract hex format.
export function peerIdByte58toContractHex(peerId: string) {
  return `0x${Buffer.from(peerIdByte58ToUint8Array(peerId)).toString("hex")}`;
}

// Serialize PeerId from contract hex format to bytes58.
export function peerIdContractHexToBase58(peerIdHex: string) {
  return base58btc
    .encode(Buffer.concat([PEER_BYTE58_PREFIX, Buffer.from(peerIdHex.slice(2), "hex")]))
    .slice(BASE_58_PREFIX.length);
}
