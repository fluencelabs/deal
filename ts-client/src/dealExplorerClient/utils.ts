import { ethers } from "ethers";

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
