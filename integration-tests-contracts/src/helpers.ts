import { getDefaultOfferFixture, randomCID } from "./fixtures.js";
import { type ICapacity, type IMarket } from "@fluencelabs/deal-ts-clients";
import {
  CC_DURATION_DEFAULT,
  CC_PRECISION,
  DEFAULT_CONFIRMATIONS, DEFAULT_DELEGATION_RATE
} from "./constants.js";
import { assert, expect } from "vitest";
import { checkEvent, checkEvents } from "./confirmations.js";

export interface RegisterMarketOfferReturnValue
  extends Omit<
    ReturnType<typeof getDefaultOfferFixture>,
    "minProtocolVersion" | "maxProtocolVersion"
  > {
  offerId: string;
  provider: string;
  minProtocolVersion: bigint;
  maxProtocolVersion: bigint;
}

// TODO: Refactor. Return value is dubious.
export async function registerMarketOffer(
  market: IMarket,
  signerAddress: string,
  paymentTokenAddress: string,
  peers: number = 1,
  cus: number = 1,
): Promise<RegisterMarketOfferReturnValue> {
  const registeredOffer = getDefaultOfferFixture(
    signerAddress,
    paymentTokenAddress,
    peers,
    cus,
  );

  console.log("Register Provider by setProviderInfo...");
  const appCID = randomCID();
  const setProviderInfoTx = await market.setProviderInfo("CI_PROVIDER", appCID);
  await setProviderInfoTx.wait(DEFAULT_CONFIRMATIONS);

  const tx = await market.registerMarketOffer(
    registeredOffer.minPricePerWorkerEpoch,
    registeredOffer.paymentToken,
    registeredOffer.effectors,
    registeredOffer.peers,
    registeredOffer.minProtocolVersion,
    registeredOffer.maxProtocolVersion,
  );
  await tx.wait(DEFAULT_CONFIRMATIONS);

  const events = await checkEvents(
    market,
    market.filters.MarketOfferRegistered,
    1,
    tx,
  );

  const lastMarketOffer = events.pop();
  assert(lastMarketOffer, "There is no market offer");

  return {
    peers: registeredOffer.peers,
    offerId: lastMarketOffer.args.offerId,
    effectors: lastMarketOffer.args.effectors.map((effector) => ({
      hash: effector.hash,
      prefixes: effector.prefixes,
    })),
    paymentToken: lastMarketOffer.args.paymentToken,
    provider: lastMarketOffer.args.provider,
    minProtocolVersion: lastMarketOffer.args.minProtocolVersion,
    maxProtocolVersion: lastMarketOffer.args.maxProtocolVersion,
    minPricePerWorkerEpoch: lastMarketOffer.args.minPricePerWorkerEpoch,
  };
}

export async function createCommitments(
  capacity: ICapacity,
  delegator: string,
  peerIds: string[],
  _duration: bigint | undefined = undefined,
) {
  const duration = _duration ?? CC_DURATION_DEFAULT;
  const fromBlock = await capacity.runner?.provider?.getBlock("latest");
  assert(fromBlock, "Not current block");

  for (const peerId of peerIds) {
    // bytes32 peerId, uint256 duration, address delegator, uint256 rewardDelegationRate
    console.log(
      "Create commitment for peer: ",
      peerId,
      " with duration: ",
      duration,
      "...",
    );
    const createCommitmentTx = await capacity.createCommitment(
      peerId,
      duration,
      delegator,
      DEFAULT_DELEGATION_RATE,
    );
    await createCommitmentTx.wait(DEFAULT_CONFIRMATIONS);
  }

  const createdCommitments = peerIds.length;

  // Fetch created commitmentIds from chain.
  const filterCreatedCC = capacity.filters.CommitmentCreated;
  const capacityCommitmentCreatedEvents = await capacity.queryFilter(
    filterCreatedCC,
    fromBlock.number,
  );
  if (capacityCommitmentCreatedEvents.length != peerIds.length) {
      console.log("unexpected created commitment number: expected =", peerIds.length, "actual =", capacityCommitmentCreatedEvents.length);
  }
  // 1 CC for each peer.
  expect(capacityCommitmentCreatedEvents.length).toBe(createdCommitments);

  return capacityCommitmentCreatedEvents.map(
    (event) => event.args.commitmentId,
  );
}

export async function depositCollateral(
  capacity: ICapacity,
  commitmentIds: string[],
) {
  let collateralToApproveCommitments = 0n;

  for (const commitmentId of commitmentIds) {
    const commitment = await capacity.getCommitment(commitmentId);
    console.log(commitment.collateralPerUnit, "collateralPerUnit");
    const collateralToApproveCommitment =
      commitment.collateralPerUnit * commitment.unitCount;
    console.log(
      "Collateral for commitmentId: ",
      commitmentId,
      " = ",
      collateralToApproveCommitment,
      "...",
    );

    collateralToApproveCommitments += collateralToApproveCommitment;
  }

  console.info(
    "Deposit collateral for commitmentIds: ",
    commitmentIds.join(","),
    "...",
  );

  const depositCollateralReceipt = await capacity
    .depositCollateral(commitmentIds, {
      value: collateralToApproveCommitments,
    })
    .then((tx) => tx.wait(DEFAULT_CONFIRMATIONS));

  const depositEvents = checkEvent(
    capacity.filters.CollateralDeposited,
    depositCollateralReceipt,
  );
  expect(depositEvents.length).toEqual(commitmentIds.length);
  const activatedEvents = checkEvent(
    capacity.filters.CommitmentActivated,
    depositCollateralReceipt,
  );
  expect(activatedEvents.length).toEqual(commitmentIds.length);
}
