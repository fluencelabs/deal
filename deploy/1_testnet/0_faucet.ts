import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { DEFAULT_HARDHAT_DEPLOY_SETTINGS } from "../../env";
import { ethers } from "hardhat";

const TEST_TOKENS_FOR_FAUCET = ethers.parseEther(String(10n ** 9n));

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    const fluenceTokenAddress = (await hre.deployments.get("FLT")).address;
    const testUSDAddress = (await hre.deployments.get("TestUSD")).address;

    const faucet = await hre.deployments.deploy("Faucet", {
        from: deployer,
        contract: "OwnableFaucet",
        args: [fluenceTokenAddress, testUSDAddress],
        ...DEFAULT_HARDHAT_DEPLOY_SETTINGS,
    });

    if (faucet.newlyDeployed) {
        await hre.deployments.execute(
            "FLT",
            {
                from: deployer,
                ...DEFAULT_HARDHAT_DEPLOY_SETTINGS,
            },
            "transfer",
            faucet.address,
            TEST_TOKENS_FOR_FAUCET,
        );

        await hre.deployments.execute(
            "TestUSD",
            {
                from: deployer,
                ...DEFAULT_HARDHAT_DEPLOY_SETTINGS,
            },
            "transfer",
            faucet.address,
            TEST_TOKENS_FOR_FAUCET,
        );
    }
};

module.exports.tags = ["testnet"];
