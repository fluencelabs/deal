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
    createOrLoadPeer, createOrLoadToken
} from "./../models";

import {log, store} from '@graphprotocol/graph-ts'
import {OfferToEffector} from "../../generated/schema";
import {getComputeUnit, getDealContract} from "./../contracts";
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
    entity.provider = event.params.owner

    entity.paymentToken = createOrLoadToken(event.params.paymentToken.toHex()).id
    entity.pricePerEpoch = event.params.minPricePerWorkerEpoch

    // Link effectors and offer:
    for (let i=0; i < effectorEntities.length; i++) {
        const effectorId = effectorEntities[i]
        // Automatically create link or ensure that exists.
        createOrLoadOfferEffector(entity.id, effectorId)
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
    let offer = createOrLoadOffer(event.params.offerId.toHex())
    let peer = createOrLoadPeer(event.params.peerId.toHex())
    // or maybe save everything into context and then count:
    //  https://thegraph.com/docs/en/developing/creating-a-subgraph/#data-source-context.
    offer.computeUnitsSum += 1

    // Since handlePeerCreated could not work with this handler, this logic moved here.
    let computeUnit = createOrLoadComputeUnit(event.params.unitId.toHex())
    computeUnit.peer = peer.id
    computeUnit.save()

    peer.offer = offer.id
    peer.save()

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
    const computeUnit = getComputeUnit(event.address, unitId)
    let peer = createOrLoadPeer(computeUnit.peerId.toHex())
    let offer = createOrLoadOffer(peer.offer)

    // Link CU to peer
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
    const computeUnit = getComputeUnit(event.address, unitId)
    let peer = createOrLoadPeer(computeUnit.peerId.toHex())
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
    deal.client = event.params.owner

    // Fetch other data from the contract.
    const contract = getDealContract(dealAddress)
    deal.paymentToken = contract.paymentToken().toHex()
    deal.minWorkers = contract.minWorkers().toI32()
    deal.targetWorkers = contract.targetWorkers().toI32()
    deal.maxWorkersPerProvider = contract.maxWorkersPerProvider().toI32()
    deal.pricePerWorkerEpoch = contract.pricePerWorkerEpoch()
    deal.save()

    // Get effectors.
    const effectorsRaw = contract.effectors()
    const appCIDS = changetype<Array<AppCID>>(effectorsRaw)
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

