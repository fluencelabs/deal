// To store serializers, e.g. from indexer fields to dealExplorerClient schemes.
import type {
  ProviderOfProvidersQueryFragment
} from "../indexerClient/queries/providers-query.generated.js";
import type {
  ComputeUnit, DealShort, DealStatus,
  Effector,
  OfferShort, Peer,
  ProviderBase,
  ProviderShort
} from "../types/schemes.js";
import type {
  BasicOfferFragment, BasicPeerFragment
} from "../indexerClient/queries/offers-query.generated.js";
import {serializeEffectorDescription, serializeProviderName} from "./logics.js";
import {DEFAULT_TOKEN_VALUE_ROUNDING, tokenValueToRounded} from "../utils.js";
import type {
  BasicDealFragment,
  ComputeUnitBasicFragment
} from "../indexerClient/queries/deals-query.generated.js";

export function composeEffectors(
    manyToManyEffectors:
      | Array<{ effector: { id: string; description: string } }>
      | null
      | undefined,
  ): Array<Effector> {
    const composedEffectors: Array<Effector> = [];
    if (!manyToManyEffectors) {
      return composedEffectors;
    }
    for (const effector of manyToManyEffectors) {
      composedEffectors.push({
        cid: effector.effector.id,
        description: serializeEffectorDescription(
          effector.effector.id,
          effector.effector.description,
        ),
      });
    }

    return composedEffectors;
  }

export function composeOfferShort(offer: BasicOfferFragment): OfferShort {
    return {
      id: offer.id,
      createdAt: Number(offer.createdAt),
      totalComputeUnits: Number(offer.computeUnitsTotal ?? 0),
      freeComputeUnits: Number(offer.computeUnitsAvailable ?? 0),
      paymentToken: {
        address: offer.paymentToken.id,
        symbol: offer.paymentToken.symbol,
        decimals: offer.paymentToken.decimals.toString(),
      },
      pricePerEpoch: tokenValueToRounded(
        offer.pricePerEpoch,
        DEFAULT_TOKEN_VALUE_ROUNDING,
        offer.paymentToken.decimals,
      ),
      effectors: composeEffectors(offer.effectors),
      providerId: offer.provider.id,
    };
  }

export function composeProviderBase(
    provider: ProviderOfProvidersQueryFragment,
  ): ProviderBase {
    return {
      id: provider.id,
      createdAt: Number(provider.createdAt),
      totalComputeUnits: provider.computeUnitsTotal,
      freeComputeUnits: provider.computeUnitsAvailable,
      name: serializeProviderName(
        provider.name,
        provider.id,
        provider.approved,
      ),
      isApproved: provider.approved,
    } as ProviderBase;
  }

export function composeProviderShort(
    provider: ProviderOfProvidersQueryFragment,
  ): ProviderShort {
  const providerBase = composeProviderBase(provider);
  const composedOffers = [];
  if (provider.offers) {
    for (const offer of provider.offers) {
      composedOffers.push(
        composeOfferShort(offer as BasicOfferFragment),
      );
    }
  }
  return {
    ...providerBase,
    offers: composedOffers,
  } as ProviderShort;
}

// It composes only compute units with linked workerIds.
export function composeComputeUnits(
  fetchedComputeUnits: Array<ComputeUnitBasicFragment>,
): Array<ComputeUnit> {
  const res: Array<ComputeUnit> = [];
  for (const fetched of fetchedComputeUnits) {
    if (fetched.workerId) {
      res.push({
        id: fetched.id,
        workerId: fetched.workerId,
      });
    }
  }
  return res;
}

export function composePeers(peers: Array<BasicPeerFragment>): Array<Peer> {
  const peersComposed: Array<Peer> = [];
  if (peers) {
    for (const peer of peers) {
      peersComposed.push({
        id: peer.id,
        offerId: peer.offer.id,
        computeUnits: peer.computeUnits
          ? composeComputeUnits(
              peer.computeUnits as Array<ComputeUnitBasicFragment>,
            )
          : [],
      });
    }
  }
  return peersComposed;
}

export function composeDealsShort(
  deal: BasicDealFragment,
  fromRpcForDealShort: {
    dealStatus: DealStatus | undefined;
    freeBalance: bigint | null | undefined;
  },
): DealShort {
  const freeBalance = fromRpcForDealShort.freeBalance
    ? fromRpcForDealShort.freeBalance
    : BigInt(0);
  const totalEarnings =
    BigInt(deal.depositedSum) - BigInt(deal.withdrawalSum) - freeBalance;

  return {
    id: deal.id,
    createdAt: Number(deal.createdAt),
    client: deal.owner,
    minWorkers: deal.minWorkers,
    targetWorkers: deal.targetWorkers,
    paymentToken: {
      address: deal.paymentToken.id,
      symbol: deal.paymentToken.symbol,
      decimals: deal.paymentToken.decimals.toString(),
    },
    balance: tokenValueToRounded(
      freeBalance,
      DEFAULT_TOKEN_VALUE_ROUNDING,
      deal.paymentToken.decimals,
    ),
    status: fromRpcForDealShort.dealStatus
      ? fromRpcForDealShort.dealStatus
      : "active",
    totalEarnings: tokenValueToRounded(
      totalEarnings,
      DEFAULT_TOKEN_VALUE_ROUNDING,
      deal.paymentToken.decimals,
    ),
    // TODO: add missed implementations.
    registeredWorkers: 0,
    matchedWorkers: 0,
  };
}
