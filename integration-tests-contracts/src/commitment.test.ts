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
  DEFAULT_CONFIRMATIONS, DEFAULT_DELEGATION_RATE
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
  provider, signer,
  signerAddress
} from "./env.js";
import type { Peer } from "./fixtures.js";

config({ path: [".env", ".env.local"] });

async function sendProof(
    sender: string,
    cuId: string,
    proofs: number,
    epoches: number,
) {
  await sendProof2(sender, [cuId], proofs, epoches);
}

async function sendProof2(
  sender: string,
  cuIds: [string],
  proofs: number,
  epoches: number,
) {
  const epochDuration = await coreContract.epochDuration();
  const difficulty = await coreContract.difficulty();
  let sentProofRounds = 0;
  let currentNonce = await provider.getTransactionCount(sender);

  while (sentProofRounds < epoches) {
    for (let cuId of cuIds) {
      const txs: Array<ContractTransactionResponse> = [];
      for (let i = 0; i < proofs; i += 1) {
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
      console.log(`Submitted ${proofs} proofs for CU ${cuId}`);
    }
    await skipEpoch(epochDuration);
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
  const unitcount:  {[key: string]: bigint} = {};
  let totalUnitcount = 0n;

  for (let commitmentId of commitmentIds) {
    unitcount[commitmentId] = (await capacityContract.getCommitment(commitmentId)).unitCount
    totalUnitcount += unitcount[commitmentId];
  }

  console.log("Depositing collateral...");
  const depositCollateralReceipt = await capacityContract
    .connect(delegator)
    .depositCollateral(commitmentIds, {
      value: collateralPerUnit * totalUnitcount,
    })
    .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

  const collateralDepositedEvents = checkEvent(
    capacityContract.filters.CollateralDeposited,
    depositCollateralReceipt,
  );
  expect(collateralDepositedEvents.map((event) => event.args)).toEqual(
    commitmentIds.map((ccID) => [ccID, unitcount[ccID] * collateralPerUnit]),
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

/**
 *  Assumes default provider/delegator addresses and delegation rate.
 *  Assumes reward pool is the same for all epochs.
 *
 * @param vestingCount
 * @param rewardPool
 * @param commitmentId
 * @param unlockedRewardedEpochs
 * @param unlockedRewardedParts
 * @param totalRewardedEpochs
 */
async function checkWithdrawalFull(
  vestingCount: bigint,
  rewardPool: bigint,
  commitmentId: string,
  unlockedRewardedEpochs: bigint,
  unlockedRewardedParts: bigint,
  totalRewardedEpochs: bigint
) {
  const unlockedReward = await capacityContract.unlockedRewards(commitmentId);
  const totalReward = await capacityContract.totalRewards(commitmentId);

  // calculations to match rounding on contracts
  const vestingRewardPart = rewardPool / vestingCount;
  const expectedTotalReward = vestingRewardPart * vestingCount * totalRewardedEpochs;
  const expectedUnlockedReward = vestingRewardPart * vestingCount * unlockedRewardedEpochs + vestingRewardPart * unlockedRewardedParts;

  const delegatorReward = unlockedReward * DEFAULT_DELEGATION_RATE / CC_PRECISION;
  const providerReward = unlockedReward - delegatorReward;


  expect(totalReward).toEqual(expectedTotalReward);
  expect(unlockedReward).toEqual(expectedUnlockedReward);

  const signerBalance = await provider.getBalance(signerAddress);
  const delegatorBalance = await provider.getBalance(delegatorAddress);

  const withdrawRewardReceipt = await capacityContract
    .withdrawReward(commitmentId)
    .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));


  const [withdrawRewardEvent] = checkEvent(
    capacityContract.filters.RewardWithdrawn,
    withdrawRewardReceipt,
  );

  const newSignerBalance = await provider.getBalance(signerAddress);
  const newDelegatorBalance = await provider.getBalance(delegatorAddress);

  expect(withdrawRewardEvent?.args).toEqual([commitmentId, unlockedReward]);

  console.log(`signer: ${signerBalance} => ${newSignerBalance} (${newSignerBalance - signerBalance})`);
  console.log(`delega: ${delegatorBalance} => ${newDelegatorBalance} (${newDelegatorBalance - delegatorBalance})`);
  // rounding on contracts looks different from one in js, so here we use CC_PRECISION to account for it
  expect(bigintAbs(newSignerBalance - signerBalance - providerReward)).toBeLessThanOrEqual(CC_PRECISION)
  expect(bigintAbs(newDelegatorBalance - delegatorBalance - delegatorReward)).toBeLessThanOrEqual(CC_PRECISION);
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

  // lgtm, passes
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

  // lgtm, passes
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

  // lgtm, passes
  test("Cannot finish CC without removing CUs", async () => {
    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
      1,
      2
    );

    const currentEpoch = await coreContract.currentEpoch();
    const epochDuration = await coreContract.epochDuration();
    const minProofsPerEpoch = await coreContract.minProofsPerEpoch()
    const cuId1 = registeredOffer.peers[0]?.unitIds[0];
    const cuId2 = registeredOffer.peers[0]?.unitIds[1];


    // create a really long commitment
    const [commitmentId] = await createCommitments(
      capacityContract,
      delegatorAddress,
      registeredOffer.peers.map((p) => p.peerId),
      CC_DURATION_DEFAULT,
    );

    await DepositCC([commitmentId], registeredOffer.peers, CC_DURATION_DEFAULT);

    await sendProof2(signerAddress, [cuId1, cuId2], Number(minProofsPerEpoch), CC_DURATION_DEFAULT);
    // Required to trigger correct check in contract
    await capacityContract.removeCUFromCC(commitmentId, [cuId1]);

    await expect(
      capacityContract
        .finishCommitment(commitmentId)
        .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS))
        .catch((e: { data: BytesLike }) => {
          console.log(e);
          throw new Error(
            capacityContract.interface.parseError(e.data)?.selector,
          );
        }),
    ).rejects.toThrow(
      capacityContract.interface.getError("For finish commitment all units should be exited")
        ?.selector,
    );
  });

  // lgtm, passes
  test("CC ends after duration", async () => {
    const registeredOffer = registeredOfferSnapshot;
    const epochDuration = await coreContract.epochDuration();
    const commitmentId = commitmentIdSnapshot;
    const cuId = registeredOffer.peers[0]?.unitIds[0];
    const minProofsPerEpoch = Number(await coreContract.minProofsPerEpoch())
    assert(cuId, "cuID not defined");

    console.log("Sending proofs...");
    await sendProof(signerAddress, cuId, minProofsPerEpoch, Number(CC_DURATION_DEFAULT - 1n));

    const currentStateAfterSentProofs =
      await capacityContract.getCommitment(commitmentId);
    expect(currentStateAfterSentProofs.status).toEqual(BigInt(CCStatus.Active));

    // Send last proof
    await sendProof(signerAddress, cuId, minProofsPerEpoch, 1);

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

  // lgtm, passes (may be flaky)
  test("Long-term CC with reward withdrawals after single proof", async () => {
    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
    );

    const vestingDuration = await coreContract.vestingPeriodDuration();
    const vestingCount = await coreContract.vestingPeriodCount();
    const epochDuration = await coreContract.epochDuration();
    const minProofsPerEpoch = await coreContract.minProofsPerEpoch();
    console.log(`vesting params: duration ${vestingDuration}, count ${vestingCount}`);

    const LONG_TERM_DURATION = vestingDuration * vestingCount + 1n;

    const [commitmentId] = await createCommitments(
      capacityContract,
      delegatorAddress,
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

    // reward pool at the epoch we will be rewarded for
    const rewardPool = await coreContract.getRewardPool(
      await coreContract.currentEpoch(),
    );
    // 2 epochs: for first we get reward, second is to make snapshot for first
    await sendProof(signerAddress, cuId, Number(minProofsPerEpoch), 2);
    // wait till the first part of the reward is definitely vested
    await skipEpoch(epochDuration, vestingDuration - 2n);

    await checkWithdrawalFull(vestingCount, rewardPool, commitmentId, 0n, 1n, 1n);
  });

  // looks good, but needs fix to work with default MAX_FAILED_RATIO = 3
  test("removeCUFromCC fail to add rewards to vesting", async () => {
    console.log("signer_balance", formatEther(await provider.getBalance(signerAddress)));
    const MAX_ERROR_WEI = CC_PRECISION;
    // fisrt, register a peer with 2 CU
    const registeredOffer = await registerMarketOffer(
        marketContract,
        signerAddress,
        paymentTokenAddress,
        1,
        2
    );

    const currentEpoch = await coreContract.currentEpoch();
    const epochDuration = await coreContract.epochDuration();
    const vestingDuration = await coreContract.vestingPeriodDuration();
    const vestingCount = await coreContract.vestingPeriodCount();
    const rewardPool = await coreContract.getRewardPool(currentEpoch);
    console.log(vestingDuration, vestingCount);


    // create a really long commitment
    const [commitmentId] = await createCommitments(
        capacityContract,
        delegatorAddress,
        registeredOffer.peers.map((p) => p.peerId),
        50n,
    );

    console.log("Commitment is created", commitmentId);

    assert(commitmentId, "Commitment ID doesn't exist");

    // set next epoch, so the vesting for the first epoch will happen right at the vesting point
    const waitEpoch = (2n * vestingDuration - 0n) - (await coreContract.currentEpoch() % vestingDuration);
    await skipEpoch(epochDuration, waitEpoch);
    await DepositCC([commitmentId], registeredOffer.peers, 50n);

    const cuId1 = registeredOffer.peers[0]?.unitIds[0];
    const cuId2 = registeredOffer.peers[0]?.unitIds[1];
    assert(cuId1, "cuID1 not defined");
    assert(cuId2, "cuID2 not defined");

    {
      const currentEpoch = await coreContract.currentEpoch();
      console.log(currentEpoch, "currentEpoch after deposit before proof");
    }

    const ccInfo = await capacityContract.getCommitment(commitmentId);
    console.log(ccInfo);

    const minProofsPerEpoch = await coreContract.minProofsPerEpoch();
    const maxProofsPerEpoch = await coreContract.maxProofsPerEpoch();
    const maxFailedRatio = await coreContract.maxFailedRatio();
    console.log(`min proofs ${minProofsPerEpoch}, max prrofs ${maxProofsPerEpoch}, max_failed_ratio ${maxFailedRatio}`)

    // send minimal number of proofs for CU2 at the start and dont send any more. That will hold vesting for CU2 until removeCUFromCC
    console.log(`min proofs ${minProofsPerEpoch}, max prrofs ${maxProofsPerEpoch}, max_failed_ratio ${maxFailedRatio}`)
    console.log("epoch: ", await coreContract.currentEpoch())

    // send first proof for CU2
    await sendProof(signerAddress, cuId2, Number(minProofsPerEpoch), 1);
    await skipEpoch(epochDuration, 1n);
    //const epochAfterFirstProof = await coreContract.currentEpoch();
    //const epochsToWait = vestingDuration - (epochAfterFirstProof % vestingDuration);
    // No vesting should happen
    expect(await capacityContract.totalRewards(commitmentId)).toBe(0n);
    // ensure that vesting start for CU1 will be different from "startEpoch" one
    //await skipEpoch(epochDuration, epochsToWait);
    console.log("epoch: ", await coreContract.currentEpoch())
    console.log("commitment status: ", await capacityContract.getStatus(commitmentId))
    // send minimal number of proofs for CU1 for 1 epochs to record vesting
    await sendProof(signerAddress, cuId1, Number(minProofsPerEpoch), 1);
    // still no vesting should happen
    expect(await capacityContract.totalRewards(commitmentId)).toBe(0n);
    await sendProof(signerAddress, cuId1, Number(minProofsPerEpoch), 1);
    {
      const totalRewards = await capacityContract.totalRewards(commitmentId)
      expect(bigintAbs(totalRewards)).toBeLessThanOrEqual(1n * rewardPool);
    }
    // wait for many epochs to ensure CC is failed
    await skipEpoch(epochDuration, 40n);
    const status = await capacityContract.getStatus(commitmentId);
    expect(status).toEqual(BigInt(CCStatus.Failed));
    // should properly vest all rewards for CU2 starting epoch
    await capacityContract
        .removeCUFromCC(commitmentId, [cuId1, cuId2])
        .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));
  });

  // lgtm, mostly passes but may be flaky with 10x lower error
  test("Long-term CC with full reward withdrawals", async () => {
    const registeredOffer = await registerMarketOffer(
      marketContract,
      signerAddress,
      paymentTokenAddress,
    );

    const vestingDuration = await coreContract.vestingPeriodDuration();
    const vestingCount = await coreContract.vestingPeriodCount();
    const epochDuration = await coreContract.epochDuration();
    const minProofsPerEpoch = await coreContract.minProofsPerEpoch();
    // test expects that reward pool won't change during run
    const rewardPool = await coreContract.getRewardPool(await coreContract.currentEpoch());
    console.log(`vesting params: duration ${vestingDuration}, count ${vestingCount}`);

    const [commitmentId] = await createCommitments(
      capacityContract,
      delegatorAddress,
      registeredOffer.peers.map((p) => p.peerId),
      CC_DURATION_DEFAULT,
    );

    const maxRewardPool = await coreContract.maxRewardPerEpoch();
    // add some money to the Capacity contract, so it can pay out rewards
    await signer.sendTransaction({
      to: capacityContract,
      value: CC_DURATION_DEFAULT * maxRewardPool
    }).then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    console.log("Commitment is created", commitmentId);

    assert(commitmentId, "Commitment ID doesn't exist");

    await DepositCC([commitmentId], registeredOffer.peers, CC_DURATION_DEFAULT);

    const cuId = registeredOffer.peers[0]?.unitIds[0];
    assert(cuId, "cuID not defined");

    console.log(
      "Sending proofs regularly for vesting period of CC duration...",
    );

    await sendProof(signerAddress, cuId, minProofsPerEpoch, Number(CC_DURATION_DEFAULT));

    const status = await capacityContract.getStatus(commitmentId);
    expect(status).toEqual(BigInt(CCStatus.Inactive));


    await capacityContract
      .removeCUFromCC(commitmentId, [cuId])
      .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

    // Wait till all vestings are available
    await skipEpoch(epochDuration, vestingDuration * vestingCount);


    await checkWithdrawalFull(vestingCount, rewardPool, commitmentId, CC_DURATION_DEFAULT, 0n, CC_DURATION_DEFAULT);

    const delegatorBalance = await provider.getBalance(delegatorAddress);

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
    console.log(newDelegatorBalance, delegatorBalance, collateralPerUnit);
    expect(
      newDelegatorBalance - delegatorBalance - collateralPerUnit,
    ).toEqual(0n);
  });

  // flaky
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

  // TODO: flaky for no known reason, but test case itself looks good
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

  // lgtm, passes
  test("Invalid proofs are rejected", async () => {
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
