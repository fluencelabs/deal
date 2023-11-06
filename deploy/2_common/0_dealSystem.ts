import type { HardhatRuntimeEnvironment } from "hardhat/types";
import {GlobalCore__factory} from "../../src/typechain-types";
import {deployments, ethers} from "hardhat";
import {getEIP1559AndHardhatDeployTxArgs} from "../../hardhatUtils/hardhatDeploy";
import {getEIP1559Args} from "../../utils/transactions";

const EPOCH_DURATION = 15;

module.exports = async function (hre: HardhatRuntimeEnvironment) {
    const accounts = await hre.getUnnamedAccounts();
    const deployer = accounts[0]!;
    const EIP1559AndHardhatDeployTxArgs = await getEIP1559AndHardhatDeployTxArgs(hre.ethers.provider)
    const txEIP1559Args = await getEIP1559Args(hre.ethers.provider)

    const fluenceToken = (await hre.deployments.get("FLT")).address;
    const usdToken = (await hre.deployments.get("TestUSD")).address;

    console.log("Fluence token address: ", fluenceToken);
    console.log("USD token address: ", usdToken);

    // TODO init GlobalCore contract
    const globalCoreImpl = await hre.deployments.deploy("GlobalCoreImpl", {
        from: deployer,
        contract: "GlobalCore",
        args: [],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    const initGlobalCorePreTx = await GlobalCore__factory.connect(
        globalCoreImpl.address,
        await ethers.getSigner(deployer),
    ).initialize.populateTransaction(fluenceToken, EPOCH_DURATION, {...txEIP1559Args});

    const globalCore = await hre.deployments.deploy("GlobalCore", {
        from: deployer,
        contract: "ERC1967Proxy",
        args: [globalCoreImpl.address, await initGlobalCorePreTx.data],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    // Deploy Deal contract implementation only.
    // Note, there is no need in initialization since initialize
    // delegated to factory contract, especially to deal creation method.
    const dealImpl = await hre.deployments.deploy("DealImpl", {
        from: deployer,
        contract: "Deal",
        args: [globalCore.address],
        ...EIP1559AndHardhatDeployTxArgs,
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
        ...EIP1559AndHardhatDeployTxArgs,
    });

    // Init Matcher contract
    const matcherImpl = await hre.deployments.deploy("MatcherImpl", {
        from: deployer,
        contract: "Matcher",
        args: [globalCore.address],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    const matcher = await hre.deployments.deploy("Matcher", {
        from: deployer,
        contract: "ERC1967Proxy",
        args: [matcherImpl.address, "0x"],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    const globalConfigContract = GlobalCore__factory.connect(globalCore.address, await ethers.getSigner(deployer));
    if (globalCore.newlyDeployed) {
        await (await globalConfigContract.setFactory(dealFactory.address, {...txEIP1559Args})).wait();
        await (await globalConfigContract.setMatcher(matcher.address, {...txEIP1559Args})).wait();
    }
};

module.exports.dependencies = ["Faucet"];
module.exports.tags = ["common"];
