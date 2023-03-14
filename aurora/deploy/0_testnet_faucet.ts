import type { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    console.log("Deploying account:", deployer);
    console.log("Block number:", await hre.ethers.provider.getBlockNumber());

    await hre.deployments.deploy("Faucet", {
        from: deployer,
        contract: "OwnableFaucet",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });
};

module.exports.tags = ["testnet"];
