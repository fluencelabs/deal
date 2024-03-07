import { assert, beforeAll, describe, expect, test } from "vitest";
import { createCommitments, registerMarketOffer } from "./helpers.js";
import { ethers, JsonRpcProvider, JsonRpcSigner } from "ethers";
import { type ContractsENV, DealClient } from "@fluencelabs/deal-ts-clients";
import { checkEvents } from "./confirmations.js";
import { CCStatus, DEFAULT_CONFIRMATIONS } from "./constants.js";
import { skipEpoch } from "./utils.js";
import "dotenv/config";

const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = process.env.RPC_URL;
const DEFAULT_TEST_TIMEOUT = 180000;

let provider: JsonRpcProvider;
let signer: JsonRpcSigner;
let contractsClient: DealClient;

describe(
  "Capacity commitment",
  () => {
    beforeAll(async () => {
      provider = new ethers.JsonRpcProvider(TEST_RPC_URL);
      signer = await provider.getSigner();
      contractsClient = new DealClient(signer, TEST_NETWORK);
    });

    test.only("CC can be removed before deposit", async () => {
      const marketContract = await contractsClient.getMarket();
      const capacityContract = await contractsClient.getCapacity();
      const paymentToken = await contractsClient.getUSDC();
      const paymentTokenAddress = await paymentToken.getAddress();

      const signerAddress = await signer.getAddress();

      const registeredOffer = await registerMarketOffer(
        marketContract,
        signerAddress,
        paymentTokenAddress,
      );

      const [commitmentId] = await createCommitments(
        capacityContract,
        signerAddress,
        registeredOffer.peers.map((p) => p.peerId),
      );

      assert(commitmentId, "Commitment ID doesn't exist");

      const removeCommitmentTx =
        await capacityContract.removeCommitment(commitmentId);

      await removeCommitmentTx.wait(DEFAULT_CONFIRMATIONS);

      const events = await checkEvents(
        capacityContract,
        capacityContract.filters.CommitmentRemoved,
        1,
        removeCommitmentTx,
      );

      expect(events.map((e) => e.args)).toEqual([[commitmentId]]);
    });

    test("CC ends after duration", async () => {
      const marketContract = await contractsClient.getMarket();
      const capacityContract = await contractsClient.getCapacity();
      const coreContract = await contractsClient.getCore();
      const paymentToken = await contractsClient.getUSDC();
      const paymentTokenAddress = await paymentToken.getAddress();

      const signerAddress = await signer.getAddress();

      const registeredOffer = await registerMarketOffer(
        marketContract,
        signerAddress,
        paymentTokenAddress,
      );

      const [commitmentId] = await createCommitments(
        capacityContract,
        signerAddress,
        registeredOffer.peers.map((p) => p.peerId),
      );

      console.log("Commitment is created", commitmentId);

      assert(commitmentId, "Commitment ID doesn't exist");

      const collateralPerUnit = await capacityContract.fltCollateralPerUnit();

      console.log("Depositing collateral...");
      const depositCollateralTx = await capacityContract.depositCollateral(
        [commitmentId],
        {
          value: collateralPerUnit,
        },
      );
      await depositCollateralTx.wait(DEFAULT_CONFIRMATIONS);

      const duration = await capacityContract.minDuration();

      const collateralDepositedEvents = await checkEvents(
        capacityContract,
        capacityContract.filters.CollateralDeposited,
        1,
        depositCollateralTx,
      );
      expect(collateralDepositedEvents.map((e) => e.args)).toEqual([
        [commitmentId, collateralPerUnit],
      ]);

      const capacityActivatedEvents = await checkEvents(
        capacityContract,
        capacityContract.filters.CommitmentActivated,
        1,
        depositCollateralTx,
      );
      expect(
        capacityActivatedEvents.map((e) => [
          e.args.peerId,
          e.args.commitmentId,
          e.args.endEpoch - e.args.startEpoch,
        ]),
      ).toEqual([[registeredOffer.peers[0]?.peerId, commitmentId, duration]]);

      const epochDuration = await coreContract.epochDuration();

      await skipEpoch(provider, epochDuration, 1);

      const currentState = await capacityContract.getCommitment(commitmentId);
      expect(currentState.status).toEqual(BigInt(CCStatus.Active));

      await skipEpoch(provider, epochDuration, duration);

      const nextStatus = await capacityContract.getCommitment(commitmentId);
      expect(nextStatus.status).toEqual(BigInt(CCStatus.Failed));
    });
  },
  DEFAULT_TEST_TIMEOUT,
);
