import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { WAIT_CONFIRMATIONS, DEFAULT_HARDHAT_DEPLOY_SETTINGS } from "../../env";
import {saveAbiToSubgraph} from "../../utils/exportAbiToSubgraph";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;
    const TestUSDDeploymentName = 'TestUSD'
    const FLTDeploymentName = 'FLT'

    console.log("Deploying account:", deployer);
    console.log("Block number:", await hre.ethers.provider.getBlockNumber());

    const flt = await hre.deployments.deploy(FLTDeploymentName, {
        from: deployer,
        contract: "TestERC20",
        args: ["Fluence Token", "FLT"],
        ...DEFAULT_HARDHAT_DEPLOY_SETTINGS,
    });

    const testUsd = await hre.deployments.deploy(TestUSDDeploymentName, {
        from: deployer,
        contract: "TestERC20",
        args: ["Test USD", "tUSD"],
        ...DEFAULT_HARDHAT_DEPLOY_SETTINGS,
    });

    // Export to Subgraph.
    saveAbiToSubgraph(testUsd.abi, TestUSDDeploymentName)
    saveAbiToSubgraph(flt.abi, FLTDeploymentName)
};

module.exports.tags = ["tokens"];
