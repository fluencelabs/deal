// TODO: relocate to test integration-tests folder.
import { beforeAll, describe, expect, test } from "vitest";
import {
  CommitmentStatus,
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
  DealFixtureModel,
  depositCollateral,
  generateEffector,
  getMarketExampleFixture,
  ProviderFixtureModel,
  registerMarketOffersFromFixtures,
} from "./fixture";
import { getEventValues } from "./events";
import { AccessType } from "../../../src/client/client";

const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = `http://localhost:8545`;
// Empirically measured time for subgraph indexing on 4CPU, 8Gb mem.
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
 *  - Deployed contracts (locally),
 *  - Deployed Subgraph and aimed to the deployed contracts.

 * Notice: Each test for matching within this module must be with different
 *  effectors (now it is random). Thus, until the filtration by effectors works well we could
 *  "separate" tests for the matcher method (To ensure the hypothesis in all
 *  positive tests below additional check that no match with different effector is presented).
 * FAQ:
 * - Why so many considerations about state?
 *  Blockchain snapshot is not going to work correctly for the tests since we use indexer (Subgraph)
 *  in conjunction with the chain as well and indexer should be snapshotted as well (but it is not possible for the Subgraph).
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
    let epochMilliseconds: bigint;

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

      epochMilliseconds = (await coreContract.epochDuration()) * 1000n;
    });

    async function _createCCDepositAndWait(providers: ProviderFixtureModel[]) {
      let createdCCIds = await createCommitmentForProviderFixtures(
        providers,
        capacityContract,
        WAIT_CONFIRMATIONS,
        CAPACITY_DEFAULT_DURATION,
      );
      await depositCollateral(
        createdCCIds,
        capacityContract,
        WAIT_CONFIRMATIONS,
      );

      // It still should not match because CC is not active (waiting start).
      // TODO: batch this to speed up.
      for (const createdCCId of createdCCIds) {
        console.log("get status for createdCCId", createdCCId);
        const _status = await capacityContract.getStatus(createdCCId);
        expect(_status).toEqual(BigInt(CommitmentStatus.WaitStart));
      }

      // We have to wait 1 epoch since deposit, thus, status becomes active
      await new Promise((resolve) =>
        setTimeout(resolve, Number(epochMilliseconds)),
      );
    }

    async function _checkExactMatch(
      dealFixture: DealFixtureModel,
      providerFixture: ProviderFixtureModel,
    ) {
      // Check that is matched successfully finally.
      const matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      // We have only 1 Offer with 2 CUs matched for this Deal.
      expect(matchResult.computeUnitsPerOffers.length).toEqual(1);
      expect(matchResult.computeUnitsPerOffers[0].length).toEqual(2);
      const computeUnitsMatchedFromMatcher = [].concat(
        ...matchResult.computeUnitsPerOffers,
      );
      const computeUnitsCreated = [].concat(
        ...providerFixture.computeUnitsPerPeers,
      );
      expect(computeUnitsMatchedFromMatcher.sort()).toEqual(
        computeUnitsCreated.sort(),
      );
      expect(matchResult.fulfilled).toEqual(true);

      // Unnecessary final check that even contracts agree with the matched result.
      const matchDealTx = await marketContract.matchDeal(
        dealFixture.dealId,
        matchResult.offers,
        matchResult.computeUnitsPerOffers,
      );
      const matchDealTxResult = await matchDealTx.wait(WAIT_CONFIRMATIONS);

      const matchedComputeUnits = getEventValues({
        txReceipt: matchDealTxResult!,
        contract: marketContract,
        eventName: "ComputeUnitMatched",
        value: "unitId",
      });
      expect(matchedComputeUnits.sort()).toEqual(computeUnitsCreated.sort());
    }

    test(`It checks that it matched successfully for 1:1 configuration where CC has status Active.`, async () => {
      // Prepare data.
      const effectors = [generateEffector()];
      const marketFixture = getMarketExampleFixture(
        paymentTokenAddress,
        effectors,
        signerAddress,
      );
      const providerFixture = marketFixture.providerExample;
      const dealFixture = marketFixture.dealExample;
      // Also check that it does not match with offers with different effectors.
      const anotherEffectors = [generateEffector()];
      const anotherEffectorProviderFixture = getMarketExampleFixture(
        paymentTokenAddress,
        anotherEffectors,
        signerAddress,
      ).providerExample;

      // Create/update provider.
      const setProviderInfoTx = await marketContract.setProviderInfo(
        "ProviderWithActiveCC",
        {
          prefixes: "0x12345678",
          hash: ethers.hexlify(ethers.randomBytes(32)),
        },
      );
      await setProviderInfoTx.wait(WAIT_CONFIRMATIONS);

      // Create deal from fixture.
      await createDealsFromFixtures(
        [dealFixture],
        await signer.getAddress(),
        paymentToken,
        dealFactoryContract,
        minDealDepositedEpochs,
        WAIT_CONFIRMATIONS,
      );

      await registerMarketOffersFromFixtures(
        [providerFixture, anotherEffectorProviderFixture],
        marketContract,
        WAIT_CONFIRMATIONS,
      );

      // Firstly, check that provider with not Active CC could not be matched with the Deal.
      let matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      expect(matchResult.fulfilled).toEqual(false);
      expect(matchResult.computeUnitsPerOffers).toEqual([]);

      // Now lets register CC and activate it for another effector offer and check that it does not match.
      await _createCCDepositAndWait([anotherEffectorProviderFixture]);
      // Check that there are no match with another effector offer.
      matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      expect(matchResult.fulfilled).toEqual(false);
      expect(matchResult.computeUnitsPerOffers).toEqual([]);

      // Now let`s create CC for the target provider.
      await _createCCDepositAndWait([providerFixture]);

      // Check itself.
      await _checkExactMatch(dealFixture, providerFixture);
    });

    test(`It checks that it matched successfully with whitelisted Provider Offers even without CC.`, async () => {
      // Prepare data.
      const effectors = [generateEffector()];
      const marketFixture = getMarketExampleFixture(
        paymentTokenAddress,
        effectors,
        signerAddress,
      );
      const providerFixture = marketFixture.providerExample;
      const dealFixture = marketFixture.dealExample;
      // Also check that it does not match with offers with different effectors.
      const anotherEffectors = [generateEffector()];
      const anotherEffectorProviderFixture = getMarketExampleFixture(
        paymentTokenAddress,
        anotherEffectors,
        signerAddress,
      ).providerExample;

      // Add whitelist for this test case.
      dealFixture.listAccessType = AccessType.WHITELIST;
      // Also include test for anotherEffectorProviderFixture. Offer from
      //  another provider should be excluded coz of another effector (not the same as it is in the Deal).
      dealFixture.listAccess = [
        providerFixture.providerAddress,
        anotherEffectorProviderFixture.providerAddress,
      ];

      // Create/update provider.
      const setProviderInfoTx = await marketContract.setProviderInfo(
        "ProviderWithActiveCC",
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

      // Register Offer with another effectors.
      await registerMarketOffersFromFixtures(
        [anotherEffectorProviderFixture],
        marketContract,
        WAIT_CONFIRMATIONS,
      );
      // Check that there are no match with another effector Offer.
      let matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      expect(matchResult.fulfilled).toEqual(false);
      expect(matchResult.computeUnitsPerOffers).toEqual([]);

      // Register target Provider Offer.
      await registerMarketOffersFromFixtures(
        [providerFixture],
        marketContract,
        WAIT_CONFIRMATIONS,
      );

      // Check itself.
      await _checkExactMatch(dealFixture, providerFixture);
    });
  },
  TESTS_TIMEOUT,
);
