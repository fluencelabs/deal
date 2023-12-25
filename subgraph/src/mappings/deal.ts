import { AppCID, getEffectorCID } from "./utils";
import {
  AppCIDChanged,
  ComputeUnitJoined,
  Deposited,
  MaxPaidEpochUpdated,
  Withdrawn,
  WorkerIdUpdated,
  ComputeUnitRemoved,
} from "../../generated/Market/Deal";
import { ComputeUnit, Deal } from "../../generated/schema";

export function handleDeposited(event: Deposited): void {
  let deal = Deal.load(event.address.toHex()) as Deal;
  deal.depositedSum = deal.depositedSum.plus(event.params.amount);
  deal.save();
}

export function handleWithdrawn(event: Withdrawn): void {
  let deal = Deal.load(event.address.toHex()) as Deal;
  deal.withdrawalSum = deal.withdrawalSum.plus(event.params.amount);
  deal.save();
}

export function handleMaxPaidEpochUpdated(event: MaxPaidEpochUpdated): void {
  let deal = Deal.load(event.address.toHex()) as Deal;
  deal.maxPaidEpoch = event.params.maxPaidEpoch;
  deal.save();
}

export function handleAppCIDChanged(event: AppCIDChanged): void {
  let deal = Deal.load(event.address.toHex()) as Deal;
  const cid = changetype<AppCID>(event.params.newAppCID);
  deal.appCID = getEffectorCID(cid);
  deal.save();
}

// Joined to Deal.
// Note, in Market we also handle handleComputeUnitAddedToDeal.
export function handleComputeUnitJoined(event: ComputeUnitJoined): void {
  const deal = Deal.load(event.address.toHex()) as Deal;

  let computeUnit = ComputeUnit.load(
    event.params.unitId.toHex(),
  ) as ComputeUnit;
  computeUnit.deal = deal.id;
  computeUnit.save();
}

// Removed from Deal.
// Note, in Market we also handle ComputeUnitRemovedFromDeal.
export function handleComputeUnitRemoved(event: ComputeUnitRemoved): void {
  let computeUnit = ComputeUnit.load(
    event.params.unitId.toHex(),
  ) as ComputeUnit;
  computeUnit.deal = null;
  computeUnit.save();
}

// Link workerId to CU.
export function handleWorkerIdUpdated(event: WorkerIdUpdated): void {
  let computeUnit = ComputeUnit.load(
    event.params.computeUnitId.toHex(),
  ) as ComputeUnit;
  computeUnit.workerId = event.params.workerId.toHex();
  computeUnit.save();
}
