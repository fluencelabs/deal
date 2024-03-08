import { assert, expect } from "vitest";
import {
  type ICapacity,
  type IDeal,
  type IDealFactory,
  type IMarket,
} from "@fluencelabs/deal-ts-clients";
import type { TypedEventLog } from "@fluencelabs/deal-ts-clients/dist/typechain-types/common.js";
import { type ContractTransactionResponse } from "ethers";

export async function checkEvents<
  R extends ICapacity | IMarket | IDeal | IDealFactory,
  T extends R["filters"][keyof R["filters"]],
>(
  contract: R,
  event: T,
  expectedEventCount: number,
  txOrBlockNumber: ContractTransactionResponse | number,
): Promise<TypedEventLog<T>[]> {
  let blockNumber: number | null | undefined =
    typeof txOrBlockNumber === "number"
      ? txOrBlockNumber
      : txOrBlockNumber.blockNumber;
  if (typeof txOrBlockNumber !== "number") {
    while (blockNumber == null) {
      console.log("query transaction...");
      const internalTx = await txOrBlockNumber.getTransaction();
      blockNumber = internalTx?.blockNumber;
    }
  }
  assert(blockNumber, "Block number is not defined");
  const events = await contract.queryFilter(event, blockNumber);
  expect(events.length).toBe(expectedEventCount);
  return events;
}
