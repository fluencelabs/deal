import { ethers } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import {getEIP1559AndHardhatDeployTxArgs} from "../../hardhatUtils/hardhatDeploy";
import {DeployFunction} from "hardhat-deploy/types";

const TEST_TOKEN_AMOUNT = 10n ** 30n * 10n ** 18n;


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;
    const EIP1559AndHardhatDeployTxArgs = await getEIP1559AndHardhatDeployTxArgs(hre.ethers.provider)


    console.log("Deploying account:", deployer);
    console.log("Block number:", await hre.ethers.provider.getBlockNumber());

    const flt = await hre.deployments.deploy("FLT", {
        from: deployer,
        contract: "TestERC20",
        args: ["Fluence Token", "FLT"],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    const testUSD = await hre.deployments.deploy("TestUSD", {
        from: deployer,
        contract: "TestERC20",
        args: ["Test USD", "tUSD"],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    if (flt.newlyDeployed) {
        await hre.deployments.execute(
            "FLT",
            {
                from: deployer,
                ...EIP1559AndHardhatDeployTxArgs,
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
                ...EIP1559AndHardhatDeployTxArgs,
            },
            "transfer",
            deployer,
            ethers.toBeHex(TEST_TOKEN_AMOUNT),
        );
    }
};

export default func;
func.tags = ["tokens"];
