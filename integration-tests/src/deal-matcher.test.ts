// International tests for e2e with dealMatcherClient: test until a deal matched with an offer.
// # Dependencies:
// - deployed contracts
// - subgraph indexes contracts
// # Test itself consists of:
// - it creates provider info: market.setProviderInfo
// - it creates Offers
// - it creates CC (and approve, and deposited collateral)
// - it waits 1 core epoch (before we could start to match)
// - it creates Deals
// - it finds match via subgraph client
// - it send mathcDeal tx finally.
// TODO: more variates not only 1to1 match.
import { assert, beforeAll, describe, expect, test } from "vitest";

import {
  type ContractsENV,
  DealClient,
  DealMatcherClient,
  type GetMatchedOffersOut,
} from "@fluencelabs/deal-ts-clients";
import { ethers, JsonRpcProvider, JsonRpcSigner } from "ethers";
import dns from "node:dns/promises";
import { DEFAULT_CONFIRMATIONS } from "./constants.js";
import {
  createCommitments,
  depositCapacity,
  registerMarketOffer,
} from "./helpers.js";

// TODO: from env.

const ip = await dns.lookup("akim-dev.dev.fluence.dev");
const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = `http://${ip.address}:8545`;
const DEFAULT_SUBGRAPH_TIME_INDEXING = 300000;
const DEFAULT_TEST_TIMEOUT = 180000;
// Test timeout should include:
// - time for confirmations waits (1 confirmation is setup on anvil chain start)
// - time for subgraph indexing
// - time for core epoch
// - other eps.
// TODO: get core.epochDuration instead of 30000
const TESTS_TIMEOUT = 120000 + 30000 + DEFAULT_SUBGRAPH_TIME_INDEXING;

let provider: JsonRpcProvider;
let signer: JsonRpcSigner;
let contractsClient: DealClient;

/*
 * e2e test with dependencies:
 * - locally deployed contracts,
 * - integrated indexer to the deployed contracts.
 * Notice: chain snapshot is not going to work correctly since we connect indexer
 * to the chain as well and indexer should be snapshoted as well.
 */
describe("#getMatchedOffersByDealId", () => {
  beforeAll(async () => {
    provider = new ethers.JsonRpcProvider(TEST_RPC_URL);
    signer = await provider.getSigner();
    contractsClient = new DealClient(signer, TEST_NETWORK);
  });

  // TODO: check that infra is running.

  test.skip(
    `Check that it matched successfully for 1:1 configuration.`,
    async () => {
      const signerAddress = await signer.getAddress();
      const timestamp = (await provider.getBlock("latest"))?.timestamp;
      assert(timestamp, "Timestamp is defined");
      console.log("Init contractsClient as signer:", signerAddress);
      const paymentToken = await contractsClient.getUSDC();
      const paymentTokenAddress = await paymentToken.getAddress();

      console.info("---- Offer Creation ----");
      const marketContract = await contractsClient.getMarket();
      const capacityContract = await contractsClient.getCapacity();

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
      await depositCapacity(capacityContract, commitmentIds);

      console.log("---- Deal Creation ----");
      const marketAddress = await marketContract.getAddress();

      const coreContract = await contractsClient.getCore();
      const epochMilliseconds = (await coreContract.epochDuration()) * 1000n;
      console.log(
        `Wait for core epoch to pass: ${epochMilliseconds} milliseconds...`,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, Number(epochMilliseconds)),
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
      expect(marketAddress).not.toBe("0x0000000000000000000000000000");
      await paymentToken.approve(marketAddress, toApproveFromDeployer);

      console.info("Create deal that match default offer...");
      const filter = marketContract.filters.DealCreated;
      const lastDealsCreatedBefore = await marketContract.queryFilter(filter);
      const deployDealTx = await marketContract.deployDeal(
        {
          prefixes: "0x12345678",
          hash: ethers.encodeBytes32String(`appCID:${timestamp}`),
        },
        registeredOffer.paymentToken,
        minWorkersDeal,
        targetWorkersDeal,
        maxWorkerPerProviderDeal,
        pricePerWorkerEpochDeal,
        registeredOffer.effectors,
        0,
        [],
      );
      await deployDealTx.wait(DEFAULT_CONFIRMATIONS);

      const lastDealsCreatedAfter = await marketContract.queryFilter(filter);
      expect(lastDealsCreatedAfter.length - lastDealsCreatedBefore.length).toBe(
        1,
      );
      const dealId =
        lastDealsCreatedAfter[lastDealsCreatedAfter.length - 1]?.args.deal;
      assert(dealId, "Deal ID is not defined");

      console.info(`Wait till indexer ingesting blockchain state...`);

      const dealMatcherClient = new DealMatcherClient(
        TEST_NETWORK,
        `http://${ip.address}:8000/subgraphs/name/fluence-deal-contracts`,
      );

      let matchedOffersOut: GetMatchedOffersOut;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition,no-constant-condition
      while (true) {
        try {
          console.info(`Find matched offers for dealId: ${dealId}...`);
          matchedOffersOut =
            await dealMatcherClient.getMatchedOffersByDealId(dealId);
          break;
        } catch (e) {
          console.log(e);
          console.log("Waiting 5s for the next attempt");
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }

      console.log(matchedOffersOut);

      // const dealId = "0xd79df1927718b3212fa6e126ec4ad2b3ee1263d9"
      console.log("---- Deal Matching ----");

      // expect(matchedOffersOut.offers.length).toBe(1); // At least with one previously created offer it matched.

      // throw new Error("Test error");

      // console.log(
      //   "computeUnitsPerOffers",
      //   matchedOffersOut.computeUnitsPerOffers,
      // );
      // const cuId = matchedOffersOut.computeUnitsPerOffers[0]?.[0];

      // Additional check for status of matched CC from chain perspective
      // for (const commitmentId of commitmentIds) {
      // e.g. 4 == Failed; 0 - Active.
      //   expect(Number(await capacityContract.getStatus(commitmentId))).eq(0);
      // }

      // console.info(
      //   `Match deal with offers structure proposed by indexer: ${JSON.stringify(matchedOffersOut)}...`,
      // );
      // const matchDealTx = await marketContract.matchDeal(
      //   dealId,
      //   matchedOffersOut.offers,
      //   matchedOffersOut.computeUnitsPerOffers,
      // );

      // const matchDealTxReceipt = await matchDealTx.wait(DEFAULT_CONFIRMATIONS);
      // await matchDealTx.wait(DEFAULT_CONFIRMATIONS)
      // console.log(matchDealTxReceipt);
      //   TODO: check further.
    },
    TESTS_TIMEOUT,
  );
});
