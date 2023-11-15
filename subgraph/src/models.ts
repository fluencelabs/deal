import {MarketOffer} from "../generated/schema";
import {BigInt, Bytes, ByteArray} from "@graphprotocol/graph-ts";

// TODO: make generic.
export function getOrCreateMarketOffer(
    offerId: string,
    ): MarketOffer {
    let entity = MarketOffer.load(offerId)

    if (entity == null) {
        entity = new MarketOffer(offerId)
        entity.createdAt = BigInt.fromI32(0)
        entity.provider = Bytes.fromHexString("0")
        entity.tokenSymbol = ""
        entity.pricePerEpoch = BigInt.fromI32(0)
        entity.save()
    }
    return entity as MarketOffer
}
