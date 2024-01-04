// File should be writen after `npm run compile` is run or you will encounter syntax and import errors.
// Note: handlers named as in the contract methods

import {
  ComputeUnitAddedToDeal,
  ComputeUnitCreated,
  ComputeUnitRemovedFromDeal,
  DealCreated,
  EffectorAdded,
  EffectorRemoved,
  MarketOfferRegistered,
  MinPricePerEpochUpdated,
  PaymentTokenUpdated,
  PeerCreated,
} from "../../generated/Market/Market";
import {
  createOrLoadDealEffector,
  createOrLoadEffector,
  createOrLoadGraphNetwork,
  createOrLoadOfferEffector, createOrLoadProvider,
  createOrLoadToken,
  UNO_BIG_INT,
  ZERO_BIG_INT,
} from "../models";

import { log, store } from "@graphprotocol/graph-ts";
import {
  ComputeUnit,
  Deal,
  Offer,
  Peer,
  Provider,
} from "../../generated/schema";
import { Deal as DealTemplate } from "../../generated/templates";
import {AppCID, getEffectorCID, parseEffectors} from "./utils";
import { getProviderName } from "../networkConstants";

export function handleMarketOfferRegistered(
  event: MarketOfferRegistered,
): void {
  // Events: MarketOfferRegistered
  // Nested events (event order is important):
  // - emit PeerCreated(offerId, peer.peerId);
  // - emit ComputeUnitCreated(offerId, peerId, unitId);

  // Create provider.
  const provider = createOrLoadProvider(event.params.provider.toHex(), event.block.timestamp);

  // Create Offer.
  const offer = new Offer(event.params.offerId.toHex());
  offer.provider = provider.id;
  offer.paymentToken = createOrLoadToken(event.params.paymentToken.toHex()).id;
  offer.pricePerEpoch = event.params.minPricePerWorkerEpoch;
  offer.createdAt = event.block.timestamp;
  offer.updatedAt = event.block.timestamp;
  offer.save();

  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.offersTotal = graphNetwork.offersTotal.plus(UNO_BIG_INT);
  graphNetwork.save();

  const appCIDS = changetype<Array<AppCID>>(event.params.effectors);
  const effectorEntities = parseEffectors(appCIDS);
  // Link effectors and offer:
  let createdOfferToEffector = 0;
  for (let i = 0; i < effectorEntities.length; i++) {
    const effectorId = effectorEntities[i];
    // Automatically create link or ensure that exists.
    const createOrLoadOfferEffectorRes = createOrLoadOfferEffector(
      offer.id,
      effectorId,
    );

    if (createOrLoadOfferEffectorRes.created) {
      createdOfferToEffector = createdOfferToEffector + 1;
    }
  }

  provider.effectorCount = provider.effectorCount + createdOfferToEffector;
  provider.save();
}

// It updates Peer and Offer.
export function handleComputeUnitCreated(event: ComputeUnitCreated): void {
  // Parent events:
  // - emit PeerCreated(offerId, peer.peerId);
  // - emit MarketOfferRegistered
  const peer = Peer.load(event.params.peerId.toHex()) as Peer;
  const offer = Offer.load(peer.offer) as Offer;
  const provider = Provider.load(offer.provider) as Provider;

  // Since handlePeerCreated could not work with this handler, this logic moved here.
  const computeUnit = new ComputeUnit(event.params.unitId.toHex());
  computeUnit.provider = peer.provider;
  computeUnit.peer = peer.id;
  computeUnit.save();

  provider.computeUnitsAvailable = provider.computeUnitsAvailable + 1;
  provider.computeUnitsTotal = provider.computeUnitsTotal + 1;
  provider.save();
  offer.computeUnitsAvailable = offer.computeUnitsAvailable + 1;
  offer.computeUnitsTotal = offer.computeUnitsTotal + 1;
  offer.updatedAt = event.block.timestamp;
  offer.save();
}

// It updates Peer and Offer.
export function handlePeerCreated(event: PeerCreated): void {
  const peer = new Peer(event.params.peerId.toHex());
  const offer = Offer.load(event.params.offerId.toHex()) as Offer;
  const provider = Provider.load(offer.provider) as Provider;
  provider.peerCount = provider.peerCount + 1;
  provider.save();

  // const provider = Provider.load(offer.provider) as Provider
  // log.info('offer.provider {}', offer.provider.toString())
  peer.provider = offer.provider;
  peer.offer = offer.id;
  peer.save();
}

// ---- Update Methods ----
export function handleMinPricePerEpochUpdated(
  event: MinPricePerEpochUpdated,
): void {
  const offer = Offer.load(event.params.offerId.toHex()) as Offer;
  offer.pricePerEpoch = event.params.minPricePerWorkerEpoch;
  offer.save();
}

