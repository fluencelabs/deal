import { assert, expect } from "vitest";
import {
  type ICapacity,
  type IDeal,
  type IDealFactory,
  type IMarket,
} from "@fluencelabs/deal-ts-clients";
import type {
  TypedContractEvent,
  TypedEventLog,
} from "@fluencelabs/deal-ts-clients/dist/typechain-types/common.js";
import {
  ContractTransactionReceipt,
  type ContractTransactionResponse,
  EventLog,
  Log,
} from "ethers";

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

const isEventLog = (log: Log): log is EventLog => {
  return "args" in log;
};

export function checkEvent<E extends TypedContractEvent>(
  event: E,
  tx: ContractTransactionReceipt | null,
): E extends TypedContractEvent<infer I, infer O, infer R>
  ? TypedEventLog<TypedContractEvent<I, O, R>>
  : never;

export function checkEvent<E extends TypedContractEvent>(
  event: E,
  tx: ContractTransactionReceipt | null,
): TypedEventLog<TypedContractEvent> {
  const log = tx?.logs.find((log) => {
    return log.topics[0] === event.fragment.topicHash;
  });

  assert(
    log !== undefined,
    `Event ${event.name} not found in transaction logs`,
  );
  if (!isEventLog(log)) {
    throw new Error("Log doesn't contain args");
  }

  return log;
}
