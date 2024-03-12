import { assert, beforeAll, describe, expect, test } from "vitest";
import { createCommitments, registerMarketOffer } from "./helpers.js";
import { ethers, JsonRpcProvider, JsonRpcSigner } from "ethers";
import { type ContractsENV, DealClient, type ICapacity, type ICore } from "@fluencelabs/deal-ts-clients";
import { checkEvents } from "./confirmations.js";
import {
  CC_DURATION_DEFAULT,
  CCStatus,
  DEFAULT_CONFIRMATIONS,
} from "./constants.js";
import { skipEpoch } from "./utils.js";
import { config } from "dotenv";
config({ path: [".env", ".env.local"] });

const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = process.env.RPC_URL;
const DEFAULT_TEST_TIMEOUT = 180000;

let provider: JsonRpcProvider;
let signer: JsonRpcSigner;
let contractsClient: DealClient;

async function sendProof(capacityContract: ICapacity, coreContract: ICore, cuId: string, proofs: number, epoches: number) {
  const difficulty = await capacityContract.difficulty();
  const currentEpoch = await coreContract.currentEpoch();
  coreContract.filters.
  for (let i = 0; i < epoches; i++) {
    const txs = new Array(epoches).fill(0).map(() => capacityContract.submitProof(
      cuId,
      ethers.hexlify(ethers.randomBytes(32)),
      difficulty,
    ).then(tx => tx.wait(DEFAULT_CONFIRMATIONS)));

    await Promise.all(txs);
  }
}

describe(
  "Capacity commitment",
  () => {
    beforeAll(async () => {
      provider = new ethers.JsonRpcProvider(TEST_RPC_URL);
      signer = await provider.getSigner();
      contractsClient = new DealClient(signer, TEST_NETWORK);
    });

    test("CC can be removed before deposit", async () => {
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

      // TODO: move to constant
      const duration = CC_DURATION_DEFAULT;

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

      const finishCommitmentTx =
        await capacityContract.finishCommitment(commitmentId);
      await finishCommitmentTx.wait(DEFAULT_CONFIRMATIONS);
      const [finishCommitmentEvent] = await checkEvents(
        capacityContract,
        capacityContract.filters.CommitmentFinished,
        1,
        finishCommitmentTx,
      );
      assert(finishCommitmentEvent, "Not Finish commitment event");
      expect(finishCommitmentEvent.args).toEqual([commitmentId]);
    });

    test.only("CC receives proofs", async () => {
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

      // TODO: move to constant
      const duration = CC_DURATION_DEFAULT;

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
          e.args.unitIds,
        ]),
      ).toEqual([
        [
          registeredOffer.peers[0]?.peerId,
          commitmentId,
          duration,
          [registeredOffer.peers[0]?.unitIds[0]],
        ],
      ]);

      const epochDuration = await coreContract.epochDuration();

      await skipEpoch(provider, epochDuration, 1);

      const currentState = await capacityContract.getCommitment(commitmentId);
      expect(currentState.status).toEqual(BigInt(CCStatus.Active));

      const cuId = registeredOffer.peers[0]?.unitIds[0];
      assert(cuId, "cuID not defined");

      const difficulty = await capacityContract.difficulty();

      const submitProofTx = await capacityContract.submitProof(
        cuId,
        ethers.hexlify(ethers.randomBytes(32)),
        difficulty,
      );
      await submitProofTx.wait(DEFAULT_CONFIRMATIONS);

      const [submitProofEvent] = await checkEvents(
        capacityContract,
        capacityContract.filters.ProofSubmitted,
        1,
        submitProofTx,
      );
      expect(submitProofEvent?.args).toEqual([commitmentId, cuId]);
    });

    test("Provider leaves CC after some time", async () => {
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

      // TODO: move to constant
      const duration = CC_DURATION_DEFAULT;

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
      // TODO: what's 0n?
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
    });
  },
  DEFAULT_TEST_TIMEOUT,
);
