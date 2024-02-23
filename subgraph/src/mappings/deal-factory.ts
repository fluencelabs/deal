// File should be writen after `npm run compile` is run or you will encounter syntax and import errors.
// Note: handlers named as in the contract methods

import {
  DealCreated,
} from "../../generated/DealFactory/DealFactory";
import {
  createOrLoadDealEffector,
  createOrLoadDealToProvidersAccess,
  createOrLoadGraphNetwork,
  createOrLoadUnregisteredProvider,
  UNO_BIG_INT,
  ZERO_BIG_INT,
} from "../models";

import { log, store } from "@graphprotocol/graph-ts";
import {
  Deal,
} from "../../generated/schema";
import { Deal as DealTemplate } from "../../generated/templates";
import {AppCID, formatAddress, getEffectorCID, parseEffectors} from "./utils";


// ---- Factory Events ----
export function handleDealCreated(event: DealCreated): void {
  const dealAddress = formatAddress(event.params.deal);
  log.info("[handleDealCreated] New deal created: {} by: {}", [
    event.params.owner.toString(),
    dealAddress.toString(),
  ]);

  const deal = new Deal(dealAddress);
  let graphNetwork = createOrLoadGraphNetwork();
  deal.createdAt = event.block.timestamp;
  deal.owner = formatAddress(event.params.owner);

  deal.paymentToken = formatAddress(event.params.paymentToken);
  deal.minWorkers = event.params.minWorkers.toI32();
  deal.targetWorkers = event.params.targetWorkers.toI32();
  deal.maxWorkersPerProvider = event.params.maxWorkersPerProvider.toI32();
  deal.pricePerWorkerEpoch = event.params.pricePerWorkerEpoch;
  const appCID = changetype<AppCID>(event.params.appCID);
  deal.appCID = getEffectorCID(appCID);
  deal.withdrawalSum = ZERO_BIG_INT;
  deal.depositedSum = ZERO_BIG_INT;

  // Perform provider access lists (whitelist, blacklist or non).
  deal.providersAccessType = event.params.providersAccessType_;
  for (let i=0; i < event.params.providersAccessList_.length; i++) {
    const providerAddress = formatAddress(event.params.providersAccessList_[i]);
    const provider = createOrLoadUnregisteredProvider(providerAddress);
    createOrLoadDealToProvidersAccess(deal.id, provider.id);
  }
  deal.save();

  // Get effectors.
  const appCIDS = changetype<Array<AppCID>>(event.params.effectors);
  const effectorEntities = parseEffectors(appCIDS);
  // Link effectors and deals:
  for (let i = 0; i < effectorEntities.length; i++) {
    const effectorId = effectorEntities[i];
    // Automatically create link or ensure that exists.
    createOrLoadDealEffector(deal.id, effectorId);
  }

  // Upd stats.
  graphNetwork.dealsTotal = graphNetwork.dealsTotal.plus(UNO_BIG_INT);
  graphNetwork.save();

  // Start indexing this deployed contract too
  DealTemplate.create(event.params.deal);
}
