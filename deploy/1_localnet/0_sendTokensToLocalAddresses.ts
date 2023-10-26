import { ethers } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

const TEST_LOCAL_TEST_TOKEN_AMOUNT = ethers.parseEther("100");
const WAIT_CONFIRMATIONS = process.env["WAIT_CONFIRMATIONS"] ? parseInt(process.env["WAIT_CONFIRMATIONS"]) : 0;

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    for (const account of accounts) {
        await hre.deployments.execute(
            "FLT",
            { from: deployer, log: true, waitConfirmations: WAIT_CONFIRMATIONS },
            "transfer",
            account,
            TEST_LOCAL_TEST_TOKEN_AMOUNT,
        );

        await hre.deployments.execute(
            "TestUSD",
            { from: deployer, log: true, waitConfirmations: WAIT_CONFIRMATIONS },
            "transfer",
            account,
            TEST_LOCAL_TEST_TOKEN_AMOUNT,
        );
    }
};

module.exports.tags = ["localnet"];
