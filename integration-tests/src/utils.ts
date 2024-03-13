import type { JsonRpcProvider } from "ethers";
import { assert } from "vitest";

export async function skipEpoch(
  provider: JsonRpcProvider,
  epochDuration: bigint,
  epochCount: bigint | number,
) {
  const block = await provider.getBlock("latest");
  assert(block !== null);
  block.timestamp;
  await provider.send("evm_increaseTime", [
    (epochDuration * BigInt(epochCount)).toString(),
  ]);

  await provider.send("evm_mine", []);
}
