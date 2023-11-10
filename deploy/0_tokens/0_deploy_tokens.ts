import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getEIP1559AndHardhatTxArgs } from "../../utils/deploy";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;
    const eip1559TxArgs = await getEIP1559AndHardhatTxArgs(hre.ethers.provider);

    console.log("Deploying account:", deployer);
    console.log("Block number:", await hre.ethers.provider.getBlockNumber());

    await hre.deployments.deploy("FLT", {
        from: deployer,
        contract: "TestERC20",
        args: ["Fluence Token", "FLT"],
        ...eip1559TxArgs,
    });

    await hre.deployments.deploy("TestUSD", {
        from: deployer,
        contract: "TestERC20",
        args: ["Test USD", "tUSD"],
        ...eip1559TxArgs,
    });
};

module.exports.tags = ["tokens"];
