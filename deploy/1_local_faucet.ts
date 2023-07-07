import type { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    console.log("Deploying account:", deployer);
    console.log("Block number:", await hre.ethers.provider.getBlockNumber());

    for (const account of accounts) {
        await hre.deployments.execute(
            "FLT",
            { from: deployer, log: true, waitConfirmations: 1 },
            "transfer",
            account,
            hre.ethers.parseEther("100"),
        );

        await hre.deployments.execute(
            "TestUSD",
            { from: deployer, log: true, waitConfirmations: 1 },
            "transfer",
            account,
            hre.ethers.parseEther("100"),
        );
    }
};

module.exports.tags = ["localnet"];
