import { beforeAll, describe, expect, test } from "vitest";
import {
  DealClient,
  type ICapacity,
  type ICore,
  type IDealFactory,
  type IERC20,
  type IMarket, DealExplorerClient, CommitmentStatus
} from "@fluencelabs/deal-ts-clients";
import {
  ethers,
  HDNodeWallet,
  JsonRpcSigner,
  Wallet,
} from "ethers";
import {
  createCommitmentForProviderFixtures,
  createDealsFromFixtures,
  depositCollateral,
  generateEffector,
  getMarketExampleFixture,
  registerMarketOffersFromFixtures
} from "../utils/fixture.js";
import { TEST_NETWORK, PROVIDER, WAIT_CONFIRMATIONS } from "../env.js";
import { waitSubgraphToIndex } from "../utils/subgraph.js";

// Empirically measured time for subgraph indexing on 4CPU, 8Gb mem.
const DEFAULT_SUBGRAPH_TIME_INDEXING = 300000;
const TESTS_TIMEOUT = 120000 + 30000 + DEFAULT_SUBGRAPH_TIME_INDEXING;
const CAPACITY_DEFAULT_DURATION = 3; // if 1 epoch 15 sec -> 75 [sec].
const LOCAL_SIGNER_MNEMONIC =
  "test test test test test test test test test test test junk";

