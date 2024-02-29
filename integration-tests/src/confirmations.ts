import { expect } from "vitest";
import {
  type ICapacity,
  type IDeal,
  type IDealFactory,
  type IMarket,
} from "@fluencelabs/deal-ts-clients";
import type { TypedEventLog } from "@fluencelabs/deal-ts-clients/dist/typechain-types/common.js";
import type { ContractTransactionResponse } from "ethers";

export async function confirmEvents<
  R extends ICapacity | IMarket | IDeal | IDealFactory,
  T extends R["filters"][keyof R["filters"]],
>(
  contract: R,
  event: T,
  expectedEventCount: number,
  tx: ContractTransactionResponse,
): Promise<TypedEventLog<T>[]> {
  while (tx.blockNumber === null) {
    await new Promise((resolve) => setTimeout(resolve));
    console.log("wait block");
  }
  const events = await contract.queryFilter(event, tx.blockNumber);
  const lastEvents = events.reverse().slice(0, expectedEventCount);
  expect(lastEvents.length).toBe(expectedEventCount);
  return lastEvents;
}
