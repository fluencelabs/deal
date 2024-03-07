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

import { type ContractsENV, DealClient } from "@fluencelabs/deal-ts-clients";
import { ethers, JsonRpcProvider, type JsonRpcSigner, Wallet } from "ethers";
import { CCStatus, DEFAULT_CONFIRMATIONS } from "./constants.js";
import {
  createCommitments,
  depositCollateral,
  registerMarketOffer,
} from "./helpers.js";
import { checkEvents } from "./confirmations.js";
import { skipEpoch } from "./utils.js";

// TODO: from env.

const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = `http://207.154.227.22:8545`;
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
let signer: Wallet | JsonRpcSigner;
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

  test(
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
      const coreContract = await contractsClient.getCore();
      const capacityContract = await contractsClient.getCapacity();
      const dealFactoryContract = await contractsClient.getDealFactory();
      const epochDuration = await coreContract.epochDuration();
      console.log(epochDuration);

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
      console.log(registeredOffer.peers.map((p) => p.peerId)[0], commitmentIds);

      for (const ccId of commitmentIds) {
        const status = await capacityContract.getStatus(ccId);
        assert(Number(status) === CCStatus.Active, "Status is not active");
      }

      console.log("---- Deal Creation ----");
      const marketAddress = await marketContract.getAddress();

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
      await paymentToken.approve(
        await dealFactoryContract.getAddress(),
        toApproveFromDeployer,
      );

      console.info("Create deal that match default offer...");
      const protocolVersion = 1;
      const deployDealTx = await dealFactoryContract.deployDeal(
        {
          prefixes: "0x12345678",
          hash: ethers.encodeBytes32String(`appCID:${timestamp}`),
        },
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

      console.log("last deal");

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
      const dealId = lastDealCreated?.args.deal;
      assert(dealId, "Deal ID is not defined");

      await skipEpoch(provider, epochDuration, 1);

      const peer = registeredOffer.peers[0];
      assert(peer, "At least 1 peer should be defined");
      const cuIds = [...(await marketContract.getComputeUnitIds(peer.peerId))];
      console.log(cuIds);

      console.info(`Match deal with offers structure`);
      const matchDealTx = await marketContract.matchDeal(
        dealId,
        [registeredOffer.offerId],
        [cuIds],
      );

      const matchDealTxReceipt = await matchDealTx.wait(DEFAULT_CONFIRMATIONS);
      await matchDealTx.wait(DEFAULT_CONFIRMATIONS);
      console.log(matchDealTxReceipt);
      //   TODO: check further.
    },
    TESTS_TIMEOUT,
  );
});
