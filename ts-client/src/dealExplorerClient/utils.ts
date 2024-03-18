import type { OrderType } from "./types/filters.js";

// Max to select per 1 multiselect filter.
export const FILTER_MULTISELECT_MAX = 100;
export const DEFAULT_ORDER_TYPE: OrderType = "desc";

// It mirrors core.currentEpoch in EpochController.sol.
export function calculateEpoch(
  timestamp: number,
  epochControllerStorageInitTimestamp: number,
  epochControllerStorageEpochDuration: number,
): number {
  return parseInt(
    (1 +
    (timestamp - epochControllerStorageInitTimestamp) /
      epochControllerStorageEpochDuration).toString()
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
