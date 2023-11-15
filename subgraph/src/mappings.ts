// File should be writen after `npm run compile` is run or you will encounter syntax and import errors.
// Note: handlers named as in the contract methods
// TODO: reorganise to sub models of mapping module.

import {
    MarketOfferRegistered,
    CoreImpl,
    ComputeUnitCreated,
    MarketOfferRegisteredEffectorsStruct, PeerCreated
} from '../generated/Core/CoreImpl'
// import {extractIdFromEvent} from "./utils";
import {getTokenSymbol} from "./networkConstants";
import {getOrCreateEffector, getOrCreateOffer, getOrCreatePeer} from "./models";
import {BigInt, Bytes, ByteArray} from "@graphprotocol/graph-ts";

import { log } from '@graphprotocol/graph-ts'
// log.info('My value is: {}', [myValue])


export function handleMarketOfferRegistered(event: MarketOfferRegistered): void {
    // Events: MarketOfferRegistered
    // Children events:
    // - emit PeerCreated(offerId, peer.peerId);
    // - emit ComputeUnitCreated(offerId, peerId, unitId);

    let entity = getOrCreateOffer(event.params.offerId.toHex())

    let effectorEntities: Array<string> = []
    const fetchedEffectors = event.params.effectors
    for (let i=0; i < fetchedEffectors.length; i++) {

        let tup: MarketOfferRegisteredEffectorsStruct
        tup = fetchedEffectors[i]
        const cid = tup.toString() + tup.toString()
        const effector = getOrCreateEffector(cid)
        effectorEntities.push(effector.id)
    }

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
    // or maybe save everything into context and then count:
    //  https://thegraph.com/docs/en/developing/creating-a-subgraph/#data-source-context.
    offer.computeUnitsSum += 1

    let peer = getOrCreatePeer(event.params.peerId.toHex())
    peer.computeUnits += 1

    peer.save()
    offer.save()
}

// It updates Peer and Offer.
export function handlePeerCreated(event: PeerCreated): void {
    let entity = getOrCreatePeer(event.params.peerId.toHex())

    entity.offer = event.params.offerId.toHex()
    entity.save()
}
