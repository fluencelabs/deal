import {Deal, Effector, Offer, OfferEffector, Peer, Token, DealEffector} from "../generated/schema";
import {BigInt, Bytes} from "@graphprotocol/graph-ts";
import {getTokenSymbol} from "./networkConstants";

const ZERO_BYTES = Bytes.fromHexString("0x0000000000000000000000000000000000000000")


export function createOrLoadToken(tokenAddress: string): Token {
    let entity = Token.load(tokenAddress)

    if (entity == null) {
        entity = new Token(tokenAddress)
        entity.symbol = getTokenSymbol(Bytes.fromHexString(tokenAddress))
        entity.save()
    }
    return entity as Token
}

// TODO: make generic.
export function createOrLoadOffer(
    offerId: string,
    ): Offer {
    let entity = Offer.load(offerId)

    if (entity == null) {
        entity = new Offer(offerId)
        entity.createdAt = BigInt.fromI32(0)
        entity.updatedAt = BigInt.fromI32(0)
        entity.provider = ZERO_BYTES
        entity.paymentToken = ""
        entity.pricePerEpoch = BigInt.fromI32(0)
        // entity.effectors = []
        entity.save()
    }
    return entity as Offer
}

// TODO: add description mapper.
const DEFAULT_EFFECTOR_DESCRIPTION = "DEFAULT_EFFECTOR_DESCRIPTION"

export function createOrLoadEffector(cid: string): Effector {
    let entity = Effector.load(cid)

    if (entity == null) {
        entity = new Effector(cid)
        entity.description = DEFAULT_EFFECTOR_DESCRIPTION
        entity.save()
    }
    return entity as Effector
}

export function createOrLoadOfferEffector(offerId: string, effectorId: string): OfferEffector {
    const concattedIds = offerId.concat(effectorId)

    let entity = OfferEffector.load(concattedIds)

    if (entity == null) {
        entity = new OfferEffector(concattedIds)
        entity.offer = offerId
        entity.effector = effectorId
        entity.save()
    }
    return entity as OfferEffector
}

export function createOrLoadPeer(peerId: string): Peer {
    let entity = Peer.load(peerId)

    if (entity == null) {
        entity = new Peer(peerId)
        entity.computeUnits = 0
        entity.offer = ""
        entity.save()
    }
    return entity as Peer
}


export function createOrLoadDeal(dealId: string): Deal {
    let entity = Deal.load(dealId)
    if (entity == null) {
        entity = new Deal(dealId)
        entity.createdAt = BigInt.fromI32(0)
        entity.client = ZERO_BYTES
        entity.withdrawalSum = BigInt.fromI32(0)
        entity.depositedSum = BigInt.fromI32(0)
        entity.paymentToken = ""
        entity.minWorkers = 0
        entity.maxWorkersPerProvider = 0
        entity.targetWorkers = 0
        entity.pricePerWorkerEpoch = BigInt.fromI32(0)
        entity.save()

    }
    return entity as Deal
}

export function createOrLoadDealEffector(dealId: string, effectorId: string): DealEffector {
    const concattedIds = dealId.concat(effectorId)
    let entity = DealEffector.load(concattedIds)

    if (entity == null) {
        entity = new DealEffector(concattedIds)
        entity.deal = dealId
        entity.effector = effectorId
        entity.save()
    }
    return entity as DealEffector
}
