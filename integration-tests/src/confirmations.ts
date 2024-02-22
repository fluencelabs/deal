import { expect } from "vitest";
import {
  type ICapacity,
  type IDeal,
  type IMarket,
} from "@fluencelabs/deal-ts-clients";
import type { TypedEventLog } from "@fluencelabs/deal-ts-clients/dist/typechain-types/common.js";

export async function confirmEvents<
  R extends ICapacity | IMarket | IDeal,
  T extends R["filters"][keyof R["filters"]],
>(
  contract: R,
  event: T,
  expectedEventCount: number,
  from: number,
): Promise<TypedEventLog<T>[]> {
  const events = await contract.queryFilter(event, from);
  const lastEvents = events.reverse().slice(0, expectedEventCount);
  expect(lastEvents.length).toBe(expectedEventCount);
  return lastEvents;
}
