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
    MarketOfferRegisteredEffectorsStruct,
    MinPricePerEpochUpdated,
    PaymentTokenUpdated
} from '../../generated/Core/CoreImpl'
import {getTokenSymbol} from "./../networkConstants";
import {getOrCreateEffector, getOrCreateOffer, getOrCreateOfferEffector, getOrCreatePeer} from "./../models";

import {log, store} from '@graphprotocol/graph-ts'
import {OfferEffector} from "../../generated/schema";
import {getComputeUnit} from "./../contracts";
import {Deal} from "../../generated/templates";


function parseEffectors(effectors: Array<MarketOfferRegisteredEffectorsStruct>): Array<string> {
    let effectorEntities: Array<string> = []
    for (let i=0; i < effectors.length; i++) {
        const cid = getEffectorCID(effectors[i])
        const effector = getOrCreateEffector(cid)
        effectorEntities.push(effector.id)
    }
    return effectorEntities
}


function getEffectorCID(effectorTuple: MarketOfferRegisteredEffectorsStruct): string {
    const cid = effectorTuple.prefixes.toString() + effectorTuple.hash.toString()
    log.info('[getEffectorCID] Extract CID from effector: {}', [cid])
    return cid
}


export function handleMarketOfferRegistered(event: MarketOfferRegistered): void {
    // Events: MarketOfferRegistered
    // Nested events:
    // - emit PeerCreated(offerId, peer.peerId);
    // - emit ComputeUnitCreated(offerId, peerId, unitId);

    let entity = getOrCreateOffer(event.params.offerId.toHex())
    const effectorEntities = parseEffectors(event.params.effectors)

    entity.createdAt = event.block.timestamp
    entity.updatedAt = event.block.timestamp
    entity.provider = event.params.owner
    entity.tokenSymbol = getTokenSymbol(event.params.paymentToken)
    entity.pricePerEpoch = event.params.minPricePerWorkerEpoch

    // Link effectors and offer:
    for (let i=0; i < effectorEntities.length; i++) {
        const effectorId = effectorEntities[i]
        // Automatically create link or ensure that exists.
        getOrCreateOfferEffector(entity.id, effectorId)
    }

    // TODO: how to Handle ComputeUnitCreated events as well via transaction logs instead of contract call.
    //  mb the flow via separate handler is more natural.
    // if (event.receipt !== null) {
    //     event.receipt!.logs.forEach((txLog) => {
    //         log.info('event.receipt.logs {} and type of: {}', [txLog.topics.toString(), txLog.logType]);
    //     })
    // }
    entity.save();
}

// It updates Peer and Offer.
export function handleComputeUnitCreated(event: ComputeUnitCreated): void {
    // Parent events:
    // - emit PeerCreated(offerId, peer.peerId);
    // - emit MarketOfferRegistered
    let offer = getOrCreateOffer(event.params.offerId.toHex())
    let peer = getOrCreatePeer(event.params.peerId.toHex())
    // or maybe save everything into context and then count:
    //  https://thegraph.com/docs/en/developing/creating-a-subgraph/#data-source-context.
    offer.computeUnitsSum += 1

    // Since handlePeerCreated could not work with this handler, this logic moved here.
    peer.computeUnits += 1

    peer.offer = offer.id
    peer.save()

    offer.updatedAt = event.block.timestamp
    offer.save()
}

// It updates Peer and Offer.
// TODO: it does not work with handleComputeUnitCreated as well.
// export function handlePeerCreated(event: PeerCreated): void {
//     let entity = getOrCreatePeer(event.params.peerId.toHex())
//     let offer = getOrCreateOffer(event.params.offerId.toHex())
//
//     entity.offer = offer.id
//     entity.save()
// }

// ---- Update Methods ----
export function handleMinPricePerEpochUpdated(event: MinPricePerEpochUpdated): void {
    let entity = getOrCreateOffer(event.params.offerId.toHex())
    entity.pricePerEpoch = event.params.minPricePerWorkerEpoch
    entity.save()
}

export function handlePaymentTokenUpdated(event: PaymentTokenUpdated): void {
    let entity = getOrCreateOffer(event.params.offerId.toHex())
    entity.tokenSymbol = getTokenSymbol(event.params.paymentToken)
    entity.save()
}

export function handleEffectorAdded(event: EffectorAdded): void {
    let offer = getOrCreateOffer(event.params.offerId.toHex())
    const effectorTuple = event.params.effector
    const cid = effectorTuple.prefixes.toString() + effectorTuple.hash.toString()
    const effector = getOrCreateEffector(cid)

    getOrCreateOfferEffector(offer.id, effector.id)

    offer.updatedAt = event.block.timestamp
    offer.save()
}

export function handleEffectorRemoved(event: EffectorRemoved): void {
    let offer = getOrCreateOffer(event.params.offerId.toHex())
    const effectorTuple = event.params.effector
    const cidToRemove = effectorTuple.prefixes.toString() + effectorTuple.hash.toString()
    const effector = getOrCreateEffector(cidToRemove)

    const offerEffector = getOrCreateOfferEffector(offer.id, effector.id)
    store.remove('OfferEffector', offerEffector.id)

    offer.updatedAt = event.block.timestamp
    offer.save()
}

export function handleComputeUnitAddedToDeal(event: ComputeUnitAddedToDeal): void {
    const unitId = event.params.unitId

    // Call the contract to extract peerId of the computeUnit.
    let computeUnit = getComputeUnit(event.address, unitId)
    let peer = getOrCreatePeer(computeUnit.peerId.toHex())
    let offer = getOrCreateOffer(peer.offer)

    peer.computeUnits += 1
    offer.computeUnitsSum += 1
    offer.updatedAt = event.block.timestamp

    peer.save()
    offer.save()
}

export function handleComputeUnitRemovedFromDeal(event: ComputeUnitRemovedFromDeal): void {
    const unitId = event.params.unitId

    // Call the contract to extract peerId of the computeUnit.
    let computeUnit = getComputeUnit(event.address, unitId)
    let peer = getOrCreatePeer(computeUnit.peerId.toHex())
    let offer = getOrCreateOffer(peer.offer)

    peer.computeUnits -= 1
    offer.computeUnitsSum -= 1
    offer.updatedAt = event.block.timestamp

    peer.save()
    offer.save()
}

// ---- Factory Events ----
export function handleDealCreated(event: DealCreated): void {
    log.info(
        '[handleDealCreated] New deal created: {} by: {}',
        [event.params.owner.toString(), event.params.deal.toString()]
    )
    Deal.create(event.params.deal)
}

