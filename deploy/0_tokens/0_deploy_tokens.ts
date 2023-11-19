import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { WAIT_CONFIRMATIONS, DEFAULT_HARDHAT_DEPLOY_SETTINGS } from "../../env";
import { getEIP1559AndHardhatTxArgs } from "../../utils/deploy";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;
    const TestUSDDeploymentName = 'TestUSD'
    const FLTDeploymentName = 'FLT'
    const eip1559TxArgs = await getEIP1559AndHardhatTxArgs(hre.ethers.provider);

    console.log("Deploying account:", deployer);
    console.log("Block number:", await hre.ethers.provider.getBlockNumber());

    const flt = await hre.deployments.deploy(FLTDeploymentName, {
        from: deployer,
        contract: "TestERC20",
        args: ["Fluence Token", "FLT"],
        ...eip1559TxArgs,
    });

    const testUsd = await hre.deployments.deploy(TestUSDDeploymentName, {
        from: deployer,
        contract: "TestERC20",
        args: ["Test USD", "tUSD"],
        ...eip1559TxArgs,
    });
};

module.exports.tags = ["tokens"];
