import type { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    for (const account of accounts) {
        await hre.deployments.execute(
            "FLT",
            { from: deployer, log: true, waitConfirmations: 2 },
            "transfer",
            account,
            hre.ethers.parseEther("100"),
        );

        await hre.deployments.execute(
            "TestUSD",
            { from: deployer, log: true, waitConfirmations: 2 },
            "transfer",
            account,
            hre.ethers.parseEther("100"),
        );
    }
};

module.exports.tags = ["localnet"];
