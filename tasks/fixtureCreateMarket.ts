import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {CI_CHAIN_IDS} from "./utils";
import {generateProviders, registerFixtureProvider, testDataFixture, Env} from "../utils/contratFixtures";
import {Core__factory, IERC20__factory} from "../src";

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

    let contractFixture = testDataFixture

    const deployer = allSigners[0]
    const providerSigners = allSigners.slice(0)

    contractFixture.providers = generateProviders(providerSigners)

    const core = Core__factory.connect((await hre.deployments.get("Core")).address, deployer);
    const flt = IERC20__factory.connect((await hre.deployments.get("FLT")).address, deployer);
    let env: Env = {core, flt}

    contractFixture.providers.map(async (provider) => {
        await registerFixtureProvider(contractFixture, provider, env)
    })
});
