import { ethers } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { DEFAULT_HARDHAT_DEPLOY_SETTINGS, WAIT_CONFIRMATIONS } from "../../env";

const TEST_LOCAL_TEST_TOKEN_AMOUNT = ethers.parseEther("100");

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    for (const account of accounts) {
        await hre.deployments.execute(
            "FLT",
            { from: deployer, ...DEFAULT_HARDHAT_DEPLOY_SETTINGS },
            "transfer",
            account,
            TEST_LOCAL_TEST_TOKEN_AMOUNT,
        );

        await hre.deployments.execute(
            "TestUSD",
            { from: deployer, ...DEFAULT_HARDHAT_DEPLOY_SETTINGS },
            "transfer",
            account,
            TEST_LOCAL_TEST_TOKEN_AMOUNT,
        );
    }
};

module.exports.tags = ["localnet"];
