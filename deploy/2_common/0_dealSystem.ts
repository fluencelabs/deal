import type { HardhatRuntimeEnvironment } from "hardhat/types";
import {GlobalCore__factory} from "../../src/typechain-types";
import {deployments, ethers} from "hardhat";

const EPOCH_DURATION = 15;
const DEFAULT_HARDHAT_DEPLOY_SETTINGS = {
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    }

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;

    const fluenceToken = (await hre.deployments.get("FLT")).address;
    const usdToken = (await hre.deployments.get("TestUSD")).address;

    console.log("Fluence token address: ", fluenceToken);
    console.log("USD token address: ", usdToken);

    // TODO init GlobalCore contract
    const globalCoreImpl = await hre.deployments.deploy("GlobalCoreImpl", {
        from: deployer,
        contract: "GlobalCore",
        args: [],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const initGlobalCorePreTx = await GlobalCore__factory.connect(
        globalCoreImpl.address,
        await ethers.getSigner(deployer),
    ).initialize.populateTransaction(fluenceToken, EPOCH_DURATION);

    const globalCore = await hre.deployments.deploy("GlobalCore", {
        from: deployer,
        contract: "ERC1967Proxy",
        args: [globalCoreImpl.address, await initGlobalCorePreTx.data],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    // Deploy Deal contract implementation only.
    // Note, there is no need in initialization since initialize
    // delegated to factory contract, especially to deal creation method.
    const dealImpl = await hre.deployments.deploy("DealImpl", {
        from: deployer,
        contract: "Deal",
        args: [globalCore.address],
        log: true,
        autoMine: true,
        waitConfirmations: 1,
    });

    const dealFactory = await hre.deployments.deploy('DealFactory', {
        from: deployer,
        args: [globalCore.address, dealImpl.address],
        contract: "DealFactory",
        proxy: {
            proxyContract: 'UUPS',
            execute: {
                init: {
                    methodName: 'initialize',
                    args: [],
                },
            },
        },
        ...DEFAULT_HARDHAT_DEPLOY_SETTINGS,
    });

    // Init Matcher contract
    const matcherImpl = await hre.deployments.deploy("MatcherImpl", {
        from: deployer,
        contract: "Matcher",
        args: [globalCore.address],
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

    const globalConfigContract = GlobalCore__factory.connect(globalCore.address, await ethers.getSigner(deployer));
    if (globalCore.newlyDeployed) {
        await (await globalConfigContract.setFactory(dealFactory.address)).wait();
        await (await globalConfigContract.setMatcher(matcher.address)).wait();
    }
};

module.exports.dependencies = ["Faucet"];
module.exports.tags = ["common"];
