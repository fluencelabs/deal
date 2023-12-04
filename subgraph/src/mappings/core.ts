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
} from "../../generated/Core/CoreImpl";
import { createOrLoadDealEffector, createOrLoadEffector, createOrLoadOfferEffector, createOrLoadToken, ZERO_BIG_INT } from "./../models";

import { log, store } from "@graphprotocol/graph-ts";
import { ComputeUnit, Deal, Offer, Peer, Provider } from "../../generated/schema";
import { Deal as DealTemplate } from "../../generated/templates";
import { AppCID, getEffectorCID, parseEffectors } from "./utils";
import { getProviderName } from "../networkConstants";

export function handleMarketOfferRegistered(event: MarketOfferRegistered): void {
    // Events: MarketOfferRegistered
    // Nested events (event order is important):
    // - emit PeerCreated(offerId, peer.peerId);
    // - emit ComputeUnitCreated(offerId, peerId, unitId);

    // Create provider.
    const providerAddress = event.params.owner.toHex();
    const provider = new Provider(providerAddress);
    provider.name = getProviderName(providerAddress);
    provider.createdAt = event.block.timestamp;
    provider.save();

    // Create Offer.
    const offer = new Offer(event.params.offerId.toHex());
    offer.provider = provider.id;
    offer.paymentToken = createOrLoadToken(event.params.paymentToken.toHex()).id;
    offer.pricePerEpoch = event.params.minPricePerWorkerEpoch;
    offer.createdAt = event.block.timestamp;
    offer.updatedAt = event.block.timestamp;
    offer.save();

    const appCIDS = changetype<Array<AppCID>>(event.params.effectors);
    const effectorEntities = parseEffectors(appCIDS);
    // Link effectors and offer:
    for (let i = 0; i < effectorEntities.length; i++) {
        const effectorId = effectorEntities[i];
        // Automatically create link or ensure that exists.
        createOrLoadOfferEffector(offer.id, effectorId);
    }
}

// It updates Peer and Offer.
export function handleComputeUnitCreated(event: ComputeUnitCreated): void {
    // Parent events:
    // - emit PeerCreated(offerId, peer.peerId);
    // - emit MarketOfferRegistered
    const offer = Offer.load(event.params.offerId.toHex()) as Offer;
    const peer = Peer.load(event.params.peerId.toHex()) as Peer;
    const provider = Provider.load(offer.provider) as Provider;

    // Since handlePeerCreated could not work with this handler, this logic moved here.
    const computeUnit = new ComputeUnit(event.params.unitId.toHex());
    computeUnit.provider = peer.provider;
    computeUnit.peer = peer.id;
    computeUnit.save();

    provider.computeUnitsAvailable += 1;
    provider.computeUnitsTotal += 1;
    provider.save();
    offer.computeUnitsAvailable += 1;
    offer.computeUnitsTotal += 1;
    offer.updatedAt = event.block.timestamp;
    offer.save();
}

// It updates Peer and Offer.
export function handlePeerCreated(event: PeerCreated): void {
    const peer = new Peer(event.params.peerId.toHex());
    const offer = Offer.load(event.params.offerId.toHex()) as Offer;

    // const provider = Provider.load(offer.provider) as Provider
    // log.info('offer.provider {}', offer.provider.toString())
    peer.provider = offer.provider;
    peer.offer = offer.id;
    peer.save();
}

// ---- Update Methods ----
export function handleMinPricePerEpochUpdated(event: MinPricePerEpochUpdated): void {
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
    const appCID = changetype<AppCID>(event.params.effector);
    const cid = getEffectorCID(appCID);
    const effector = createOrLoadEffector(cid);

    createOrLoadOfferEffector(offer.id, effector.id);

    offer.updatedAt = event.block.timestamp;
    offer.save();
}

export function handleEffectorRemoved(event: EffectorRemoved): void {
    const offer = Offer.load(event.params.offerId.toHex()) as Offer;
    const appCID = changetype<AppCID>(event.params.effector);
    const cidToRemove = getEffectorCID(appCID);
    const effector = createOrLoadEffector(cidToRemove);

    const offerEffector = createOrLoadOfferEffector(offer.id, effector.id);
    store.remove("OfferToEffector", offerEffector.id);

    offer.updatedAt = event.block.timestamp;
    offer.save();
}

// Note, in Deal we also handle ComputeUnitJoined.
export function handleComputeUnitAddedToDeal(event: ComputeUnitAddedToDeal): void {
    // Call the contract to extract peerId of the computeUnit.
    const peer = Peer.load(event.params.peerId.toHex()) as Peer;
    const offer = Offer.load(peer.offer) as Offer;
    const provider = Provider.load(offer.provider) as Provider;

    provider.computeUnitsAvailable -= 1;
    provider.save();
    offer.computeUnitsAvailable -= 1;
    offer.updatedAt = event.block.timestamp;
    offer.save();
}

// Note, in Deal we also handle ComputeUnitRemoved.
export function handleComputeUnitRemovedFromDeal(event: ComputeUnitRemovedFromDeal): void {
    // Call the contract to extract peerId of the computeUnit.
    const peer = Peer.load(event.params.peerId.toHex()) as Peer;
    const offer = Offer.load(peer.offer) as Offer;
    const provider = Provider.load(offer.provider) as Provider;

    provider.computeUnitsAvailable += 1;
    provider.computeUnitsTotal += 1;
    provider.save();
    offer.computeUnitsAvailable += 1;
    offer.updatedAt = event.block.timestamp;
    offer.save();
}

// ---- Factory Events ----
export function handleDealCreated(event: DealCreated): void {
    const dealAddress = event.params.deal;
    log.info("[handleDealCreated] New deal created: {} by: {}", [event.params.owner.toString(), dealAddress.toString()]);

    const deal = new Deal(dealAddress.toHex());
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
