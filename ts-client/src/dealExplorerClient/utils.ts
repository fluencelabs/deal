import { ethers } from "ethers";
import type { OrderType } from "./types/filters.js";

// @deprecated
export const DEFAULT_TOKEN_VALUE_ROUNDING = 3;
// Max to select per 1 multiselect filter.
export const FILTER_MULTISELECT_MAX = 100;
export const DEFAULT_ORDER_TYPE: OrderType = "desc";

// Note, suffix Default because in the future we could check for minimal delta
//  in contracts and parse by this dynamic value.
export interface SerializationSettings {
  parseNativeTokenToFixedDefault: number;
  parseTokenToFixedDefault: number;
}

// Parse token value with its decimals to more human-readable format.
// Note, first of all it parses value according to its decimals from contracts,
//  after it parsed to supplied fixed format (in case it is 0.0000 it parsed to 0).
// Note, toFixed should be equal to the minimal delta value in contracts that should be added (e.g. ).
//  With this precision we sure that showed values are representative for the user.
//  For stable coins with smth like 6 digits it seemed to use toFixed=2.
export function tokenValueToRounded(
  value: string | bigint,
  toFixed: number = 3,
  decimals: number = 18,
) {
  const formatted = ethers.formatUnits(value, decimals);
  const parsed = parseFloat(formatted).toFixed(toFixed);
  if (parsed == "0." + "0".repeat(toFixed)) {
    return "0"
  }
  return parsed
}

// Convert human-readable value to token value with its decimals (e.g. WEI in case of ETH-like tokens).
export function valueToTokenValue(
  value: string | bigint | number,
  decimals: number = 18,
) {
  return ethers.parseUnits(value.toString(), decimals).toString();
}

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
