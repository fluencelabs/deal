import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { getEIP1559AndHardhatTxArgs } from "../../utils/deploy";

const TEST_TOKENS_FOR_FAUCET = ethers.parseEther(String(10n ** 9n));

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    const eip1559TxArgs = await getEIP1559AndHardhatTxArgs(hre.ethers.provider);

    const fluenceTokenAddress = (await hre.deployments.get("FLT")).address;
    const testUSDAddress = (await hre.deployments.get("TestUSD")).address;

    const faucet = await hre.deployments.deploy("Faucet", {
        from: deployer,
        contract: "OwnableFaucet",
        args: [fluenceTokenAddress, testUSDAddress],
        ...eip1559TxArgs,
    });

    if (faucet.newlyDeployed) {
        await hre.deployments.execute(
            "FLT",
            {
                from: deployer,
                ...eip1559TxArgs,
            },
            "transfer",
            faucet.address,
            TEST_TOKENS_FOR_FAUCET,
        );

        await hre.deployments.execute(
            "TestUSD",
            {
                from: deployer,
                ...eip1559TxArgs,
            },
            "transfer",
            faucet.address,
            TEST_TOKENS_FOR_FAUCET,
        );
    }
};

module.exports.tags = ["testnet"];
