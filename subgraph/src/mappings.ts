// File should be writen after `npm run compile` is run or you will encounter syntax and import errors.
// Note: handlers named as in the contract methods
// TODO: reorganise to sub models of mapping module.

import {
    MarketOfferRegistered,
    CoreImpl,
    ComputeUnitCreated,
    MarketOfferRegisteredEffectorsStruct,
    PeerCreated,
    MinPricePerEpochUpdated,
    PaymentTokenUpdated,
    EffectorAdded,
    EffectorAddedEffectorStruct, EffectorRemoved, ComputeUnitRemovedFromDeal, ComputeUnitAddedToDeal
} from '../generated/Core/CoreImpl'
// import {extractIdFromEvent} from "./utils";
import {getTokenSymbol} from "./networkConstants";
import {getOrCreateEffector, getOrCreateOffer, getOrCreatePeer} from "./models";
import {BigInt, Bytes, ByteArray} from "@graphprotocol/graph-ts";

import { log } from '@graphprotocol/graph-ts'
// log.info('My value is: {}', [myValue])

function parseEffectors(effectors: Array<MarketOfferRegisteredEffectorsStruct>): Array<string> {
    let effectorEntities: Array<string> = []
    for (let i=0; i < effectors.length; i++) {
        const cid = getEffectorCID(effectors[i])
        const effector = getOrCreateEffector(cid)
        effectorEntities.push(effector.id)
    }
    return effectorEntities
}

// TODO: marke type as tuple of [Bytes, Bytes]. Currently: subgraphERROR TS1110: Type expected.
function getEffectorCID(effectorTuple: MarketOfferRegisteredEffectorsStruct): string {
    const cid = effectorTuple.prefixes.toString() + effectorTuple.hash.toString()
    log.info('[getEffectorCID] Extract CID from effector: {}', [cid])
    return cid
}


export function handleMarketOfferRegistered(event: MarketOfferRegistered): void {
    // Events: MarketOfferRegistered
    // Children events:
    // - emit PeerCreated(offerId, peer.peerId);
    // - emit ComputeUnitCreated(offerId, peerId, unitId);

    let entity = getOrCreateOffer(event.params.offerId.toHex())
    const effectorEntities = parseEffectors(event.params.effectors)

    entity.createdAt = event.block.timestamp
    entity.provider = event.params.owner
    entity.tokenSymbol = getTokenSymbol(event.params.paymentToken)
    entity.pricePerEpoch = event.params.minPricePerWorkerEpoch
    entity.effectors = effectorEntities

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
    peer.computeUnits += 1

    peer.save()
    offer.save()
}

// It updates Peer and Offer.
export function handlePeerCreated(event: PeerCreated): void {
    let entity = getOrCreatePeer(event.params.peerId.toHex())
    let offer = getOrCreateOffer(event.params.offerId.toHex())

    entity.offer = offer.id
    entity.save()
}

// Update Methods
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
    let entity = getOrCreateOffer(event.params.offerId.toHex())
    const effectorTuple = event.params.effector
    const cid = effectorTuple.prefixes.toString() + effectorTuple.hash.toString()
    const effector = getOrCreateEffector(cid)
    if (entity.effectors == null) {
        entity.effectors = [cid]
    } else {
        entity.effectors!.push(effector.id)
    }
    entity.save()
}

export function handleEffectorRemoved(event: EffectorRemoved): void {
    let entity = getOrCreateOffer(event.params.offerId.toHex())
    const effectorTuple = event.params.effector
    const cidToRemove = effectorTuple.prefixes.toString() + effectorTuple.hash.toString()

    if (entity.effectors == null) {
        return
    }

    // Find effector to remove
    let effectorsToSave: Array<string> = []
    for (let i=0; i < entity.effectors!.length; i++) {
        const currentEffector = entity.effectors![i]
        if (currentEffector !== cidToRemove) {
            continue
        }
        effectorsToSave.push(currentEffector)
    }
    entity.effectors = effectorsToSave
    entity.save()
}

export function handleComputeUnitAddedToDeal(event: ComputeUnitAddedToDeal): void {
    // TODO: resolve even without no info about dealId
}

export function handleComputeUnitRemovedFromDeal(event: ComputeUnitRemovedFromDeal): void {
    // TODO: resolve even without no info about dealId
}
