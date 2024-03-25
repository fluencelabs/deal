import type { ComputeUnit, OfferDetail, Peer } from "../types/schemes.js";
import type {
  BasicPeerFragment,
  ComputeUnitBasicFragment,
  OfferDetailFragment,
} from "../indexerClient/queries/offers-query.generated.js";
import {
  type SerializationSettings,
  tokenValueToRounded,
} from "../../utils/serializers.js";
import { serializeEffectors } from "../../utils/indexerClient/serializers.js";

export function serializeComputeUnits(
  fetchedComputeUnits: Array<ComputeUnitBasicFragment>,
): Array<ComputeUnit> {
  const res: Array<ComputeUnit> = [];
  for (const fetched of fetchedComputeUnits) {
    res.push({
      id: fetched.id,
      workerId: fetched.workerId ?? undefined,
    });
  }
  return res;
}

export function serializePeers(peers: Array<BasicPeerFragment>): Array<Peer> {
  const peersComposed: Array<Peer> = [];
  if (peers) {
    for (const peer of peers) {
      peersComposed.push({
        id: peer.id,
        offerId: peer.offer.id,
        computeUnits: peer.computeUnits
          ? serializeComputeUnits(
              peer.computeUnits as Array<ComputeUnitBasicFragment>,
            )
          : [],
      });
    }
  }
  return peersComposed;
}

export function serializeOfferDetail(
  offer: OfferDetailFragment,
  serializationSettings: SerializationSettings,
): OfferDetail {
  const serializedPeers: Array<Peer> =
    offer.peers?.map((peer) => {
      return {
        id: peer.id,
        offerId: peer.offer.id,
        computeUnits:
          peer.computeUnits?.map((computeUnit) => {
            return {
              id: computeUnit.id,
              workerId: computeUnit.workerId ?? undefined,
            };
          }) ?? [],
      };
    }) ?? [];
  return {
    id: offer.id,
    createdAt: Number(offer.createdAt),
    updatedAt: Number(offer.updatedAt),
    totalComputeUnits: Number(offer.computeUnitsTotal ?? 0),
    freeComputeUnits: Number(offer.computeUnitsAvailable ?? 0),
    paymentToken: {
      address: offer.paymentToken.id,
      symbol: offer.paymentToken.symbol,
      decimals: offer.paymentToken.decimals.toString(),
    },
    // USDC.
    pricePerEpoch: tokenValueToRounded(
      offer.pricePerEpoch,
      serializationSettings.parseTokenToFixedDefault,
      offer.paymentToken.decimals,
    ),
    effectors: serializeEffectors(offer.effectors),
    providerId: offer.provider.id,
    peersCount: offer.peers?.length ?? 0,
    peers: serializedPeers,
  };
}
