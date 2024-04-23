import { describe, expect, test } from "vitest";
import {
  cidBase32ToIndexerHex,
  cidIndexerHexToCIDBase32,
  peerIdByte58toContractHex,
  peerIdContractHexToBase58,
} from "../../../../src/utils/serializers/fluence";

describe("#peerIdContractHexToBase58", () => {
  test("it converts to contract format and back (for prefix [0, 36, 8, 1, 18, 32]).", async () => {
    const base58format = "12D3KooWCKCeqLPSgMnDjyFsJuWqREDtKNHx1JEBiwaMXhCLNTRb";
    const contractFormat = peerIdByte58toContractHex(base58format);
    expect(peerIdContractHexToBase58(contractFormat)).toEqual(base58format);
  });
});

describe("#cidIndexerHexToCIDBase32", () => {
  test("it converts to contract format and back.", async () => {
    const base32format =
      "bafkreids22lgia5bqs63uigw4mqwhsoxvtnkpfqxqy5uwyyerrldsr32ce";
    const indexerFormat = cidBase32ToIndexerHex(base32format);
    expect(cidIndexerHexToCIDBase32(indexerFormat)).toEqual(base32format);
  });
});
