import { expect } from "chai";
import { deployments, ethers as hardhatEthers } from "hardhat";
import { ethers } from "ethers";
import { Core, Core__factory, Deal, Deal__factory, IERC20, IERC20__factory } from "../../src/typechain-types";
import { MIN_DEPOSITED_EPOCHES } from "../../env";

enum DealStatus {
    INACTIVE = 0n,
    ACTIVE = 1n,
    ENDED = 2n,
}

describe("Create deal -> Register CPs -> Match -> Set workers", () => {
    const testData: {
        deal: Deal | undefined;
        pricePerWorkerEpoch: bigint;
        effectors: Array<{
            prefixes: string;
            hash: string;
        }>;
        providers: Array<{
            signer: ethers.Signer;
            peers: Array<{
                peerId: string;
                freeUnits: number;
                units: Array<string>;
            }>;
            offerId: string;
        }>;
        dealSettings: {
            deposited: bigint;
            appCID: {
                prefixes: string;
                hash: string;
            };
            minWorkers: bigint;
            targetWorkers: bigint;
            maxWorkerPerProvider: bigint;
            accessType: number;
        };
    } = {
        deal: undefined,
        pricePerWorkerEpoch: ethers.parseEther("0.01"),
        effectors: Array.from({ length: 10 }, () => ({
            prefixes: ethers.hexlify(ethers.randomBytes(4)),
            hash: ethers.hexlify(ethers.randomBytes(32)),
        })),
        providers: [],
        dealSettings: {
            deposited: 0n,
            appCID: {
                prefixes: ethers.hexlify(hardhatEthers.randomBytes(4)),
                hash: ethers.hexlify(hardhatEthers.randomBytes(32)),
            },
            minWorkers: 60n,
            targetWorkers: 60n,
            maxWorkerPerProvider: 3n,
            accessType: 0, // 0 - standart, 1 - whitelist, 2 - blacklist
        },
    };

    const env: {
        core: Core | undefined;
        flt: IERC20 | undefined;
    } = {
        core: undefined,
        flt: undefined,
    };

    const minDeposit = testData.dealSettings.targetWorkers * testData.pricePerWorkerEpoch * MIN_DEPOSITED_EPOCHES;

    before(async () => {
        await deployments.fixture(["tokens", "common", "localnet"]);

        const signer = await hardhatEthers.provider.getSigner();
        env.core = Core__factory.connect((await deployments.get("Core")).address, signer);
        env.flt = IERC20__factory.connect((await deployments.get("FLT")).address, signer);

        // generate compute providers
        (await hardhatEthers.getSigners()).slice(0).map((signer) => {
            testData.providers.push({
                signer: signer,
                peers: new Array(3).fill(0).map(() => {
                    return {
                        peerId: ethers.hexlify(ethers.randomBytes(32)),
                        freeUnits: 1,
                        units: [],
                    };
                }),
                offerId: ethers.hexlify(ethers.randomBytes(32)),
            });
        });
    });

    it("1.1. create deal", async () => {
        await (await env.flt.approve(await env.core!.getAddress(), minDeposit)).wait();

        testData.dealSettings.deposited += minDeposit;

        // create deal
        const createDealTx = await env.core.deployDeal(
            testData.dealSettings.appCID,
            await env.flt!.getAddress(),
            testData.dealSettings.minWorkers,
            testData.dealSettings.targetWorkers,
            testData.dealSettings.maxWorkerPerProvider,
            testData.pricePerWorkerEpoch,
            testData.effectors,
            testData.dealSettings.accessType,
            [],
        );

        // parse result from event
        const resOfCreateDeal = await createDealTx.wait();
        const dealCreatedEventTopic = env.core.interface.getEvent("DealCreated").topicHash;
        const log = resOfCreateDeal.logs.find(({ topics }) => {
            return topics[0] === dealCreatedEventTopic;
        });
        const dealAddress = env.core.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args.deal;

        // get deal address
        testData.deal = Deal__factory.connect(dealAddress, await hardhatEthers.provider.getSigner());

        // expect test results
        expect(await env.core.hasDeal(dealAddress)).to.be.true;
        expect(await testData.deal.minWorkers()).to.be.equal(testData.dealSettings.minWorkers);
        expect(await testData.deal.targetWorkers()).to.be.equal(testData.dealSettings.targetWorkers);
        expect(await testData.deal.appCID()).to.deep.equal([testData.dealSettings.appCID.prefixes, testData.dealSettings.appCID.hash]);
        expect(await testData.deal.effectors()).to.deep.equal(testData.effectors.map((effector) => [effector.prefixes, effector.hash]));

        expect(await testData.deal.accessType()).to.be.equal(testData.dealSettings.accessType);
        expect(await testData.deal.getAccessList()).to.deep.equal([]);
    });

    it("1.2. update appCID", async () => {
        const newCID = {
            prefixes: ethers.randomBytes(4),
            hash: ethers.randomBytes(32),
        };

        // load modules
        const setAppCIDTx = await testData.deal.setAppCID(newCID);

        // parse result from event
        const resOfSetAppCIDTx = await setAppCIDTx.wait();
        const appCIDChangedEventTopic = testData.deal.interface.getEvent("AppCIDChanged").topicHash;
        const log = resOfSetAppCIDTx.logs.find(({ topics }) => topics[0] === appCIDChangedEventTopic);
        const newCIDFromContract = testData.deal.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args.newAppCID;

        // expect test results
        expect(newCIDFromContract[0]).to.be.equal(ethers.hexlify(newCID.prefixes));
        expect(newCIDFromContract[1]).to.be.equal(ethers.hexlify(newCID.hash));
    });

    it("2.1 register compute provider", async () => {
        // load configs
        const fltAddress = await env.flt.getAddress();

        testData.providers.map(async (provider) => {
            const computeProviderSigner = provider.signer;

            // register compute provider
            const registerOfferTx = await env.core!.connect(computeProviderSigner).registerMarketOffer(
                provider.offerId,
                testData.pricePerWorkerEpoch,
                fltAddress,
                testData.effectors,
                provider.peers.map((x) => ({
                    peerId: x.peerId,
                    freeUnits: x.freeUnits,
                })),
            );

            const resOfRegisterOffer = await registerOfferTx.wait();

            const offerRegisteredEventTopic = env.core.interface.getEvent("MarkeOfferRegistered").topicHash;
            const log = resOfRegisterOffer.logs.find(({ topics }) => topics[0] === offerRegisteredEventTopic);
            const parsedLog: ethers.Result = env.core.interface.parseLog({
                data: log.data,
                topics: [...log.topics],
            })?.args;

            // verify register result
            // a. verify event
            expect(parsedLog.offerId).to.be.equal(provider.offerId);
            expect(parsedLog.owner).to.be.equal(await computeProviderSigner.getAddress());
            expect(parsedLog.minPricePerWorkerEpoch).to.be.equal(testData.pricePerWorkerEpoch);
            expect(parsedLog.paymentToken).to.be.equal(fltAddress);
            expect(parsedLog.effectors).to.deep.equal(testData.effectors.map((effector) => [effector.prefixes, effector.hash]));

            // b. verify offer state
            const offerInfo = await env.core.getOffer(provider.offerId);
            expect(offerInfo.owner).to.be.equal(await computeProviderSigner.getAddress());
            expect(offerInfo.minPricePerWorkerEpoch).to.be.equal(testData.pricePerWorkerEpoch);
            expect(offerInfo.paymentToken).to.be.equal(fltAddress);

            // c. verify peers state
            testData.providers.map(async (provider) => {
                provider.peers.map(async (peer) => {
                    const computePeerInfo = await env.core.getPeer(peer.peerId);

                    expect(computePeerInfo.offerId).to.be.equal(provider.offerId);
                });
            });

            // d. verify units state and save unitIds
            const unitsByPeerId: Record<string, Array<string>> = {};
            const unitCreatedEventTopic = env.core.interface.getEvent("ComputeUnitCreated").topicHash;
            const logs = resOfRegisterOffer.logs.filter(({ topics }) => topics[0] === unitCreatedEventTopic);
            logs.map(async (log) => {
                const parsedLog: ethers.Result = env.core.interface.parseLog({
                    data: log.data,
                    topics: [...log.topics],
                })?.args;

                expect(parsedLog.offerId).to.be.equal(provider.offerId);

                unitsByPeerId[parsedLog.peerId] = parsedLog.unitId;

                const unitInfo = await env.core.getComputeUnit(parsedLog.unitId);
                expect(unitInfo.deal).to.be.equal(ethers.ZeroAddress);
                expect(unitInfo.peerId).to.be.equal(parsedLog.peerId);
            });

            provider.peers.map((peer) => {
                expect(unitsByPeerId[peer.peerId]).to.be.not.undefined;
                peer.units = unitsByPeerId[peer.peerId];
            });
        });
    });

    it("3. Match deal with compute providers", async () => {
        expect(await testData.deal.getFreeBalance()).to.be.eq(minDeposit);

        const dealAddress = await testData.deal.getAddress();

        // match deal
        const matchTx = await env.core.matchDeal(dealAddress);

        const resOfMatchTx = await matchTx.wait();

        // check ComputePeerMatched event
        const computeUnitMatchedEventTopic = env.core.interface.getEvent("ComputeUnitMatched").topicHash;
        const mathchedUnitCount = resOfMatchTx.logs.filter((x) => x.topics[0] == computeUnitMatchedEventTopic).length;

        console.log(mathchedUnitCount);
        expect(mathchedUnitCount).to.be.equal(
            testData.providers.reduce((accumulator, computeProvider) => {
                return accumulator + computeProvider.peers.length;
            }, 0),
        );

        expect(await testData.deal.getStatus()).to.be.eq(DealStatus.INACTIVE);
    });

    it("4. Deposit balance", async () => {
        const amount = ethers.parseEther("100000");
        testData.dealSettings.deposited += amount;

        await (await env.flt.approve(await testData.deal.getAddress(), amount)).wait();
        const depositRes = await (await testData.deal.deposit(amount)).wait();

        const depositedEventTopic = testData.deal.interface.getEvent("Deposited").topicHash;
        const log = depositRes.logs.find(({ topics }) => {
            return topics[0] === depositedEventTopic;
        });
        const args = testData.deal.interface.parseLog({
            data: log.data,
            topics: [...log.topics],
        }).args;

        expect(args.amount).to.be.eq(amount);
    });

    // // 4. Set workers in deal
    // it("5. Set workers in Deal", async () => {
    //     // load modules
    //     const workerIdByUnitId: Record<string, string> = {};
    //     for (const provider of Object.values(computeProviders)) {
    //         for (const unitId of provider.units) {
    //             // generate worker id
    //             const workerId = ethers.hexlify(ethers.randomBytes(32));

    //             // set worker
    //             const resOfSetWorker = await (await deal.connect(provider.signer).setWorker(unitId, workerId)).wait();

    //             // parse event
    //             const workerRegistredEventTopic = deal.interface.getEvent("WorkerIdUpdated").topicHash;
    //             const workerRegistredLog = resOfSetWorker.logs.find((x) => x.topics[0] == workerRegistredEventTopic);
    //             const argsOfWorkerRegistredEvent: ethers.Result = deal.interface.parseLog({
    //                 data: workerRegistredLog.data,
    //                 topics: [...workerRegistredLog.topics],
    //             }).args;

    //             // verify event
    //             expect(argsOfWorkerRegistredEvent.computeUnitId).to.be.equal(unitId);
    //             expect(argsOfWorkerRegistredEvent.workerId).to.be.equal(workerId);

    //             workerIdByUnitId[unitId] = workerId;
    //         }
    //     }

    //     const stateComputeUints = await deal.getComputeUnits();
    //     stateComputeUints.map((unit: IWorkerManager.ComputeUnitStructOutput) => {
    //         expect(workerIdByUnitId[unit.id]).to.be.eq(unit.workerId);
    //     });

    //     expect(await deal.getStatus()).to.be.eq(DealStatus.ACTIVE);

    //     const currentEpoch = BigInt(Math.floor((await hardhatEthers.provider.getBlock("latest"))!.timestamp / EPOCH_DURATION));
    //     const paidEpochs = totalDeposit / (dealParams.pricePerWorkerEpoch * (await deal.getComputeUnitCount()));
    //     expect(await deal.getMaxPaidEpoch()).to.be.eq(currentEpoch + paidEpochs);
    // });

    // it("6. Get status after maxPaidEpoch", async () => {
    //     const EPOCH_AFTER_MAX_PAID = 10n;
    //     const epoch = (await deal.getMaxPaidEpoch()) + EPOCH_AFTER_MAX_PAID;

    //     await hardhatEthers.provider.send("evm_setNextBlockTimestamp", [Number(epoch) * EPOCH_DURATION]);
    //     await hardhatEthers.provider.send("evm_mine", []);

    //     expect(await deal.getFreeBalance()).to.be.lessThan(minDeposit);
    //     expect(await deal.getStatus()).to.be.eq(DealStatus.INACTIVE);
    // });

    // it("6. Get reward", async () => {
    //     const provider = Object.values(computeProviders)[0];
    //     const uintId = provider.units[0];

    //     const reward = await deal.getRewardAmount(uintId);

    //     const paidEpochs = totalDeposit / (dealParams.pricePerWorkerEpoch * dealParams.minWorkers);
    //     expect(reward).to.be.eq(paidEpochs * dealParams.pricePerWorkerEpoch);

    //     const balanceBefore = await flt.balanceOf(await provider.signer.getAddress());
    //     await (await deal.withdrawRewards(uintId)).wait();
    //     const balanceAfter = await flt.balanceOf(await provider.signer.getAddress());

    //     expect(balanceAfter - balanceBefore).to.be.eq(reward);
    //     expect(await deal.getRewardAmount(uintId)).to.be.eq(0n);
    // });

    // it("7. Remove workers", async () => {
    //     const provider = Object.values(computeProviders)[0];
    //     const uintId = provider.units[0];

    //     const currentEpoch = BigInt(Math.floor((await hardhatEthers.provider.getBlock("latest"))!.timestamp / EPOCH_DURATION));

    //     const removeUnitTx = await (await deal.connect(provider.signer).removeComputeUnit(uintId)).wait();
    //     const computeUnitRemovedEventTopic = deal.interface.getEvent("ComputeUnitRemoved").topicHash;
    //     const log = removeUnitTx.logs.find(({ topics }) => {
    //         return topics[0] === computeUnitRemovedEventTopic;
    //     });
    //     const args = deal.interface.parseLog({
    //         data: log.data,
    //         topics: [...log.topics],
    //     }).args;

    //     expect(args.id).to.be.eq(uintId);

    //     expect(await deal.getUnlockCollateralEpoch(uintId)).to.be.eq(currentEpoch + WITHDRAW_EPOCH_TIMEOUT);

    //     await hardhatEthers.provider.send("evm_setNextBlockTimestamp", [Number(currentEpoch + WITHDRAW_EPOCH_TIMEOUT) * EPOCH_DURATION]);
    //     await hardhatEthers.provider.send("evm_mine", []);

    //     const balanceBefore = await flt.balanceOf(await provider.signer.getAddress());
    //     await (await deal.withdrawCollateral(uintId)).wait();
    //     const balanceAfter = await flt.balanceOf(await provider.signer.getAddress());

    //     expect(balanceAfter - balanceBefore).to.be.eq(dealParams.collateralPerWorker);
    //     expect(await deal.getUnlockCollateralEpoch(uintId)).to.be.eq(0n);
    // });

    // it("8. Close deal", async () => {
    //     await (await deal.stop()).wait();

    //     expect(await deal.getStatus()).to.be.eq(DealStatus.ENDED);
    // });
});
