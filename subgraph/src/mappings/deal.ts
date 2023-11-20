import {Deposited, Withdrawn} from "../../generated/templates/Deal/DealImpl";
import {createOrLoadDeal} from "../models";

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
