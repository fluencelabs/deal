import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { WAIT_CONFIRMATIONS, DEFAULT_HARDHAT_DEPLOY_SETTINGS } from "../../env";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    console.log("Deploying account:", deployer);
    console.log("Block number:", await hre.ethers.provider.getBlockNumber());

    await hre.deployments.deploy("FLT", {
        from: deployer,
        contract: "TestERC20",
        args: ["Fluence Token", "FLT"],
        ...DEFAULT_HARDHAT_DEPLOY_SETTINGS,
    });

    await hre.deployments.deploy("TestUSD", {
        from: deployer,
        contract: "TestERC20",
        args: ["Test USD", "tUSD"],
        ...DEFAULT_HARDHAT_DEPLOY_SETTINGS,
    });
};

module.exports.tags = ["tokens"];
