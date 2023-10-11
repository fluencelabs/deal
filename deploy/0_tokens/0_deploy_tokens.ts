import { ethers } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

const TEST_TOKEN_AMOUNT = 10n ** 30n * 10n ** 18n;

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    console.log("Deploying account:", deployer);
    console.log("Block number:", await hre.ethers.provider.getBlockNumber());

    const flt = await hre.deployments.deploy("FLT", {
        from: deployer,
        contract: "TestERC20",
        args: ["Fluence Token", "FLT"],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const testUSD = await hre.deployments.deploy("TestUSD", {
        from: deployer,
        contract: "TestERC20",
        args: ["Test USD", "tUSD"],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    if (flt.newlyDeployed) {
        await hre.deployments.execute(
            "FLT",
            {
                from: deployer,
                log: true,
                waitConfirmations: 1,
                autoMine: true,
            },
            "transfer",
            deployer,
            ethers.toBeHex(TEST_TOKEN_AMOUNT),
        );
    }

    if (testUSD.newlyDeployed) {
        await hre.deployments.execute(
            "TestUSD",
            {
                from: deployer,
                log: true,
                waitConfirmations: 1,
                autoMine: true,
            },
            "transfer",
            deployer,
            ethers.toBeHex(TEST_TOKEN_AMOUNT),
        );
    }
};

module.exports.tags = ["tokens"];
