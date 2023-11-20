import {Effector, Offer, OfferEffector, Peer} from "../generated/schema";
import {BigInt, Bytes} from "@graphprotocol/graph-ts";

const ZERO_BYTES = Bytes.fromHexString("0x0000000000000000000000000000000000000000")

// TODO: make generic.
// TODO: rename to getOrLoad
export function getOrCreateOffer(
    offerId: string,
    ): Offer {
    let entity = Offer.load(offerId)

    if (entity == null) {
        entity = new Offer(offerId)
        entity.createdAt = BigInt.fromI32(0)
        entity.updatedAt = BigInt.fromI32(0)
        entity.provider = ZERO_BYTES
        entity.tokenSymbol = ""
        entity.pricePerEpoch = BigInt.fromI32(0)
        // entity.effectors = []
        entity.save()
    }
    return entity as Offer
}

// TODO: add description mapper.
const DEFAULT_EFFECTOR_DESCRIPTION = "DEFAULT_EFFECTOR_DESCRIPTION"

export function getOrCreateEffector(cid: string): Effector {
    let entity = Effector.load(cid)

    if (entity == null) {
        entity = new Effector(cid)
        entity.description = DEFAULT_EFFECTOR_DESCRIPTION
        entity.save()
    }
    return entity as Effector
}

export function getOrCreateOfferEffector(offerId: string, effectorId: string): OfferEffector {
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

export function getOrCreatePeer(peerId: string): Peer {
    let entity = Peer.load(peerId)

    if (entity == null) {
        entity = new Peer(peerId)
        entity.computeUnits = 0
        entity.offer = ""
        entity.save()
    }
    return entity as Peer
}
