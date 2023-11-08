import {GlobalCore__factory} from "../../src/typechain-types";
import {getEIP1559AndHardhatDeployTxArgs} from "../../hardhatUtils/hardhatDeploy";
import {getEIP1559Args} from "../../utils/transactions";
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const EPOCH_DURATION = 15;

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const [deployer] = await hre.ethers.getSigners();
    const EIP1559AndHardhatDeployTxArgs = await getEIP1559AndHardhatDeployTxArgs(hre.ethers.provider)
    const txEIP1559Args = await getEIP1559Args(hre.ethers.provider)

    const fluenceToken = (await hre.deployments.get("FLT")).address;
    const usdToken = (await hre.deployments.get("TestUSD")).address;

    console.log("Fluence token address: ", fluenceToken);
    console.log("USD token address: ", usdToken);

    // TODO init GlobalCore contract
    const globalCoreImpl = await hre.deployments.deploy("GlobalCoreImpl", {
        from: deployer.address,
        contract: "GlobalCore",
        args: [],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    const initGlobalCorePreTx = await GlobalCore__factory.connect(
        globalCoreImpl.address,
        deployer,
    ).initialize.populateTransaction(fluenceToken, EPOCH_DURATION, {...txEIP1559Args});

    const globalCore = await hre.deployments.deploy("GlobalCore", {
        from: deployer.address,
        contract: "ERC1967Proxy",
        args: [globalCoreImpl.address, await initGlobalCorePreTx.data],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    // Deploy Deal contract implementation only.
    // Note, there is no need in initialization since initialize
    // delegated to factory contract, especially to deal creation method.
    const dealImpl = await hre.deployments.deploy("DealImpl", {
        from: deployer.address,
        contract: "Deal",
        args: [globalCore.address],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    const dealFactory = await hre.deployments.deploy('DealFactory', {
        from: deployer.address,
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
        from: deployer.address,
        contract: "Matcher",
        args: [globalCore.address],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    const matcher = await hre.deployments.deploy("Matcher", {
        from: deployer.address,
        contract: "ERC1967Proxy",
        args: [matcherImpl.address, "0x"],
        ...EIP1559AndHardhatDeployTxArgs,
    });

    const globalConfigContract = GlobalCore__factory.connect(globalCore.address, deployer);
    if (globalCore.newlyDeployed) {
        await (await globalConfigContract.setFactory(dealFactory.address, {...txEIP1559Args})).wait();
        await (await globalConfigContract.setMatcher(matcher.address, {...txEIP1559Args})).wait();
    }
};

export default func;
func.dependencies = ["Faucet"];
func.tags = ["common"];
