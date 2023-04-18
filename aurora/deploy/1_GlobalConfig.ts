import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeveloperFaucet__factory, GlobalConfig__factory } from "../typechain-types";
import { ethers } from "hardhat";

const WITHDRAWAL_PERIOD = 60;
const EPOCH_DURATION = 60;

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    const developerFaucetDeploy = await hre.deployments.get("Faucet");

    const developerFaucet = new DeveloperFaucet__factory(await hre.ethers.getSigner(deployer)).attach(developerFaucetDeploy.address);

    const fluenceToken = await developerFaucet.fluenceToken();
    const usdToken = await developerFaucet.usdToken();
    const epochManager = await hre.deployments.deploy("EpochManager", {
        from: deployer,
        args: [EPOCH_DURATION],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const globalConfigImpl = await hre.deployments.deploy("GlobalConfigImpl", {
        from: deployer,
        contract: "GlobalConfig",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const populateGlobalContract = new GlobalConfig__factory(await ethers.getSigner(deployer)).attach(globalConfigImpl.address);

    const globalConfig = await hre.deployments.deploy("GlobalConfig", {
        from: deployer,
        contract: "ERC1967Proxy",
        args: [
            globalConfigImpl.address,
            (await populateGlobalContract.populateTransaction.initialize(fluenceToken, WITHDRAWAL_PERIOD, epochManager.address)).data,
        ],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const particleVerifyer = await hre.deployments.deploy("ParticleVerifyer", {
        from: deployer,
        contract: "MockParticleVerifyer",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const coreImpl = await hre.deployments.deploy("CoreImpl", {
        from: deployer,
        contract: "Core",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const configImpl = await hre.deployments.deploy("ConfigImpl", {
        from: deployer,
        contract: "Config",
        args: [globalConfig.address, particleVerifyer.address],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const controllerImpl = await hre.deployments.deploy("ControllerImpl", {
        from: deployer,
        contract: "Controller",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const paymentImpl = await hre.deployments.deploy("PaymentImpl", {
        from: deployer,
        contract: "Payment",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const statusControllerImpl = await hre.deployments.deploy("StatusControllerImpl", {
        from: deployer,
        contract: "StatusController",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const workersImpl = await hre.deployments.deploy("WorkersImpl", {
        from: deployer,
        contract: "Workers",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const factoryImpl = await hre.deployments.deploy("FactoryImpl", {
        from: deployer,
        contract: "DealFactory",
        args: [
            globalConfig.address,
            usdToken,
            coreImpl.address,
            configImpl.address,
            controllerImpl.address,
            paymentImpl.address,
            statusControllerImpl.address,
            workersImpl.address,
        ],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const factory = await hre.deployments.deploy("Factory", {
        from: deployer,
        contract: "ERC1967Proxy",
        args: [factoryImpl.address, "0x"],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const matcherImpl = await hre.deployments.deploy("MatcherImpl", {
        from: deployer,
        contract: "Matcher",
        args: [globalConfig.address],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const matcher = await hre.deployments.deploy("Matcher", {
        from: deployer,
        contract: "ERC1967Proxy",
        args: [matcherImpl.address, "0x"],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });
};

module.exports.dependencies = ["Faucet"];
module.exports.tags = ["common"];
