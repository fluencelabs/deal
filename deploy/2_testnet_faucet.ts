import type { HardhatRuntimeEnvironment } from "hardhat/types";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    console.log("Deploying account:", deployer);
    console.log("Block number:", await hre.ethers.provider.getBlockNumber());
    console.log("Testnet faucet");

    const faucet = await hre.deployments.deploy("Faucet", {
        from: deployer,
        contract: "OwnableFaucet",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    await hre.deployments.execute(
        "FLT",
        {
            from: deployer,
            log: true,
            waitConfirmations: 1,
            autoMine: true,
        },
        "transfer",
        faucet.address,
        hre.ethers.parseEther(10n ** 9n),
    );
    await hre.deployments.execute(
        "FLT",
        {
            from: deployer,
            log: true,
            waitConfirmations: 1,
            autoMine: true,
        },
        "transfer",
        faucet.address,
        hre.ethers.parseEther(10n ** 9n),
    );
};

module.exports.tags = ["testnet"];
