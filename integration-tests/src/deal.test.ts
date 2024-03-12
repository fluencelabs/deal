import { type ContractsENV, DealClient } from "@fluencelabs/deal-ts-clients";
import { ethers, JsonRpcProvider, JsonRpcSigner, type Wallet } from "ethers";
import { assert, beforeAll, describe, expect, test } from "vitest";
import { CCStatus, DealStatus, DEFAULT_CONFIRMATIONS } from "./constants.js";
import {
  createCommitments,
  depositCollateral,
  registerMarketOffer,
} from "./helpers.js";
import { randomCID } from "./fixtures.js";
import { checkEvents } from "./confirmations.js";
import { config } from "dotenv";
import { skipEpoch } from "./utils.js";
config({ path: [".env", ".env.local"] });

// const TEST_NETWORK: ContractsENV = "dar";
const TEST_NETWORK: ContractsENV = "local";
// const TEST_RPC_URL = `https://ipc-dar.fluence.dev`;
const TEST_RPC_URL = process.env.RPC_URL;
const DEFAULT_TEST_TIMEOUT = 180000;

let provider: JsonRpcProvider;
let signer: JsonRpcSigner | Wallet;
let contractsClient: DealClient;

describe(
  "Deal tests",
  () => {
    beforeAll(async () => {
      provider = new ethers.JsonRpcProvider(TEST_RPC_URL);
      signer = await provider.getSigner();
      console.log(await signer.getAddress());
      contractsClient = new DealClient(signer, TEST_NETWORK);
    });

    test("Deal lifecycle before matching", async () => {
      const marketContract = await contractsClient.getMarket();
      const capacityContract = await contractsClient.getCapacity();
      const coreContract = await contractsClient.getCore();
      const paymentToken = await contractsClient.getUSDC();
      const paymentTokenAddress = await paymentToken.getAddress();
      const dealFactoryContract = await contractsClient.getDealFactory();

      const signerAddress = await signer.getAddress();

      const registeredOffer = await registerMarketOffer(
        marketContract,
        signerAddress,
        paymentTokenAddress,
      );

      const minWorkersDeal = 1;
      const targetWorkersDeal = 1;
      const maxWorkerPerProviderDeal = 1;
      const pricePerWorkerEpochDeal = registeredOffer.minPricePerWorkerEpoch;

      const minDealDepositedEpoches =
        await coreContract.minDealDepositedEpoches();
      const toApproveFromDeployer =
        BigInt(targetWorkersDeal) *
        pricePerWorkerEpochDeal *
        minDealDepositedEpoches;

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

      // TODO: enable deal withdraw
      // console.log("Deal withdraw...");
      // await (
      //   await deal.withdraw(amountToDeposit / 2n)
      // ).wait(DEFAULT_CONFIRMATIONS);
      // const [dealWithdrawEvent] = await confirmEvents(
      //   deal,
      //   deal.filters.Withdrawn,
      //   1,
      // );
      // expect(dealWithdrawEvent?.args.amount).toEqual(amountToDeposit);

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
      const signerAddress = await signer.getAddress();
      const timestamp = (await provider.getBlock("latest"))?.timestamp;
      assert(timestamp, "Timestamp is defined");
      console.log("Init contractsClient as signer:", signerAddress);
      const paymentToken = await contractsClient.getUSDC();
      const paymentTokenAddress = await paymentToken.getAddress();

      console.info("---- Offer Creation ----");
      const marketContract = await contractsClient.getMarket();
      const coreContract = await contractsClient.getCore();
      const capacityContract = await contractsClient.getCapacity();
      const dealFactoryContract = await contractsClient.getDealFactory();
      const epochDuration = await coreContract.epochDuration();

      const registeredOffer = await registerMarketOffer(
        marketContract,
        signerAddress,
        paymentTokenAddress,
      );

      console.log("---- CC Creation ----");
      const commitmentIds = await createCommitments(
        capacityContract,
        signerAddress,
        registeredOffer.peers.map((p) => p.peerId),
      );

      console.info("Deposit collateral for all sent CC...");
      await depositCollateral(capacityContract, commitmentIds);
      await skipEpoch(provider, epochDuration, 1);

      for (const ccId of commitmentIds) {
        const status: CCStatus = Number(await capacityContract.getStatus(ccId));
        assert(status === CCStatus.Active, "Status is not active");
      }

      console.log("---- Deal Creation ----");
      const minWorkersDeal = 1;
      const targetWorkersDeal = 1;
      const maxWorkerPerProviderDeal = 1;
      const pricePerWorkerEpochDeal = registeredOffer.minPricePerWorkerEpoch;

      const minDealDepositedEpoches =
        await coreContract.minDealDepositedEpoches();
      const toApproveFromDeployer =
        BigInt(targetWorkersDeal) *
        pricePerWorkerEpochDeal *
        minDealDepositedEpoches;

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

      console.info("Create deal that match default offer...");
      const protocolVersion = 1;
      const dealAppCID = {
        prefixes: "0x12345678",
        hash: ethers.encodeBytes32String(`appCID:${timestamp}`),
      };
      const deployDealTx = await dealFactoryContract.deployDeal(
        dealAppCID,
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

      const [lastDealCreated] = await checkEvents(
        dealFactoryContract,
        dealFactoryContract.filters.DealCreated,
        1,
        deployDealTx,
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

      await skipEpoch(provider, epochDuration, 1);

      const peer = registeredOffer.peers[0];
      assert(peer, "At least 1 peer should be defined");
      const cuIds = [...(await marketContract.getComputeUnitIds(peer.peerId))];

      console.info(`Match deal with offers structure`);
      const matchDealTx = await marketContract.matchDeal(
        dealId,
        [registeredOffer.offerId],
        [cuIds],
      );

      await matchDealTx.wait(DEFAULT_CONFIRMATIONS);
      //   TODO: check further.

      const [CUMatchedEvent] = await checkEvents(
        marketContract,
        marketContract.filters.ComputeUnitMatched,
        1,
        matchDealTx,
      );

      assert(CUMatchedEvent, "No CU matched event");

      expect([
        CUMatchedEvent.args.peerId,
        CUMatchedEvent.args.deal,
        CUMatchedEvent.args.unitId,
        CUMatchedEvent.args.appCID,
      ]).toEqual([
        peer.peerId,
        dealId,
        registeredOffer.peers[0]?.unitIds[0],
        [dealAppCID.prefixes, dealAppCID.hash],
      ]);

      console.log("Remove compute unit participating in deal...");
      const cuID = registeredOffer.peers[0]?.unitIds[0];
      assert(cuID, "At least one cuID should be specified");
      const dealContract = contractsClient.getDeal(dealId);
      const removeComputeUnitTx =
        await marketContract.returnComputeUnitFromDeal(cuID);
      // const removeComputeUnitTx = await dealContract.removeComputeUnit(cuID);
      await removeComputeUnitTx.wait(DEFAULT_CONFIRMATIONS);
      const [removeComputeUnitEvent] = await checkEvents(
        marketContract,
        marketContract.filters.ComputeUnitRemovedFromDeal,
        1,
        removeComputeUnitTx,
      );
      assert(removeComputeUnitEvent, "No remove compute unit event");
      expect(removeComputeUnitEvent.args).toEqual([
        CUMatchedEvent.args.unitId,
        dealId,
        CUMatchedEvent.args.peerId,
      ]);
      const dealStatus: DealStatus = Number(await dealContract.getStatus());
      console.log(dealStatus, "deal status");
      expect(dealStatus === DealStatus.INSUFFICIENT_FUNDS);
    });

    test("End deal after it was created", async () => {
      const signerAddress = await signer.getAddress();
      const timestamp = (await provider.getBlock("latest"))?.timestamp;
      assert(timestamp, "Timestamp is defined");
      console.log("Init contractsClient as signer:", signerAddress);
      const paymentToken = await contractsClient.getUSDC();
      const paymentTokenAddress = await paymentToken.getAddress();

      console.info("---- Offer Creation ----");
      const marketContract = await contractsClient.getMarket();
      const coreContract = await contractsClient.getCore();
      const capacityContract = await contractsClient.getCapacity();
      const dealFactoryContract = await contractsClient.getDealFactory();
      const epochDuration = await coreContract.epochDuration();

      const registeredOffer = await registerMarketOffer(
        marketContract,
        signerAddress,
        paymentTokenAddress,
      );

      console.log("---- CC Creation ----");
      const commitmentIds = await createCommitments(
        capacityContract,
        signerAddress,
        registeredOffer.peers.map((p) => p.peerId),
      );

      console.info("Deposit collateral for all sent CC...");
      await depositCollateral(capacityContract, commitmentIds);
      await skipEpoch(provider, epochDuration, 1);

      for (const ccId of commitmentIds) {
        const status: CCStatus = Number(await capacityContract.getStatus(ccId));
        assert(status === CCStatus.Active, "Status is not active");
      }

      console.log("---- Deal Creation ----");
      const minWorkersDeal = 1;
      const targetWorkersDeal = 1;
      const maxWorkerPerProviderDeal = 1;
      const pricePerWorkerEpochDeal = registeredOffer.minPricePerWorkerEpoch;

      const minDealDepositedEpoches =
        await coreContract.minDealDepositedEpoches();
      const toApproveFromDeployer =
        BigInt(targetWorkersDeal) *
        pricePerWorkerEpochDeal *
        minDealDepositedEpoches;

      console.info(
        "Send approve of payment token for amount = ",
        toApproveFromDeployer.toString(),
      );
      const initialBalance = await paymentToken.balanceOf(signerAddress);
      expect(initialBalance).toBeGreaterThan(toApproveFromDeployer);
      await paymentToken.approve(
        await dealFactoryContract.getAddress(),
        toApproveFromDeployer,
      );

      console.info("Create deal that match default offer...");
      const protocolVersion = 1;
      const dealAppCID = {
        prefixes: "0x12345678",
        hash: ethers.encodeBytes32String(`appCID:${timestamp}`),
      };
      const deployDealTx = await dealFactoryContract.deployDeal(
        dealAppCID,
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

      const [lastDealCreated] = await checkEvents(
        dealFactoryContract,
        dealFactoryContract.filters.DealCreated,
        1,
        deployDealTx,
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

      await skipEpoch(provider, epochDuration, 1);

      const peer = registeredOffer.peers[0];
      assert(peer, "At least 1 peer should be defined");
      const cuIds = [...(await marketContract.getComputeUnitIds(peer.peerId))];

      console.info(`Match deal with offers structure`);
      const matchDealTx = await marketContract.matchDeal(
        dealId,
        [registeredOffer.offerId],
        [cuIds],
      );

      await matchDealTx.wait(DEFAULT_CONFIRMATIONS);
      //   TODO: check further.

      const [CUMatchedEvent] = await checkEvents(
        marketContract,
        marketContract.filters.ComputeUnitMatched,
        1,
        matchDealTx,
      );

      assert(CUMatchedEvent, "No CU matched event");

      expect([
        CUMatchedEvent.args.peerId,
        CUMatchedEvent.args.deal,
        CUMatchedEvent.args.unitId,
        CUMatchedEvent.args.appCID,
      ]).toEqual([
        peer.peerId,
        dealId,
        registeredOffer.peers[0]?.unitIds[0],
        [dealAppCID.prefixes, dealAppCID.hash],
      ]);

      // Skip some epoches
      await skipEpoch(provider, epochDuration, 10);

      console.log("Stopping matched deal...");
      const dealContract = contractsClient.getDeal(dealId);
      const dealStopTx = await dealContract.stop();
      await dealStopTx.wait(DEFAULT_CONFIRMATIONS);
      const [dealStopEvent] = await checkEvents(
        dealContract,
        dealContract.filters.DealEnded,
        1,
        dealStopTx,
      );
      expect(dealStopEvent?.args.endedEpoch).toBeDefined();

      await skipEpoch(provider, epochDuration, 3);

      const dealBalance = await dealContract.getFreeBalance();
      const dealWithdrawTx = await dealContract.withdraw(dealBalance);
      await dealWithdrawTx.wait(DEFAULT_CONFIRMATIONS);
      const [dealWithdrawEvent] = await checkEvents(
        dealContract,
        dealContract.filters.Withdrawn,
        1,
        dealWithdrawTx,
      );
      expect(dealWithdrawEvent?.args).toEqual([dealBalance]);

      const afterWithdrawBalance = await paymentToken.balanceOf(signerAddress);

      expect(initialBalance).toEqual(afterWithdrawBalance);
    });
  },
  DEFAULT_TEST_TIMEOUT,
);
