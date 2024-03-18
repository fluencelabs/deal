// Side effect import
import { provider, coreContract, capacityContract } from "./env.js";
import {
  CapacityConstantType,
  CC_MAX_FAILED_RATIO,
  CC_MIN_DURATION,
  DEFAULT_CONFIRMATIONS,
} from "./constants.js";

async function moveToStartOfNextEpoch() {
  const epochDuration = await coreContract.epochDuration();
  console.log("Current epoch duration", epochDuration);
  const currentBlock = await provider.getBlock("latest");
  if (currentBlock === null) {
    throw new Error("current block isn't defined");
  }

  const secondsTillNextEpoch =
    epochDuration - (BigInt(currentBlock.timestamp) % epochDuration);
  await provider.send("evm_increaseTime", [secondsTillNextEpoch.toString()]);
  await provider.send("evm_mine", []);
}

export default async function setup() {
  await moveToStartOfNextEpoch();

  await capacityContract
    .setConstant(CapacityConstantType.MinDuration, CC_MIN_DURATION)
    .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
  await capacityContract
    .setConstant(CapacityConstantType.MaxFailedRatio, CC_MAX_FAILED_RATIO)
    .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
}
