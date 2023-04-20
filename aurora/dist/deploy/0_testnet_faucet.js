"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = async function (hre) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0];
    if (hre.network.name === "hardhat") {
        return;
    }
    console.log("Deploying account:", deployer);
    console.log("Block number:", await hre.ethers.provider.getBlockNumber());
    console.log("Testnet faucet");
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
