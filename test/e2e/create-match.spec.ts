import { expect } from "chai";
import { DealClient, DealFactory, DealFactory__factory, IERC20, IERC20__factory, Matcher, Matcher__factory } from "../../src/index";
import { deployments, ethers as hardhatEthers } from "hardhat";
import { Deal } from "../../src/client/deal";
import { ethers } from "ethers";

describe("Create deal -> Register CPs -> Match -> Set workers", () => {
    // deal params
    const effectors = Array.from({ length: 10 }, () => ({
        prefixes: ethers.hexlify(ethers.randomBytes(4)),
        hash: ethers.hexlify(ethers.randomBytes(32)),
    }));
    const peerId = ethers.hexlify(ethers.randomBytes(32));
    const computePeerWorkerSlotCount = 2n;
    const dealParams = {
        minWorkers: 1n,
        targetWorkers: 100n,
    };

    // setup contracts
    let factory: DealFactory;
    let flt: IERC20;
    let matcher: Matcher;

    // test data
    let deal: Deal;
    const pats: string[] = [];

    before(async () => {
        await deployments.fixture(["tokens", "common", "localnet"]);

        const signer = await hardhatEthers.provider.getSigner();
        factory = DealFactory__factory.connect((await deployments.get("Factory")).address, signer);
        flt = IERC20__factory.connect((await deployments.get("FLT")).address, signer);
        matcher = Matcher__factory.connect((await deployments.get("Matcher")).address, signer);
    });

    // 0. Create deal
    it("deploy deal", async () => {
        const createDealParams = {
            minWorkers: dealParams.minWorkers,
            targetWorkers: dealParams.targetWorkers,
            appCID: {
                prefixes: hardhatEthers.hexlify(hardhatEthers.randomBytes(4)),
                hash: hardhatEthers.hexlify(hardhatEthers.randomBytes(32)),
            },
            effectors: effectors,
        };

        // create deal
        const createDealTx = await factory.createDeal(
            createDealParams.minWorkers,
            createDealParams.targetWorkers,
            createDealParams.appCID,
            createDealParams.effectors,
        );

        // parse result from event
        const resOfCreateDeal = await createDealTx.wait();
        const dealCreatedEventTopic = factory.interface.getEvent("DealCreated").topicHash;
        const log = resOfCreateDeal.logs.find(({ topics }) => {
            return topics[0] === dealCreatedEventTopic;
        });
        const dealEvent = factory.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args.deal;

        // get deal address
        deal = new DealClient(await hardhatEthers.provider.getSigner(), "local").getDeal(dealEvent.core);

        // load modules
        const configModule = await deal.getConfigModule();

        // expect test results
        expect(await factory.isDeal(dealEvent.core)).to.be.true;
        expect(await configModule.minWorkers()).to.be.equal(createDealParams.minWorkers);
        expect(await configModule.targetWorkers()).to.be.equal(createDealParams.targetWorkers);
        expect(await configModule.appCID()).to.deep.equal([createDealParams.appCID.prefixes, createDealParams.appCID.hash]);
        expect(await configModule.effectors()).to.deep.equal(
            createDealParams.effectors.map((effector) => [effector.prefixes, effector.hash]),
        );
    });
    it("update appCID", async () => {
        const newCID = {
            prefixes: ethers.randomBytes(4),
            hash: ethers.randomBytes(32),
        };

        // load modules
        const configModule = await deal.getConfigModule();

        const setAppCIDTx = await configModule.setAppCID(newCID);

        // parse result from event
        const resOfSetAppCIDTx = await setAppCIDTx.wait();
        const appCIDChangedEventTopic = configModule.interface.getEvent("AppCIDChanged").topicHash;
        const log = resOfSetAppCIDTx.logs.find(({ topics }) => topics[0] === appCIDChangedEventTopic);
        const newCIDFromContract = configModule.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args.newAppCID;

        // expect test results
        expect(newCIDFromContract[0]).to.be.equal(ethers.hexlify(newCID.prefixes));
        expect(newCIDFromContract[1]).to.be.equal(ethers.hexlify(newCID.hash));
    });

    // 1. Register compute provider and workers
    it("register compute provider", async () => {
        // get compute provider
        const computeProvider = await hardhatEthers.provider.getSigner(1);

        // load configs
        const minPricePerEpoch = await factory.PRICE_PER_EPOCH();
        const configModule = await deal.getConfigModule();
        const maxCollateral = await configModule.requiredCollateral();
        const fltAddress = await flt.getAddress();

        // register compute provider
        const registerComputeProviderTx = await matcher
            .connect(computeProvider)
            .registerComputeProvider(minPricePerEpoch, maxCollateral, fltAddress, effectors);
        const resOfRegisterComputeProvider = await registerComputeProviderTx.wait();

        const computeProviderRegisteredEventTopic = matcher.interface.getEvent("ComputeProviderRegistered").topicHash;
        const log = resOfRegisterComputeProvider.logs.find(({ topics }) => topics[0] === computeProviderRegisteredEventTopic);
        const parsedLog: ethers.Result = matcher.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        })?.args;

        // verify register result
        // a. verify event
        expect(parsedLog.computeProvider).to.be.equal(await computeProvider.getAddress());
        expect(parsedLog.minPricePerEpoch).to.be.equal(minPricePerEpoch);
        expect(parsedLog.maxCollateral).to.be.equal(maxCollateral);
        expect(parsedLog.paymentToken).to.be.equal(fltAddress);
        expect(parsedLog.effectors).to.deep.equal(effectors.map((effector) => [effector.prefixes, effector.hash]));
        // b. verify contract state
        const computeProviderInfo = await matcher.computeProviderByOwner(await computeProvider.getAddress());
        expect(computeProviderInfo.minPricePerEpoch).to.be.equal(minPricePerEpoch);
        expect(computeProviderInfo.maxCollateral).to.be.equal(maxCollateral);
        expect(computeProviderInfo.paymentToken).to.be.equal(fltAddress);
        expect(computeProviderInfo.totalFreeWorkerSlots).to.be.equal(0);
    });
    it("register compute peer", async () => {
        // get compute provider
        const computeProvider = await hardhatEthers.provider.getSigner(1);

        // load configs
        const configModule = await deal.getConfigModule();
        const maxCollateral = await configModule.requiredCollateral();
        const workerSlotCount = computePeerWorkerSlotCount;
        const totalCollateral = maxCollateral * workerSlotCount;

        // approve token for collateral
        await (await flt.connect(computeProvider).approve(await matcher.getAddress(), totalCollateral)).wait();

        // register compute peer
        const addWorkersSlotsTx = await matcher.connect(computeProvider).addWorkersSlots(peerId, workerSlotCount);
        const resOfAddWorkersSlots = await addWorkersSlotsTx.wait();

        // parse event
        const workersSlotsChangedEventTopic = matcher.interface.getEvent("WorkersSlotsChanged").topicHash;
        const log = resOfAddWorkersSlots.logs.find(({ topics }) => topics[0] === workersSlotsChangedEventTopic);
        const parsedLog: ethers.Result = matcher.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        })?.args;

        // verify event results
        expect(parsedLog.peerId).to.be.equal(peerId);
        expect(parsedLog.newWorkerSlots).to.be.equal(workerSlotCount);

        // verify contract state
        expect(await matcher.getFreeWorkersSolts(peerId)).to.be.equal(workerSlotCount);
    });

    // 2. Match deal
    it("Match deal with compute providers", async () => {
        // get addresses
        const computeProviderAddress = await (await hardhatEthers.provider.getSigner(1)).getAddress();
        const dealAddress = await (await deal.getCore()).getAddress();

        // load modules
        const workersModule = await deal.getWorkersModule();

        // match deal
        const matchTx = await matcher.matchWithDeal(dealAddress);
        const resOfMatchTx = await matchTx.wait();

        // parse ComputeProviderMatched event
        const computeProviderMatchedEventTopic = matcher.interface.getEvent("ComputeProviderMatched").topicHash;
        const computeProviders = resOfMatchTx.logs
            .filter((x) => x.topics[0] == computeProviderMatchedEventTopic)
            .map((log) => {
                const args: ethers.Result = matcher.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                }).args;

                return {
                    computeProvider: args.computeProvider,
                    deal: args.deal,
                    dealCreationBlock: args.dealCreationBlock,
                    appCID: args.appCID,
                };
            });

        // parse ComputePeerMatched event
        const computePeerMatchedEventTopic = matcher.interface.getEvent("ComputePeerMatched").topicHash;
        const computePeers = resOfMatchTx.logs
            .filter((x) => x.topics[0] == computePeerMatchedEventTopic)
            .map((log) => {
                const args: ethers.Result = matcher.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                }).args;

                return {
                    peerId: args.peerId,
                    deal: args.deal,
                    patIds: args.patIds,
                    dealCreationBlock: args.dealCreationBlock,
                    appCID: args.appCID,
                };
            });

        // parse PATCreated events
        const patCreatedEventTopic = workersModule.interface.getEvent("PATCreated").topicHash;
        const pats = resOfMatchTx.logs
            .filter((x) => x.topics[0] == patCreatedEventTopic)
            .map((log) => {
                const args = workersModule.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                }).args;

                return {
                    id: args.id,
                    owner: args.owner,
                };
            });

        // verify compute providers
        expect(computeProviders.length).to.be.equal(1);
        expect(computeProviders[0].computeProvider).to.be.equal(computeProviderAddress);
        expect(computeProviders[0].deal).to.be.equal(dealAddress);
        //TODO: expect(computeProviders[0].dealCreationBlock).to.be.equal(0);
        //TODO: expect(computeProviders[0].appCID).to.be.equal(appCID);

        // verify compute peers
        expect(computePeers.length).to.be.equal(1);
        expect(computePeers[0].peerId).to.be.equal(peerId);
        expect(computePeers[0].deal).to.be.equal(dealAddress);
        expect(computePeers[0].patIds.length).to.be.equal(computePeerWorkerSlotCount);
        //TODO: expect(computePeers[0].dealCreationBlock).to.be.equal(0);
        //TODO: expect(computePeers[0].appCID).to.be.equal(appCID);

        // verify pats
        expect(pats.length).to.be.equal(2);

        const expectedPatIds: Record<string, boolean> = {};
        computePeers[0].patIds.map((patId) => {
            expectedPatIds[patId] = true;
        });
        pats.map((pat) => {
            expect(pat.id).to.not.equal(ethers.ZeroAddress);
            expect(pat.owner).to.be.equal(computeProviderAddress);
            expect(expectedPatIds[pat.id]).to.be.equal(true);

            // push pat id to result
            pats.push(pat.id);
        });
    });

    // 3. Set workers in deal
    it("Set workers in Deal", async () => {
        // load modules
        const workersModule = await deal.getWorkersModule();

        for (const patId of pats) {
            // generate worker id
            const workerId = ethers.hexlify(ethers.randomBytes(32));

            // set worker
            const resOfSetWorker = await (await workersModule.setWorker(patId, workerId)).wait();

            // parse event
            const workerRegistredEventTopic = workersModule.interface.getEvent("WorkerRegistred").topicHash;
            const workerRegistredLog = resOfSetWorker.logs.find((x) => x.topics[0] == workerRegistredEventTopic);
            const argsOfWorkerRegistredEvent: ethers.Result = workersModule.interface.parseLog({
                data: workerRegistredLog.data,
                topics: [...workerRegistredLog.topics],
            }).args;

            // verify event
            expect(argsOfWorkerRegistredEvent.patId).to.be.equal(patId);
            expect(argsOfWorkerRegistredEvent.workerId).to.be.equal(workerId);
        }
    });
});
