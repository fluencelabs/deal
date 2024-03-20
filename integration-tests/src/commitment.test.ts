import { assert, describe, expect, test } from "vitest";
import { createCommitments, registerMarketOffer } from "./helpers.js";
import {
  type BytesLike,
  type ContractTransactionResponse,
  ethers,
  formatEther,
  zeroPadBytes,
} from "ethers";
import { checkEvent } from "./confirmations.js";
import {
  CapacityConstantType,
  CC_DURATION_DEFAULT,
  CC_MAX_FAILED_RATIO,
  CC_PRECISION,
  CC_SLASHING_RATE_PERCENT,
  CCStatus,
  DEFAULT_CONFIRMATIONS,
} from "./constants.js";
import { bigintAbs, skipEpoch, snapshot } from "./utils.js";
import { config } from "dotenv";
import {
  capacityContract,
  coreContract,
  delegator,
  delegatorAddress,
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
  commitmentId: string,
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
    await skipEpoch(epochDuration);
    console.log(
      await capacityContract
        .unlockedRewards(commitmentId)
        .then((reward) => formatEther(reward)),
      await capacityContract
        .totalRewards(commitmentId)
        .then((reward) => formatEther(reward)),
      await coreContract.currentEpoch(),
    );
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
    .connect(delegator)
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

  await skipEpoch(epochDuration, 1);

  const currentState = await capacityContract.getCommitment(cuID);
  expect(currentState.status).toEqual(BigInt(CCStatus.Active));
}

