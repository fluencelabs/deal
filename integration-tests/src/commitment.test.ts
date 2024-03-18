import { assert, describe, expect, test } from "vitest";
import { createCommitments, registerMarketOffer } from "./helpers.js";
import { type ContractTransactionResponse, ethers, zeroPadBytes } from "ethers";
import { checkEvent } from "./confirmations.js";
import {
  CC_DURATION_DEFAULT,
  CC_MAX_FAILED_RATIO,
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
import type { Peer } from "./fixtures.js";

config({ path: [".env", ".env.local"] });

async function sendProof(
  sender: string,
  cuId: string,
  proofs: number,
  epoches: number,
) {
  const epochDuration = await coreContract.epochDuration();
  const difficulty = await coreContract.difficulty();
  let sentProofRounds = 0;
  let currentNonce = await provider.getTransactionCount(sender);

  while (sentProofRounds < epoches) {
    const txs: Array<ContractTransactionResponse> = [];
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

async function DepositCC(
  commitmentIds: string[],
  peers: Peer[],
  _duration: bigint | undefined,
) {
  const duration = _duration ?? CC_DURATION_DEFAULT;
  const collateralPerUnit = await coreContract.fltCollateralPerUnit();

  console.log("Depositing collateral...");
  const depositCollateralReceipt = await capacityContract
    .depositCollateral(commitmentIds, {
      value: collateralPerUnit,
    })
    .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

  const collateralDepositedEvents = checkEvent(
    capacityContract.filters.CollateralDeposited,
    depositCollateralReceipt,
  );
  expect(collateralDepositedEvents.map((event) => event.args)).toEqual(
    commitmentIds.map((cuID) => [cuID, collateralPerUnit]),
  );

  const capacityActivatedEvents = checkEvent(
    capacityContract.filters.CommitmentActivated,
    depositCollateralReceipt,
  );

  expect(
    capacityActivatedEvents.map((event) => [
      event.args.peerId,
      event.args.commitmentId,
      event.args.endEpoch - event.args.startEpoch,
    ]),
  ).toEqual(peers.map(({ peerId }, i) => [peerId, commitmentIds[i], duration]));

  const epochDuration = await coreContract.epochDuration();
  const cuID = commitmentIds[0];
  assert(cuID, "CC id should be defined");

  const currentStateBeforeDelegation =
    await capacityContract.getCommitment(cuID);
  expect(currentStateBeforeDelegation.status).toEqual(
    BigInt(CCStatus.WaitStart),
  );

  await skipEpoch(provider, epochDuration, 1);

  const currentState = await capacityContract.getCommitment(cuID);
  expect(currentState.status).toEqual(BigInt(CCStatus.Active));
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

    const [removeCommitmentEvent] = checkEvent(
      capacityContract.filters.CommitmentRemoved,
      removeCommitmentReceipt,
    );
    assert(removeCommitmentEvent);

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

    await DepositCC([commitmentId], registeredOffer.peers, CC_DURATION_DEFAULT);

    const epochDuration = await coreContract.epochDuration();

    console.log("Waiting for CC to fail without proofs...");
    await skipEpoch(provider, epochDuration, CC_MAX_FAILED_RATIO);
    const currentStateAfterSomeEpoches =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSomeEpoches.status).toEqual(
      BigInt(CCStatus.Failed),
    );

    const peer = registeredOffer.peers[0];
    assert(peer, "At least a single peer should be present in fixture");

    const cuIDs = peer.unitIds;

    const removeCUFromCCReceipt = await capacityContract
      .removeCUFromCC(commitmentId, cuIDs)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
    const [commitmentStatsUpdatedEvent] = checkEvent(
      capacityContract.filters.CommitmentStatsUpdated,
      removeCUFromCCReceipt,
    );
    expect(commitmentStatsUpdatedEvent?.args.commitmentId).toMatch(
      commitmentId,
    );

    console.log("Waiting for withdraw epoches to pass...");
    const withdrawEpochs = await coreContract.withdrawEpochsAfterFailed();
    await skipEpoch(provider, epochDuration, withdrawEpochs);

    console.log("Finishing commitment...");
    const finishCommitmentReceipt = await capacityContract
      .finishCommitment(commitmentId)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const [finishCommitmentEvent] = checkEvent(
      capacityContract.filters.CommitmentFinished,
      finishCommitmentReceipt,
    );
    assert(finishCommitmentEvent, "No finish commitment event");
    expect(finishCommitmentEvent.args).toEqual([commitmentId]);
  });

  test("Cannot finish CC without removing CUs", async () => {
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

    await DepositCC([commitmentId], registeredOffer.peers, CC_DURATION_DEFAULT);

    console.log("Waiting for CC to fail without proofs...");
    const epochDuration = await coreContract.epochDuration();
    await skipEpoch(provider, epochDuration, CC_MAX_FAILED_RATIO);
    const currentStateAfterSomeEpoches =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSomeEpoches.status).toEqual(
      BigInt(CCStatus.Failed),
    );

    console.log("Waiting for withdraw epoches to pass...");
    const withdrawEpochs = await coreContract.withdrawEpochsAfterFailed();
    // TODO: lesser values aren't working
    const HACKY_WITHDRAW_EPOCHS = withdrawEpochs * 2n;
    await skipEpoch(provider, epochDuration, HACKY_WITHDRAW_EPOCHS);

    // TODO: Add error class
    await expect(
      capacityContract
        .finishCommitment(commitmentId)
        .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS)),
    ).rejects.toThrow("(unknown custom error)");
  });

  test("CC ends after duration", async () => {
    console.log(await capacityContract.getAddress());
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

    await DepositCC([commitmentId], registeredOffer.peers, CC_DURATION_DEFAULT);

    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    console.log("Sending proofs...");
    await sendProof(signerAddress, cuId, 2, Number(CC_DURATION_DEFAULT - 1n));

    const currentStateAfterSentProofs =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSentProofs.status).toEqual(BigInt(CCStatus.Active));

    // Send last proof
    await sendProof(signerAddress, cuId, 2, 1);

    // TODO: need to wait additional epoch, otherwise CC doesn't end
    const epochDuration = await coreContract.epochDuration();
    await skipEpoch(provider, epochDuration, 1);

    const nextStatus = await capacityContract.getCommitment(commitmentId);
    expect(nextStatus.status).toEqual(BigInt(CCStatus.Inactive));

    const peer = registeredOffer.peers[0];
    assert(peer, "At least a single peer should be present in fixture");

    const cuIDs = peer.unitIds;

    const removeCUFromCCReceipt = await capacityContract
      .removeCUFromCC(commitmentId, cuIDs)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
    const [commitmentStatsUpdatedEvent] = checkEvent(
      capacityContract.filters.CommitmentStatsUpdated,
      removeCUFromCCReceipt,
    );
    expect(commitmentStatsUpdatedEvent?.args.commitmentId).toMatch(
      commitmentId,
    );

    console.log("Waiting for withdraw epoches to pass...");
    const withdrawEpochs = await coreContract.withdrawEpochsAfterFailed();
    await skipEpoch(provider, epochDuration, withdrawEpochs);

    console.log("Finishing commitment...");
    const finishCommitmentReceipt = await capacityContract
      .finishCommitment(commitmentId)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const [finishCommitmentEvent] = checkEvent(
      capacityContract.filters.CommitmentFinished,
      finishCommitmentReceipt,
    );
    assert(finishCommitmentEvent, "No finish commitment event");
    expect(finishCommitmentEvent.args).toEqual([commitmentId]);
  });

  test.skip("Long-term CC with reward withdrawals", async () => {
    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
    );

    const vestingDuration = await coreContract.vestingPeriodDuration();
    const vestingCount = await coreContract.vestingPeriodCount();

    const LONG_TERM_DURATION = vestingDuration * vestingCount + 1n;

    const [commitmentId] = await createCommitments(
      capacityContract,
      signerAddress,
      registeredOffer.peers.map((p) => p.peerId),
      LONG_TERM_DURATION,
    );

    console.log("Commitment is created", commitmentId);

    assert(commitmentId, "Commitment ID doesn't exist");

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
    const [withdrawRewardEvent] = checkEvent(
      capacityContract.filters.RewardWithdrawn,
      withdrawRewardReceipt,
    );
    expect(withdrawRewardEvent?.args).toEqual([commitmentId, 123]);

    // Add more withdrawals rewards. For now, just end CC
    await sendProof(
      signerAddress,
      cuId,
      2,
      Number(LONG_TERM_DURATION - vestingDuration) - 1,
    );

    const nextStatus = await capacityContract.getCommitment(commitmentId);
    expect(nextStatus.status).toEqual(BigInt(CCStatus.Inactive));

    const finishCommitmentReceipt = await capacityContract
      .finishCommitment(commitmentId)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const [finishCommitmentEvent] = checkEvent(
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

    const collateralPerUnit = await coreContract.fltCollateralPerUnit();

    console.log("Depositing collateral...");
    const depositCollateralReceipt = await capacityContract
      .depositCollateral([commitmentId], {
        value: collateralPerUnit,
      })
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const [collateralDepositedEvent] = checkEvent(
      capacityContract.filters.CollateralDeposited,
      depositCollateralReceipt,
    );
    assert(collateralDepositedEvent);
    expect(collateralDepositedEvent.args).toEqual([
      commitmentId,
      collateralPerUnit,
    ]);

    const [capacityActivatedEvent] = checkEvent(
      capacityContract.filters.CommitmentActivated,
      depositCollateralReceipt,
    );
    assert(capacityActivatedEvent);

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
    // await sendProof(signerAddress, cuId, MAX_ALLOWED_PROOFS * 2, 2);
    // TODO: Real error is tooManyProof, but it's hidden in contract
    await expect(
      sendProof(signerAddress, cuId, MAX_ALLOWED_PROOFS * 2, 2),
    ).rejects.toThrow("(unknown custom error)");
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

    const collateralPerUnit = await coreContract.fltCollateralPerUnit();

    console.log("Depositing collateral...");
    const depositCollateralReceipt = await capacityContract
      .depositCollateral([commitmentId], {
        value: collateralPerUnit,
      })
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const [collateralDepositedEvent] = checkEvent(
      capacityContract.filters.CollateralDeposited,
      depositCollateralReceipt,
    );
    assert(collateralDepositedEvent);
    expect(collateralDepositedEvent.args).toEqual([
      commitmentId,
      collateralPerUnit,
    ]);

    const [capacityActivatedEvent] = checkEvent(
      capacityContract.filters.CommitmentActivated,
      depositCollateralReceipt,
    );
    assert(capacityActivatedEvent);

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
    await sendProof(signerAddress, cuId, 1, Number(CC_MAX_FAILED_RATIO));

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

    const collateralPerUnit = await coreContract.fltCollateralPerUnit();

    console.log("Depositing collateral...");
    const depositCollateralReceipt = await capacityContract
      .depositCollateral([commitmentId], {
        value: collateralPerUnit,
      })
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const [collateralDepositedEvent] = checkEvent(
      capacityContract.filters.CollateralDeposited,
      depositCollateralReceipt,
    );
    assert(collateralDepositedEvent);
    expect(collateralDepositedEvent.args).toEqual([
      commitmentId,
      collateralPerUnit,
    ]);

    const [capacityActivatedEvent] = checkEvent(
      capacityContract.filters.CommitmentActivated,
      depositCollateralReceipt,
    );
    assert(capacityActivatedEvent);

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
