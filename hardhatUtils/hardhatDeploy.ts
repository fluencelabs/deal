// Scripts are compatible only with hardhat-deploy.
import {getEIP1559Args} from "../utils/transactions";
import {ethers} from "ethers";

const WAIT_CONFIRMATIONS = process.env["WAIT_CONFIRMATIONS"] ? parseInt(process.env["WAIT_CONFIRMATIONS"]) : 0;

const DEFAULT_HARDHAT_DEPLOY_TX_ARGUMENTS = {
    log: true,
    autoMine: true,  // TODO: use only if hardhat network: to speed up testing and etc.
    waitConfirmations: WAIT_CONFIRMATIONS,
}

export async function getEIP1559AndHardhatDeployTxArgs(hreProvider: ethers.Provider | any) {
    const eip1559FeeArgs = await getEIP1559Args(hreProvider)
    return {
        ...DEFAULT_HARDHAT_DEPLOY_TX_ARGUMENTS,
        ...eip1559FeeArgs,
    }
}
