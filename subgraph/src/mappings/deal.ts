import {AppCIDChanged, Deposited, MaxPaidEpochUpdated, Withdrawn} from "../../generated/templates/Deal/DealImpl";
import {createOrLoadDeal} from "../models";
import {AppCID, getEffectorCID} from "./utils";

export function handleDeposited(event: Deposited): void {
    let deal = createOrLoadDeal(event.address.toHex())
    deal.depositedSum = event.params.amount.plus(deal.depositedSum)
    deal.save()
}

export function handleWithdrawn(event: Withdrawn): void {
    let deal = createOrLoadDeal(event.address.toHex())
    deal.depositedSum = deal.depositedSum.minus(event.params.amount)
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
