import { ethers } from "ethers";
import { assert, describe, expect, test } from "vitest";
import { CCStatus, DealStatus, DEFAULT_CONFIRMATIONS } from "./constants.js";
import {
  createCommitments,
  depositCollateral,
  registerMarketOffer,
} from "./helpers.js";
import { randomCID, randomWorkerId } from "./fixtures.js";
import { checkEvent, checkEvents } from "./confirmations.js";
import { config } from "dotenv";
import { skipEpoch } from "./utils.js";
import {
  capacityContract,
  contractsClient,
  coreContract,
  dealFactoryContract,
  marketContract,
  paymentToken,
  paymentTokenAddress,
  provider,
  signerAddress,
} from "./env.js";

config({ path: [".env", ".env.local"] });

describe("Deal tests", () => {
  test("Deal lifecycle before matching", async () => {
    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
    );

    const minWorkersDeal = 1;
    const targetWorkersDeal = 1;
    const maxWorkerPerProviderDeal = 1;
    const pricePerWorkerEpochDeal = registeredOffer.minPricePerWorkerEpoch;

    const minDealDepositedEpochs = await coreContract.minDealDepositedEpochs();
    const toApproveFromDeployer =
      BigInt(targetWorkersDeal) *
      pricePerWorkerEpochDeal *
      minDealDepositedEpochs;

    console.info(
      "Send approve of payment token for amount = ",
      toApproveFromDeployer.toString(),
    );
    expect(await paymentToken.balanceOf(signerAddress)).toBeGreaterThan(
      toApproveFromDeployer,
    );
    await paymentToken.approve(
      await dealFactoryContract.getAddress(),
      toApproveFromDeployer,
    );

    const protocolVersion = 1;
    const deployDealTx = await dealFactoryContract.deployDeal(
      randomCID(),
      registeredOffer.paymentToken,
      toApproveFromDeployer,
      minWorkersDeal,
      targetWorkersDeal,
      maxWorkerPerProviderDeal,
      pricePerWorkerEpochDeal,
      registeredOffer.effectors,
      0,
      [],
      protocolVersion,
    );

    await deployDealTx.wait(DEFAULT_CONFIRMATIONS);

    const [dealCreatedEvent] = await checkEvents(
      dealFactoryContract,
      dealFactoryContract.filters.DealCreated,
      1,
      deployDealTx,
    );
    assert(dealCreatedEvent, "Deal is undefined");

    const deal = contractsClient.getDeal(dealCreatedEvent.args.deal);
    let freeBalance = await deal.getFreeBalance();
    console.log("deal free balance", freeBalance);

    const status = await deal.getStatus();
    console.log("deal status", status);

    console.log("Changing AppCID...");
    const newAppCID = randomCID();
    const setAppTx = await deal.setAppCID(newAppCID);
    await setAppTx.wait(DEFAULT_CONFIRMATIONS);
    const [appCIDChangedEvent] = await checkEvents(
      deal,
      deal.filters.AppCIDChanged,
      1,
      setAppTx,
    );
    expect(appCIDChangedEvent?.args.newAppCID).toEqual([
      newAppCID.prefixes,
      newAppCID.hash,
    ]);

    console.log("Deal deposit...");
    const dealDepositEpochAmount = 5n;

    const amountToDeposit =
      BigInt(targetWorkersDeal) *
      pricePerWorkerEpochDeal *
      dealDepositEpochAmount;

    await (
      await paymentToken.approve(await deal.getAddress(), amountToDeposit)
    ).wait(DEFAULT_CONFIRMATIONS);

    const depositTx = await deal.deposit(amountToDeposit);
    await depositTx.wait(DEFAULT_CONFIRMATIONS);
    const [dealDepositEvent] = await checkEvents(
      deal,
      deal.filters.Deposited,
      1,
      depositTx,
    );
    expect(dealDepositEvent?.args.amount).toEqual(amountToDeposit);

    freeBalance = await deal.getFreeBalance();
    console.log("deal free balance", freeBalance);

    freeBalance = await deal.getFreeBalance();
    console.log("deal free balance", freeBalance);

    console.log("Deal stop...");

    const dealStopTx = await deal.stop();
    await dealStopTx.wait(DEFAULT_CONFIRMATIONS);
    const [dealStopEvent] = await checkEvents(
      deal,
      deal.filters.DealEnded,
      1,
      dealStopTx,
    );
    expect(dealStopEvent?.args.endedEpoch).toBeDefined();
  });

  test("Suspense matched deal when provider removes worker", async () => {
    const timestamp = (await provider.getBlock("latest"))?.timestamp;
    const epochDuration = await coreContract.epochDuration();

    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
      2,
    );

    console.log("---- CC Creation ----");
    const commitmentIds = await createCommitments(
      capacityContract,
      signerAddress,
      registeredOffer.peers.map((p) => p.peerId),
    );

    console.info("Deposit collateral for all sent CC...");
    await depositCollateral(capacityContract, commitmentIds);
    await skipEpoch(epochDuration, 1);

    for (const ccId of commitmentIds) {
      const status: CCStatus = Number(await capacityContract.getStatus(ccId));
      assert(status === CCStatus.Active, "CC is not active");
    }

    console.log("---- Deal Creation ----");
    const minWorkersDeal = 1;
    const targetWorkersDeal = 2;
    const maxWorkerPerProviderDeal = 2;
    const pricePerWorkerEpochDeal = registeredOffer.minPricePerWorkerEpoch;

    const minDealDepositedEpoches = await coreContract.minDealDepositedEpochs();
    const depositForDeal =
      BigInt(targetWorkersDeal) *
      pricePerWorkerEpochDeal *
      minDealDepositedEpoches;

    console.info(
      "Send approve of payment token for amount = ",
      depositForDeal.toString(),
    );

    await paymentToken
      .approve(await dealFactoryContract.getAddress(), depositForDeal)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    console.info("Create deal that match default offer...");
    const protocolVersion = 1;
    const dealAppCID = {
      prefixes: "0x12345678",
      hash: ethers.encodeBytes32String(`appCID:${timestamp}`),
    };
    const deployDealReceipt = await dealFactoryContract
      .deployDeal(
        dealAppCID,
        registeredOffer.paymentToken,
        depositForDeal,
        minWorkersDeal,
        targetWorkersDeal,
        maxWorkerPerProviderDeal,
        pricePerWorkerEpochDeal,
        registeredOffer.effectors,
        0,
        [],
        protocolVersion,
      )
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const [lastDealCreated] = checkEvent(
      dealFactoryContract.filters.DealCreated,
      deployDealReceipt,
    );

    assert(lastDealCreated, "Deal is not created");

    expect({
      owner: lastDealCreated.args.owner,
      minWorkers: lastDealCreated.args.minWorkers,
      targetWorkers: lastDealCreated.args.targetWorkers,
    }).toEqual({
      owner: signerAddress,
      minWorkers: BigInt(minWorkersDeal),
      targetWorkers: BigInt(targetWorkersDeal),
    });
    const dealId = lastDealCreated.args.deal;
    assert(dealId, "Deal ID is not defined");

    const peers = registeredOffer.peers;
    const cuIDs = peers.map((peer) => {
      const cuID = peer.unitIds[0];
      assert(cuID, "cuID not defined");
      return cuID;
    });

    console.info(`Match deal with offers structure`);
    const matchDealReceipt = await marketContract
      .matchDeal(dealId, [registeredOffer.offerId], [cuIDs])
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const CUMatchedEvents = checkEvent(
      marketContract.filters.ComputeUnitMatched,
      matchDealReceipt,
    );

    expect(
      CUMatchedEvents.map((event) => [
        event.args.peerId,
        event.args.deal,
        event.args.unitId,
        event.args.appCID,
      ]),
    ).toEqual([
      [
        peers[0]?.peerId,
        dealId,
        peers[0]?.unitIds[0],
        [dealAppCID.prefixes, dealAppCID.hash],
      ],
      [
        peers[1]?.peerId,
        dealId,
        peers[1]?.unitIds[0],
        [dealAppCID.prefixes, dealAppCID.hash],
      ],
    ]);

    const dealContract = contractsClient.getDeal(dealId);

    let dealStatus: DealStatus = Number(await dealContract.getStatus());
    expect(dealStatus).toEqual(DealStatus.NOT_ENOUGH_WORKERS);

    console.log("Setting up workers...");
    for (const cuID of cuIDs) {
      const workerId = randomWorkerId();
      const receipt = await dealContract
        .setWorker(cuID, workerId)
        .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
      const [setWorkerEvent] = checkEvent(
        dealContract.filters.WorkerIdUpdated,
        receipt,
      );
      expect(setWorkerEvent?.args).toEqual([cuID, workerId]);
    }

    dealStatus = Number(await dealContract.getStatus());
    expect(dealStatus).toEqual(DealStatus.ACTIVE);

    {
      const remainingDeposit = await dealContract.getFreeBalance();
      console.log(remainingDeposit, "remainingDeposit");
    }

    expect(await dealContract.getFreeBalance()).toEqual(depositForDeal);

    console.log("Checking rewards...");
    const rewardPerEpoch = await dealContract.pricePerWorkerEpoch();
    for (let i = 0; i < minDealDepositedEpoches; i++) {
      const rewards = await Promise.all(
        cuIDs.map((cuID) => dealContract.getRewardAmount(cuID)),
      );

      console.log("available reward", rewards);
      expect(rewards).toEqual(cuIDs.map(() => rewardPerEpoch * BigInt(i)));
      await skipEpoch(epochDuration, 1);
    }

    {
      const remainingDeposit = await dealContract.getFreeBalance();
      console.log(remainingDeposit, "remainingDeposit");
      expect(remainingDeposit).toEqual(0n);
    }

    {
      const dealStatus = Number(await dealContract.getStatus());
      expect(dealStatus).toEqual(DealStatus.INSUFFICIENT_FUNDS);
    }

    console.log("Refilling deal balance...");

    await paymentToken
      .approve(await dealContract.getAddress(), depositForDeal)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const refillReceipt = await dealContract
      .deposit(depositForDeal)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
    const [refillEvent] = checkEvent(
      dealContract.filters.Deposited,
      refillReceipt,
    );
    expect(refillEvent?.args).toEqual([depositForDeal]);

    {
      const dealStatus = Number(await dealContract.getStatus());
      expect(dealStatus).toEqual(DealStatus.ACTIVE);
    }

    for (const cuID of cuIDs) {
      const receipt = await dealContract
        .withdrawRewards(cuID)
        .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
      const [withdrawRewardEvent] = checkEvent(
        dealContract.filters.RewardWithdrawn,
        receipt,
      );
      expect(withdrawRewardEvent?.args).toEqual([
        cuID,
        rewardPerEpoch * minDealDepositedEpoches,
      ]);
    }

    console.log("Remove compute unit participating in deal...");

    const lastPeer = peers[1];
    assert(lastPeer, "Not last peer");

    const lastCuID = cuIDs[1];
    assert(lastCuID, "Not last CuID");

    const removeComputeUnitReceipt = await marketContract
      .returnComputeUnitFromDeal(lastCuID)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const [removeComputeUnitEvent] = checkEvent(
      marketContract.filters.ComputeUnitRemovedFromDeal,
      removeComputeUnitReceipt,
    );

    assert(removeComputeUnitEvent, "No remove compute unit event");
    expect(removeComputeUnitEvent.args).toEqual([
      lastCuID,
      dealId,
      lastPeer.peerId,
    ]);

    {
      // We still have 1 worker left
      const dealStatus: DealStatus = Number(await dealContract.getStatus());
      expect(dealStatus === DealStatus.ACTIVE);
    }

    const dealStopReceipt = await dealContract
      .stop()
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
    const [dealStopEvent] = checkEvent(
      dealContract.filters.DealEnded,
      dealStopReceipt,
    );

    const currentEpoch = await coreContract.currentEpoch();
    expect(dealStopEvent?.args.endedEpoch).toEqual(currentEpoch);

    {
      const dealStatus: DealStatus = Number(await dealContract.getStatus());
      expect(dealStatus === DealStatus.ENDED);
    }

    // TODO: plus another epoch to account deal impl
    await skipEpoch(epochDuration, minDealDepositedEpoches + 1n);

    const initialBalance = await paymentToken.balanceOf(signerAddress);

    const dealBalance = await dealContract.getFreeBalance();
    const dealWithdrawReceipt = await dealContract
      .withdraw(dealBalance)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
    const [dealWithdrawEvent] = checkEvent(
      dealContract.filters.Withdrawn,
      dealWithdrawReceipt,
    );
    expect(dealWithdrawEvent?.args).toEqual([dealBalance]);

    const afterWithdrawBalance = await paymentToken.balanceOf(signerAddress);

    expect(afterWithdrawBalance - initialBalance).toEqual(dealBalance);
  });
});
