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
  type ICapacity,
  type ICore,
  type IDealFactory,
  type IERC20,
  type IMarket,
} from "@fluencelabs/deal-ts-clients";
import { ethers, JsonRpcProvider, type JsonRpcSigner, Wallet } from "ethers";
import {
  CapacityConstantType,
  CCStatus,
  DEFAULT_CONFIRMATIONS,
} from "./constants.js";
import {
  createCommitments,
  depositCollateral,
  registerMarketOffer,
} from "./helpers.js";
import { checkEvents } from "./confirmations.js";
import { skipEpoch } from "./utils.js";
import { config } from "dotenv";
config({ path: [".env", ".env.local"] });

// TODO: from env.

const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = process.env.RPC_URL;
const DEFAULT_TEST_TIMEOUT = 180000;
// Test timeout should include:
// - time for confirmations waits (1 confirmation is setup on anvil chain start)
// - time for subgraph indexing
// - time for core epoch
// - other eps.

let provider: JsonRpcProvider;
let signer: JsonRpcSigner;
let contractsClient: DealClient;
let marketContract: IMarket;
let capacityContract: ICapacity;
let dealFactoryContract: IDealFactory;
let coreContract: ICore;
let paymentToken: IERC20;
let paymentTokenAddress: string;
let signerAddress: string;

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
    marketContract = contractsClient.getMarket();
    capacityContract = contractsClient.getCapacity();
    dealFactoryContract = contractsClient.getDealFactory();
    coreContract = contractsClient.getCore();
    paymentToken = contractsClient.getUSDC();
    paymentTokenAddress = await paymentToken.getAddress();
    signerAddress = await signer.getAddress();

    await capacityContract.setConstant(CapacityConstantType.MinDuration, 0);
  });

  test(
    `Check that it matched successfully for 1:1 configuration.`,
    async () => {
      const timestamp = (await provider.getBlock("latest"))?.timestamp;
      assert(timestamp, "Timestamp is defined");
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
    },
    DEFAULT_TEST_TIMEOUT,
  );
});
