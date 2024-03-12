import {
  CapacityCommitmentStatus,
  createOrLoadCapacityCommitmentStatsPerEpoch,
  createOrLoadCapacityCommitmentToComputeUnit,
  createOrLoadComputeUnitPerEpochStat,
  createOrLoadGraphNetwork,
  UNO_BIG_INT,
  ZERO_BIG_INT,
} from "../models";
import {
  CapacityCommitment,
  ComputeUnit,
  Peer,
  Provider,
  SubmittedProof,
} from "../../generated/schema";
import {
  CollateralDeposited,
  CommitmentActivated,
  CommitmentCreated,
  CommitmentFinished,
  CommitmentRemoved,
  CommitmentStatsUpdated,
  ProofSubmitted,
  RewardWithdrawn,
  UnitActivated,
  UnitDeactivated,
  WhitelistAccessGranted,
  WhitelistAccessRevoked,
} from "../../generated/Capacity/Capacity";
import {
  calculateEpoch,
  calculateNextFailedCCEpoch,
  getCapacityMaxFailedRatio,
  getMinRequiredProofsPerEpoch,
} from "../contracts";
import { Initialized } from "../../generated/Capacity/Capacity";
import { BigInt } from "@graphprotocol/graph-ts";
import { formatAddress } from "./utils";
import { log } from "@graphprotocol/graph-ts/index";

export function handleWhitelistAccessGranted(
  event: WhitelistAccessGranted,
): void {
  let provider = Provider.load(event.params.account.toHexString()) as Provider;
  provider.approved = true;
  provider.save();
}

export function handleWhitelistAccessRevoked(
  event: WhitelistAccessRevoked,
): void {
  let provider = Provider.load(event.params.account.toHexString()) as Provider;
  provider.approved = false;
  provider.save();
}

export function handleInitialized(event: Initialized): void {
  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.capacityMaxFailedRatio = getCapacityMaxFailedRatio(
    event.address,
  ).toI32();
  graphNetwork.capacityContractAddress = event.address.toHexString();
  graphNetwork.minRequiredProofsPerEpoch = getMinRequiredProofsPerEpoch(
    event.address,
  ).toI32();
  graphNetwork.save();
}

export function handleCommitmentCreated(event: CommitmentCreated): void {
  // TODO: rm those logs if phantom error does not occur.
  log.info("[handleCommitmentCreated] Start...", []);
  let commitment = new CapacityCommitment(
    event.params.commitmentId.toHexString(),
  );
  log.info("event.params.commitmentId.toHexString(): {}", [
    event.params.commitmentId.toHexString(),
  ]);
  log.info("event.params.peerId.toHexString(): {}", [
    event.params.peerId.toHexString(),
  ]);
  // Load or create peer.
  let peer = Peer.load(event.params.peerId.toHexString()) as Peer;
  log.info("peer loaded successfully: {}", [peer.id]);

  commitment.peer = peer.id;
  commitment.provider = peer.provider;
  commitment.rewardWithdrawn = ZERO_BIG_INT;
  commitment.status = CapacityCommitmentStatus.WaitDelegation;
  commitment.collateralPerUnit = event.params.fltCollateralPerUnit;
  commitment.createdAt = event.block.timestamp;
  commitment.duration = event.params.duration;
  commitment.rewardDelegatorRate = event.params.rewardDelegationRate.toI32();
  commitment.delegator = formatAddress(event.params.delegator);
  commitment.activeUnitCount = 0;
  commitment.startEpoch = ZERO_BIG_INT;
  commitment.endEpoch = ZERO_BIG_INT;
  commitment.totalFailCount = 0;
  commitment.failedEpoch = ZERO_BIG_INT;
  commitment.exitedUnitCount = 0;
  commitment.nextCCFailedEpoch = ZERO_BIG_INT;
  commitment.computeUnitsCount = 0;
  commitment.nextAdditionalActiveUnitCount = 0;
  commitment.snapshotEpoch = ZERO_BIG_INT;
  commitment.deleted = false;
  commitment.totalCollateral = ZERO_BIG_INT;
  commitment.submittedProofsCount = 0;
  commitment.save();

  peer.currentCapacityCommitment = commitment.id;
  peer.save();

  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.capacityCommitmentsTotal =
    graphNetwork.capacityCommitmentsTotal.plus(UNO_BIG_INT);
  graphNetwork.save();
}