export function handlePaymentTokenUpdated(event: PaymentTokenUpdated): void {
  const offer = Offer.load(event.params.offerId.toHex()) as Offer;
  offer.paymentToken = createOrLoadToken(event.params.paymentToken.toHex()).id;
  offer.save();
}

export function handleEffectorAdded(event: EffectorAdded): void {
  const offer = Offer.load(event.params.offerId.toHex()) as Offer;
  const provider = Provider.load(offer.provider) as Provider;
  const appCID = changetype<AppCID>(event.params.effector);
  const cid = getEffectorCID(appCID);
  const effector = createOrLoadEffector(cid);

  const createOrLoadOfferEffectorRes = createOrLoadOfferEffector(
    offer.id,
    effector.id,
  );

  offer.updatedAt = event.block.timestamp;
  offer.save();
  if (createOrLoadOfferEffectorRes.created) {
    provider.effectorCount = provider.effectorCount + 1;
    provider.save();
  }
}

export function handleEffectorRemoved(event: EffectorRemoved): void {
  const offer = Offer.load(event.params.offerId.toHex()) as Offer;
  const provider = Provider.load(offer.provider) as Provider;
  const appCID = changetype<AppCID>(event.params.effector);
  const cidToRemove = getEffectorCID(appCID);
  const effector = createOrLoadEffector(cidToRemove);

  const createOrLoadOfferEffectorRes = createOrLoadOfferEffector(
    offer.id,
    effector.id,
  );
  store.remove("OfferToEffector", createOrLoadOfferEffectorRes.entity.id);
  if (createOrLoadOfferEffectorRes.created) {
    // We created and deleted the effector: means nothing should be changed in counter.
    provider.effectorCount = provider.effectorCount + 1;
    provider.save();
  } else {
    provider.effectorCount = provider.effectorCount - 1;
    provider.save();
  }

  offer.updatedAt = event.block.timestamp;
  offer.save();
}

// Note, in Deal we also handle ComputeUnitJoined.
export function handleComputeUnitAddedToDeal(
  event: ComputeUnitAddedToDeal,
): void {
  // Call the contract to extract peerId of the computeUnit.
  const peer = Peer.load(event.params.peerId.toHex()) as Peer;
  const offer = Offer.load(peer.offer) as Offer;
  const provider = Provider.load(offer.provider) as Provider;

  provider.computeUnitsAvailable = provider.computeUnitsAvailable - 1;
  provider.save();
  offer.computeUnitsAvailable = offer.computeUnitsAvailable - 1;
  offer.updatedAt = event.block.timestamp;
  offer.save();
}

// Note, in Deal we also handle ComputeUnitRemoved.
export function handleComputeUnitRemovedFromDeal(
  event: ComputeUnitRemovedFromDeal,
): void {
  // Call the contract to extract peerId of the computeUnit.
  const peer = Peer.load(event.params.peerId.toHex()) as Peer;
  const offer = Offer.load(peer.offer) as Offer;
  const provider = Provider.load(offer.provider) as Provider;

  provider.computeUnitsAvailable = provider.computeUnitsAvailable + 1;
  provider.computeUnitsTotal = provider.computeUnitsTotal + 1;
  provider.save();
  offer.computeUnitsAvailable = offer.computeUnitsAvailable + 1;
  offer.updatedAt = event.block.timestamp;
  offer.save();
}

// ---- Factory Events ----
export function handleDealCreated(event: DealCreated): void {
  const dealAddress = event.params.deal;
  log.info("[handleDealCreated] New deal created: {} by: {}", [
    event.params.owner.toString(),
    dealAddress.toString(),
  ]);

  const deal = new Deal(dealAddress.toHex());
  let graphNetwork = createOrLoadGraphNetwork();
  deal.createdAt = event.block.timestamp;
  deal.owner = event.params.owner;

  deal.paymentToken = event.params.paymentToken.toHex();
  deal.minWorkers = event.params.minWorkers.toI32();
  deal.targetWorkers = event.params.targetWorkers.toI32();
  deal.maxWorkersPerProvider = event.params.maxWorkersPerProvider.toI32();
  deal.pricePerWorkerEpoch = event.params.pricePerWorkerEpoch;
  const appCID = changetype<AppCID>(event.params.appCID);
  deal.appCID = getEffectorCID(appCID);
  deal.withdrawalSum = ZERO_BIG_INT;
  deal.depositedSum = ZERO_BIG_INT;
  graphNetwork.dealsTotal = graphNetwork.dealsTotal.plus(UNO_BIG_INT);
  graphNetwork.save();
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

  // Start indexing this deployed contract too
  DealTemplate.create(dealAddress);
}
