import { ethers } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import {getEIP1559Args} from "../../utils/transactions";
import {DeployFunction} from "hardhat-deploy/types";

const TEST_LOCAL_TEST_TOKEN_AMOUNT = ethers.parseEther("100");


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;
    const txEIP1559Args = await getEIP1559Args(hre.ethers.provider)

    for (const account of accounts) {
        await hre.deployments.execute(
            "FLT",
            { from: deployer, ...txEIP1559Args },
            "transfer",
            account,
            TEST_LOCAL_TEST_TOKEN_AMOUNT,
        );

        await hre.deployments.execute(
            "TestUSD",
            { from: deployer, ...txEIP1559Args },
            "transfer",
            account,
            TEST_LOCAL_TEST_TOKEN_AMOUNT,
        );
    }
};

export default func;
func.tags = ["localnet"];