// It is supposed that collateral deposited at the same time as commitment activated
//  (the same tx).
export function handleCommitmentActivated(event: CommitmentActivated): void {
  let commitment = CapacityCommitment.load(
    event.params.commitmentId.toHexString(),
  ) as CapacityCommitment;
  commitment.status = CapacityCommitmentStatus.WaitStart;
  commitment.startEpoch = event.params.startEpoch;
  commitment.endEpoch = event.params.endEpoch;
  commitment.activeUnitCount = event.params.unitIds.length;

  commitment.computeUnitsCount = event.params.unitIds.length;
  for (let i = 0; i < event.params.unitIds.length; i++) {
    const computeUnitId = event.params.unitIds[i].toHexString();
    // We rely on contract logic that it is not possible to emit event with not existing CUs.
    //  Also, we relay that previously we save computeUnitId successfully in prev. handler.
    const computeUnit = ComputeUnit.load(computeUnitId) as ComputeUnit;
    createOrLoadCapacityCommitmentToComputeUnit(commitment.id, computeUnit.id);
  }
  commitment.nextAdditionalActiveUnitCount = 0;
  const graphNetwork = createOrLoadGraphNetwork();
  commitment.snapshotEpoch = calculateEpoch(
    event.block.timestamp,
    BigInt.fromI32(graphNetwork.initTimestamp),
    BigInt.fromI32(graphNetwork.coreEpochDuration),
  );

  const _calculatedFailedEpoch = calculateNextFailedCCEpoch(
    BigInt.fromString(graphNetwork.capacityMaxFailedRatio.toString()),
    BigInt.fromString(commitment.computeUnitsCount.toString()),
    BigInt.fromString(commitment.activeUnitCount.toString()),
    BigInt.fromString(commitment.nextAdditionalActiveUnitCount.toString()),
    BigInt.fromString(commitment.totalFailCount.toString()),
    BigInt.fromString(commitment.snapshotEpoch.toString()),
  );
  commitment.nextCCFailedEpoch = _calculatedFailedEpoch;
  commitment.save();

  let peer = Peer.load(event.params.peerId.toHexString()) as Peer;
  peer.currentCCCollateralDepositedAt = event.params.startEpoch;
  peer.currentCCEndEpoch = event.params.endEpoch;
  peer.currentCCNextCCFailedEpoch = _calculatedFailedEpoch;
  peer.save();
}

export function handleCollateralDeposited(event: CollateralDeposited): void {
  let commitment = CapacityCommitment.load(
    event.params.commitmentId.toHexString(),
  ) as CapacityCommitment;
  commitment.totalCollateral = event.params.totalCollateral;
  commitment.save();
}

export function handleCommitmentRemoved(event: CommitmentRemoved): void {
  let commitment = CapacityCommitment.load(
    event.params.commitmentId.toHexString(),
  ) as CapacityCommitment;
  commitment.deleted = true;
  commitment.save();

  let peer = Peer.load(commitment.peer) as Peer;
  peer.currentCapacityCommitment = null;
  peer.currentCCCollateralDepositedAt = ZERO_BIG_INT;
  peer.currentCCEndEpoch = ZERO_BIG_INT;
  peer.save();
}

export function handleCommitmentFinished(event: CommitmentFinished): void {
  let commitment = CapacityCommitment.load(
    event.params.commitmentId.toHexString(),
  ) as CapacityCommitment;
  commitment.status = CapacityCommitmentStatus.Removed;
  commitment.save();

  let peer = Peer.load(commitment.peer) as Peer;
  peer.currentCapacityCommitment = null;
  peer.currentCCCollateralDepositedAt = ZERO_BIG_INT;
  peer.currentCCEndEpoch = ZERO_BIG_INT;
  peer.save();
}

export function handleCommitmentStatsUpdated(
  event: CommitmentStatsUpdated,
): void {
  // Handle current commitment stats.
  let commitment = CapacityCommitment.load(
    event.params.commitmentId.toHexString(),
  ) as CapacityCommitment;

  commitment.totalFailCount = event.params.totalFailCount.toI32();
  commitment.exitedUnitCount = event.params.exitedUnitCount.toI32();
  commitment.activeUnitCount = event.params.activeUnitCount.toI32();
  commitment.nextAdditionalActiveUnitCount =
    event.params.nextAdditionalActiveUnitCount.toI32();

  const graphNetwork = createOrLoadGraphNetwork();
  // Calculate next failed epoch.
  const _calculatedFailedEpoch = calculateNextFailedCCEpoch(
    BigInt.fromString(graphNetwork.capacityMaxFailedRatio.toString()),
    BigInt.fromString(commitment.computeUnitsCount.toString()),
    BigInt.fromString(commitment.activeUnitCount.toString()),
    BigInt.fromString(commitment.nextAdditionalActiveUnitCount.toString()),
    BigInt.fromString(commitment.totalFailCount.toString()),
    BigInt.fromString(event.params.changedEpoch.toString()),
  );
  commitment.nextCCFailedEpoch = _calculatedFailedEpoch;

  // Additional check if failedEpoch could be committed in CC model.
  const currentEpoch = calculateEpoch(
    event.block.timestamp,
    BigInt.fromI32(graphNetwork.initTimestamp),
    BigInt.fromI32(graphNetwork.coreEpochDuration),
  );
  if (currentEpoch >= _calculatedFailedEpoch) {
    commitment.failedEpoch = currentEpoch;
    commitment.status = CapacityCommitmentStatus.Failed;
  }
  commitment.save();

  let peer = Peer.load(commitment.peer) as Peer;
  peer.currentCCNextCCFailedEpoch = _calculatedFailedEpoch;
  peer.save();

  // Save commitment stat for evolution graph.
  let capacityCommitmentStatsPerEpoch =
    createOrLoadCapacityCommitmentStatsPerEpoch(
      commitment.id,
      currentEpoch.toString(),
    );
  capacityCommitmentStatsPerEpoch.totalFailCount = commitment.totalFailCount;
  capacityCommitmentStatsPerEpoch.exitedUnitCount = commitment.exitedUnitCount;
  capacityCommitmentStatsPerEpoch.activeUnitCount = commitment.activeUnitCount;
  capacityCommitmentStatsPerEpoch.nextAdditionalActiveUnitCount =
    commitment.nextAdditionalActiveUnitCount;
  capacityCommitmentStatsPerEpoch.currentCCNextCCFailedEpoch =
    commitment.nextCCFailedEpoch;
  if (capacityCommitmentStatsPerEpoch.blockNumberStart > event.block.number) {
    capacityCommitmentStatsPerEpoch.blockNumberStart = event.block.number;
  }
  if (capacityCommitmentStatsPerEpoch.blockNumberEnd < event.block.number) {
    capacityCommitmentStatsPerEpoch.blockNumberEnd = event.block.number;
  }
  capacityCommitmentStatsPerEpoch.save();
}

