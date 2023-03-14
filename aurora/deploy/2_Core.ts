import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { Core__factory, DeveloperFaucet__factory } from "../typechain-types";

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    const developerFaucetDeploy = await hre.deployments.get("Faucet");

    const developerFaucet = new DeveloperFaucet__factory(await hre.ethers.getSigner(deployer)).attach(developerFaucetDeploy.address);

    const fluenceToken = await developerFaucet.fluenceToken();
    const epochManagerDeploy = await hre.deployments.get("EpochManager");

    const coreImpl = await hre.deployments.deploy("CoreImpl", {
        from: deployer,
        contract: "Core",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const core = await hre.deployments.deploy("Core", {
        from: deployer,
        contract: "ERC1967Proxy",
        args: [coreImpl.address, []],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const coreContract = new Core__factory(await hre.ethers.getSigner(deployer)).attach(core.address);

    await (
        await coreContract.initialize(fluenceToken, "0x0000000000000000000000000000000000000000", 60, 120, 1, 1, epochManagerDeploy.address)
    ).wait();
};

module.exports.dependencies = ["Faucet", "EpochManager"];
module.exports.tags = ["common"];
