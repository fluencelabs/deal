import { afterEach, assert, beforeAll, beforeEach } from "vitest";
import { coreContract, provider } from "./env.js";
import {
  CapacityConstantType,
  CC_MAX_FAILED_RATIO,
  CC_MIN_DURATION, CC_PRECISION,
  CC_SLASHING_RATE_PERCENT,
  DEFAULT_CONFIRMATIONS
} from "./constants.js";

export async function skipEpoch(
  epochDuration: bigint,
  epochCount: bigint | number = 1,
) {
  if (epochCount === 0) {
    return;
  }

  const block = await provider.getBlock("latest");
  assert(block !== null);
  await provider.send("evm_increaseTime", [
    (epochDuration * BigInt(epochCount)).toString(),
  ]);

  await provider.send("evm_mine", []);
}

export function snapshot(createSnapshot: () => Promise<void>) {
  let snapshotId: unknown;
  let testIsRunning: boolean = false;

  beforeAll(async () => {
    await createSnapshot();
  }, 180000);

  beforeEach(async () => {
    snapshotId = await provider.send("evm_snapshot", []);
    assert(!testIsRunning, "concurrent testing");
    testIsRunning = true;
    const block = await provider.getBlock("latest");
    assert(block !== null, "Block is null");
    console.log(block.number, "beforeEach");
    await provider.send("evm_setIntervalMining", [1]);
  });

  afterEach(async () => {
    await provider.send("evm_setIntervalMining", [0]);
    assert(testIsRunning, "concurrent testing");
    testIsRunning = false;
    await provider.send("evm_revert", [snapshotId]);
    const block = await provider.getBlock("latest");
    assert(block !== null, "Block is null");
    console.log(block.number, "afterEach");
  });
}

export function bigintAbs(n: bigint) {
  return n < 0n ? -n : n;
}
