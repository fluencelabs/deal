import { assert, describe, expect, test } from "vitest";
import { createCommitments, registerMarketOffer } from "./helpers.js";
import { type ContractTransactionResponse, ethers } from "ethers";
import { checkEvent } from "./confirmations.js";
import {
  CC_DURATION_DEFAULT,
  CCStatus,
  DEFAULT_CONFIRMATIONS,
} from "./constants.js";
import { skipEpoch } from "./utils.js";
import { config } from "dotenv";
import {
  capacityContract,
  coreContract,
  marketContract,
  paymentTokenAddress,
  provider,
  signerAddress,
} from "./env.js";

config({ path: [".env", ".env.local"] });

const NEXT_EPOCH_INTERVAL = 200;

async function sendProof(
  sender: string,
  cuId: string,
  proofs: number,
  epoches: number,
) {
  const difficulty = await capacityContract.difficulty();
  let sentProofRounds = 0;
  let currentEpoch = await coreContract.currentEpoch();
  console.log(currentEpoch, "currentEpoch");
  const provider = capacityContract.runner?.provider;
  assert(provider, "no provider");
  let currentNonce = await provider.getTransactionCount(sender);

  while (sentProofRounds++ < proofs) {
    const txs: Array<ContractTransactionResponse> = [];
    for (let i = 0; i < epoches; i++) {
      txs.push(
        await capacityContract.submitProof(
          cuId,
          ethers.hexlify(ethers.randomBytes(32)),
          difficulty,
          {
            nonce: currentNonce++,
          },
        ),
      );
    }

    await Promise.all(txs.map((tx) => tx.wait(DEFAULT_CONFIRMATIONS)));

    let newEpoch;
    do {
      await new Promise((resolve) => setTimeout(resolve, NEXT_EPOCH_INTERVAL));
      newEpoch = await coreContract.currentEpoch();
      console.log(newEpoch, "newEpoch");
    } while (newEpoch === currentEpoch);

    currentEpoch = newEpoch;
  }
}

