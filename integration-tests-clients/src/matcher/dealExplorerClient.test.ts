import { beforeAll, describe, expect, test } from "vitest";
import {
  DealClient,
  DealExplorerClient,
  type ICapacity,
  type ICore,
  type IERC20,
  type IMarket,
} from "@fluencelabs/deal-ts-clients";
import { ethers, HDNodeWallet, JsonRpcSigner, Wallet } from "ethers";
import { generateEffector } from "../utils/fixture.js";
import { getEventValue } from "../utils/events.js";
import { TEST_NETWORK, PROVIDER } from "../env.js";
import {
  sign,
  wait,
  peerIdContractHexToBase58,
  setTryTimeout,
} from "../utils.js";
import assert from "node:assert";

// Empirically measured time for subgraph indexing on 4CPU, 8Gb mem.
const DEFAULT_SUBGRAPH_TIME_INDEXING = 300000;
const TESTS_TIMEOUT = 120000 + 30000 + DEFAULT_SUBGRAPH_TIME_INDEXING;
const LOCAL_SIGNER_MNEMONIC =
  "test test test test test test test test test test test junk";

describe(
  "dealExplorerClient tests",
  () => {
    let signer: Wallet | JsonRpcSigner | HDNodeWallet;
    let contractsClient: DealClient;
    let dealExplorerClient: DealExplorerClient;
    let signerAddress: string;
    let paymentTokenAddress: string;
    let coreContract: ICore;
    let marketContract: IMarket;
    let capacityContract: ICapacity;
    let paymentToken: IERC20;
    let epochMilliseconds: number;

    beforeAll(async () => {
      signer = ethers.Wallet.fromPhrase(LOCAL_SIGNER_MNEMONIC, PROVIDER);
      signerAddress = await signer.getAddress();
      contractsClient = new DealClient(signer, TEST_NETWORK);
      dealExplorerClient = new DealExplorerClient(
        TEST_NETWORK,
        undefined,
        signer,
      );
      paymentToken = await contractsClient.getUSDC();
      paymentTokenAddress = await paymentToken.getAddress();
      coreContract = await contractsClient.getCore();
      marketContract = await contractsClient.getMarket();
      capacityContract = await contractsClient.getCapacity();

      epochMilliseconds = Number((await coreContract.epochDuration()) * 1000n);
    });

    test("offer and commitment have correct number of compute units after offer update", async () => {
      await sign(marketContract.setProviderInfo, "ProviderWithActiveCC", {
        prefixes: "0x12345678",
        hash: ethers.hexlify(ethers.randomBytes(32)),
      });

      const peerId = ethers.hexlify(ethers.randomBytes(32));

      const unitIdToBeRemovedAfterUpdate = ethers.hexlify(
        ethers.randomBytes(32),
      );

      const unitIds = [
        unitIdToBeRemovedAfterUpdate,
        ...new Array(2).fill(0).map(() => {
          return ethers.hexlify(ethers.randomBytes(32));
        }),
      ];

      const registerMarketOfferTxReceipt = await sign(
        marketContract.registerMarketOffer,
        ethers.parseEther("0.00001").toString(),
        paymentTokenAddress,
        [generateEffector()].map((effector) => ({
          prefixes: effector.prefix,
          hash: effector.hash,
        })),
        [
          {
            peerId,
            unitIds,
            owner: signerAddress,
          },
        ],
        1,
        1,
      );

      const offerId = getEventValue({
        txReceipt: registerMarketOfferTxReceipt,
        contract: marketContract,
        eventName: "MarketOfferRegistered",
        value: "offerId",
      });

      assert(typeof offerId === "string");

      await sign(
        marketContract.removeComputeUnit,
        unitIdToBeRemovedAfterUpdate,
      );

      const createCommitmentTx = await sign(
        capacityContract.createCommitment,
        peerId,
        60 * 60 * 24 * 30, // 30 days in seconds
        ethers.ZeroAddress,
        1,
      );

      const ccId = getEventValue({
        txReceipt: createCommitmentTx,
        contract: capacityContract,
        eventName: "CommitmentCreated",
        value: "commitmentId",
      });

      assert(typeof ccId === "string");

      const capacityCommitmentUpdated =
        await capacityContract.getCommitment(ccId);

      await sign(capacityContract.depositCollateral, [ccId], {
        value:
          capacityCommitmentUpdated.unitCount *
          capacityCommitmentUpdated.collateralPerUnit,
      });

      await wait(epochMilliseconds);

      await setTryTimeout(
        "trying to get offer from explorer",
        async () => {
          const {
            data: [firstOffer],
          } = await dealExplorerClient.getOffers({ search: offerId });

          assert(firstOffer !== undefined);
          expect(firstOffer.totalComputeUnits).toEqual(2);
        },
        (e) => {
          throw e;
        },
        60000,
      );

      const offer = await dealExplorerClient.getOffer(offerId);
      assert(offer !== null);
      expect(offer.totalComputeUnits).toEqual(2);

      const {
        data: [ccFromExplorer],
      } = await dealExplorerClient.getCapacityCommitments({
        search: ccId,
      });

      assert(ccFromExplorer !== undefined);
      expect(ccFromExplorer.computeUnitsCount).toEqual(2);

      const cc = await dealExplorerClient.getCapacityCommitment(ccId);
      assert(cc !== null);
      expect(cc.computeUnitsCount).toEqual(2);
    });
  },
  TESTS_TIMEOUT,
);
