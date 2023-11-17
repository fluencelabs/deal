// Scripts are compatible only with hardhat-deploy.
import { getEIP1559Args } from "../utils/transactions";
import { ethers } from "ethers";

const WAIT_CONFIRMATIONS = process.env["WAIT_CONFIRMATIONS"] ? parseInt(<string>process.env["WAIT_CONFIRMATIONS"]) : 0;

export const DEFAULT_HARDHAT_DEPLOY_TX_ARGUMENTS = {
    log: true,
    autoMine: true, // To speed deployment on test network.
    waitConfirmations: WAIT_CONFIRMATIONS,
};

export async function getEIP1559AndHardhatDeployTxArgs(hreProvider: ethers.Provider | any) {
    const eip1559FeeArgs = await getEIP1559Args(hreProvider);
    return {
        ...DEFAULT_HARDHAT_DEPLOY_TX_ARGUMENTS,
        ...eip1559FeeArgs,
    };
}
