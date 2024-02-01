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
import { describe, test, expect, assert } from "vitest";

import {
  type ContractsENV,
  DealClient,
  DealMatcherClient,
} from "@fluencelabs/deal-ts-clients";
import { ethers } from "ethers";

// TODO: from env.
const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = "http://localhost:8545";
const DEFAULT_SUBGRAPH_TIME_INDEXING = 240000;
const DEFAULT_CONFIRMATIONS = 1;
// Test timeout should include:
// - time for confirmations waits (1 confirmation is setup on anvil chain start)
// - time for subgraph indexing
// - time for core epoch
// - other eps.
// TODO: get core.epochDuration instead of 30000
const TESTS_TIMEOUT = 120000 + 30000 + DEFAULT_SUBGRAPH_TIME_INDEXING;

function getDefaultOfferFixture(
  owner: string,
  paymentToken: string,
  timestamp: number,
) {
  const offerFixture = {
    minPricePerWorkerEpoch: ethers.parseEther("0.01"),
    paymentToken: paymentToken,
    effectors: [
      { prefixes: "0x12345678", hash: ethers.encodeBytes32String("Dogu") },
    ],
    peers: [
      {
        peerId: ethers.encodeBytes32String(`peerId0:${timestamp}`),
        unitIds: [ethers.encodeBytes32String(`unitId0:${timestamp}`)],

        owner: owner,
      },
    ],
  };
  return { offerFixture };
}

const provider = new ethers.JsonRpcProvider(TEST_RPC_URL);

/*
 * e2e test with dependencies:
 * - locally deployed contracts,
 * - integrated indexer to the deployed contracts.
 * Notice: chain snapshot is not going to work correctly since we connect indexer
 *  to the chain as well and indexer should be snapshoted as well.
 */
describe("#getMatchedOffersByDealId", () => {
  // TODO: check that infra is running.
  async function createOffer(
    signer: ethers.Signer,
    timestamp: number,
    paymentTokenAddress: string,
  ) {
    const contractsClient = new DealClient(signer, TEST_NETWORK);
    const marketContract = await contractsClient.getMarket();
    const signerAddress = await signer.getAddress();

    const { offerFixture } = getDefaultOfferFixture(
      signerAddress,
      paymentTokenAddress,
      timestamp,
    );

    console.log("Register Provider by setProviderInfo...");
    const setProviderInfoTx = await marketContract.setProviderInfo(
      "CI_PROVIDER",
      {
        prefixes: "0x12345678",
        hash: ethers.encodeBytes32String(`CI_PROVIDER:${timestamp}`),
      },
    );
    await setProviderInfoTx.wait(DEFAULT_CONFIRMATIONS);

    const tx = await marketContract.registerMarketOffer(
      offerFixture.minPricePerWorkerEpoch,
      offerFixture.paymentToken,
      offerFixture.effectors,
      offerFixture.peers,
    );
    await tx.wait(DEFAULT_CONFIRMATIONS);

    return offerFixture;
  }

  test(
    `Check that it matched successfully for 1:1 configuration.`,
    async () => {
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("Init contractsClient as signer:", signerAddress);
      const contractsClient = new DealClient(signer, TEST_NETWORK);
      const paymentToken = await contractsClient.getUSDC();
      const paymentTokenAddress = await paymentToken.getAddress();

      const blockNumber = await provider.getBlockNumber();
      const timestamp = (await provider.getBlock(blockNumber))?.timestamp;
      assert(timestamp, "timestamp is undefined");

      console.info("---- Offer Creation ----");
      const registeredOffer = await createOffer(
        signer,
        timestamp,
        paymentTokenAddress,
      );

      console.log("---- CC Creation ----");
      const capacityContract = await contractsClient.getCapacity();
      const capacityContractAddress = await capacityContract.getAddress();
      const capacityMinDuration = await capacityContract.minDuration();
      for (const peer of registeredOffer.peers) {
        // bytes32 peerId, uint256 duration, address delegator, uint256 rewardDelegationRate
        console.log(
          "Create commitment for peer: ",
          peer.peerId,
          " with duration: ",
          capacityMinDuration,
          "...",
        );
        const createCommitmentTx = await capacityContract.createCommitment(
          peer.peerId,
          capacityMinDuration,
          signerAddress,
          1,
        );
        await createCommitmentTx.wait(DEFAULT_CONFIRMATIONS);
      }
      console.log("Approve collateral for all sent CC...");
      // Fetch created commitmentIds from chain.
      const filterCreatedCC = capacityContract.filters.CommitmentCreated;
      const capacityCommitmentCreatedEvents =
        await capacityContract.queryFilter(filterCreatedCC);
      const capacityCommitmentCreatedEventsLast =
        capacityCommitmentCreatedEvents
          .reverse()
          .slice(0, registeredOffer.peers.length);
      // 1 CC for each peer.
      expect(capacityCommitmentCreatedEventsLast.length).toBe(
        registeredOffer.peers.length,
      );
      const commitmentIds = capacityCommitmentCreatedEventsLast.map(
        (event) => event.args.commitmentId,
      );

      console.info("Deposit collateral for all sent CC...");
      for (const commitmentId of commitmentIds) {
        const commitment = await capacityContract.getCommitment(commitmentId);
        const collateralToApproveCommitment =
          commitment.collateralPerUnit * commitment.unitCount;
        console.log(
          "Collateral for commitmentId: ",
          commitmentId,
          " = ",
          collateralToApproveCommitment,
          "...",
        );

        console.info(
          "Deposit collateral for commitmentId: ",
          commitmentId,
          "...",
        );

        const depositCollateralTx = await capacityContract.depositCollateral(
          commitmentId,
          { value: collateralToApproveCommitment },
        );
        await depositCollateralTx.wait(DEFAULT_CONFIRMATIONS);
      }

      console.log("---- Deal Creation ----");
      const marketContract = await contractsClient.getMarket();
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

      console.info(
        `Wait indexer ${DEFAULT_SUBGRAPH_TIME_INDEXING} to process transactions with Deal...`,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, DEFAULT_SUBGRAPH_TIME_INDEXING),
      );
      // const dealId = "0xd79df1927718b3212fa6e126ec4ad2b3ee1263d9"

      console.log("---- Deal Matching ----");
      console.info(`Find matched offers for dealId: ${dealId}...`);
      const dealMatcherClient = new DealMatcherClient(
        TEST_NETWORK,
        "http://localhost:8000/subgraphs/name/fluence-deal-contracts",
      );
      const matchedOffersOut =
        await dealMatcherClient.getMatchedOffersByDealId(dealId);
      expect(matchedOffersOut.offers.length).toBe(1); // At least with one previously created offer it matched.

      console.log(matchedOffersOut.computeUnitsPerOffers);
      // const cuId = matchedOffersOut.computeUnitsPerOffers[0]?.[0];

      // Additional check for status of matched CC from chain perspective
      for (const commitmentId of commitmentIds) {
        // e.g. 4 == Failed; 0 - Active.
        expect(Number(await capacityContract.getStatus(commitmentId))).eq(0);
      }

      console.info(
        `Match deal with offers structure proposed by indexer: ${JSON.stringify(matchedOffersOut)}...`,
      );
      const matchDealTx = await marketContract.matchDeal(
        dealId,
        matchedOffersOut.offers,
        matchedOffersOut.computeUnitsPerOffers,
      );
      // await matchDealTx.wait(DEFAULT_CONFIRMATIONS)
      console.log(matchDealTx);
      //   TODO: check further.
    },
    TESTS_TIMEOUT,
  );
});
