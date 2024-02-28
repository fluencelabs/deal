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
  createOrLoadToken,
  UNKNOWN_EFFECTOR_DESCRIPTION,
  UNO_BIG_INT,
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
  // Loaded or created provider - does not meter for this function logic.
  provider.name = event.params.name;
  provider.registered = true;
  provider.approved = false;
  provider.createdAt = event.block.timestamp;
  provider.computeUnitsAvailable = 0;
  provider.computeUnitsTotal = 0;
  provider.peerCount = 0;
  provider.save();

  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.providersTotal = graphNetwork.providersTotal.plus(UNO_BIG_INT);
  graphNetwork.save()
}

// It fails on EffectorInfoSet but does not fail on
// EffectorInfoSetButNotTuple(indexed uint256,(bytes4,bytes32),string,(bytes4,bytes32)).
// TODO: enable this handler when https://github.com/graphprotocol/graph-node/issues/5171 resolved.
export function handleEffectorInfoSet(event: EffectorInfoSet): void {
  const appCID = changetype<AppCID>(event.params.id);
  const cid = getEffectorCID(appCID);
  let effector = createOrLoadEffector(cid);
  effector.description = event.params.description;
  effector.save();
}

// When it is removed: it does not mean that in other place it is stopped to use the effector.
//  Effector description and approved info merely deleted.
export function handleEffectorInfoRemoved(event: EffectorInfoRemoved): void {
  const appCID = changetype<AppCID>(event.params.id);
  const cid = getEffectorCID(appCID);
  let effector = createOrLoadEffector(cid);
  effector.description = UNKNOWN_EFFECTOR_DESCRIPTION;
  effector.save();
}

export function handleMarketOfferRegistered(
  event: MarketOfferRegistered,
): void {
  // Events: MarketOfferRegistered
  // Nested events (event order is important):
  // - emit PeerCreated(offerId, peer.peerId);
  // - emit ComputeUnitCreated(offerId, peerId, unitId);

  const provider = Provider.load(event.params.provider.toHex()) as Provider;

  // Create Offer.
  const offer = new Offer(event.params.offerId.toHex());
  offer.provider = provider.id;
  offer.paymentToken = createOrLoadToken(formatAddress(event.params.paymentToken)).id;
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
  let peer = Peer.load(event.params.peerId.toHex()) as Peer;
  const offer = Offer.load(peer.offer) as Offer;
  const provider = Provider.load(offer.provider) as Provider;

  // Since handlePeerCreated could not work with this handler, this logic moved here.
  const computeUnit = new ComputeUnit(event.params.unitId.toHex());
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
  peer.isAnyJoinedDeals = false;
  // Init stats below.
  peer.computeUnitsTotal = 0;
  peer.computeUnitsInDeal = 0;
  peer.computeUnitsInCapacityCommitment = 0;
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
  offer.paymentToken = createOrLoadToken(formatAddress(event.params.paymentToken)).id;
  offer.save();
}

export function handleEffectorAdded(event: EffectorAdded): void {
  const offer = Offer.load(event.params.offerId.toHex()) as Offer;
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
  const offer = Offer.load(event.params.offerId.toHex()) as Offer;
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
export function handleComputeUnitAddedToDeal(
  event: ComputeUnitAddedToDeal,
): void {
  // Call the contract to extract peerId of the computeUnit.
  let peer = Peer.load(event.params.peerId.toHex()) as Peer;
  const offer = Offer.load(peer.offer) as Offer;
  const provider = Provider.load(offer.provider) as Provider;

  createOrLoadDealToPeer(event.address.toHex(), peer.id);
  createOrLoadDealToJoinedOfferPeer(event.address.toHex(), offer.id, peer.id);
  peer.isAnyJoinedDeals = true;

  // Upd stats.
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
  let peer = Peer.load(event.params.peerId.toHex()) as Peer;
  const offer = Offer.load(peer.offer) as Offer;
  const provider = Provider.load(offer.provider) as Provider;

  const dealToPeer = createOrLoadDealToPeer(event.address.toHex(), peer.id);
  const dealToJoinedOfferPeer = createOrLoadDealToJoinedOfferPeer(event.address.toHex(), offer.id, peer.id);
  store.remove("DealToPeer", dealToPeer.id);
  store.remove("DealToJoinedOfferPeer", dealToJoinedOfferPeer.id);
  if (peer.joinedDeals.load().length == 0) {
    peer.isAnyJoinedDeals = false;
  }

  // Upd stats.
  peer.computeUnitsInDeal = peer.computeUnitsInDeal - 1;
  peer.save()

  provider.computeUnitsAvailable = provider.computeUnitsAvailable + 1;
  provider.save();

  offer.computeUnitsAvailable = offer.computeUnitsAvailable + 1;
  offer.updatedAt = event.block.timestamp;
  offer.save();
}
