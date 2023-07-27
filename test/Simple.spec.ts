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
import { ethers } from "ethers";

describe("Factory", () => {
    const effectors = Array.from({ length: 10 }, () => ({
        prefixes: ethers.randomBytes(4),
        hash: ethers.randomBytes(32),
    }));

    let faucet: DeveloperFaucet;
    let factory: DealFactory;
    let matcher: Matcher;
    let deal: Deal;

    const peerId = {
        hashCode: "0x00",
        length: "0x20",
        value: ethers.hexlify(ethers.randomBytes(32)),
    };

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

    it("registerComputeProvider in matcher", async () => {
        const owner = await ethers.provider.getSigner(0);
        const computeProvider = await ethers.provider.getSigner(1);

        const pricePerEpoch = await factory.PRICE_PER_EPOCH();
        const configModule = await deal.getConfigModule();
        const maxCollateral = await configModule.requiredCollateral();
        const fltAddress = await faucet.fluenceToken();

        await (await matcher.connect(owner).setWhiteList(await computeProvider.getAddress(), true)).wait();

        const tx = await matcher.connect(computeProvider).registerComputeProvider(pricePerEpoch, maxCollateral, fltAddress, effectors);
        const res = await tx.wait();

        const eventTopic = matcher.interface.getEvent("ComputeProviderRegistered").topicHash;
        const log = res.logs.find(({ topics }) => topics[0] === eventTopic);
        const parsetLog = matcher.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        });

        expect(parsetLog.args[0]).to.be.equal(await computeProvider.getAddress());
        expect(parsetLog.args[1]).to.be.equal(pricePerEpoch);
        expect(parsetLog.args[2]).to.be.equal(maxCollateral);
        expect(parsetLog.args[3]).to.be.equal(fltAddress);
        // expect(parsetLog.args[4]).to.be.equal(effectors);

        const computeProviderInfo = await matcher.computeProviderByOwner(await computeProvider.getAddress());
        expect(computeProviderInfo.minPricePerEpoch).to.be.equal(pricePerEpoch);
        expect(computeProviderInfo.maxCollateral).to.be.equal(maxCollateral);
    });

    it("registerComputePeer in matcher", async () => {
        const owner = await ethers.provider.getSigner(0);
        const computeProvider = await ethers.provider.getSigner(1);

        const configModule = await deal.getConfigModule();
        const maxCollateral = await configModule.requiredCollateral();
        const workersCount = 2n;

        const totalCollateral = maxCollateral * workersCount;

        const flt = IERC20__factory.connect(await faucet.fluenceToken(), await ethers.provider.getSigner());

        await (await matcher.connect(owner).setWhiteList(await computeProvider.getAddress(), true)).wait();
        await (await flt.connect(computeProvider).approve(await matcher.getAddress(), totalCollateral)).wait();

        const tx = await matcher.connect(computeProvider).addWorkersSlots(peerId, workersCount);
        const res = await tx.wait();

        const eventTopic = matcher.interface.getEvent("WorkersSlotsChanged").topicHash;
        const log = res.logs.find(({ topics }) => topics[0] === eventTopic);
        const parsetLog = matcher.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        });

        expect(parsetLog.args[0][0]).to.be.equal(peerId.hashCode);
        expect(parsetLog.args[0][1]).to.be.equal(peerId.length);
        expect(parsetLog.args[0][2]).to.be.equal(peerId.value);
        expect(parsetLog.args[1]).to.be.equal(workersCount);

        expect(await matcher.getFreeWorkersSolts(await computeProvider.getAddress(), peerId)).to.be.equal(workersCount);
    });

    it("match and set workers", async () => {
        const computeProvider = await (await ethers.provider.getSigner(1)).getAddress();
        const dealAddress = await (await deal.getCore()).getAddress();
        const workersModule = await deal.getWorkersModule();

        const tx = await matcher.matchWithDeal(dealAddress);
        const res = await tx.wait();

        const computeProviderMatchedEvent = matcher.interface.getEvent("ComputeProviderMatched").topicHash;
        const computeProviders = res!.logs
            .filter((x) => x.topics[0] == computeProviderMatchedEvent)
            .map((log) => {
                const args = matcher.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                }).args;

                return {
                    computeProvider: args[0],
                    deal: args[1],
                    dealCreationBlock: args[2],
                    appCID: args[3],
                };
            });

        const computePeerMatchedEvent = matcher.interface.getEvent("ComputePeerMatched").topicHash;
        const computePeers = res!.logs
            .filter((x) => x.topics[0] == computePeerMatchedEvent)
            .map((log) => {
                const args = matcher.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                }).args;

                return {
                    deal: args[0],
                    peerId: args[1],
                    reservedWorkersSlots: args[2],
                };
            });

        const patCreatedEvent = workersModule.interface.getEvent("PATCreated").topicHash;
        const pats = res!.logs
            .filter((x) => x.topics[0] == patCreatedEvent)
            .map((log) => {
                const args = workersModule.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                }).args;

                return {
                    id: args[0],
                    owner: args[1],
                };
            });

        expect(computeProviders.length).to.be.equal(1);
        expect(computeProviders[0].computeProvider).to.be.equal(computeProvider);
        expect(computeProviders[0].deal).to.be.equal(dealAddress);
        expect(computePeers.length).to.be.equal(1);
        expect(computePeers[0].deal).to.be.equal(dealAddress);
        expect(computePeers[0].reservedWorkersSlots).to.be.equal(2n);
        expect(pats.length).to.be.equal(2);

        for (const pat of pats) {
            const workerId = {
                hashCode: "0x00",
                length: "0x20",
                value: ethers.hexlify(ethers.randomBytes(32)),
            };

            const res = await (await workersModule.setWorker(pat.id, workerId)).wait();

            const workerRegistredEvent = workersModule.interface.getEvent("WorkerRegistred").topicHash;
            const workerRegistredLog = res!.logs.find((x) => x.topics[0] == workerRegistredEvent);
            const args = workersModule.interface.parseLog({
                data: workerRegistredLog.data,
                topics: [...workerRegistredLog.topics],
            }).args;

            const workerRegistred = {
                id: args[0],
                workerId: args[1],
            };

            expect(workerRegistred.id).to.be.equal(pat.id);
            expect(workerRegistred.workerId[0]).to.be.equal(workerId.hashCode);
            expect(workerRegistred.workerId[1]).to.be.equal(workerId.length);
            expect(workerRegistred.workerId[2]).to.be.equal(workerId.value);
        }
    });
});
