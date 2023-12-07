import { expect } from "chai";
import { deployments, ethers as hardhatEthers } from "hardhat";
import { ethers } from "ethers";
import {
  Core,
  Core__factory,
  Deal,
  Deal__factory,
  IERC20,
  IERC20__factory,
  IWorkerManager,
} from "../../src/typechain-types";
import { EPOCH_DURATION, MIN_DEPOSITED_EPOCHES } from "../../env";
import {
  generateProviders,
  registerFixtureProvider,
  testDataFixture,
} from "../../utils/contratFixtures";

enum DealStatus {
  INACTIVE = 0n,
  ACTIVE = 1n,
  ENDED = 2n,
}

describe("Create deal -> Register CPs -> Match -> Set workers", () => {
  const testData = testDataFixture;

  const env: {
    core: Core | undefined;
    flt: IERC20 | undefined;
  } = {
    core: undefined,
    flt: undefined,
  };

  const minDeposit =
    testData.dealSettings.targetWorkers *
    testData.pricePerWorkerEpoch *
    MIN_DEPOSITED_EPOCHES;

  it("4. Deposit balance", async () => {
    const amount = ethers.parseEther("100000");
    testData.dealSettings.deposited += amount;

    await (
      await env.flt.approve(await testData.deal.getAddress(), amount)
    ).wait();
    const depositRes = await (await testData.deal.deposit(amount)).wait();

    const depositedEventTopic =
      testData.deal.interface.getEvent("Deposited").topicHash;
    const log = depositRes.logs.find(({ topics }) => {
      return topics[0] === depositedEventTopic;
    });
    const args = testData.deal.interface.parseLog({
      data: log.data,
      topics: [...log.topics],
    }).args;

    expect(args.amount).to.be.eq(amount);
  });

  it("5. Set workers in Deal", async () => {
    // load modules
    const workerIdByUnitId: Record<string, string> = {};
    for (const provider of testData.providers) {
      for (const peer of provider.peers) {
        for (const unitId of peer.units) {
          // generate worker id
          const workerId = ethers.hexlify(ethers.randomBytes(32));

          console.log("set worker", unitId, workerId);
          // set worker
          const resOfSetWorker = await (
            await testData.deal
              .connect(provider.signer)
              .setWorker(unitId, workerId)
          ).wait();

          // parse event
          const workerRegistredEventTopic =
            testData.deal.interface.getEvent("WorkerIdUpdated").topicHash;
          const workerRegistredLog = resOfSetWorker.logs.find(
            (x) => x.topics[0] == workerRegistredEventTopic
          );
          const argsOfWorkerRegistredEvent: ethers.Result =
            testData.deal.interface.parseLog({
              data: workerRegistredLog.data,
              topics: [...workerRegistredLog.topics],
            }).args;

          // verify event
          expect(argsOfWorkerRegistredEvent.computeUnitId).to.be.equal(unitId);
          expect(argsOfWorkerRegistredEvent.workerId).to.be.equal(workerId);

          workerIdByUnitId[unitId] = workerId;
          console.log("workerIdByUnitId", workerIdByUnitId[unitId]);
        }
      }
    }

    const stateComputeUints = await testData.deal.getComputeUnits();
    stateComputeUints.map((unit: IWorkerManager.ComputeUnitStructOutput) => {
      console.log("unit", unit);
      console.log("workerIdByUnitId[unit.id]", workerIdByUnitId[unit.id]);
      expect(workerIdByUnitId[unit.id]).to.be.eq(unit.workerId);
    });

    expect(await testData.deal.getStatus()).to.be.eq(DealStatus.ACTIVE);

    const currentEpoch = await env.core.currentEpoch();
    const paidEpochs =
      testData.dealSettings.deposited /
      (testData.pricePerWorkerEpoch *
        (await testData.deal.getComputeUnitCount()));
    expect(await testData.deal.getMaxPaidEpoch()).to.be.eq(
      currentEpoch + paidEpochs
    );
  });

  it("6. Get status after maxPaidEpoch", async () => {
    const EPOCH_AFTER_MAX_PAID = 10n;
    const epoch =
      (await testData.deal.getMaxPaidEpoch()) + EPOCH_AFTER_MAX_PAID;

    const currentTimestamp = (await hardhatEthers.provider.getBlock("latest"))!
      .timestamp;
    const currentEpoch = await env.core.currentEpoch();
    const addEpoch = epoch - currentEpoch;
    await hardhatEthers.provider.send("evm_setNextBlockTimestamp", [
      currentTimestamp + Number(addEpoch * EPOCH_DURATION),
    ]);
    await hardhatEthers.provider.send("evm_mine", []);

    expect((await testData.deal.getFreeBalance()) < minDeposit).to.be.true;
    expect(await testData.deal.getStatus()).to.be.eq(DealStatus.INACTIVE);
  });

  it("6. Get reward", async () => {
    const provider = testData.providers[0];
    const uintId = provider.peers[0].units[0];

    const reward = await testData.deal.getRewardAmount(uintId);

    const paidEpochs =
      testData.dealSettings.deposited /
      (testData.pricePerWorkerEpoch * testData.dealSettings.minWorkers);
    expect(reward).to.be.eq(paidEpochs * testData.pricePerWorkerEpoch);

    const balanceBefore = await env.flt.balanceOf(
      await provider.signer.getAddress()
    );
    await (await testData.deal.withdrawRewards(uintId)).wait();
    const balanceAfter = await env.flt.balanceOf(
      await provider.signer.getAddress()
    );

    expect(balanceAfter - balanceBefore).to.be.eq(reward);
    expect(await testData.deal.getRewardAmount(uintId)).to.be.eq(0n);
  });

  it("7. Remove workers", async () => {
    const provider = testData.providers[0];
    const uintId = provider.peers[0].units[0];

    const removeUnitTx = await (
      await env.core.connect(provider.signer).returnComputeUnitFromDeal(uintId)
    ).wait();
    const computeUnitRemovedEventTopic = env.core.interface.getEvent(
      "ComputeUnitRemovedFromDeal"
    ).topicHash;
    const log = removeUnitTx.logs.find(({ topics }) => {
      return topics[0] === computeUnitRemovedEventTopic;
    });
    const args = env.core.interface.parseLog({
      data: log.data,
      topics: [...log.topics],
    }).args;

    expect(args.unitId).to.be.eq(uintId);
  });

  it("8. Close deal", async () => {
    await (await testData.deal.stop()).wait();

    expect(await testData.deal.getStatus()).to.be.eq(DealStatus.ENDED);
  });
});
