import {createOrLoadComputeUnit, createOrLoadDeal} from "../models";
import {AppCID, getEffectorCID} from "./utils";
import {
    AppCIDChanged,
    ComputeUnitJoined,
    Deposited,
    MaxPaidEpochUpdated,
    Withdrawn, WorkerIdUpdated
} from "../../generated/Core/DealImpl";

export function handleDeposited(event: Deposited): void {
    let deal = createOrLoadDeal(event.address.toHex())
    deal.depositedSum = deal.depositedSum.plus(event.params.amount)
    deal.save()
}

export function handleWithdrawn(event: Withdrawn): void {
    let deal = createOrLoadDeal(event.address.toHex())
    deal.withdrawalSum = deal.withdrawalSum.plus(event.params.amount)
    deal.save()
}

export function handleMaxPaidEpochUpdated(event: MaxPaidEpochUpdated): void {
    let deal = createOrLoadDeal(event.address.toHex())
    deal.maxPaidEpoch = deal.depositedSum.minus(event.params.maxPaidEpoch)
    deal.save()
}

export function handleAppCIDChanged(event: AppCIDChanged): void {
    let deal = createOrLoadDeal(event.address.toHex())
    const cid = changetype<AppCID>(event.params.newAppCID)

    deal.appCID = getEffectorCID(cid)
    deal.save()
}

// Joined to Deal.
export function handleComputeUnitJoined(event: ComputeUnitJoined): void {
    let deal = createOrLoadDeal(event.address.toHex())

    let computeUnit = createOrLoadComputeUnit(event.params.unitId.toHex())
    computeUnit.deal = deal.id
    computeUnit.save()
}

// Link workerId to CU.
export function handleWorkerIdUpdated(event: WorkerIdUpdated): void {
    let computeUnit = createOrLoadComputeUnit(event.params.computeUnitId.toHex())
    computeUnit.workerID = event.params.workerId.toHex()
    computeUnit.save()
}
