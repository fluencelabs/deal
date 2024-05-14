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

    async function _createCCDepositAndWait(
      providers: ProviderFixtureModel[],
      capacityContract: ICapacity,
    ) {
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

      // This check below is desirable but randomly it could be on the edge of the next
      //  epoch (when epoch time -> 0), thus status could be changed unexpectedly for this check.
      // // It still should not match because CC is not active (waiting start).
      // for (const createdCCId of createdCCIds) {
      //   const _status = await capacityContract.getStatus(createdCCId);
      //   expect(_status).toEqual(BigInt(CommitmentStatus.WaitStart));
      // }

      // We have to wait 1 epoch since deposit, after the status becomes active.
      await new Promise((resolve) =>
        setTimeout(resolve, Number(epochMilliseconds)),
      );
    }

    async function _checkExactMatch(
      dealFixture: DealFixtureModel,
      providerFixture: ProviderFixtureModel,
      expectedMatchedFully: boolean = true,
    ) {
      // Check that is matched successfully finally.
      const matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      // We have only 1 Offer with 2 CUs number from provider fixture.
      const providerFixtureComputeUnits = [].concat(
        ...providerFixture.computeUnitsPerPeers,
      );
      expect(matchResult.computeUnitsPerOffers.length).toEqual(1);
      expect(matchResult.computeUnitsPerOffers[0].length).toEqual(
        providerFixtureComputeUnits.length,
      );
      const computeUnitsMatchedFromMatcher = [].concat(
        ...matchResult.computeUnitsPerOffers,
      );
      expect(computeUnitsMatchedFromMatcher.sort()).toEqual(
        providerFixtureComputeUnits.sort(),
      );
      expect(matchResult.fulfilled).toEqual(expectedMatchedFully);

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
      expect(matchedComputeUnits.sort()).toEqual(
        providerFixtureComputeUnits.sort(),
      );
    }

    test(`It matches successfully for 1:1 configuration where CC has status Active.`, async () => {
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
      await _createCCDepositAndWait(
        [anotherEffectorProviderFixture],
        capacityContract,
      );
      // Check that there are no match with another effector offer.
      matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      expect(matchResult.fulfilled).toEqual(false);
      expect(matchResult.computeUnitsPerOffers).toEqual([]);

      // Now let`s create CC for the target provider.
      await _createCCDepositAndWait([providerFixture], capacityContract);

      // Check itself.
      await _checkExactMatch(dealFixture, providerFixture);
    });

    test(`It matches successfully with whitelisted Provider Offers even without CC.`, async () => {
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

    test("It ignores CUs from blacklisted providers.", async () => {
      // Prepare data.
      // Our case:
      // - Deal - 2 target workers, 1 min worker
      // - Providers: blacklisted, ordinary with 1 worker
      // We expect match with ordinary provider for 1 worker.
      const effectors = [generateEffector()];

      const marketFixture = getMarketExampleFixture(
        paymentTokenAddress,
        effectors,
        signerAddress,
      );
      const providerFixture = marketFixture.providerExample;
      providerFixture.peerIds = providerFixture.peerIds.slice(0, 1);
      providerFixture.computeUnitsPerPeers = [
        providerFixture.computeUnitsPerPeers[0].slice(0, 1),
      ];
      // Create context for blacklisted provider.
      const blacklistedSigner = new ethers.Wallet(
        PRIVATE_KEY_8_ANVIL_ACCOUNT,
        provider,
      );
      const blacklistedSignerAddress = await blacklistedSigner.getAddress();
      const blacklistedProviderFixture = getMarketExampleFixture(
        paymentTokenAddress,
        effectors,
        blacklistedSignerAddress,
      ).providerExample;
      const contractsClientByBlacklisted = new DealClient(
        blacklistedSigner,
        TEST_NETWORK,
      );
      const marketContractByBlacklisted =
        await contractsClientByBlacklisted.getMarket();
      const capacityContractByBlacklisted =
        await contractsClientByBlacklisted.getCapacity();

      const dealFixture = marketFixture.dealExample;
      dealFixture.listAccessType = AccessType.BLACKLIST;
      dealFixture.listAccess = [blacklistedProviderFixture.providerAddress];
      dealFixture.minWorkers = 1;

      // Create/update providers.
      const setProviderInfoTx = await marketContract.setProviderInfo(
        "Provider",
        {
          prefixes: "0x12345678",
          hash: ethers.hexlify(ethers.randomBytes(32)),
        },
      );
      await setProviderInfoTx.wait(WAIT_CONFIRMATIONS);
      const setBlacklistedProviderInfoTx =
        await marketContractByBlacklisted.setProviderInfo(
          "ProviderBlacklisted",
          {
            prefixes: "0x12345678",
            hash: ethers.hexlify(ethers.randomBytes(32)),
          },
        );
      await setBlacklistedProviderInfoTx.wait(WAIT_CONFIRMATIONS);

      // Create deal from fixture.
      await createDealsFromFixtures(
        [dealFixture],
        await signer.getAddress(),
        paymentToken,
        dealFactoryContract,
        minDealDepositedEpochs,
        WAIT_CONFIRMATIONS,
      );

      // Register offers by separate signers.
      await registerMarketOffersFromFixtures(
        [providerFixture],
        marketContract,
        WAIT_CONFIRMATIONS,
      );
      await registerMarketOffersFromFixtures(
        [blacklistedProviderFixture],
        marketContractByBlacklisted,
        WAIT_CONFIRMATIONS,
      );

      // Firstly, check that providers with not Active CC could not be matched with the Deal.
      let matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      expect(matchResult.fulfilled).toEqual(false);
      expect(matchResult.computeUnitsPerOffers).toEqual([]);

      // Create CC and wait for blacklisted provider and check.
      await _createCCDepositAndWait(
        [blacklistedProviderFixture],
        capacityContractByBlacklisted,
      );
      matchResult = await dealMatcherClient.getMatchedOffersByDealId(
        dealFixture.dealId,
      );
      expect(matchResult.fulfilled).toEqual(false);
      expect(matchResult.computeUnitsPerOffers).toEqual([]);

      // Now create CC for target provider offer and lets check that blacklisted would be ignored,
      //  and only ordinary provider would be matched.
      await _createCCDepositAndWait([providerFixture], capacityContract);

      // Check itself.
      await _checkExactMatch(dealFixture, providerFixture, false);
    });

    // // TODO
    // test("It does not allow to match with CUs from Failed CC.", async () => {
    // });
    //
    // // TODO
    // test("It allows to rematch after core: minDealRematchingEpochs.", async () => {
    // });
  },
  TESTS_TIMEOUT,
);
