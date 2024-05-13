// TODO: relocate to test integration-tests folder.
// TODO: add redeploy chain command somehow after.
import { beforeAll, describe, expect, test } from "vitest";
import {
  ContractsENV,
  DealClient,
  DealMatcherClient,
  ICapacity,
  ICore,
  IDealFactory,
  IERC20,
  IMarket,
} from "../../../src";
import {
  ethers,
  HDNodeWallet,
  JsonRpcProvider,
  JsonRpcSigner,
  Wallet,
} from "ethers";
import {
  createCommitmentForProviderFixtures,
  createDealsFromFixtures,
  depositCollateral,
  getMarketExampleFixture,
  registerMarketOffersFromFixtures,
  updateProviderFixtureAddress,
} from "./fixture";

const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = `http://localhost:8545`;
const DEFAULT_SUBGRAPH_TIME_INDEXING = 300000;
const TESTS_TIMEOUT = 120000 + 30000 + DEFAULT_SUBGRAPH_TIME_INDEXING;
const WAIT_CONFIRMATIONS = Number(process.env.WAIT_CONFIRMATIONS || 1);
const CAPACITY_DEFAULT_DURATION = 60 * 60 * 24 * 30; // 30 days in seconds
const LOCAL_SIGNER_MNEMONIC =
  "test test test test test test test test test test test junk";
const PRIVATE_KEY_8_ANVIL_ACCOUNT =
  "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97";

/*
 * e2e test with dependencies:
 * - locally deployed contracts,
 * - integrated indexer to the deployed contracts.
 * Notice: chain snapshot is not going to work correctly since we connect indexer
 * to the chain as well and indexer should be snapshoted as well.
 * Notice: after each test subgraph should be FLUSHED and contracts should be REDEPLOYED as well.
 * Notice: currently all 2 tests could be run independently for success cases.
 */
