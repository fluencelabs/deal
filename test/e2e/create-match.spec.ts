import { expect } from "chai";
import { deployments, ethers as hardhatEthers } from "hardhat";
import { ethers } from "ethers";
import { IWorkerManager } from "../../src/typechain-types/contracts/deal/interfaces/IWorkerManager";
import {
    Deal,
    Deal__factory,
    DealFactory,
    IERC20,
    IERC20__factory,
    Matcher,
    Matcher__factory
} from "../../src/typechain-types";

const EPOCH_DURATION = 15;
const WITHDRAW_EPOCH_TIMEOUT = 2n;

enum DealStatus {
    INACTIVE = 0n,
    ACTIVE = 1n,
    ENDED = 2n,
}

type Peer = {
    peerId: string;
    workerSlots: number;
};

type ComputeProvider = {
    signer: ethers.Signer;
    peers: Array<Peer>;
    units: Array<string>;
};

describe("Create deal -> Register CPs -> Match -> Set workers", () => {
    const PROVIDERS_CONFIG = {
        MIN_PRICE_PER_EPOCH: ethers.parseEther("0.01"),
        PEERS_COUNT: 3,
    };

    // deal params
    const effectors = Array.from({ length: 10 }, () => ({
        prefixes: ethers.hexlify(ethers.randomBytes(4)),
        hash: ethers.hexlify(ethers.randomBytes(32)),
    }));
    const dealParams = {
        initDeposit: ethers.parseEther("100"),
        appCID: {
            prefixes: ethers.hexlify(hardhatEthers.randomBytes(4)),
            hash: ethers.hexlify(hardhatEthers.randomBytes(32)),
        },
        minWorkers: 60n,
        targetWorkers: 60n,
        maxWorkersPerProvider: 3n,
        collateralPerWorker: 3n,
        pricePerWorkerEpoch: PROVIDERS_CONFIG.MIN_PRICE_PER_EPOCH,
        effectors: effectors,
        accessType: 0, // 0 - standart, 1 - whitelist, 2 - blacklist
    };

    // ENV contracts
    let factory: DealFactory;
    let flt: IERC20;
    let matcher: Matcher;
    let deal: Deal;

    // compute providers
    const computeProviders: Record<string, ComputeProvider> = {};

    before(async () => {
        await deployments.fixture(["tokens", "common", "localnet"]);

        const signer = await hardhatEthers.provider.getSigner();
        const DealFactoryFactory = await deployments.get("DealFactory")
        factory = (
            await hardhatEthers.getContractAt('DealFactory', DealFactoryFactory.address) as DealFactory).connect(signer)

        flt = IERC20__factory.connect((await deployments.get("FLT")).address, signer);
        matcher = Matcher__factory.connect((await deployments.get("Matcher")).address, signer);

        // generate compute providers
        (await hardhatEthers.getSigners()).slice(0).map((signer) => {
            computeProviders[signer.address] = {
                signer: signer,
                peers: new Array(PROVIDERS_CONFIG.PEERS_COUNT).fill(0).map(() => {
                    return {
                        peerId: ethers.hexlify(ethers.randomBytes(32)),
                        workerSlots: 1,
                    };
                }),
                units: [],
            };
        });
    });

    // 1. Create deal
    it("1.1. deploy deal", async () => {
        const createDealParams = {
            paymentToken: await flt.getAddress(),
        };

        // create deal
        const createDealTx = await factory.deployDeal(
            dealParams.appCID,
            createDealParams.paymentToken,
            dealParams.collateralPerWorker,
            dealParams.minWorkers,
            dealParams.targetWorkers,
            dealParams.maxWorkersPerProvider,
            dealParams.pricePerWorkerEpoch,
            dealParams.effectors,
            dealParams.accessType,
            [],
        );

        // parse result from event
        const resOfCreateDeal = await createDealTx.wait();
        const dealCreatedEventTopic = factory.interface.getEvent("DealCreated").topicHash;
        const log = resOfCreateDeal.logs.find(({ topics }) => {
            return topics[0] === dealCreatedEventTopic;
        });
        const dealAddress = factory.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args.deal;

        // get deal address
        deal = Deal__factory.connect(dealAddress, await hardhatEthers.provider.getSigner());

        // expect test results
        expect(await factory.hasDeal(dealAddress)).to.be.true;
        expect(await deal.minWorkers()).to.be.equal(dealParams.minWorkers);
        expect(await deal.targetWorkers()).to.be.equal(dealParams.targetWorkers);
        expect(await deal.appCID()).to.deep.equal([dealParams.appCID.prefixes, dealParams.appCID.hash]);
        expect(await deal.effectors()).to.deep.equal(dealParams.effectors.map((effector) => [effector.prefixes, effector.hash]));

        expect(await deal.accessType()).to.be.equal(dealParams.accessType);
        expect(await deal.getAccessList()).to.deep.equal([]);
    });

    it("1.2. update appCID", async () => {
        const newCID = {
            prefixes: ethers.randomBytes(4),
            hash: ethers.randomBytes(32),
        };

        // load modules
        const setAppCIDTx = await deal.setAppCID(newCID);

        // parse result from event
        const resOfSetAppCIDTx = await setAppCIDTx.wait();
        const appCIDChangedEventTopic = deal.interface.getEvent("AppCIDChanged").topicHash;
        const log = resOfSetAppCIDTx.logs.find(({ topics }) => topics[0] === appCIDChangedEventTopic);
        const newCIDFromContract = deal.interface.parseLog({
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
        const maxCollateral = await deal.collateralPerWorker();
        const fltAddress = await flt.getAddress();

        Object.values(computeProviders).map(async (provider) => {
            const computeProviderSigner = provider.signer;

            // register compute provider
            const registerComputeProviderTx = await matcher
                .connect(computeProviderSigner)
                .registerComputeProvider(PROVIDERS_CONFIG.MIN_PRICE_PER_EPOCH, maxCollateral, fltAddress, effectors);
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
            expect(parsedLog.minPricePerEpoch).to.be.equal(PROVIDERS_CONFIG.MIN_PRICE_PER_EPOCH);
            expect(parsedLog.maxCollateral).to.be.equal(maxCollateral);
            expect(parsedLog.paymentToken).to.be.equal(fltAddress);
            expect(parsedLog.effectors).to.deep.equal(effectors.map((effector) => [effector.prefixes, effector.hash]));

            // b. verify contract state
            const computeProviderInfo = await matcher.getComputeProviderInfo(await computeProviderSigner.getAddress());
            expect(computeProviderInfo.minPricePerEpoch).to.be.equal(PROVIDERS_CONFIG.MIN_PRICE_PER_EPOCH);
            expect(computeProviderInfo.maxCollateral).to.be.equal(maxCollateral);
            expect(computeProviderInfo.paymentToken).to.be.equal(fltAddress);
            expect(computeProviderInfo.totalFreeWorkerSlots).to.be.equal(0);
        });
    });

    it("2.1 try to register compute provider (not in whitlist)", async () => {
        // load configs
        const maxCollateral = await deal.collateralPerWorker();
        const fltAddress = await flt.getAddress();

        (await hardhatEthers.getSigners()).map(async (signer) => {
            const computeProviderSigner = signer;

            // register compute provider
            await expect(
                await matcher
                    .connect(computeProviderSigner)
                    .registerComputeProvider(PROVIDERS_CONFIG.MIN_PRICE_PER_EPOCH, maxCollateral, fltAddress, effectors),
            ).to.be.revertedWith("Compute provider is not in whitelist");
        });
    });

    it("2.2 register compute peer", async () => {
        for (const provider of Object.values(computeProviders)) {
            for (const peer of provider.peers) {
                // get compute provider
                const maxCollateral = await deal.collateralPerWorker();
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
                expect((await matcher.getComputePeerInfo(peer.peerId)).freeWorkerSlots).to.be.equal(peer.workerSlots);
            }
        }
    });

    // 3. Match deal
    it("3. Match deal with compute providers", async () => {
        const dealAddress = await deal.getAddress();

        // match deal
        const findingResult = await matcher.findComputePeers(dealAddress);
        const matchTx = await matcher.matchDeal(
            dealAddress,
            findingResult.computeProviders.map((x) => x),
            findingResult.computePeers.map((x) => x.map((y) => y)),
        );

        const resOfMatchTx = await matchTx.wait();

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

                // ----------------- Events -----------------
                computePeersMatchedEventsMap[args.peerId] = {
                    peerId: args.peerId,
                    deal: args.deal,
                    computeUnitId: args.computeUnitId,
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
        const computeUnitCreatedTopic = deal.interface.getEvent("ComputeUnitCreated").topicHash;
        const computeUnitCreatedEvent = resOfMatchTx.logs
            .filter((x) => x.topics[0] == computeUnitCreatedTopic)
            .map((log) => {
                const args = deal.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                }).args;

                return {
                    id: args.id,
                    owner: args.owner,
                };
            });

        // verify pats
        expect(computeUnitCreatedEvent.length).to.be.equal(Object.keys(computePeersMatchedEventsMap).length);

        const expectedComputeUnitIds: Record<string, boolean> = {};

        Object.values(computePeersMatchedEventsMap).map((event) => {
            expectedComputeUnitIds[event.computeUnitId] = true;
        });

        computeUnitCreatedEvent.map((unit) => {
            expect(unit.id).to.not.equal(ethers.ZeroAddress);
            // expect(pat.owner).to.be.equal(computePeersMatchedEventsMap[pat.id].); TODO
            expect(expectedComputeUnitIds[unit.id]).to.be.equal(true);
            computeProviders[unit.owner].units.push(unit.id);
        });

        const stateUnits = await deal.getComputeUnits();

        expect(stateUnits.length).to.be.equal(computeUnitCreatedEvent.length);
        stateUnits.map((unit: IWorkerManager.ComputeUnitStructOutput) => {
            expect(expectedComputeUnitIds[unit.id]).to.be.true;
        });
    });

    // 4. Set workers in deal
    it("4. Set workers in Deal", async () => {
        // load modules
        const workerIdByUnitId: Record<string, string> = {};
        for (const provider of Object.values(computeProviders)) {
            for (const unitId of provider.units) {
                // generate worker id
                const workerId = ethers.hexlify(ethers.randomBytes(32));

                // set worker
                const resOfSetWorker = await (await deal.connect(provider.signer).setWorker(unitId, workerId)).wait();

                // parse event
                const workerRegistredEventTopic = deal.interface.getEvent("WorkerIdUpdated").topicHash;
                const workerRegistredLog = resOfSetWorker.logs.find((x) => x.topics[0] == workerRegistredEventTopic);
                const argsOfWorkerRegistredEvent: ethers.Result = deal.interface.parseLog({
                    data: workerRegistredLog.data,
                    topics: [...workerRegistredLog.topics],
                }).args;

                // verify event
                expect(argsOfWorkerRegistredEvent.computeUnitId).to.be.equal(unitId);
                expect(argsOfWorkerRegistredEvent.workerId).to.be.equal(workerId);

                workerIdByUnitId[unitId] = workerId;
            }
        }

        const stateComputeUints = await deal.getComputeUnits();
        stateComputeUints.map((unit: IWorkerManager.ComputeUnitStructOutput) => {
            expect(workerIdByUnitId[unit.id]).to.be.eq(unit.workerId);
        });
    });

    it("5. Deposit balance", async () => {
        expect(await deal.getStatus()).to.be.eq(DealStatus.INACTIVE);

        const amount = dealParams.initDeposit;

        await (await flt.approve(await deal.getAddress(), amount)).wait();
        const depositRes = await (await deal.deposit(amount)).wait();

        const depositedEventTopic = deal.interface.getEvent("Deposited").topicHash;
        const log = depositRes.logs.find(({ topics }) => {
            return topics[0] === depositedEventTopic;
        });
        const args = deal.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args;

        expect(args.amount).to.be.eq(amount);
        expect(await deal.getFreeBalance()).to.be.eq(amount);
        expect(await deal.getStatus()).to.be.eq(DealStatus.ACTIVE);

        const currentEpoch = BigInt(Math.floor((await hardhatEthers.provider.getBlock("latest"))!.timestamp / EPOCH_DURATION));
        const paidEpochs = dealParams.initDeposit / (dealParams.pricePerWorkerEpoch * dealParams.minWorkers);
        expect(await deal.getMaxPaidEpoch()).to.be.eq(currentEpoch + paidEpochs);
    });

    it("6. Get status after maxPaidEpoch", async () => {
        const EPOCH_AFTER_MAX_PAID = 10n;
        const epoch = (await deal.getMaxPaidEpoch()) + EPOCH_AFTER_MAX_PAID;

        await hardhatEthers.provider.send("evm_setNextBlockTimestamp", [Number(epoch) * EPOCH_DURATION]);
        await hardhatEthers.provider.send("evm_mine", []);

        expect(await deal.getFreeBalance()).to.be.eq(0n);
        expect(await deal.getStatus()).to.be.eq(DealStatus.INACTIVE);
    });

    it("6. Get reward", async () => {
        const provider = Object.values(computeProviders)[0];
        const uintId = provider.units[0];

        const reward = await deal.getRewardAmount(uintId);

        const paidEpochs = dealParams.initDeposit / (dealParams.pricePerWorkerEpoch * dealParams.minWorkers);
        expect(reward).to.be.eq(paidEpochs * dealParams.pricePerWorkerEpoch);

        const balanceBefore = await flt.balanceOf(await provider.signer.getAddress());
        await (await deal.withdrawRewards(uintId)).wait();
        const balanceAfter = await flt.balanceOf(await provider.signer.getAddress());

        expect(balanceAfter - balanceBefore).to.be.eq(reward);
        expect(await deal.getRewardAmount(uintId)).to.be.eq(0n);
    });

    it("7. Remove workers", async () => {
        const provider = Object.values(computeProviders)[0];
        const uintId = provider.units[0];

        const currentEpoch = BigInt(Math.floor((await hardhatEthers.provider.getBlock("latest"))!.timestamp / EPOCH_DURATION));

        const removeUnitTx = await (await deal.connect(provider.signer).removeComputeUnit(uintId)).wait();
        const computeUnitRemovedEventTopic = deal.interface.getEvent("ComputeUnitRemoved").topicHash;
        const log = removeUnitTx.logs.find(({ topics }) => {
            return topics[0] === computeUnitRemovedEventTopic;
        });
        const args = deal.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args;

        expect(args.id).to.be.eq(uintId);

        expect(await deal.getUnlockCollateralEpoch(uintId)).to.be.eq(currentEpoch + WITHDRAW_EPOCH_TIMEOUT);

        await hardhatEthers.provider.send("evm_setNextBlockTimestamp", [Number(currentEpoch + WITHDRAW_EPOCH_TIMEOUT) * EPOCH_DURATION]);
        await hardhatEthers.provider.send("evm_mine", []);

        const balanceBefore = await flt.balanceOf(await provider.signer.getAddress());
        await (await deal.withdrawCollateral(uintId)).wait();
        const balanceAfter = await flt.balanceOf(await provider.signer.getAddress());

        expect(balanceAfter - balanceBefore).to.be.eq(dealParams.collateralPerWorker);
        expect(await deal.getUnlockCollateralEpoch(uintId)).to.be.eq(0n);
    });

    it("8. Close deal", async () => {
        await (await deal.stop()).wait();

        expect(await deal.getStatus()).to.be.eq(DealStatus.ENDED);
    });
});
