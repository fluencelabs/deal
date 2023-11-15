// Scripts are compatible only with hardhat-deploy.
import { getEIP1559Args } from "./transactions";
import { ethers } from "ethers";
import { DEFAULT_HARDHAT_TX_SETTINGS } from "../env";

export async function getEIP1559AndHardhatTxArgs(hreProvider: ethers.Provider) {
    const eip1559FeeArgs = await getEIP1559Args(hreProvider);
    return {
        ...DEFAULT_HARDHAT_TX_SETTINGS,
        ...eip1559FeeArgs,
    };
}
