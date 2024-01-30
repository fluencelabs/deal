import {
  CapacityCommitmentStatus, createOrLoadCapacityCommitmentToComputeUnit,
  createOrLoadGraphNetwork, UNO_BIG_INT,
  ZERO_BIG_INT
} from "../models";
import {
  CapacityCommitment,
  ComputeUnit,
  Peer,
  Provider
} from "../../generated/schema";
import {
  CollateralDeposited,
  CommitmentActivated,
  CommitmentCreated,
  CommitmentFinished,
  CommitmentRemoved,
  CommitmentStatsUpdated,
  WhitelistAccessGranted,
  WhitelistAccessRevoked,
} from "../../generated/Capacity/Capacity";
import {
  calculateEpoch,
  calculateNextFailedCCEpoch, getCapacityMaxFailedRatio,
} from "../contracts";
import {Initialized} from "../../generated/Capacity/Capacity";
import {BigInt} from "@graphprotocol/graph-ts";


export function handleWhitelistAccessGranted(event: WhitelistAccessGranted): void {
  let provider = Provider.load(event.params.account.toHex()) as Provider;
  provider.approved = true;
  provider.save();
}

export function handleWhitelistAccessRevoked(event: WhitelistAccessRevoked): void {
  let provider = Provider.load(event.params.account.toHex()) as Provider;
  provider.approved = false;
  provider.save();
}

export function handleInitialized(event: Initialized): void {
  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.capacityMaxFailedRatio = getCapacityMaxFailedRatio(event.address).toI32();
  graphNetwork.save()
}

export function handleCommitmentCreated(event: CommitmentCreated): void {
  let commitment = new CapacityCommitment(event.params.commitmentId.toHex());

  commitment.peer = event.params.peerId.toHex()
  commitment.status = CapacityCommitmentStatus.WaitDelegation
  commitment.collateralPerUnit = event.params.fltCollateralPerUnit
  commitment.createdAt = event.block.timestamp;
  commitment.duration = event.params.duration
  commitment.rewardDelegatorRate = event.params.rewardDelegationRate.toI32()
  commitment.delegator = event.params.delegator.toHex()
  commitment.activeUnitCount = 0
  commitment.startEpoch = ZERO_BIG_INT
  commitment.endEpoch = ZERO_BIG_INT
  commitment.totalCUFailCount = 0
  commitment.failedEpoch = ZERO_BIG_INT
  commitment.exitedUnitCount = 0
  commitment.nextCCFailedEpoch = ZERO_BIG_INT
  commitment.computeUnitsCount = 0
  commitment.nextAdditionalActiveUnitCount = 0
  commitment.snapshotEpoch = ZERO_BIG_INT
  commitment.deleted = false;
  commitment.save()

  let peer = Peer.load(event.params.peerId.toHex()) as Peer;
  peer.currentCapacityCommitment = commitment.id;
  peer.save()

  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.capacityCommitmentsTotal = graphNetwork.capacityCommitmentsTotal.plus(UNO_BIG_INT);
  graphNetwork.save();
}

// It is supposed that collateral deposited at the same time as commitment activated
//  (the same tx).
export function handleCommitmentActivated(event: CommitmentActivated): void {
  let commitment = CapacityCommitment.load(event.params.commitmentId.toHex()) as CapacityCommitment;
  commitment.status = CapacityCommitmentStatus.WaitStart
  commitment.startEpoch = event.params.startEpoch
  commitment.endEpoch = event.params.endEpoch
  commitment.activeUnitCount = event.params.unitIds.length

  commitment.computeUnitsCount = event.params.unitIds.length
  for (let i=0; i < event.params.unitIds.length; i++) {
    const computeUnitId = event.params.unitIds[i].toHex()
    // We rely on contract logic that it is not possible to emit event with not existing CUs.
    //  Also, we relay that previously we save computeUnitId successfully in prev. handler.
    const computeUnit = ComputeUnit.load(computeUnitId) as ComputeUnit
    createOrLoadCapacityCommitmentToComputeUnit(commitment.id, computeUnit.id)
  }
  commitment.nextAdditionalActiveUnitCount = 0
  const graphNetwork = createOrLoadGraphNetwork();
  commitment.snapshotEpoch = calculateEpoch(
    event.block.timestamp,
    BigInt.fromI32(graphNetwork.initTimestamp),
    BigInt.fromI32(graphNetwork.coreEpochDuration),
  )

  const _calculatedFailedEpoch = calculateNextFailedCCEpoch(
    BigInt.fromString(graphNetwork.capacityMaxFailedRatio.toString()),
    BigInt.fromString(commitment.computeUnitsCount.toString()),
    BigInt.fromString(commitment.activeUnitCount.toString()),
    BigInt.fromString(commitment.nextAdditionalActiveUnitCount.toString()),
    BigInt.fromString(commitment.totalCUFailCount.toString()),
    BigInt.fromString(commitment.snapshotEpoch.toString()),
  )
  commitment.nextCCFailedEpoch = _calculatedFailedEpoch
  commitment.save()

  let peer = Peer.load(event.params.peerId.toHex()) as Peer;
  peer.currentCCCollateralDepositedAt = event.params.startEpoch;
  peer.currentCCEndEpoch = event.params.endEpoch;
  peer.currentCCNextCCFailedEpoch = _calculatedFailedEpoch;
  peer.save();
}