describe(
  "#getMatchedOffersByDealId",
  () => {
    let provider: JsonRpcProvider;
    let signer: Wallet | JsonRpcSigner | HDNodeWallet;
    let contractsClient: DealClient;
    let dealMatcherClient: DealMatcherClient;
    let signerAddress: string;
    let paymentTokenAddress: string;
    let dealFactoryContract: IDealFactory;
    let coreContract: ICore;
    let marketContract: IMarket;
    let capacityContract: ICapacity;
    let paymentToken: IERC20;
    let minDealDepositedEpochs: bigint;

    beforeAll(async () => {
      provider = new ethers.JsonRpcProvider(TEST_RPC_URL);
      signer = ethers.Wallet.fromPhrase(LOCAL_SIGNER_MNEMONIC, provider);
      signerAddress = await signer.getAddress();
      contractsClient = new DealClient(signer, TEST_NETWORK);
      dealMatcherClient = new DealMatcherClient("local");
      paymentToken = await contractsClient.getUSDC();
      paymentTokenAddress = await paymentToken.getAddress();
      dealFactoryContract = await contractsClient.getDealFactory();
      coreContract = await contractsClient.getCore();
      marketContract = await contractsClient.getMarket();
      capacityContract = await contractsClient.getCapacity();
      minDealDepositedEpochs = await coreContract.minDealDepositedEpochs();
    });

    test(`It checks that it matched successfully for 1:1 configuration where CC has status Active.`, async () => {
      const marketFixture = getMarketExampleFixture(paymentTokenAddress);
      const providerFixture = marketFixture.providerWithCapacityCommitments;
      const dealFixture = marketFixture.dealWithoutWhitelist;
      // Post-prepare fixtures.
      updateProviderFixtureAddress(signerAddress, [providerFixture]);

      const setProviderInfoTx = await marketContract.setProviderInfo(
        "TestProvider8AnvilAccount",
        {
          prefixes: "0x12345678",
          hash: ethers.hexlify(ethers.randomBytes(32)),
        },
      );
      await setProviderInfoTx.wait(WAIT_CONFIRMATIONS);

      await createDealsFromFixtures(
        [dealFixture],
        await signer.getAddress(),
        paymentToken,
        dealFactoryContract,
        minDealDepositedEpochs,
        WAIT_CONFIRMATIONS,
      );

      // Firstly, check that provider with not Active CC is not in matched with Deal.
      await registerMarketOffersFromFixtures(
        [providerFixture],
        marketContract,
        WAIT_CONFIRMATIONS,
      );

      let matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      expect(matchResult.fulfilled).toEqual(false);
      expect(matchResult.computeUnitsPerOffers).toEqual([]);

      // Now lets register CC and activate it.
      const createdCCIds = await createCommitmentForProviderFixtures(
        [providerFixture],
        capacityContract,
        WAIT_CONFIRMATIONS,
        CAPACITY_DEFAULT_DURATION,
      );
      await depositCollateral(
        createdCCIds,
        capacityContract,
        WAIT_CONFIRMATIONS,
      );

      // Before 1 epoch passed we should not fetch offers, since the has status WAITING_START.
      // TODO

      // We have to wait 1 epoch since deposit, thus, status becomes active
      const epochMilliseconds = (await coreContract.epochDuration()) * 1000n;
      await new Promise((resolve) =>
        setTimeout(resolve, Number(epochMilliseconds)),
      );

      matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      console.log("matchResult", matchResult);
      expect(matchResult.fulfilled).toEqual(true);

      // Unnecessary final check that even contracts agree with the matched result.
      const matchDealTx = await marketContract.matchDeal(
        dealFixture.dealId,
        matchResult.offers,
        matchResult.computeUnitsPerOffers,
      );
    });

    test(`It checks that it matched successfully with whitelisted Provider Offers even without CC.`, async () => {
      // TODO: when it becomes possible to flush, depreacte use of another signer
      // Lets use another signer for this case
      signer = new ethers.Wallet(PRIVATE_KEY_8_ANVIL_ACCOUNT, provider);
      const signerAddress = await signer.getAddress();
      contractsClient = new DealClient(signer, TEST_NETWORK);
      paymentToken = await contractsClient.getUSDC();
      paymentTokenAddress = await paymentToken.getAddress();
      dealFactoryContract = await contractsClient.getDealFactory();
      coreContract = await contractsClient.getCore();
      marketContract = await contractsClient.getMarket();
      capacityContract = await contractsClient.getCapacity();

      const marketFixture = getMarketExampleFixture(paymentTokenAddress);
      const providerFixture = marketFixture.providerToBeMatched;
      const dealFixture = marketFixture.dealToMatchWithWhiteListedProvider;
      // Post-prepare fixtures.
      updateProviderFixtureAddress(signerAddress, [providerFixture]);
      dealFixture.listAccess = [
        marketFixture.providerToBeMatched.providerAddress,
      ];

      const setProviderInfoTx = await marketContract.setProviderInfo(
        "TestProvider8AnvilAccount",
        {
          prefixes: "0x12345678",
          hash: ethers.hexlify(ethers.randomBytes(32)),
        },
      );
      await setProviderInfoTx.wait(WAIT_CONFIRMATIONS);

      await createDealsFromFixtures(
        [dealFixture],
        signerAddress,
        paymentToken,
        dealFactoryContract,
        minDealDepositedEpochs,
        WAIT_CONFIRMATIONS,
      );

      await registerMarketOffersFromFixtures(
        [providerFixture],
        marketContract,
        WAIT_CONFIRMATIONS,
      );

      const matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      console.log("matchResult", matchResult);
      expect(matchResult.fulfilled).toEqual(true);

      // Unnecessary final check that even contracts agree with the matched result.
      const matchDealTx = await marketContract.matchDeal(
        dealFixture.dealId,
        matchResult.offers,
        matchResult.computeUnitsPerOffers,
      );
    });
  },
  TESTS_TIMEOUT,
);
