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
    PaymentTokenUpdated
} from '../../generated/Core/CoreImpl'
import {
    createOrLoadComputeUnit,
    createOrLoadDeal, createOrLoadDealEffector,
    createOrLoadEffector,
    createOrLoadOffer,
    createOrLoadOfferEffector,
    createOrLoadPeer, createOrLoadProvider, createOrLoadToken
} from "./../models";

import {log, store} from '@graphprotocol/graph-ts'
import {OfferToEffector} from "../../generated/schema";
import {getOfferInfo} from "./../contracts";
import {Deal as DealTemplate} from "../../generated/templates";
import {AppCID, getEffectorCID, parseEffectors} from "./utils";


export function handleMarketOfferRegistered(event: MarketOfferRegistered): void {
    // Events: MarketOfferRegistered
    // Nested events:
    // - emit PeerCreated(offerId, peer.peerId);
    // - emit ComputeUnitCreated(offerId, peerId, unitId);

    let entity = createOrLoadOffer(event.params.offerId.toHex())
    const appCIDS = changetype<Array<AppCID>>(event.params.effectors)
    const effectorEntities = parseEffectors(appCIDS)

    entity.createdAt = event.block.timestamp
    entity.updatedAt = event.block.timestamp

    const provider = createOrLoadProvider(event.params.owner.toHex())
    entity.provider = provider.id

    entity.paymentToken = createOrLoadToken(event.params.paymentToken.toHex()).id
    entity.pricePerEpoch = event.params.minPricePerWorkerEpoch

    // Link effectors and offer:
    for (let i=0; i < effectorEntities.length; i++) {
        const effectorId = effectorEntities[i]
        // Automatically create link or ensure that exists.
        createOrLoadOfferEffector(entity.id, effectorId)
    }

    entity.save();
}

// It updates Peer and Offer.
export function handleComputeUnitCreated(event: ComputeUnitCreated): void {
    // Parent events:
    // - emit PeerCreated(offerId, peer.peerId);
    // - emit MarketOfferRegistered
    let offer = createOrLoadOffer(event.params.offerId.toHex())
    let peer = createOrLoadPeer(event.params.peerId.toHex())

    // Since handlePeerCreated could not work with this handler, this logic moved here.
    let computeUnit = createOrLoadComputeUnit(event.params.unitId.toHex())

    const offerInfo = getOfferInfo(event.address, offer.id)
    const provider = createOrLoadProvider(offerInfo.owner.toHex())
    computeUnit.provider = provider.id

    computeUnit.peer = peer.id
    computeUnit.save()

    peer.offer = offer.id
    peer.save()

    offer.computeUnitsSum += 1
    offer.updatedAt = event.block.timestamp
    offer.save()
}

// It updates Peer and Offer.
// TODO: it does not work with handleComputeUnitCreated as well.
// export function handlePeerCreated(event: PeerCreated): void {
//     let entity = createOrLoadPeer(event.params.peerId.toHex())
//     let offer = createOrLoadOffer(event.params.offerId.toHex())
//
//     entity.offer = offer.id
//     entity.save()
// }

// ---- Update Methods ----
export function handleMinPricePerEpochUpdated(event: MinPricePerEpochUpdated): void {
    let entity = createOrLoadOffer(event.params.offerId.toHex())
    entity.pricePerEpoch = event.params.minPricePerWorkerEpoch
    entity.save()
}

export function handlePaymentTokenUpdated(event: PaymentTokenUpdated): void {
    let entity = createOrLoadOffer(event.params.offerId.toHex())
    entity.paymentToken = createOrLoadToken(event.params.paymentToken.toHex()).id
    entity.save()
}

export function handleEffectorAdded(event: EffectorAdded): void {
    let offer = createOrLoadOffer(event.params.offerId.toHex())
    const appCID = changetype<AppCID>(event.params.effector)
    const cid = getEffectorCID(appCID)
    const effector = createOrLoadEffector(cid)

    createOrLoadOfferEffector(offer.id, effector.id)

    offer.updatedAt = event.block.timestamp
    offer.save()
}

export function handleEffectorRemoved(event: EffectorRemoved): void {
    let offer = createOrLoadOffer(event.params.offerId.toHex())
    const appCID = changetype<AppCID>(event.params.effector)
    const cidToRemove = getEffectorCID(appCID)
    const effector = createOrLoadEffector(cidToRemove)

    const offerEffector = createOrLoadOfferEffector(offer.id, effector.id)
    store.remove('OfferToEffector', offerEffector.id)

    offer.updatedAt = event.block.timestamp
    offer.save()
}

export function handleComputeUnitAddedToDeal(event: ComputeUnitAddedToDeal): void {
    const unitId = event.params.unitId

    // Call the contract to extract peerId of the computeUnit.
    let peer = createOrLoadPeer(event.params.peerId.toHex())
    let offer = createOrLoadOffer(peer.offer)

    // Link CU to peer.
    let computeUnitEntity = createOrLoadComputeUnit(unitId.toHex())
    computeUnitEntity.peer = peer.id
    computeUnitEntity.save()

    // Sum CU in Offer.
    offer.computeUnitsSum += 1
    offer.updatedAt = event.block.timestamp

    peer.save()
    offer.save()
}

export function handleComputeUnitRemovedFromDeal(event: ComputeUnitRemovedFromDeal): void {
    const unitId = event.params.unitId

    // Call the contract to extract peerId of the computeUnit.
    let peer = createOrLoadPeer(event.params.peerId.toHex())
    let offer = createOrLoadOffer(peer.offer)

    // rm from storage compute unit.
    let computeUnitEntity = createOrLoadComputeUnit(unitId.toHex())
    store.remove('ComputeUnit', computeUnitEntity.id)

    offer.computeUnitsSum -= 1
    offer.updatedAt = event.block.timestamp

    peer.save()
    offer.save()
}

// ---- Factory Events ----
export function handleDealCreated(event: DealCreated): void {
    const dealAddress = event.params.deal
    log.info(
        '[handleDealCreated] New deal created: {} by: {}',
        [event.params.owner.toString(), dealAddress.toString()]
    )

    let deal = createOrLoadDeal(dealAddress.toHex())
    deal.createdAt = event.block.timestamp
    deal.owner = event.params.owner

    deal.paymentToken = event.params.paymentToken.toHex()
    deal.minWorkers = event.params.minWorkers.toI32()
    deal.targetWorkers = event.params.targetWorkers.toI32()
    deal.maxWorkersPerProvider = event.params.maxWorkersPerProvider.toI32()
    deal.pricePerWorkerEpoch = event.params.pricePerWorkerEpoch
    deal.save()

    // Get effectors.
    const appCIDS = changetype<Array<AppCID>>(event.params.effectors)
    const effectorEntities = parseEffectors(appCIDS)
    // Link effectors and deals:
    for (let i=0; i < effectorEntities.length; i++) {
        const effectorId = effectorEntities[i]
        // Automatically create link or ensure that exists.
        createOrLoadDealEffector(deal.id, effectorId)
    }

    // Start indexing this deployed contract too
    DealTemplate.create(dealAddress)
}

