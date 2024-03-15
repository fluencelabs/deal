import type { JsonRpcProvider } from "ethers";
import { assert } from "vitest";

export async function skipEpoch(
  provider: JsonRpcProvider,
  epochDuration: bigint,
  epochCount: bigint | number = 1,
) {
  const block = await provider.getBlock("latest");
  assert(block !== null);
  await provider.send("evm_increaseTime", [
    (epochDuration * BigInt(epochCount)).toString(),
  ]);

  await provider.send("evm_mine", []);
}
