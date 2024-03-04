import type { JsonRpcProvider } from "ethers";

export async function skipEpoch(
  provider: JsonRpcProvider,
  epochDuration: bigint,
  n: bigint | number,
) {
  await provider.send("evm_increaseTime", [
    (epochDuration * BigInt(n)).toString(),
  ]);

  await provider.send("evm_mine", []);
}
