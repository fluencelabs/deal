import {Deal, Effector, Offer, OfferToEffector, Peer, Token, DealToEffector, ComputeUnit} from "../generated/schema";
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

export function createOrLoadOfferEffector(offerId: string, effectorId: string): OfferToEffector {
    const concattedIds = offerId.concat(effectorId)

    let entity = OfferToEffector.load(concattedIds)

    if (entity == null) {
        entity = new OfferToEffector(concattedIds)
        entity.offer = offerId
        entity.effector = effectorId
        entity.save()
    }
    return entity as OfferToEffector
}

export function createOrLoadPeer(peerId: string): Peer {
    let entity = Peer.load(peerId)

    if (entity == null) {
        entity = new Peer(peerId)
        entity.offer = ""
        entity.save()
    }
    return entity as Peer
}

export function createOrLoadComputeUnit(cuId: string): ComputeUnit {
    let entity = ComputeUnit.load(cuId)

    if (entity == null) {
        entity = new ComputeUnit(cuId)
        entity.peer = ""
        entity.save()
    }
    return entity as ComputeUnit
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
        entity.appCID = ""
        entity.maxWorkersPerProvider = 0
        entity.targetWorkers = 0
        entity.pricePerWorkerEpoch = BigInt.fromI32(0)
        entity.save()

    }
    return entity as Deal
}

export function createOrLoadDealEffector(dealId: string, effectorId: string): DealToEffector {
    const concattedIds = dealId.concat(effectorId)
    let entity = DealToEffector.load(concattedIds)

    if (entity == null) {
        entity = new DealToEffector(concattedIds)
        entity.deal = dealId
        entity.effector = effectorId
        entity.save()
    }
    return entity as DealToEffector
}
