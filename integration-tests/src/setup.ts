// Side effect import
import { provider, coreContract, capacityContract } from "./env.js";
import { CapacityConstantType, DEFAULT_CONFIRMATIONS } from "./constants.js";

async function moveToStartOfNextEpoch() {
  const epochDuration = await coreContract.epochDuration();
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
    .setConstant(CapacityConstantType.MinDuration, 0)
    .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
  await capacityContract
    .setConstant(CapacityConstantType.MaxFailedRatio, 3)
    .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
}
