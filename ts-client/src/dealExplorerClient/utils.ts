import type { OrderType } from "./types/filters.js";

// Max to select per 1 multiselect filter.
export const FILTER_MULTISELECT_MAX = 100;
export const DEFAULT_ORDER_TYPE: OrderType = "desc";

// Returns total counter according to provided total and filters.
// Note, now it returns null when filters are not empty because for subgraph it
//  is impossible to get counter with filtration.
// Ref to https://github.com/graphprotocol/graph-node/issues/1309.
// @param filters: filters that used to be sent to subgraph directly
//  (thus, after serialization).
export function getTotalCounter(
  // @ts-ignore
  filters: any,
  total: number,
): string | null {
  // onlyApproved == false filter should not be counted as actual filter for schemes:
  // - OffersFilters,
  // - ProvidersFilters,
  //  because this false value is a default one. And default filter value should not be counted when we decide:
  //  if we actually use filtration and, thus, we can not count total for the query.
  // Note, this, behavior will be ignored when
  //  counters will be implemented: https://github.com/graphprotocol/graph-node/issues/1309.
  const filtersCopy = { ...filters };
  if (filtersCopy.onlyApproved === false) {
    delete filtersCopy.onlyApproved;
  }

  if (Object.keys(filtersCopy).length) {
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