export function handleUnitActivated(event: UnitActivated): void {}

export function handleUnitDeactivated(event: UnitDeactivated): void {}

export function handleProofSubmitted(event: ProofSubmitted): void {
  let proofSubmitted = new SubmittedProof(event.transaction.hash.toHexString());
  let capacityCommitment = CapacityCommitment.load(
    event.params.commitmentId.toHexString(),
  ) as CapacityCommitment;
  let computeUnit = ComputeUnit.load(
    event.params.unitId.toHexString(),
  ) as ComputeUnit;
  const provider = Provider.load(computeUnit.provider) as Provider;
  let graphNetwork = createOrLoadGraphNetwork();
  const currentEpoch = calculateEpoch(
    event.block.timestamp,
    BigInt.fromI32(graphNetwork.initTimestamp),
    BigInt.fromI32(graphNetwork.coreEpochDuration),
  );
  let capacityCommitmentStatsPerEpoch =
    createOrLoadCapacityCommitmentStatsPerEpoch(
      capacityCommitment.id,
      currentEpoch.toString(),
    );

  proofSubmitted.capacityCommitmentStatsPerEpoch =
    capacityCommitmentStatsPerEpoch.id;
  proofSubmitted.capacityCommitment = capacityCommitment.id;
  proofSubmitted.computeUnit = computeUnit.id;
  proofSubmitted.provider = provider.id;
  proofSubmitted.peer = computeUnit.peer;
  proofSubmitted.localUnitNonce = event.params.localUnitNonce;
  proofSubmitted.createdAt = event.block.timestamp;
  proofSubmitted.createdEpoch = currentEpoch;
  proofSubmitted.save();

  // Update stats below.
  capacityCommitment.submittedProofsCount =
    capacityCommitment.submittedProofsCount + 1;
  capacityCommitment.save();

  computeUnit.submittedProofsCount =
    capacityCommitment.submittedProofsCount + 1;
  computeUnit.save();

  graphNetwork.proofsTotal = graphNetwork.proofsTotal.plus(UNO_BIG_INT);
  graphNetwork.save();

  let computeUnitPerEpochStat = createOrLoadComputeUnitPerEpochStat(
    computeUnit.id,
    currentEpoch.toString(),
  );
  computeUnitPerEpochStat.submittedProofsCount =
    computeUnitPerEpochStat.submittedProofsCount + 1;
  computeUnitPerEpochStat.capacityCommitment = capacityCommitment.id;
  computeUnitPerEpochStat.save();

  capacityCommitmentStatsPerEpoch.submittedProofsCount =
    capacityCommitmentStatsPerEpoch.submittedProofsCount + 1;
  // Let's catch when CU triggered to become succeceed in proof submission for the epoch (and only once) below.
  if (
    computeUnitPerEpochStat.submittedProofsCount ==
    graphNetwork.minRequiredProofsPerEpoch
  ) {
    capacityCommitmentStatsPerEpoch.computeUnitsWithMinRequiredProofsSubmittedCounter =
      capacityCommitmentStatsPerEpoch.computeUnitsWithMinRequiredProofsSubmittedCounter +
      1;
  }
  capacityCommitmentStatsPerEpoch.save();
}

export function handleRewardWithdrawn(event: RewardWithdrawn): void {
  let capacityCommitment = CapacityCommitment.load(
    event.params.commitmentId.toHexString(),
  ) as CapacityCommitment;
  capacityCommitment.rewardWithdrawn = capacityCommitment.rewardWithdrawn.plus(
    event.params.amount,
  );
  capacityCommitment.save();
}
