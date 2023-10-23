import { expect } from "chai";
import { DealClient, DealFactory, DealFactory__factory, IERC20, IERC20__factory, Matcher, Matcher__factory } from "../../src/index";
import { deployments, ethers as hardhatEthers } from "hardhat";
import { Deal } from "../../src/client/deal";
import { ethers } from "ethers";
import { PATStructOutput } from "../../src/typechain-types/contracts/deal/WorkersModule.sol/WorkersModule";

type Peer = {
    peerId: string;
    workerSlots: number;
};

type ComputeProvider = {
    signer: ethers.Signer;
    peers: Array<Peer>;
};

describe("Create deal -> Register CPs -> Match -> Set workers", () => {
    // deal params
    const effectors = Array.from({ length: 10 }, () => ({
        prefixes: ethers.hexlify(ethers.randomBytes(4)),
        hash: ethers.hexlify(ethers.randomBytes(32)),
    }));

    const computeProviders: Record<string, ComputeProvider> = {};

    const dealParams = {
        minWorkers: 3n,
        targetWorkers: 3n,
    };

    // setup contracts
    let factory: DealFactory;
    let flt: IERC20;
    let matcher: Matcher;

    // test data
    let deal: Deal;
    const globalPATs: string[] = [];

    before(async () => {
        await deployments.fixture(["tokens", "common", "localnet"]);

        const signer = await hardhatEthers.provider.getSigner();
        factory = DealFactory__factory.connect((await deployments.get("Factory")).address, signer);
        flt = IERC20__factory.connect((await deployments.get("FLT")).address, signer);
        matcher = Matcher__factory.connect((await deployments.get("Matcher")).address, signer);

        const one = (await hardhatEthers.getSigners())[0];
        [one].map((signer) => {
            computeProviders[signer.address] = {
                signer: signer,
                peers: new Array(3).fill(0).map(() => {
                    return {
                        peerId: ethers.hexlify(ethers.randomBytes(32)),
                        workerSlots: 1,
                    };
                }),
            };
        });
    });

    // 1. Create deal
    it("1.1. deploy deal", async () => {
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
    }).timeout(100000);

    it("1.2. update appCID", async () => {
        const newCID = {
            prefixes: ethers.randomBytes(4),
            hash: ethers.randomBytes(32),
        };

        // load modules
        const coreModule = await deal.getCore();

        const setAppCIDTx = await coreModule.setAppCID(newCID);

        // parse result from event
        const resOfSetAppCIDTx = await setAppCIDTx.wait();
        const appCIDChangedEventTopic = coreModule.interface.getEvent("AppCIDChanged").topicHash;
        const log = resOfSetAppCIDTx.logs.find(({ topics }) => topics[0] === appCIDChangedEventTopic);
        const newCIDFromContract = coreModule.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args.newAppCID;

        // expect test results
        expect(newCIDFromContract[0]).to.be.equal(ethers.hexlify(newCID.prefixes));
        expect(newCIDFromContract[1]).to.be.equal(ethers.hexlify(newCID.hash));
    });

    // 2. Register compute provider and workers
    it("2.1 register compute provider", async () => {
        // load configs
        const minPricePerEpoch = await factory.PRICE_PER_EPOCH();
        const configModule = await deal.getConfigModule();
        const maxCollateral = await configModule.requiredCollateral();
        const fltAddress = await flt.getAddress();

        Object.values(computeProviders).map(async (provider) => {
            const computeProviderSigner = provider.signer;

            // register compute provider
            const registerComputeProviderTx = await matcher
                .connect(computeProviderSigner)
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
            expect(parsedLog.computeProvider).to.be.equal(await computeProviderSigner.getAddress());
            expect(parsedLog.minPricePerEpoch).to.be.equal(minPricePerEpoch);
            expect(parsedLog.maxCollateral).to.be.equal(maxCollateral);
            expect(parsedLog.paymentToken).to.be.equal(fltAddress);
            expect(parsedLog.effectors).to.deep.equal(effectors.map((effector) => [effector.prefixes, effector.hash]));
            // b. verify contract state
            const computeProviderInfo = await matcher.computeProviderByOwner(await computeProviderSigner.getAddress());
            expect(computeProviderInfo.minPricePerEpoch).to.be.equal(minPricePerEpoch);
            expect(computeProviderInfo.maxCollateral).to.be.equal(maxCollateral);
            expect(computeProviderInfo.paymentToken).to.be.equal(fltAddress);
            expect(computeProviderInfo.totalFreeWorkerSlots).to.be.equal(0);
        });
    });

    it("2.2 register compute peer", async () => {
        for (const provider of Object.values(computeProviders)) {
            for (const peer of provider.peers) {
                // get compute provider

                // load configs
                const configModule = await deal.getConfigModule();
                const maxCollateral = await configModule.requiredCollateral();
                const totalCollateral = maxCollateral * BigInt(peer.workerSlots);

                // approve token for collateral
                (await (await flt.connect(provider.signer)).approve(await matcher.getAddress(), totalCollateral)).wait();

                // register compute peer
                const addWorkersSlotsTx = await matcher.connect(provider.signer).addWorkersSlots(peer.peerId, peer.workerSlots);

                const resOfAddWorkersSlots = await addWorkersSlotsTx.wait();

                // parse event
                const workersSlotsChangedEventTopic = matcher.interface.getEvent("WorkersSlotsChanged").topicHash;
                const log = resOfAddWorkersSlots.logs.find(({ topics }) => topics[0] === workersSlotsChangedEventTopic);
                const parsedLog: ethers.Result = matcher.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                })?.args;

                // verify event results
                expect(parsedLog.peerId).to.be.equal(peer.peerId);
                expect(parsedLog.newWorkerSlots).to.be.equal(peer.workerSlots);

                // verify contract state
                expect(await matcher.getFreeWorkersSolts(peer.peerId)).to.be.equal(peer.workerSlots);
            }
        }
    });

    // 3. Match deal
    it("3. Match deal with compute providers", async () => {
        const dealAddress = await (await deal.getCore()).getAddress();

        // load modules
        const workersModule = await deal.getWorkersModule();

        // match deal
        const matchTx = await matcher.matchWithDeal(dealAddress);
        const resOfMatchTx = await matchTx.wait();

        // check ComputeProviderMatched event
        const computeProviderMatchedEventTopic = matcher.interface.getEvent("ComputeProviderMatched").topicHash;
        const computeProvidersMatchedEvents = resOfMatchTx.logs
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

        expect(computeProvidersMatchedEvents.length).to.be.equal(Object.values(computeProviders).length);

        computeProvidersMatchedEvents.map(async (cpMatchedEvent) => {
            const computeProvider = computeProviders[cpMatchedEvent.computeProvider];
            // verify compute providers
            expect(computeProvider).to.not.be.equals(undefined);
            expect(cpMatchedEvent.deal).to.be.equal(dealAddress);
            //TODO: expect(computeProviders[0].dealCreationBlock).to.be.equal(0);
            //TODO: expect(computeProviders[0].appCID).to.be.equal(appCID);
        });

        // check ComputePeerMatched event
        const computePeersMatchedEventsMap: Record<string, any> = {};
        const computePeerMatchedEventTopic = matcher.interface.getEvent("ComputePeerMatched").topicHash;
        resOfMatchTx.logs
            .filter((x) => x.topics[0] == computePeerMatchedEventTopic)
            .map((log) => {
                const args: ethers.Result = matcher.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                }).args;

                computePeersMatchedEventsMap[args.peerId] = {
                    peerId: args.peerId,
                    deal: args.deal,
                    patId: args.patId,
                    dealCreationBlock: args.dealCreationBlock,
                    appCID: args.appCID,
                };
            });

        // verify compute peers
        expect(Object.keys(computePeersMatchedEventsMap).length).to.be.equal(
            Object.values(computeProviders).reduce((accumulator, computeProvider) => {
                return accumulator + computeProvider.peers.length;
            }, 0),
        );

        Object.values(computeProviders).map((computeProvider) => {
            computeProvider.peers.map((peer) => {
                expect(computePeersMatchedEventsMap[peer.peerId]).not.to.be.equal(undefined);
                expect(computePeersMatchedEventsMap[peer.peerId].deal).to.be.equal(dealAddress);
            });
        });

        // parse PATCreated events
        const patCreatedEventTopic = workersModule.interface.getEvent("PATCreated").topicHash;
        const patCreatedEvents = resOfMatchTx.logs
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

        // verify pats
        expect(patCreatedEvents.length).to.be.equal(Object.keys(computePeersMatchedEventsMap).length);

        const expectedPatIds: Record<string, boolean> = {};

        Object.values(computePeersMatchedEventsMap).map((event) => {
            expectedPatIds[event.patId] = true;
        });

        patCreatedEvents.map((pat) => {
            expect(pat.id).to.not.equal(ethers.ZeroAddress);
            // expect(pat.owner).to.be.equal(computePeersMatchedEventsMap[pat.id].); TODO
            expect(expectedPatIds[pat.id]).to.be.equal(true);
            globalPATs.push(pat.id);
        });

        const statePATs = await workersModule.getPATs();

        expect(statePATs.length).to.be.equal(patCreatedEvents.length);
        statePATs.map((pat: PATStructOutput) => {
            expect(expectedPatIds[pat.id]).to.be.true;
        });
    });

    // 4. Set workers in deal
    it("4. Set workers in Deal", async () => {
        // load modules
        const workersModule = await deal.getWorkersModule();

        const workerIdByPATId: Record<string, string> = {};
        for (const patId of globalPATs) {
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

            workerIdByPATId[patId] = workerId;
        }

        const statePATs = await workersModule.getPATs();
        statePATs.map((pat: PATStructOutput) => {
            expect(workerIdByPATId[pat.id]).to.be.eq(pat.workerId);
        });
    });
});
