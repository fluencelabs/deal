import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {CI_CHAIN_IDS} from "./utils";
import {generateProviders, registerFixtureProvider, testDataFixture, Env} from "../utils/contratFixtures";
import {Core__factory, IERC20__factory} from "../src";
import {MIN_DEPOSITED_EPOCHES} from "../env";

type Args = {
};


task("createMarket", "[Testnet Fixture] Deploy everything and create market with a few offers",)
    .setAction(async (args: Args, hre: HardhatRuntimeEnvironment) => {
    const network = await hre.ethers.provider.getNetwork();
    const allSigners = await hre.ethers.getSigners()
    if (network.chainId !in CI_CHAIN_IDS) {
        console.warn(
        "This script is not for the production chains. Return."
        );
        return
    }

    console.log(`Run deploy task...`)
    await hre.run('deploy', {write: true})

    let taskDataFixture = testDataFixture

    const deployer = allSigners[0]
    const providerSigners = allSigners.slice(0)

    console.log(`Generate providers...`)
    taskDataFixture.providers = generateProviders(providerSigners)

    const coreAddress = (await hre.deployments.get("Core")).address
    const fltAddress = (await hre.deployments.get("FLT")).address
    const core = Core__factory.connect(coreAddress, deployer);
    const flt = IERC20__factory.connect(fltAddress, deployer);
    let env: Env = {core, flt}

    console.log(`Register providers (and thus, their offers): %s...`, taskDataFixture.providers)
    for (let i=0; i < taskDataFixture.providers.length; i++) {
        const provider = taskDataFixture.providers[i]
        console.log('Start registering %s', provider.signer)
        await registerFixtureProvider(taskDataFixture, provider, env)
        console.log('Successfully registered provider %and its offer...')
    }

    console.log("Approve Core for FLT token deposit to deal...")
    const minDeposit = taskDataFixture.dealSettings.targetWorkers * taskDataFixture.pricePerWorkerEpoch * MIN_DEPOSITED_EPOCHES;
    const approveTx = await env.flt.approve(coreAddress, minDeposit)
    const approveTxRes = await approveTx.wait();

    console.log("Create Deal...")
    // TODO: change to another signer. Not deployer could deploy this...
    const deployDealTx = await env.core.deployDeal(
        taskDataFixture.dealSettings.appCID,
        fltAddress,
        taskDataFixture.dealSettings.minWorkers,
        taskDataFixture.dealSettings.targetWorkers,
        taskDataFixture.dealSettings.maxWorkerPerProvider,
        taskDataFixture.pricePerWorkerEpoch,
        taskDataFixture.effectors,
        taskDataFixture.dealSettings.accessType,
        [],
    );

    const deployDealTxRes = await deployDealTx.wait();
});
