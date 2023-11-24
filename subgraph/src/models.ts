import {
    Deal,
    Effector,
    Offer,
    OfferToEffector,
    Peer,
    Token,
    DealToEffector,
    ComputeUnit,
    Provider
} from "../generated/schema";
import {BigInt, Bytes} from "@graphprotocol/graph-ts";
import {getTokenSymbol} from "./networkConstants";

const ZERO_BYTES = Bytes.fromHexString("0x0000000000000000000000000000000000000000")
const ZERO_STRING = ""
const ZERO_BIG_INT = BigInt.fromI32(0)


export function createOrLoadToken(tokenAddress: string): Token {
    let entity = Token.load(tokenAddress)

    if (entity == null) {
        entity = new Token(tokenAddress)
        entity.symbol = getTokenSymbol(Bytes.fromHexString(tokenAddress))
        entity.save()
    }
    return entity as Token
}

export function createOrLoadProvider(providerId: string): Provider {
    let entity = Provider.load(providerId)

    if (entity == null) {
        entity = new Provider(providerId)
        entity.save()
    }
    return entity as Provider
}

// TODO: make generic.
export function createOrLoadOffer(
    offerId: string,
    ): Offer {
    let entity = Offer.load(offerId)

    if (entity == null) {
        entity = new Offer(offerId)
        entity.createdAt =
        entity.updatedAt = ZERO_BIG_INT
        entity.provider = ZERO_STRING
        entity.paymentToken = ZERO_STRING
        entity.pricePerEpoch = ZERO_BIG_INT
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
        entity.offer = ZERO_STRING
        entity.save()
    }
    return entity as Peer
}

export function createOrLoadComputeUnit(cuId: string): ComputeUnit {
    let entity = ComputeUnit.load(cuId)

    if (entity == null) {
        entity = new ComputeUnit(cuId)
        entity.peer = ZERO_STRING
        entity.provider = ZERO_STRING
        entity.save()
    }
    return entity as ComputeUnit
}


export function createOrLoadDeal(dealId: string): Deal {
    let entity = Deal.load(dealId)
    if (entity == null) {
        entity = new Deal(dealId)
        entity.createdAt = ZERO_BIG_INT
        entity.client = ZERO_BYTES
        entity.withdrawalSum = ZERO_BIG_INT
        entity.depositedSum = ZERO_BIG_INT
        entity.paymentToken = ZERO_STRING
        entity.minWorkers = 0
        entity.appCID = ZERO_STRING
        entity.maxWorkersPerProvider = 0
        entity.targetWorkers = 0
        entity.pricePerWorkerEpoch = ZERO_BIG_INT
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