// Note, that MIN_DURATION * EPOCH_DURATION (them are set up during contract deploy) should not be exited the test timeout.
// In those tests also note timeframes for waitSubgraphToIndex() and block confirmation time of your test node.
//  Thus, those all times above should be taken into consideration when you write/run the tests below.
describe(
  "#dealExplorerClient",
  () => {
    let signer: Wallet | JsonRpcSigner | HDNodeWallet;
    let contractsClient: DealClient;
    let explorerClient: DealExplorerClient;
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
      signer = ethers.Wallet.fromPhrase(LOCAL_SIGNER_MNEMONIC, PROVIDER);
      signerAddress = await signer.getAddress();
      contractsClient = new DealClient(signer, TEST_NETWORK);
      explorerClient = new DealExplorerClient(TEST_NETWORK, undefined, signer,);
      paymentToken = await contractsClient.getUSDC();
      paymentTokenAddress = await paymentToken.getAddress();
      dealFactoryContract = await contractsClient.getDealFactory();
      coreContract = await contractsClient.getCore();
      marketContract = await contractsClient.getMarket();
      capacityContract = await contractsClient.getCapacity();
      minDealDepositedEpochs = await coreContract.minDealDepositedEpochs();

      epochMilliseconds = (await coreContract.epochDuration()) * 1000n;
    });

    describe("#getCapacityCommitments", () => {
      test.only("It filters by status correctly.", async () => {
              // Prepare data.
        const effectors = [generateEffector()];
        const marketFixture = getMarketExampleFixture(
          paymentTokenAddress,
          effectors,
          signerAddress,
        );
        const providerFixture = marketFixture.providerExample;
        const dealFixture = marketFixture.dealExample;

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
          [providerFixture],
          marketContract,
          WAIT_CONFIRMATIONS,
        );

        // In these tests lets rely on CC creation time, - thus, we could divide different tests
        const CCCreatedRightBefore = Math.round(Date.now() / 1000)
        console.log(`
          Test for explorer below isolated from others by hypothesis
          that filter createdAtFrom works properly. Timestamp for createdAtFrom:
          ${CCCreatedRightBefore}`
        )

        // Check that no CCs for the date filter.
        let fetchedCCs = await explorerClient.getCapacityCommitments({
          createdAtFrom: CCCreatedRightBefore,
        })
        expect(fetchedCCs.data.length).toEqual(0)

        // Create CC.
        let createdCCIds = await createCommitmentForProviderFixtures(
          [providerFixture],
          capacityContract,
          WAIT_CONFIRMATIONS,
          CAPACITY_DEFAULT_DURATION,
        );
        await waitSubgraphToIndex()

        console.log("--- Check that after creation of CC, statuses are WaitDelegation. ---")
        // Also check the same status on blockchain before.
        const chosenCC = createdCCIds[0] as string
        let statusCCFromChain = Number(await capacityContract.getStatus(chosenCC))
        expect(statusCCFromChain).toEqual(CommitmentStatus.WaitDelegation)

        fetchedCCs = await explorerClient.getCapacityCommitments({
          createdAtFrom: CCCreatedRightBefore,
          status: "waitDelegation"
        })
        expect(fetchedCCs.data.length).toEqual(2)

        console.log("Deposit collateral for created CCs: ", createdCCIds);
        await depositCollateral(
          createdCCIds,
          capacityContract,
          WAIT_CONFIRMATIONS,
        );
        await waitSubgraphToIndex()
        // And check that nothing for wait delegation though.
        fetchedCCs = await explorerClient.getCapacityCommitments({
          createdAtFrom: CCCreatedRightBefore,
          status: "waitDelegation"
        })
        expect(fetchedCCs.data.length).toEqual(0)

        // Code commented because it is difficult to check waitStart coz it takes 1 epoch, and deposit could be on the edge of epoch.
        // fetchedCCs = await explorerClient.getCapacityCommitments({
        //   createdAtFrom: CCCreatedRightBefore,
        //   status: "waitStart"
        // })

        console.log('--- Check that it is active after 1 epoch passed (WaitStart + 1 epoch == Active). ---')
        await new Promise((resolve) =>
          setTimeout(resolve, Number(epochMilliseconds)),
        );
        // Check on chain before.
        statusCCFromChain = Number(await capacityContract.getStatus(chosenCC))
        console.log(`TODO: got for ${chosenCC}: statusCCFromChain: ${statusCCFromChain}`)
        expect(statusCCFromChain).toEqual(CommitmentStatus.Active)
        // Check then in client.
        fetchedCCs = await explorerClient.getCapacityCommitments({
          createdAtFrom: CCCreatedRightBefore,
          status: "active"
        })
        expect(fetchedCCs.data.length).toEqual(2)

        // Wait for CC to be expired, thus, wait for CAPACITY_DEFAULT_DURATION.
        const expirationPeriod = CAPACITY_DEFAULT_DURATION * Number(epochMilliseconds)
        console.log(`Wait for ${expirationPeriod} msec.`)
        await new Promise((resolve) =>
          setTimeout(resolve, expirationPeriod),
        );

        console.log('--- Check that CC should not be ACTIVE after CC period passed. ---')
        // Assert chain state.
        statusCCFromChain = Number(await capacityContract.getStatus(chosenCC))
        console.log(`TODO: check inactive got for ${chosenCC}: statusCCFromChain: ${statusCCFromChain}`)
        expect(statusCCFromChain).toEqual(CommitmentStatus.Inactive)
        // Assert client active filter.
        fetchedCCs = await explorerClient.getCapacityCommitments({
          createdAtFrom: CCCreatedRightBefore,
          status: "active"
        })
        expect(fetchedCCs.data.length).toEqual(0)
        // Finally check the target filter.
        fetchedCCs = await explorerClient.getCapacityCommitments({
          createdAtFrom: CCCreatedRightBefore,
          status: "inactive"
        })
        expect(fetchedCCs.data.length).toEqual(2)

        console.log("--- Check that REMOVED filter works properly. ---")
        console.log(`Remove all CUs from target CC: ${chosenCC}...`)
        const removeCCTx = await capacityContract.removeCUFromCC(chosenCC, providerFixture.computeUnitsPerPeers[0])
        await removeCCTx.wait(WAIT_CONFIRMATIONS)
        await waitSubgraphToIndex()

        // Assert that status of CC the same after remove of CUs from CC.
        fetchedCCs = await explorerClient.getCapacityCommitments({
          createdAtFrom: CCCreatedRightBefore,
          status: "inactive"
        })
        expect(fetchedCCs.data.length).toEqual(2)

        // Target check for this block.
        console.log(`Send finishCommitment for the target CC: ${chosenCC}`)
        const finishCCTx = await capacityContract.finishCommitment(chosenCC)
        await finishCCTx.wait(WAIT_CONFIRMATIONS)
        await waitSubgraphToIndex()

        // Target check on chain.
        statusCCFromChain = Number(await capacityContract.getStatus(chosenCC))
        console.log(`TODO: check removed got for ${chosenCC}: statusCCFromChain: ${statusCCFromChain}`)
        expect(statusCCFromChain).toEqual(CommitmentStatus.Removed)
        // Target check of client.
        fetchedCCs = await explorerClient.getCapacityCommitments({
          createdAtFrom: CCCreatedRightBefore,
          status: "removed"
        })
        // We removed only 1 CC.
        expect(fetchedCCs.data.length).toEqual(1)
      });
    })

  //   TODO: add test flow for failed status and remove at the end.
  },
  TESTS_TIMEOUT,
);