describe("Capacity commitment", () => {
  test("CC can be removed before deposit", async () => {
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

    const removeCommitmentReceipt = await removeCommitmentTx.wait(
      DEFAULT_CONFIRMATIONS,
    );

    const removeCommitmentEvent = checkEvent(
      capacityContract.filters.CommitmentRemoved,
      removeCommitmentReceipt,
    );

    console.log(removeCommitmentEvent.args.commitmentId);

    expect(removeCommitmentEvent.args).toEqual([commitmentId]);
  });

  test.only("CC fails if proofs haven't been sent", async () => {
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
    const depositCollateralReceipt = await capacityContract
      .depositCollateral([commitmentId], {
        value: collateralPerUnit,
      })
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    // TODO: move to constant
    const duration = CC_DURATION_DEFAULT;

    const collateralDepositedEvent = checkEvent(
      capacityContract.filters.CollateralDeposited,
      depositCollateralReceipt,
    );

    expect(collateralDepositedEvent.args).toEqual([
      commitmentId,
      collateralPerUnit,
    ]);

    const capacityActivatedEvent = checkEvent(
      capacityContract.filters.CommitmentActivated,
      depositCollateralReceipt,
    );
    console.log(capacityActivatedEvent.args.startEpoch);
    console.log(capacityActivatedEvent.args.endEpoch);

    expect([
      capacityActivatedEvent.args.peerId,
      capacityActivatedEvent.args.commitmentId,
      capacityActivatedEvent.args.endEpoch -
        capacityActivatedEvent.args.startEpoch,
    ]).toEqual([registeredOffer.peers[0]?.peerId, commitmentId, duration]);

    const [epochDuration, currentEpoch] = await Promise.all([
      coreContract.epochDuration(),
      coreContract.currentEpoch(),
    ]);
    console.log(currentEpoch, "currentEpoch");

    await skipEpoch(provider, epochDuration, 2);

    const [currentEpoch1] = await Promise.all([coreContract.currentEpoch()]);
    console.log(currentEpoch1, "currentEpoch1");

    const currentState = await capacityContract.getCommitment(commitmentId);
    const [currentEpoch2] = await Promise.all([coreContract.currentEpoch()]);
    console.log(currentEpoch2, "currentEpoch2");
    expect(currentState.status).toEqual(BigInt(CCStatus.Active));

    console.log("Waiting for the fail...");
    await skipEpoch(provider, epochDuration, 2);
    const currentStateAfterSomeEpoches =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSomeEpoches.status).toEqual(
      BigInt(CCStatus.Failed),
    );
  });

  test("CC ends after duration", async () => {
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
    const depositCollateralReceipt = await capacityContract
      .depositCollateral([commitmentId], {
        value: collateralPerUnit,
      })
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    // TODO: move to constant
    const duration = CC_DURATION_DEFAULT;

    const collateralDepositedEvent = checkEvent(
      capacityContract.filters.CollateralDeposited,
      depositCollateralReceipt,
    );
    expect(collateralDepositedEvent.args).toEqual([
      commitmentId,
      collateralPerUnit,
    ]);

    const capacityActivatedEvent = checkEvent(
      capacityContract.filters.CommitmentActivated,
      depositCollateralReceipt,
    );

    expect([
      capacityActivatedEvent.args.peerId,
      capacityActivatedEvent.args.commitmentId,
      capacityActivatedEvent.args.endEpoch -
        capacityActivatedEvent.args.startEpoch,
    ]).toEqual([registeredOffer.peers[0]?.peerId, commitmentId, duration]);

    const epochDuration = await coreContract.epochDuration();

    await skipEpoch(provider, epochDuration, 1);

    const currentState = await capacityContract.getCommitment(commitmentId);
    expect(currentState.status).toEqual(BigInt(CCStatus.Active));

    await skipEpoch(provider, epochDuration, duration);

    const nextStatus = await capacityContract.getCommitment(commitmentId);
    expect(nextStatus.status).toEqual(BigInt(CCStatus.Failed));

    const finishCommitmentTx = await capacityContract
      .finishCommitment(commitmentId)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const finishCommitmentEvent = checkEvent(
      capacityContract.filters.CommitmentFinished,
      finishCommitmentTx,
    );
    assert(finishCommitmentEvent, "Not Finish commitment event");
    expect(finishCommitmentEvent.args).toEqual([commitmentId]);
  });

  test("CC receives proofs", async () => {
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
    const depositCollateralReceipt = await capacityContract
      .depositCollateral([commitmentId], {
        value: collateralPerUnit,
      })
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    // TODO: move to constant
    const duration = CC_DURATION_DEFAULT;

    const collateralDepositedEvent = checkEvent(
      capacityContract.filters.CollateralDeposited,
      depositCollateralReceipt,
    );
    expect(collateralDepositedEvent.args).toEqual([
      commitmentId,
      collateralPerUnit,
    ]);

    const capacityActivatedEvent = checkEvent(
      capacityContract.filters.CommitmentActivated,
      depositCollateralReceipt,
    );

    expect([
      capacityActivatedEvent.args.peerId,
      capacityActivatedEvent.args.commitmentId,
      capacityActivatedEvent.args.endEpoch -
        capacityActivatedEvent.args.startEpoch,
      capacityActivatedEvent.args.unitIds,
    ]).toEqual([
      [
        registeredOffer.peers[0]?.peerId,
        commitmentId,
        duration,
        [registeredOffer.peers[0]?.unitIds[0]],
      ],
    ]);

    const epochDuration = await coreContract.epochDuration();

    await skipEpoch(provider, epochDuration, 2);

    const currentState = await capacityContract.getCommitment(commitmentId);
    expect(currentState.status).toEqual(BigInt(CCStatus.Active));

    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    console.log("Sending proofs...");

    await sendProof(signerAddress, cuId, 2, 3);

    // const submitProofTx = await capacityContract.submitProof(
    //   cuId,
    //   ethers.hexlify(ethers.randomBytes(32)),
    //   difficulty,
    // );
    // await submitProofTx.wait(DEFAULT_CONFIRMATIONS);
    //
    // const [submitProofEvent] = await checkEvents(
    //   capacityContract,
    //   capacityContract.filters.ProofSubmitted,
    //   1,
    //   submitProofTx,
    // );
    // expect(submitProofEvent?.args).toEqual([commitmentId, cuId]);
  });

  test("Provider turns off CC after some time", async () => {
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
    const depositCollateralReceipt = await capacityContract
      .depositCollateral([commitmentId], {
        value: collateralPerUnit,
      })
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    // TODO: move to constant
    const duration = CC_DURATION_DEFAULT;

    const collateralDepositedEvent = checkEvent(
      capacityContract.filters.CollateralDeposited,
      depositCollateralReceipt,
    );
    expect(collateralDepositedEvent.args).toEqual([
      commitmentId,
      collateralPerUnit,
    ]);

    const capacityActivatedEvent = checkEvent(
      capacityContract.filters.CommitmentActivated,
      depositCollateralReceipt,
    );

    expect([
      capacityActivatedEvent.args.peerId,
      capacityActivatedEvent.args.commitmentId,
      capacityActivatedEvent.args.endEpoch -
        capacityActivatedEvent.args.startEpoch,
    ]).toEqual([[registeredOffer.peers[0]?.peerId, commitmentId, duration]]);

    const epochDuration = await coreContract.epochDuration();

    await skipEpoch(provider, epochDuration, 1);

    const currentState = await capacityContract.getCommitment(commitmentId);
    expect(currentState.status).toEqual(BigInt(CCStatus.Active));
  });
});
