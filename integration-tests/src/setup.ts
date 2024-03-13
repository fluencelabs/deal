// Side effect import
import { provider, coreContract } from "./env.js";
import type { JsonRpcProvider } from "ethers";

async function stopAutoMining(provider: JsonRpcProvider) {
  await provider.send("evm_setAutomine", [false]);
}

export default async function setup() {
  await stopAutoMining(provider);
  const epochDuration = await coreContract.epochDuration();
}