// @deprecated. Currently, no use for the event as it is used in handleCommitmentActivated.
export function handleCollateralDeposited(event: CollateralDeposited): void {}

export function handleCommitmentRemoved(event: CommitmentRemoved): void {
  let commitment = CapacityCommitment.load(event.params.commitmentId.toHex()) as CapacityCommitment;
  commitment.deleted = true;
  commitment.save();

  let peer = Peer.load(commitment.peer) as Peer;
  peer.currentCapacityCommitment = null;
  peer.currentCCCollateralDepositedAt = ZERO_BIG_INT;
  peer.currentCCEndEpoch = ZERO_BIG_INT;
  peer.save();
}

export function handleCommitmentFinished(event: CommitmentFinished): void {
  let commitment = CapacityCommitment.load(event.params.commitmentId.toHex()) as CapacityCommitment;
  commitment.status = CapacityCommitmentStatus.Removed;
  commitment.save();

  let peer = Peer.load(commitment.peer) as Peer;
  peer.currentCapacityCommitment = null;
  peer.currentCCCollateralDepositedAt = ZERO_BIG_INT;
  peer.currentCCEndEpoch = ZERO_BIG_INT;
  peer.save();
}

export function handleCommitmentStatsUpdated(event: CommitmentStatsUpdated): void {
  let commitment = CapacityCommitment.load(event.params.commitmentId.toHex()) as CapacityCommitment;

  commitment.totalCUFailCount = event.params.totalCUFailCount.toI32()
  commitment.exitedUnitCount = event.params.exitedUnitCount.toI32()
  commitment.activeUnitCount = event.params.activeUnitCount.toI32()
  commitment.nextAdditionalActiveUnitCount = event.params.nextAdditionalActiveUnitCount.toI32()

  const graphNetwork = createOrLoadGraphNetwork();
  // Calculate next failed epoch.
  const _calculatedFailedEpoch = calculateNextFailedCCEpoch(
    BigInt.fromString(graphNetwork.capacityMaxFailedRatio.toString()),
    BigInt.fromString(commitment.computeUnitsCount.toString()),
    BigInt.fromString(commitment.activeUnitCount.toString()),
    BigInt.fromString(commitment.nextAdditionalActiveUnitCount.toString()),
    BigInt.fromString(commitment.totalCUFailCount.toString()),
    BigInt.fromString(commitment.snapshotEpoch.toString()),
  )
  commitment.nextCCFailedEpoch = _calculatedFailedEpoch

  // Additional check if failedEpoch could be committed in CC model.
  const currentEpoch = calculateEpoch(
    event.block.timestamp,
    BigInt.fromI32(graphNetwork.initTimestamp),
    BigInt.fromI32(graphNetwork.coreEpochDuration),
  )
  if (currentEpoch >= _calculatedFailedEpoch) {
    commitment.failedEpoch = currentEpoch;
    commitment.status = CapacityCommitmentStatus.Failed;
  }
  commitment.save();

  let peer = Peer.load(commitment.peer) as Peer;
  peer.currentCCNextCCFailedEpoch = _calculatedFailedEpoch;
  peer.save();
}

// TODO: UnitDeactivated/ UnitActivated to work with units.


