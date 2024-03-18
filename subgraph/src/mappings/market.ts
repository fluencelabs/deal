// File should be writen after `npm run compile` is run or you will encounter syntax and import errors.
// Note: handlers named as in the contract methods

import {
  ComputeUnitAddedToDeal,
  ComputeUnitCreated,
  ComputeUnitRemovedFromDeal,
  EffectorAdded,
  EffectorInfoRemoved, EffectorInfoSet,
  EffectorRemoved,
  Initialized,
  MarketOfferRegistered,
  MinPricePerEpochUpdated,
  PaymentTokenUpdated,
  PeerCreated,
  ProviderInfoUpdated,
} from "../../generated/Market/Market";
import {
  createOrLoadDealToJoinedOfferPeer,
  createOrLoadDealToPeer,
  createOrLoadEffector,
  createOrLoadGraphNetwork,
  createOrLoadOfferEffector,
  createOrLoadToken, REMOVED_EFFECTOR_INFO_DESCRIPTION,
  UNKNOWN_EFFECTOR_DESCRIPTION,
  UNO_BIG_INT
} from "../models";

import { log, store } from "@graphprotocol/graph-ts";
import {
  ComputeUnit,
  Deal,
  Offer,
  Peer,
  Provider,
} from "../../generated/schema";
import {AppCID, formatAddress, getEffectorCID, parseEffectors} from "./utils";

export function handleInitialized(event: Initialized): void {
  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.marketContractAddress = event.address.toHexString();
  graphNetwork.save()
}

export function handleProviderInfoUpdated(event: ProviderInfoUpdated): void {
  const addr = formatAddress(event.params.provider);
  let provider = Provider.load(addr);
  if (provider == null) {
    provider = new Provider(addr);
  }
  // Note, we do not change approved to false, because possibly provider have
  //  been approved  through whitelist contract already. Thus, no need to
  //  change approved field here.
  if (provider.approved == null) {
    provider.approved = false;
  }
  provider.name = event.params.name;
  provider.registered = true;
  provider.createdAt = event.block.timestamp;
  provider.computeUnitsAvailable = 0;
  provider.computeUnitsTotal = 0;
  provider.peerCount = 0;
  provider.save();

  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.providersTotal = graphNetwork.providersTotal.plus(UNO_BIG_INT);
  graphNetwork.save()
}

export function handleEffectorInfoSet(event: EffectorInfoSet): void {
  const appCID = changetype<AppCID>(event.params.id);
  const cid = getEffectorCID(appCID);
  let effector = createOrLoadEffector(cid);
  effector.description = event.params.description;
  effector.save();
}

// When it is removed: it does not mean that in other place it is stopped to use the effector.
//  Effector description and approved info merely deleted only.
export function handleEffectorInfoRemoved(event: EffectorInfoRemoved): void {
  const appCID = changetype<AppCID>(event.params.id);
  const cid = getEffectorCID(appCID);
  let effector = createOrLoadEffector(cid);
  effector.description = REMOVED_EFFECTOR_INFO_DESCRIPTION;
  effector.save();
}

export function handleMarketOfferRegistered(
  event: MarketOfferRegistered,
): void {
  // Events: MarketOfferRegistered
  // Nested events (event order is important):
  // - emit PeerCreated(offerId, peer.peerId);
  // - emit ComputeUnitCreated(offerId, peerId, unitId);

  const provider = Provider.load(event.params.provider.toHexString()) as Provider;

  // Create Offer.
  const offer = new Offer(event.params.offerId.toHexString());
  offer.provider = provider.id;
  offer.paymentToken = createOrLoadToken(event.params.paymentToken).id;
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
  for (let i = 0; i < effectorEntities.length; i++) {
    const effectorId = effectorEntities[i];
    // Automatically create link or ensure that exists.
    createOrLoadOfferEffector(
      offer.id,
      effectorId,
    );
  }

  provider.save();
}

// It updates Peer and Offer.
export function handleComputeUnitCreated(event: ComputeUnitCreated): void {
  // Parent events:
  // - emit PeerCreated(offerId, peer.peerId);
  // - emit MarketOfferRegistered
  let peer = Peer.load(event.params.peerId.toHexString()) as Peer;
  const offer = Offer.load(peer.offer) as Offer;
  const provider = Provider.load(offer.provider) as Provider;

  // Since handlePeerCreated could not work with this handler, this logic moved here.
  const computeUnit = new ComputeUnit(event.params.unitId.toHexString());
  computeUnit.provider = peer.provider;
  computeUnit.peer = peer.id;
  computeUnit.submittedProofsCount = 0;
  computeUnit.createdAt = event.block.timestamp;
  computeUnit.save();

  // Upd stats.
  peer.computeUnitsTotal = peer.computeUnitsTotal + 1;
  peer.save()

  provider.computeUnitsAvailable = provider.computeUnitsAvailable + 1;
  provider.computeUnitsTotal = provider.computeUnitsTotal + 1;
  provider.save();

  offer.computeUnitsAvailable = offer.computeUnitsAvailable + 1;
  offer.computeUnitsTotal = offer.computeUnitsTotal + 1;
  offer.updatedAt = event.block.timestamp;
  offer.save();
}

