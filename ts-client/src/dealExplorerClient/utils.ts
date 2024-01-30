import { ethers } from "ethers";
import type {OrderType} from "./types/filters.js";

export const DEFAULT_TOKEN_VALUE_ROUNDING = 3
// Max to select per 1 multiselect filter.
export const FILTER_MULTISELECT_MAX = 100;
export const DEFAULT_ORDER_TYPE: OrderType = "desc";

export function tokenValueToRounded(
  value: string | bigint,
  toFixed: number = 3,
  decimals: number = 18,
) {
  const formatted = ethers.formatUnits(value, decimals);
  return parseFloat(formatted).toFixed(toFixed);
}

export function valueToTokenValue(
  value: string | bigint | number,
  decimals: number = 18,
) {
  return ethers.parseUnits(value.toString(), decimals).toString();
}
