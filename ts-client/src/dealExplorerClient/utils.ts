import {ethers} from "ethers";

export function formatTokenValueToFix(value: string | bigint, toFixed: number = 3, decimals: number = 18) {
    const formatted = ethers.formatUnits(value, decimals)
    return parseFloat(formatted).toFixed(toFixed);
}