export function handlePeerCreated(event: PeerCreated): void {
  const peer = new Peer(event.params.peerId.toHexString());
  const offer = Offer.load(event.params.offerId.toHexString()) as Offer;
  const provider = Provider.load(offer.provider) as Provider;
  provider.peerCount = provider.peerCount + 1;
  provider.save();

  // const provider = Provider.load(offer.provider) as Provider
  // log.info('offer.provider {}', offer.provider.toString())
  peer.provider = offer.provider;
  peer.offer = offer.id;
  peer.isAnyJoinedDeals = false;
  // Init stats below.
  peer.computeUnitsTotal = 0;
  peer.computeUnitsInDeal = 0;
  peer.save();
}

// ---- Update Methods ----
export function handleMinPricePerEpochUpdated(
  event: MinPricePerEpochUpdated,
): void {
  const offer = Offer.load(event.params.offerId.toHexString()) as Offer;
  offer.pricePerEpoch = event.params.minPricePerWorkerEpoch;
  offer.save();
}

export function handlePaymentTokenUpdated(event: PaymentTokenUpdated): void {
  const offer = Offer.load(event.params.offerId.toHexString()) as Offer;
  offer.paymentToken = createOrLoadToken(event.params.paymentToken).id;
  offer.save();
}

export function handleEffectorAdded(event: EffectorAdded): void {
  const offer = Offer.load(event.params.offerId.toHexString()) as Offer;
  const appCID = changetype<AppCID>(event.params.effector);
  const cid = getEffectorCID(appCID);
  const effector = createOrLoadEffector(cid);

  const createOrLoadOfferEffectorRes = createOrLoadOfferEffector(
    offer.id,
    effector.id,
  );

  offer.updatedAt = event.block.timestamp;
  offer.save();
}

export function handleEffectorRemoved(event: EffectorRemoved): void {
  const offer = Offer.load(event.params.offerId.toHexString()) as Offer;
  const appCID = changetype<AppCID>(event.params.effector);
  const cidToRemove = getEffectorCID(appCID);
  const effector = createOrLoadEffector(cidToRemove);

  const createOrLoadOfferEffectorRes = createOrLoadOfferEffector(
    offer.id,
    effector.id,
  );
  store.remove("OfferToEffector", createOrLoadOfferEffectorRes.entity.id);
  offer.updatedAt = event.block.timestamp;
  offer.save();
}

// Note, in Deal we also handle ComputeUnitJoined.
// Note, this event is kinda the main event for match CU with deal.
export function handleComputeUnitAddedToDeal(
  event: ComputeUnitAddedToDeal,
): void {
  // Call the contract to extract peerId of the computeUnit.
  let peer = Peer.load(event.params.peerId.toHexString()) as Peer;
  const offer = Offer.load(peer.offer) as Offer;
  const provider = Provider.load(offer.provider) as Provider;
  let deal = Deal.load(formatAddress(event.params.deal)) as Deal;

  const createOrLoadDealToPeerResult = createOrLoadDealToPeer(deal.id, peer.id);
  // Check if we need to incr counter if mapping was merely loaded before.
  if (!createOrLoadDealToPeerResult.created) {
    const createOrLoadDealToPeer = createOrLoadDealToPeerResult.entity;
    createOrLoadDealToPeer.connections = createOrLoadDealToPeer.connections + 1;
    createOrLoadDealToPeer.save();
  }
  createOrLoadDealToJoinedOfferPeer(deal.id, offer.id, peer.id);
  peer.isAnyJoinedDeals = true;

  // Upd stats.
  deal.matchedWorkersCurrentCount = deal.matchedWorkersCurrentCount + 1;
  deal.save();

  peer.computeUnitsInDeal = peer.computeUnitsInDeal + 1;
  peer.save()

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
  let peer = Peer.load(event.params.peerId.toHexString()) as Peer;
  const offer = Offer.load(peer.offer) as Offer;
  const provider = Provider.load(offer.provider) as Provider;
  let computeUnit = ComputeUnit.load(event.params.unitId.toHexString()) as ComputeUnit;
  let deal = Deal.load(formatAddress(event.params.deal)) as Deal;

  const dealToPeerReturn = createOrLoadDealToPeer(deal.id, peer.id);
  const dealToPeer = dealToPeerReturn.entity;
  // Check that deal has other CUs from the same peer before rm connection: Deal Vs Peer.
  if (dealToPeer.connections == 1) {
    const dealToJoinedOfferPeer = createOrLoadDealToJoinedOfferPeer(deal.id, offer.id, peer.id);
    store.remove("DealToPeer", dealToPeer.id);
    store.remove("DealToJoinedOfferPeer", dealToJoinedOfferPeer.id);
  }
  if (peer.joinedDeals.load().length == 0) {
    peer.isAnyJoinedDeals = false;
  }

  // Upd stats.
  deal.matchedWorkersCurrentCount = deal.matchedWorkersCurrentCount - 1;
  if (computeUnit.workerId != null) {
    computeUnit.workerId = null;
    computeUnit.save();
    deal.registeredWorkersCurrentCount = deal.registeredWorkersCurrentCount - 1;
  }
  deal.save();

  peer.computeUnitsInDeal = peer.computeUnitsInDeal - 1;
  peer.save()

  provider.computeUnitsAvailable = provider.computeUnitsAvailable + 1;
  provider.save();

  offer.computeUnitsAvailable = offer.computeUnitsAvailable + 1;
  offer.updatedAt = event.block.timestamp;
  offer.save();
}
