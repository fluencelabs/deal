import { type ContractsENV, DealClient } from "@fluencelabs/deal-ts-clients";
import { ethers, JsonRpcProvider, JsonRpcSigner, type Wallet } from "ethers";
import { assert, beforeAll, describe, expect, test } from "vitest";
import { DEFAULT_CONFIRMATIONS } from "./constants.js";
import { registerMarketOffer } from "./helpers.js";
import { randomCID } from "./fixtures.js";
import { checkEvents } from "./confirmations.js";

// const TEST_NETWORK: ContractsENV = "dar";
const TEST_NETWORK: ContractsENV = "local";
// const TEST_RPC_URL = `https://ipc-dar.fluence.dev`;
const TEST_RPC_URL = `http://207.154.227.22:8545`;
const DEFAULT_TEST_TIMEOUT = 180000;

let provider: JsonRpcProvider;
let signer: JsonRpcSigner | Wallet;
let contractsClient: DealClient;

enum DealStatus {
  INACTIVE,
  ACTIVE,
  ENDED,
}

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
      const deployDealTs = await dealFactoryContract.deployDeal(
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

      await deployDealTs.wait(DEFAULT_CONFIRMATIONS);

      const [dealCreatedEvent] = await checkEvents(
        dealFactoryContract,
        dealFactoryContract.filters.DealCreated,
        1,
        deployDealTs,
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
      await deployDealTs.wait(DEFAULT_CONFIRMATIONS);
      const [dealStopEvent] = await checkEvents(
        deal,
        deal.filters.DealEnded,
        1,
        dealStopTx,
      );
      expect(dealStopEvent?.args.endedEpoch).toBeDefined();
    });
  },
  DEFAULT_TEST_TIMEOUT,
);
