import {CapacityCommitmentStatus, ZERO_BIG_INT} from "../models";
import {CapacityCommitment} from "../../generated/schema";
import {
  CollateralDeposited, CommitmentActivated,
  CommitmentCreated
} from "../../generated/Capacity/Capacity";

export function handleCommitmentCreated(event: CommitmentCreated): void {
  let commitment = new CapacityCommitment(event.params.commitmentId.toHex());

  commitment.peer = event.params.peerId.toHex()
  commitment.CCStatus = CapacityCommitmentStatus.WaitDelegation
  commitment.collateralPerUnit = event.params.fltCCCollateralPerUnit
  commitment.duration = event.params.duration
  commitment.rewardDelegatorRate = event.params.rewardDelegationRate
  commitment.delegator = event.params.delegator.toHex()
  commitment.unitCount = 0
  commitment.startEpoch = ZERO_BIG_INT
  commitment.endEpoch = ZERO_BIG_INT
  commitment.totalCUFailCount = 0
  commitment.failedEpoch = ZERO_BIG_INT
  commitment.exitedUnitCount = 0
  commitment.save()
}

export function handleCommitmentActivated(event: CommitmentActivated): void {
  let commitment = CapacityCommitment.load(event.params.commitmentId.toHex()) as CapacityCommitment;
  commitment.CCStatus = CapacityCommitmentStatus.Active
  commitment.startEpoch = event.params.startEpoch
  commitment.endEpoch = event.params.endEpoch
  commitment.unitCount = event.params.unitIds.length
  commitment.save()
}

export function handleCollateralDeposited(event: CollateralDeposited): void {
  let commitment = new CapacityCommitment(event.params.commitmentId.toHex());
}
