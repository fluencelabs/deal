import {
  CapacityCommitmentStatus,
  createOrLoadGraphNetwork,
  ZERO_BIG_INT
} from "../models";
import {CapacityCommitment, Peer} from "../../generated/schema";
import {
  CollateralDeposited,
  CommitmentActivated,
  CommitmentCreated,
  CommitmentFinished,
  CommitmentRemoved,
  CommitmentSnapshotCommitted
} from "../../generated/Capacity/Capacity";
import {
  calculateEpoch,
  calculateNextFailedCCEpoch, getCapacityMaxFailedRatio,
} from "../contracts";
import {Initialized} from "../../generated/Capacity/Capacity";
import {BigInt} from "@graphprotocol/graph-ts";
import { log } from '@graphprotocol/graph-ts'


export function handleInitialized(event: Initialized): void {
  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.capacityMaxFailedRatio = getCapacityMaxFailedRatio(event.address).toI32();
  graphNetwork.save()
}

export function handleCommitmentCreated(event: CommitmentCreated): void {
  let commitment = new CapacityCommitment(event.params.commitmentId.toHex());

  commitment.peer = event.params.peerId.toHex()
  commitment.status = CapacityCommitmentStatus.WaitDelegation
  commitment.collateralPerUnit = event.params.fltCCCollateralPerUnit
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
  commitment.unitCount = 0
  commitment.nextAdditionalActiveUnitCount = 0
  commitment.snapshotEpoch = ZERO_BIG_INT
  commitment.deleted = false;
  commitment.save()

  let peer = Peer.load(event.params.peerId.toHex()) as Peer;
  peer.currentCapacityCommitment = commitment.id
  peer.save()
}

// It is supposed that collateral deposited at the same time as commitment activated
//  (the same tx).
export function handleCommitmentActivated(event: CommitmentActivated): void {
  let commitment = CapacityCommitment.load(event.params.commitmentId.toHex()) as CapacityCommitment;
  commitment.status = CapacityCommitmentStatus.WaitStart
  commitment.startEpoch = event.params.startEpoch
  commitment.endEpoch = event.params.endEpoch
  commitment.activeUnitCount = event.params.unitIds.length
  commitment.unitCount = event.params.unitIds.length
  commitment.nextAdditionalActiveUnitCount = 0
  const graphNetwork = createOrLoadGraphNetwork();
  commitment.snapshotEpoch = calculateEpoch(
    event.block.timestamp,
    BigInt.fromI32(graphNetwork.initTimestamp),
    BigInt.fromI32(graphNetwork.coreEpochDuration),
  )

  const _calculatedFailedEpoch = calculateNextFailedCCEpoch(
    BigInt.fromString(graphNetwork.capacityMaxFailedRatio.toString()),
    BigInt.fromString(commitment.unitCount.toString()),
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

export function handleCommitmentSnapshotCommitted(event: CommitmentSnapshotCommitted): void {
  let peer = Peer.load(event.params.peerId.toHex()) as Peer;
  const nextCCFailedEpoch = event.params.nextCCFailedEpoch;
  peer.currentCCNextCCFailedEpoch = nextCCFailedEpoch
  peer.save();

  if (peer.currentCapacityCommitment == null) {
    throw new Error("Assertion: Peer has no current capacity commitment.");
  }
  let cc = CapacityCommitment.load(peer.currentCapacityCommitment!) as CapacityCommitment;
  cc.nextCCFailedEpoch = nextCCFailedEpoch;
  cc.save();
}

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

// TODO: UnitDeactivated/ UnitActivated to work with
// - activeUnitCount
// - totalCUFailCount
// - failedEpoch
// - exitedUnitCount


