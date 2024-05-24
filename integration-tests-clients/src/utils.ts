import type {
  TypedContractMethod,
  StateMutability,
} from "@fluencelabs/deal-ts-clients/dist/typechain-types/common.d.ts";
import assert from "assert";
import type { TransactionRequest } from "ethers";
import { WAIT_CONFIRMATIONS } from "./env.js";
import { base58btc } from "multiformats/bases/base58";

const DEFAULT_OVERRIDES: TransactionRequest = {
  maxPriorityFeePerGas: 0,
};

function methodCallToString([method, ...args]: [
  { name: string },
  ...unknown[],
]) {
  return `${method.name}(${JSON.stringify(args, null, 2).slice(1, -1)})`;
}

export async function sign<
  A extends Array<unknown> = Array<unknown>,
  R = unknown,
  S extends Exclude<StateMutability, "view"> = "payable",
>(
  method: TypedContractMethod<A, R, S>,
  ...originalArgs: Parameters<TypedContractMethod<A, R, S>>
) {
  const overrides = originalArgs[originalArgs.length - 1];

  const hasOverrides =
    method.fragment.inputs.length === originalArgs.length - 1 &&
    typeof overrides === "object";

  // @ts-expect-error this probably impossible to type correctly with current TypeScript compiler
  const args: Parameters<TypedContractMethod<A, R, S>> = hasOverrides
    ? [...originalArgs.slice(0, -1), { ...DEFAULT_OVERRIDES, ...overrides }]
    : [...originalArgs, DEFAULT_OVERRIDES];

  if (method.name !== "multicall") {
    const debugInfo = `calling contract method: ${methodCallToString([
      method,
      ...args,
    ])}`;

    console.log(debugInfo);
  }

  const { tx, res } = await setTryTimeout(
    `execute ${method.name} blockchain method`,
    async function executingContractMethod() {
      const tx = await method(...args);
      const res = await tx.wait(WAIT_CONFIRMATIONS);
      return { tx, res };
    },
    (err) => {
      throw err;
    },
    1000 * 5, // 5 seconds
    1000,
    (err: unknown) => {
      return !(
        err instanceof Error &&
        [
          "data=null",
          "connection error",
          "connection closed",
          "Tendermint RPC error",
        ].some((msg) => {
          return err.message.includes(msg);
        })
      );
    },
  );

  assert(res !== null, `'${method.name}' transaction hash is not defined`);
  assert(res.status === 1, `'${method.name}' transaction failed with status 1`);

  console.log(`${method.name} transaction ${tx.hash} was mined successfully`);

  return res;
}

export async function setTryTimeout<T, U>(
  message: string,
  callbackToTry: () => T | Promise<T>,
  errorHandler: (error: unknown) => U,
  msToTryFor: number,
  msBetweenTries = 1000,
  failCondition?: (error: unknown) => boolean,
): Promise<T | U> {
  let isTimeoutRunning = true;

  const timeout = setTimeout(() => {
    isTimeoutRunning = false;
  }, msToTryFor);

  let error: unknown;
  let attemptCounter = 1;
  let isTrying = true;

  while (isTrying) {
    isTrying = isTimeoutRunning;

    try {
      console.log(`Trying to ${message}`);
      const res = await callbackToTry();
      clearTimeout(timeout);
      isTrying = false;
      return res;
    } catch (e) {
      if (failCondition !== undefined && failCondition(e)) {
        clearTimeout(timeout);
        return errorHandler(e);
      }

      const errorString = stringifyUnknown(e);
      const previousErrorString = stringifyUnknown(error);

      if (errorString === previousErrorString) {
        console.log(
          `Attempt #${attemptCounter} to ${message} failed with the same error`,
        );
      } else {
        const retryMessage = isTrying ? ". Going to retry" : "";
        console.log(`Failing to ${message}${retryMessage}`);
        console.log(`Reason: ${stringifyUnknown(e)}`);
      }

      error = e;
      attemptCounter++;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, msBetweenTries);
    });
  }

  return errorHandler(error);
}

export function stringifyUnknown(unknown: unknown): string {
  try {
    if (typeof unknown === "string") {
      return unknown;
    }

    if (unknown instanceof Error) {
      const errorMessage =
        typeof unknown.stack === "string" &&
        unknown.stack.includes(unknown.message)
          ? unknown.stack
          : `${unknown.message}${
              unknown.stack === undefined ? "" : `\n${unknown.stack}`
            }`;

      const otherErrorProperties = Object.getOwnPropertyNames(unknown).filter(
        (p) => {
          return p !== "message" && p !== "stack";
        },
      );

      return `${errorMessage}${
        otherErrorProperties.length > 0
          ? `\n${JSON.stringify(unknown, otherErrorProperties, 2)}`
          : ""
      }`;
    }

    if (unknown === undefined) {
      return "undefined";
    }

    return JSON.stringify(unknown, null, 2);
  } catch {
    // eslint-disable-next-line no-restricted-syntax
    return String(unknown);
  }
}

export async function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

const PEER_BYTE58_PREFIX = new Uint8Array([0, 36, 8, 1, 18, 32]);
const BASE_58_PREFIX = "z";

// Serialize PeerId from contract hex format to bytes58.
export function peerIdContractHexToBase58(peerIdHex: string) {
  return base58btc
    .encode(
      Buffer.concat([
        PEER_BYTE58_PREFIX,
        Buffer.from(peerIdHex.slice(2), "hex"),
      ]),
    )
    .slice(BASE_58_PREFIX.length);
}