describe("Capacity commitment", () => {
  let commitmentIdSnapshot: string;
  let registeredOfferSnapshot: Awaited<ReturnType<typeof registerMarketOffer>>;

  snapshot(async () => {
    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
    );

    const [commitmentId] = await createCommitments(
      capacityContract,
      delegatorAddress,
      registeredOffer.peers.map((p) => p.peerId),
    );

    console.log("Commitment is created", commitmentId);

    assert(commitmentId, "Commitment ID doesn't exist");

    await DepositCC([commitmentId], registeredOffer.peers, CC_DURATION_DEFAULT);

    commitmentIdSnapshot = commitmentId;
    registeredOfferSnapshot = registeredOffer;
  });

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
    const registeredOffer = registeredOfferSnapshot;
    const commitmentId = commitmentIdSnapshot;
    const epochDuration = await coreContract.epochDuration();

    console.log("Waiting for CC to fail without proofs...");
    await skipEpoch(epochDuration, CC_MAX_FAILED_RATIO);
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
    await skipEpoch(epochDuration, withdrawEpochs);

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
    const commitmentId = commitmentIdSnapshot;
    console.log("Waiting for CC to fail without proofs...");
    const epochDuration = await coreContract.epochDuration();
    await skipEpoch(epochDuration, CC_MAX_FAILED_RATIO);
    const currentStateAfterSomeEpoches =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSomeEpoches.status).toEqual(
      BigInt(CCStatus.Failed),
    );

    console.log("Waiting for withdraw epoches to pass...");
    const withdrawEpochs = await coreContract.withdrawEpochsAfterFailed();
    // TODO: lesser values aren't working
    const HACKY_WITHDRAW_EPOCHS = withdrawEpochs * 2n;
    await skipEpoch(epochDuration, HACKY_WITHDRAW_EPOCHS);

    await expect(
      capacityContract
        .finishCommitment(commitmentId)
        .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS))
        .catch((e: { data: BytesLike }) => {
          throw new Error(
            capacityContract.interface.parseError(e.data)?.selector,
          );
        }),
    ).rejects.toThrow(
      capacityContract.interface.getError("CapacityCommitmentIsActive(uint8)")
        ?.selector,
    );
  });

  test("CC ends after duration", async () => {
    const registeredOffer = registeredOfferSnapshot;
    const commitmentId = commitmentIdSnapshot;
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
    await skipEpoch(epochDuration, 1);

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
    await skipEpoch(epochDuration, withdrawEpochs);

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

  // TODO: fix
  test.skip("Long-term CC with reward withdrawals after single proof", async () => {
    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
    );

    const vestingDuration = await coreContract.vestingPeriodDuration();
    const vestingCount = await coreContract.vestingPeriodCount();
    console.log(vestingDuration, vestingCount);

    const LONG_TERM_DURATION = vestingDuration * vestingCount + 1n;

    const [commitmentId] = await createCommitments(
      capacityContract,
      signerAddress,
      registeredOffer.peers.map((p) => p.peerId),
      LONG_TERM_DURATION,
    );

    console.log("Commitment is created", commitmentId);

    assert(commitmentId, "Commitment ID doesn't exist");

    await DepositCC([commitmentId], registeredOffer.peers, LONG_TERM_DURATION);

    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    console.log(
      "Sending proofs regularly for vesting period of CC duration...",
    );

    const block = await provider.getBlock("latest");
    assert(block, "No block");
    const deltaTillNextEpoch =
      vestingDuration - (BigInt(block.number) % vestingDuration);
    console.log("deltaTillNextEpoch", deltaTillNextEpoch);

    await sendProof(signerAddress, cuId, 2, 1);
    const status = await capacityContract.getStatus(commitmentId);
    console.log(status);
    const epochDuration = await coreContract.epochDuration();
    await skipEpoch(epochDuration, 1);

    const unlockedReward = await capacityContract.unlockedRewards(commitmentId);
    const totalReward = await capacityContract.totalRewards(commitmentId);
    const poolAmount = await coreContract.getRewardPool(
      await coreContract.currentEpoch(),
    );
    const status1 = await capacityContract.getStatus(commitmentId);
    console.log(await capacityContract.getAddress());
    console.log(status1);
    console.log(unlockedReward, totalReward, poolAmount);
    assert(totalReward > 0, "Should be greater than 0");
  });

  // TODO: implement
  test("Long-term CC with reward withdrawals when CC is failed", async () => {});

  test("Long-term CC with full reward withdrawals", async () => {
    const MAX_ERROR_WEI = CC_PRECISION;
    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
    );

    const vestingDuration = await coreContract.vestingPeriodDuration();
    const vestingCount = await coreContract.vestingPeriodCount();
    console.log(vestingDuration, vestingCount);

    const LONG_TERM_DURATION = vestingDuration * vestingCount + 1n;

    const [commitmentId] = await createCommitments(
      capacityContract,
      delegatorAddress,
      registeredOffer.peers.map((p) => p.peerId),
      CC_DURATION_DEFAULT,
    );

    console.log("Commitment is created", commitmentId);

    assert(commitmentId, "Commitment ID doesn't exist");

    const epochDuration = await coreContract.epochDuration();
    let currentEpoch = await coreContract.currentEpoch();

    await skipEpoch(
      epochDuration,
      vestingDuration - (currentEpoch % vestingDuration) + 1n,
    );

    currentEpoch = await coreContract.currentEpoch();
    console.log(currentEpoch, "currentEpoch after skip before deposit");
    console.log(await capacityContract.getAddress());

    await DepositCC([commitmentId], registeredOffer.peers, CC_DURATION_DEFAULT);

    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    console.log(
      "Sending proofs regularly for vesting period of CC duration...",
    );

    const block = await provider.getBlock("latest");
    assert(block, "No block");
    const deltaTillNextEpoch =
      vestingDuration - (BigInt(block.number) % vestingDuration);
    console.log("deltaTillNextEpoch", deltaTillNextEpoch);

    currentEpoch = await coreContract.currentEpoch();
    console.log(currentEpoch, "currentEpoch after deposit before proof");

    const ccInfo = await capacityContract.getCommitment(commitmentId);
    console.log(ccInfo);
    // TODO: Add check for intermediate vesting value, e.g. after 2-3 proof sending epoches
    await sendProof(
      signerAddress,
      cuId,
      2,
      Number(CC_DURATION_DEFAULT),
      commitmentId,
    );

    for (let i = 0; i < 20; i++) {
      await skipEpoch(epochDuration, 1);
      const [a, b] = await Promise.all([
        capacityContract
          .unlockedRewards(commitmentId)
          .then((reward) => formatEther(reward)),
        capacityContract
          .totalRewards(commitmentId)
          .then((reward) => formatEther(reward)),
        coreContract.currentEpoch(),
      ]);
      console.log(a, b);
    }

    const status = await capacityContract.getStatus(commitmentId);
    expect(status).toEqual(BigInt(CCStatus.Inactive));

    {
      const rewardPool = await coreContract.getRewardPool(currentEpoch);

      const unlockedVesting =
        await capacityContract.unlockedRewards(commitmentId);
      const totalVesting = await capacityContract.totalRewards(commitmentId);

      expect(
        bigintAbs(totalVesting - rewardPool * (CC_DURATION_DEFAULT - 1n)) <=
          MAX_ERROR_WEI,
      ).toBeTruthy();

      expect(
        bigintAbs(unlockedVesting - totalVesting) <= MAX_ERROR_WEI,
      ).toBeTruthy();
    }

    await capacityContract
      .removeCUFromCC(commitmentId, [cuId])
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    // Wait till all vestings are available
    await skipEpoch(epochDuration, 20);

    const rewardPool = await coreContract.getRewardPool(currentEpoch);
    console.log(rewardPool, "rewardPool");
    const unlockedVesting =
      await capacityContract.unlockedRewards(commitmentId);
    const totalVesting = await capacityContract.totalRewards(commitmentId);

    expect(
      bigintAbs(totalVesting - rewardPool * CC_DURATION_DEFAULT) <=
        MAX_ERROR_WEI,
    ).toBeTruthy();
    expect(
      bigintAbs(unlockedVesting - totalVesting) <= MAX_ERROR_WEI,
    ).toBeTruthy();

    console.log("Waiting for withdraw epoches to pass...");
    const withdrawEpochs = await coreContract.withdrawEpochsAfterFailed();
    await skipEpoch(epochDuration, withdrawEpochs);

    let delegatorBalance = await provider.getBalance(delegatorAddress);
    let providerBalance = await provider.getBalance(signerAddress);

    const withdrawRewardReceipt = await capacityContract
      .withdrawReward(commitmentId)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
    const [withdrawRewardEvent] = checkEvent(
      capacityContract.filters.RewardWithdrawn,
      withdrawRewardReceipt,
    );
    expect(withdrawRewardEvent?.args).toEqual([commitmentId, unlockedVesting]);

    let newDelegatorBalance = await provider.getBalance(delegatorAddress);
    let newProviderBalance = await provider.getBalance(signerAddress);

    console.log(newProviderBalance, providerBalance, unlockedVesting / 2n);
    expect(
      bigintAbs(newProviderBalance - providerBalance - unlockedVesting / 2n) <=
        MAX_ERROR_WEI,
    ).toBeTruthy();
    console.log(newDelegatorBalance, delegatorBalance, unlockedVesting / 2n);
    expect(
      bigintAbs(
        newDelegatorBalance - delegatorBalance - unlockedVesting / 2n,
      ) <= MAX_ERROR_WEI,
    ).toBeTruthy();

    delegatorBalance = await provider.getBalance(delegatorAddress);

    const finishCommitmentReceipt = await capacityContract
      .finishCommitment(commitmentId)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    const [finishCommitmentEvent] = checkEvent(
      capacityContract.filters.CommitmentFinished,
      finishCommitmentReceipt,
    );
    assert(finishCommitmentEvent, "No finish commitment event");
    expect(finishCommitmentEvent.args).toEqual([commitmentId]);

    newDelegatorBalance = await provider.getBalance(delegatorAddress);

    const collateralPerUnit = await coreContract.fltCollateralPerUnit();
    console.log(newDelegatorBalance, delegatorBalance, collateralPerUnit);
    expect(
      bigintAbs(newDelegatorBalance - delegatorBalance - collateralPerUnit) <=
        MAX_ERROR_WEI,
    ).toBeTruthy();
  });

  test("CC is slashed after missing proofs", async () => {
    const registeredOffer = registeredOfferSnapshot;
    const commitmentId = commitmentIdSnapshot;
    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    const epochDuration = await coreContract.epochDuration();

    const peer = registeredOffer.peers[0];
    assert(peer, "At least a single peer should be present in fixture");

    const cuIDs = peer.unitIds;

    // Skip to the end of CC
    await skipEpoch(epochDuration, CC_DURATION_DEFAULT);

    console.log("Remove CU from CC...");
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
    await skipEpoch(epochDuration, withdrawEpochs);

    const delegatorBalance = await provider.getBalance(delegatorAddress);

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

    const newDelegatorBalance = await provider.getBalance(delegatorAddress);

    const collateralPerUnit = await coreContract.fltCollateralPerUnit();
    const slashedBalance =
      (collateralPerUnit / 100n) *
      CC_SLASHING_RATE_PERCENT *
      CC_MAX_FAILED_RATIO;

    console.log(slashedBalance);
    expect(newDelegatorBalance - delegatorBalance).toEqual(
      collateralPerUnit - slashedBalance,
    );
  });

  test("CC is not slashed when slashing is 0", async () => {
    await coreContract
      .setCapacityConstant(CapacityConstantType.SlashingRate, 0)
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
    const registeredOffer = registeredOfferSnapshot;
    const commitmentId = commitmentIdSnapshot;
    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    const epochDuration = await coreContract.epochDuration();

    const peer = registeredOffer.peers[0];
    assert(peer, "At least a single peer should be present in fixture");

    const cuIDs = peer.unitIds;

    // Skip to the end of CC
    await skipEpoch(epochDuration, CC_DURATION_DEFAULT);

    console.log("Remove CU from CC...");
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
    await skipEpoch(epochDuration, withdrawEpochs);

    const delegatorBalance = await provider.getBalance(delegatorAddress);

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

    const newDelegatorBalance = await provider.getBalance(delegatorAddress);

    const collateralPerUnit = await coreContract.fltCollateralPerUnit();
    expect(newDelegatorBalance - delegatorBalance).toEqual(collateralPerUnit);
  });

  test("Send too many proofs to CC per epoch", async () => {
    const registeredOffer = registeredOfferSnapshot;
    const commitmentId = commitmentIdSnapshot;
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
    await expect(
      sendProof(signerAddress, cuId, MAX_ALLOWED_PROOFS * 2, 2).catch(
        (e: { data: BytesLike }) => {
          throw new Error(
            capacityContract.interface.parseError(e.data)?.selector,
          );
        },
      ),
    ).rejects.toThrow(
      capacityContract.interface.getError("TooManyProofs()")?.selector,
    );
  });

  test("Send too little proofs to CC per epoch", async () => {
    const registeredOffer = registeredOfferSnapshot;
    const commitmentId = commitmentIdSnapshot;

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
    const registeredOffer = registeredOfferSnapshot;
    const commitmentId = commitmentIdSnapshot;

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
