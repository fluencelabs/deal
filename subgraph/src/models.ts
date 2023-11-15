import {Effector, Offer, Peer} from "../generated/schema";
import {BigInt, Bytes, ByteArray} from "@graphprotocol/graph-ts";

// TODO: make generic.
export function getOrCreateOffer(
    offerId: string,
    ): Offer {
    let entity = Offer.load(offerId)

    if (entity == null) {
        entity = new Offer(offerId)
        entity.createdAt = BigInt.fromI32(0)
        entity.provider = Bytes.fromHexString("0")
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
        entity.CID = Bytes.fromHexString("0")
        entity.Description = DEFAULT_EFFECTOR_DESCRIPTION
        entity.save()
    }
    return entity as Effector
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
