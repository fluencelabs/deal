import { assert, describe, expect, test } from "vitest";
import { createCommitments, registerMarketOffer } from "./helpers.js";
import { type ContractTransactionResponse, ethers, zeroPadBytes } from "ethers";
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

async function sendProof(
  sender: string,
  cuId: string,
  proofs: number,
  epoches: number,
) {
  const difficulty = await capacityContract.difficulty();
  let sentProofRounds = 0;
  let currentNonce = await provider.getTransactionCount(sender);

  while (sentProofRounds < epoches) {
    const txs: Array<ContractTransactionResponse> = [];
    const epochDuration = await coreContract.epochDuration();
    for (let i = 0; i < proofs; i += 1) {
      txs.push(
        await capacityContract.submitProof(
          cuId,
          ethers.hexlify(ethers.randomBytes(32)),
          difficulty,
          {
            nonce: currentNonce,
          },
        ),
      );

      currentNonce += 1;
    }

    await Promise.all(txs.map((tx) => tx.wait(DEFAULT_CONFIRMATIONS)));
    await skipEpoch(provider, epochDuration);
    sentProofRounds += 1;
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

    console.log(
      `Commitment removed: ${removeCommitmentEvent.args.commitmentId}`,
    );

    expect(removeCommitmentEvent.args).toEqual([commitmentId]);
  });

  test("CC fails if proofs haven't been sent", async () => {
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
    ]).toEqual([
      registeredOffer.peers[0]?.peerId,
      commitmentId,
      CC_DURATION_DEFAULT,
    ]);

    const epochDuration = await coreContract.epochDuration();

    await skipEpoch(provider, epochDuration, 1);

    const currentState = await capacityContract.getCommitment(commitmentId);
    expect(currentState.status).toEqual(BigInt(CCStatus.Active));

    console.log("Waiting for CC to fail without proofs...");
    await skipEpoch(provider, epochDuration, 2);
    const currentStateAfterSomeEpoches =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSomeEpoches.status).toEqual(
      BigInt(CCStatus.Failed),
    );

    return;
    // TODO: fix finishing

    const finishCommitmentReceipt = await capacityContract
      .finishCommitment(commitmentId)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const finishCommitmentEvent = checkEvent(
      capacityContract.filters.CommitmentFinished,
      finishCommitmentReceipt,
    );
    assert(finishCommitmentEvent, "No finish commitment event");
    expect(finishCommitmentEvent.args).toEqual([commitmentId]);
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
    ]).toEqual([
      registeredOffer.peers[0]?.peerId,
      commitmentId,
      CC_DURATION_DEFAULT,
    ]);

    const epochDuration = await coreContract.epochDuration();

    await skipEpoch(provider, epochDuration, 1);

    const currentState = await capacityContract.getCommitment(commitmentId);
    expect(currentState.status).toEqual(BigInt(CCStatus.Active));

    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    console.log("Sending proofs...");
    await sendProof(signerAddress, cuId, 2, Number(CC_DURATION_DEFAULT - 1n));

    const currentStateAfterSentProofs =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSentProofs.status).toEqual(BigInt(CCStatus.Active));

    // Send last proof
    await sendProof(signerAddress, cuId, 2, 1);

    const nextStatus = await capacityContract.getCommitment(commitmentId);
    expect(nextStatus.status).toEqual(BigInt(CCStatus.Inactive));

    return;
    // TODO: fix finishing
    console.log("Finishing commitment...");

    const finishCommitmentReceipt = await capacityContract
      .finishCommitment(commitmentId)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const finishCommitmentEvent = checkEvent(
      capacityContract.filters.CommitmentFinished,
      finishCommitmentReceipt,
    );
    assert(finishCommitmentEvent, "No finish commitment event");
    expect(finishCommitmentEvent.args).toEqual([commitmentId]);
  });

  test.only("Long-term CC with reward withdrawals", async () => {
    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
    );

    const vestingDuration = await capacityContract.vestingPeriodDuration();
    const vestingCount = await capacityContract.vestingPeriodCount();

    const LONG_TERM_DURATION = vestingDuration * vestingCount + 1n;

    const [commitmentId] = await createCommitments(
      capacityContract,
      signerAddress,
      registeredOffer.peers.map((p) => p.peerId),
      LONG_TERM_DURATION,
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
    ]).toEqual([
      registeredOffer.peers[0]?.peerId,
      commitmentId,
      LONG_TERM_DURATION,
    ]);

    const epochDuration = await coreContract.epochDuration();

    await skipEpoch(provider, epochDuration, 1);

    const currentState = await capacityContract.getCommitment(commitmentId);
    expect(currentState.status).toEqual(BigInt(CCStatus.Active));

    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    console.log(
      "Sending proofs regularly for vesting period of CC duration...",
    );
    await sendProof(signerAddress, cuId, 2, Number(vestingDuration));

    const currentStateAfterSentProofs =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSentProofs.status).toEqual(BigInt(CCStatus.Active));

    const withdrawRewardReceipt = await capacityContract
      .withdrawReward(commitmentId)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
    const withdrawRewardEvent = checkEvent(
      capacityContract.filters.RewardWithdrawn,
      withdrawRewardReceipt,
    );
    expect(withdrawRewardEvent.args).toEqual([commitmentId, 123]);

    // Add more withdrawals rewards. For now, just end CC
    await sendProof(
      signerAddress,
      cuId,
      2,
      Number(LONG_TERM_DURATION - vestingDuration) - 1,
    );

    const nextStatus = await capacityContract.getCommitment(commitmentId);
    expect(nextStatus.status).toEqual(BigInt(CCStatus.Inactive));

    return;
    // TODO: fix finishing
    console.log("Finishing commitment...");

    const finishCommitmentReceipt = await capacityContract
      .finishCommitment(commitmentId)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const finishCommitmentEvent = checkEvent(
      capacityContract.filters.CommitmentFinished,
      finishCommitmentReceipt,
    );
    assert(finishCommitmentEvent, "No finish commitment event");
    expect(finishCommitmentEvent.args).toEqual([commitmentId]);
  });

  test("Send too many proofs to CC per epoch", async () => {
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
    ]).toEqual([
      registeredOffer.peers[0]?.peerId,
      commitmentId,
      CC_DURATION_DEFAULT,
    ]);

    const epochDuration = await coreContract.epochDuration();

    await skipEpoch(provider, epochDuration, 1);

    const currentState = await capacityContract.getCommitment(commitmentId);
    expect(currentState.status).toEqual(BigInt(CCStatus.Active));

    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    const MAX_ALLOWED_PROOFS = 5;

    console.log("Sending regular amount of proofs proofs...");
    await sendProof(signerAddress, cuId, MAX_ALLOWED_PROOFS, 1);

    const currentStateAfterSentProofs =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSentProofs.status).toEqual(BigInt(CCStatus.Active));

    console.log("Sending excessive amount of proofs...");
    await expect(
      sendProof(signerAddress, cuId, MAX_ALLOWED_PROOFS * 2, 2),
    ).rejects.toBeDefined();
  });

  test("Send too little proofs to CC per epoch", async () => {
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
    ]).toEqual([
      registeredOffer.peers[0]?.peerId,
      commitmentId,
      CC_DURATION_DEFAULT,
    ]);

    const epochDuration = await coreContract.epochDuration();

    await skipEpoch(provider, epochDuration, 1);

    const currentState = await capacityContract.getCommitment(commitmentId);
    expect(currentState.status).toEqual(BigInt(CCStatus.Active));

    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    console.log("Sending regular amount of proofs proofs...");
    await sendProof(signerAddress, cuId, 2, 1);

    const currentStateAfterSentProofs =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSentProofs.status).toEqual(BigInt(CCStatus.Active));

    console.log("Sending insufficient amount of proofs...");
    await sendProof(signerAddress, cuId, 1, 2);

    const nextStatus = await capacityContract.getCommitment(commitmentId);
    expect(nextStatus.status).toEqual(BigInt(CCStatus.Failed));
  });

  test("Mix valid proofs with invalid", async () => {
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
    ]).toEqual([
      registeredOffer.peers[0]?.peerId,
      commitmentId,
      CC_DURATION_DEFAULT,
    ]);

    const epochDuration = await coreContract.epochDuration();

    await skipEpoch(provider, epochDuration, 1);

    const currentState = await capacityContract.getCommitment(commitmentId);
    expect(currentState.status).toEqual(BigInt(CCStatus.Active));

    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    console.log("Sending valid proofs...");
    await sendProof(signerAddress, cuId, 2, 1);

    const currentStateAfterSentProofs =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSentProofs.status).toEqual(BigInt(CCStatus.Active));

    console.log("Sending invalid proofs...");

    await expect(
      capacityContract.submitProof(
        cuId,
        ethers.hexlify(ethers.randomBytes(32)),
        zeroPadBytes("0x", 32),
      ),
    ).rejects.toThrow("Proof is not valid");

    const nextStatus = await capacityContract.getCommitment(commitmentId);
    expect(nextStatus.status).toEqual(BigInt(CCStatus.Active));
  });
});
