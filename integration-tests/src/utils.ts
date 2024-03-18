import { afterEach, assert, beforeAll, beforeEach } from "vitest";
import { provider } from "./env.js";

export async function skipEpoch(
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

export function snapshot(createSnapshot: () => Promise<void>) {
  let snapshotId: unknown;
  let snapshotBlockNumber: number;

  beforeAll(async () => {
    await createSnapshot();
  }, 180000);

  beforeEach(async () => {
    snapshotId = await provider.send("evm_snapshot", []);
    const block = await provider.getBlock("latest");
    assert(block !== null, "Block is null");
    console.log(block.number, "beforeEach");
  });

  afterEach(async () => {
    await provider.send("evm_revert", [snapshotId]);
    const block = await provider.getBlock("latest");
    assert(block !== null, "Block is null");
    console.log(block.number, "afterEach");
  });
}
