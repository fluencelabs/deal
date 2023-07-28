import { expect } from "chai";
import {
    DealClient,
    DealFactory,
    DealFactory__factory,
    DeveloperFaucet,
    DeveloperFaucet__factory,
    IERC20__factory,
    Matcher,
    Matcher__factory,
} from "../src/index";
import { deployments, ethers } from "hardhat";
import { Deal } from "../src/client/deal";

describe("Factory", () => {
    const effectors = Array.from({ length: 10 }, () => ({
        prefixes: ethers.randomBytes(4),
        hash: ethers.randomBytes(32),
    }));

    let faucet: DeveloperFaucet;
    let factory: DealFactory;
    let matcher: Matcher;
    let deal: Deal;

    before(async () => {
        await deployments.fixture(["common", "localnet"]);

        const signer = await ethers.provider.getSigner();
        factory = DealFactory__factory.connect((await deployments.get("Factory")).address, signer);
        faucet = DeveloperFaucet__factory.connect((await deployments.get("Faucet")).address, signer);
        matcher = Matcher__factory.connect((await deployments.get("Matcher")).address, signer);
    });

    it("deploy deal", async () => {
        const params = {
            minWorkers_: 1n,
            targetWorkers_: 100n,
            appCID_: {
                prefixes: ethers.randomBytes(4),
                hash: ethers.randomBytes(32),
            },
            effectors: effectors,
        };

        const tx = await factory.createDeal(params.minWorkers_, params.targetWorkers_, params.appCID_, params.effectors);
        const res = await tx.wait();

        const eventTopic = factory.interface.getEvent("DealCreated").topicHash;
        const log = res.logs.find(({ topics }) => {
            return topics[0] === eventTopic;
        });

        const dealEvent = factory.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args.deal;

        deal = new DealClient(await ethers.provider.getSigner(), "local").getDeal(dealEvent.core);

        expect(await factory.isDeal(dealEvent.core)).to.be.true;
    });

    it("setAppCID", async () => {
        const config = await deal.getConfigModule();
        const newCID = {
            prefixes: ethers.randomBytes(4),
            hash: ethers.randomBytes(32),
        };

        const tx = await config.setAppCID(newCID);
        const res = await tx.wait();

        const eventTopic = config.interface.getEvent("AppCIDChanged").topicHash;

        const log = res.logs.find(({ topics }: any) => topics[0] === eventTopic);
        const newCIDFromContract = config.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args.newAppCID;

        expect(newCIDFromContract[0]).to.be.equal(ethers.hexlify(newCID.prefixes));
        expect(newCIDFromContract[1]).to.be.equal(ethers.hexlify(newCID.hash));
    });

    it("join", async () => {
        const configModule = await deal.getConfigModule();
        const workersModule = await deal.getWorkersModule();

        const requiredCollateral = await configModule.requiredCollateral();

        const fltAddress = await faucet.fluenceToken();
        const flt = IERC20__factory.connect(fltAddress, await ethers.provider.getSigner());

        await (await flt.approve(await workersModule.getAddress(), requiredCollateral)).wait();

        const tx = await workersModule.join();
        const res = await tx.wait();

        const eventTopic = workersModule.interface.getEvent("PATCreated").topicHash;
        const log = res.logs.find(({ topics }: any) => topics[0] === eventTopic);
        const parsetLog = workersModule.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        });

        expect(parsetLog.args.owner).to.be.equal(await (await ethers.provider.getSigner()).getAddress());
    });

    it("register in matcher", async () => {
        const owner = await ethers.provider.getSigner(0);
        const computeProvider = await ethers.provider.getSigner(1);

        const pricePerEpoch = await factory.PRICE_PER_EPOCH();
        const configModule = await deal.getConfigModule();
        const maxCollateral = await configModule.requiredCollateral();
        const workersCount = 2n;
        const totalCollateral = maxCollateral * workersCount;

        const fltAddress = await faucet.fluenceToken();

        const flt = IERC20__factory.connect(fltAddress, await ethers.provider.getSigner());

        await (await matcher.connect(owner).setWhiteList(await computeProvider.getAddress(), true)).wait();
        await (await flt.connect(computeProvider).approve(await matcher.getAddress(), totalCollateral)).wait();

        const tx = await matcher.connect(computeProvider).register(pricePerEpoch, maxCollateral, workersCount, effectors);
        const res = await tx.wait();

        const eventTopic = matcher.interface.getEvent("ComputeProviderRegistered").topicHash;
        const log = res.logs.find(({ topics }) => topics[0] === eventTopic);
        const parsetLog = matcher.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        });

        expect(parsetLog.args.computeProvider).to.be.equal(await computeProvider.getAddress());
        expect(parsetLog.args.minPriceByEpoch).to.be.equal(pricePerEpoch);
        expect(parsetLog.args.maxCollateral).to.be.equal(maxCollateral);
        expect(parsetLog.args.workersCount).to.be.equal(workersCount);

        const computeProviderInfo = await matcher.resourceConfigs(await computeProvider.getAddress());
        expect(computeProviderInfo.minPriceByEpoch).to.be.equal(pricePerEpoch);
        expect(computeProviderInfo.maxCollateral).to.be.equal(maxCollateral);
        expect(computeProviderInfo.workersCount).to.be.equal(workersCount);
    });

    it("match", async () => {
        const computeProvider = await (await ethers.provider.getSigner(1)).getAddress();
        const dealAddress = await (await deal.getCore()).getAddress();
        const workersModule = await deal.getWorkersModule();

        const tx = await matcher.matchWithDeal(dealAddress);
        const res = await tx.wait();

        for (const log of res.logs) {
            if (log.topics[0] == matcher.interface.getEvent("Matched").topicHash) {
                console.log(log);
            }
        }

        const eventTopic = workersModule.interface.getEvent("PATCreated").topicHash;

        let patCount = 0;
        for (const log of res.logs) {
            if (log.topics[0] === eventTopic) {
                const parsetLog = workersModule.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                });
                expect(parsetLog.args.owner).to.be.equal(computeProvider);
                patCount++;
            }
        }

        expect(patCount).to.be.equal(2);
    });
});
