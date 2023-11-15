import { ethers } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getEIP1559AndHardhatTxArgs } from "../../utils/deploy";

const TEST_LOCAL_TEST_TOKEN_AMOUNT = ethers.parseEther("100");

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;
    const eip1559TxArgs = await getEIP1559AndHardhatTxArgs(hre.ethers.provider);

    for (const account of accounts) {
        await hre.deployments.execute("FLT", { from: deployer, ...eip1559TxArgs }, "transfer", account, TEST_LOCAL_TEST_TOKEN_AMOUNT);

        await hre.deployments.execute("TestUSD", { from: deployer, ...eip1559TxArgs }, "transfer", account, TEST_LOCAL_TEST_TOKEN_AMOUNT);
    }
};

module.exports.tags = ["localnet"];
