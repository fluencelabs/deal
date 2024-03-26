import type { OrderType } from "./types/filters.js";

// Max to select per 1 multiselect filter.
export const FILTER_MULTISELECT_MAX = 100;
export const DEFAULT_ORDER_TYPE: OrderType = "desc";

// Returns total counter according to provided total and filters.
// Note, now it returns null when filters are not empty because for subgraph it
//  is impossible to get counter with filtration.
// Ref to https://github.com/graphprotocol/graph-node/issues/1309.
export function getTotalCounter(
  // @ts-ignore
  filters: any,
  total: number,
): string | null {
  if (Object.keys(filters).length) {
    return null;
  }
  return total.toString();
}

// It mirrors core.currentEpoch in EpochController.sol.
export function calculateEpoch(
  timestamp: number,
  epochControllerStorageInitTimestamp: number,
  epochControllerStorageEpochDuration: number,
): number {
  return parseInt(
    (
      1 +
      (timestamp - epochControllerStorageInitTimestamp) /
        epochControllerStorageEpochDuration
    ).toString(),
  );
}

export function calculateTimestamp(
  epoch: number,
  epochControllerStorageInitTimestamp: number,
  epochControllerStorageEpochDuration: number,
): number {
  return (
    (epoch - 1) * epochControllerStorageEpochDuration +
    epochControllerStorageInitTimestamp
  );
}
