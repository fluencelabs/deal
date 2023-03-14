"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typechain_types_1 = require("../typechain-types");
module.exports = async function (hre) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0];
    const coreDeploy = await hre.deployments.get("Core");
    const developerFaucetDeploy = await hre.deployments.get("Faucet");
    const developerFaucet = new typechain_types_1.DeveloperFaucet__factory(await hre.ethers.getSigner(deployer)).attach(developerFaucetDeploy.address);
    const paymentTokenAddress = await developerFaucet.usdToken();
    await hre.deployments.deploy("DealFactory", {
        from: deployer,
        args: [coreDeploy.address, paymentTokenAddress],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });
};
module.exports.dependencies = ["Core", "Faucet"];
module.exports.tags = ["common"];
