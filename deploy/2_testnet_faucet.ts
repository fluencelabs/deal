import { ethers } from "hardhat";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    const fluenceTokenAddress = (await hre.deployments.get("FLT")).address;
    const testUSDAddress = (await hre.deployments.get("TestUSD")).address;

    const faucet = await hre.deployments.deploy("Faucet", {
        from: deployer,
        contract: "OwnableFaucet",
        args: [fluenceTokenAddress, testUSDAddress],
        log: true,
        autoMine: true,
        waitConfirmations: 5,
    });

    if (faucet.newlyDeployed) {
        await hre.deployments.execute(
            "FLT",
            {
                from: deployer,
                log: true,
                waitConfirmations: 5,
                autoMine: true,
            },
            "transfer",
            faucet.address,
            hre.ethers.parseEther(String(10n ** 9n)),
        );
        await hre.deployments.execute(
            "FLT",
            {
                from: deployer,
                log: true,
                waitConfirmations: 5,
                autoMine: true,
            },
            "transfer",
            faucet.address,
            hre.ethers.parseEther(String(10n ** 9n)),
        );
    }
};

module.exports.tags = ["testnet"];
