import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { getEIP1559AndHardhatDeployTxArgs } from "../../hardhatUtils/hardhatDeploy";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;
    const EIP1559AndHardhatDeployTxArgs = await getEIP1559AndHardhatDeployTxArgs(hre.ethers.provider);

    const fluenceTokenAddress = (await hre.deployments.get("FLT")).address;
    const testUSDAddress = (await hre.deployments.get("TestUSD")).address;

    const faucet = await hre.deployments.deploy("Faucet", {
        from: deployer,
        contract: "OwnableFaucet",
        args: [fluenceTokenAddress, testUSDAddress],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    if (faucet.newlyDeployed) {
        await hre.deployments.execute(
            "FLT",
            {
                from: deployer,
                ...EIP1559AndHardhatDeployTxArgs,
            },
            "transfer",
            faucet.address,
            hre.ethers.parseEther(String(10n ** 9n)),
        );

        await hre.deployments.execute(
            "TestUSD",
            {
                from: deployer,
                ...EIP1559AndHardhatDeployTxArgs,
            },
            "transfer",
            faucet.address,
            hre.ethers.parseEther(String(10n ** 9n)),
        );
    }
};

module.exports.tags = ["testnet"];
