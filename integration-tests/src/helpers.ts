import { getDefaultOfferFixture, randomCID } from "./fixtures.js";
import { type ICapacity, type IMarket } from "@fluencelabs/deal-ts-clients";
import { DEFAULT_CONFIRMATIONS } from "./constants.js";
import { assert, expect } from "vitest";
import { checkEvents } from "./confirmations.js";

export async function registerMarketOffer(
  market: IMarket,
  signerAddress: string,
  paymentTokenAddress: string,
) {
  const registeredOffer = getDefaultOfferFixture(
    signerAddress,
    paymentTokenAddress,
  );

  console.log("Register Provider by setProviderInfo...");
  const setProviderInfoTx = await market.setProviderInfo(
    "CI_PROVIDER",
    randomCID(),
  );
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
    offerId: lastMarketOffer.args.offerId,
    ...registeredOffer,
  };
}

export async function createCommitments(
  capacity: ICapacity,
  signerAddress: string,
  peerIds: string[],
  fromBlock: number,
) {
  const capacityMinDuration = await capacity.minDuration();

  for (const peerId of peerIds) {
    // bytes32 peerId, uint256 duration, address delegator, uint256 rewardDelegationRate
    console.log(
      "Create commitment for peer: ",
      peerId,
      " with duration: ",
      capacityMinDuration,
      "...",
    );
    const createCommitmentTx = await capacity.createCommitment(
      peerId,
      capacityMinDuration,
      signerAddress,
      1,
    );
    await createCommitmentTx.wait(DEFAULT_CONFIRMATIONS);
  }

  const createdCommitments = peerIds.length;

  // Fetch created commitmentIds from chain.
  const filterCreatedCC = capacity.filters.CommitmentCreated;
  const capacityCommitmentCreatedEvents = await capacity.queryFilter(
    filterCreatedCC,
    fromBlock,
  );
  const capacityCommitmentCreatedEventsLast = capacityCommitmentCreatedEvents
    .reverse()
    .slice(0, createdCommitments);
  // 1 CC for each peer.
  expect(capacityCommitmentCreatedEventsLast.length).toBe(createdCommitments);

  return capacityCommitmentCreatedEventsLast.map(
    (event) => event.args.commitmentId,
  );
}

export async function depositCapacity(
  capacity: ICapacity,
  commitmentIds: string[],
) {
  let collateralToApproveCommitments = 0n;

  for (const commitmentId of commitmentIds) {
    const commitment = await capacity.getCommitment(commitmentId);
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

  const depositCollateralTx = await capacity.depositCollateral(commitmentIds, {
    value: collateralToApproveCommitments,
  });
  await depositCollateralTx.wait(DEFAULT_CONFIRMATIONS);
}
