import {AppCID, formatAddress, getEffectorCID} from "./utils";
import {
  AppCIDChanged,
  ComputeUnitJoined,
  Deposited,
  MaxPaidEpochUpdated,
  Withdrawn,
  WorkerIdUpdated,
  ComputeUnitRemoved, ProviderAddedToAccessList, ProviderRemovedFromAccessList,
} from "../../generated/Market/Deal";
import { ComputeUnit, Deal } from "../../generated/schema";
import {
  createOrLoadDealToProvidersAccess,
  createOrLoadUnregisteredProvider
} from "../models";
import {store} from "@graphprotocol/graph-ts";

export function handleDeposited(event: Deposited): void {
  let deal = Deal.load(formatAddress(event.address)) as Deal;
  deal.depositedSum = deal.depositedSum.plus(event.params.amount);
  deal.save();
}

export function handleWithdrawn(event: Withdrawn): void {
  let deal = Deal.load(formatAddress(event.address)) as Deal;
  deal.withdrawalSum = deal.withdrawalSum.plus(event.params.amount);
  deal.save();
}

export function handleMaxPaidEpochUpdated(event: MaxPaidEpochUpdated): void {
  let deal = Deal.load(formatAddress(event.address)) as Deal;
  deal.maxPaidEpoch = event.params.maxPaidEpoch;
  deal.save();
}

export function handleAppCIDChanged(event: AppCIDChanged): void {
  let deal = Deal.load(formatAddress(event.address)) as Deal;
  const cid = changetype<AppCID>(event.params.newAppCID);
  deal.appCID = getEffectorCID(cid);
  deal.save();
}

// Joined to Deal.
// Note, in Market we also handle handleComputeUnitAddedToDeal.
export function handleComputeUnitJoined(event: ComputeUnitJoined): void {
  const deal = Deal.load(formatAddress(event.address)) as Deal;

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
  let deal = Deal.load(formatAddress(event.address)) as Deal;

  computeUnit.workerId = event.params.workerId.toHexString();
  computeUnit.save();

  // Update stats below.
  // Check that worker already counted and counter should not be updated.
  if (computeUnit.workerId == null) {
    deal.registeredWorkersCurrentCount = deal.registeredWorkersCurrentCount + 1;
    deal.save();
  }
}

export function handleProviderAddedToAccessList(event: ProviderAddedToAccessList): void {
  const deal = Deal.load(formatAddress(event.address)) as Deal;
  const provider = createOrLoadUnregisteredProvider(formatAddress(event.params.provider));
  createOrLoadDealToProvidersAccess(deal.id, provider.id);
}

export function handleProviderRemovedFromAccessList(event: ProviderRemovedFromAccessList): void {
  const deal = Deal.load(formatAddress(event.address)) as Deal;
  const provider = createOrLoadUnregisteredProvider(formatAddress(event.params.provider));
  const entity = createOrLoadDealToProvidersAccess(deal.id, provider.id);
  store.remove("OfferToEffector", entity.id);
}
