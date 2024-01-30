// To store serializers, e.g. from indexer fields to dealExplorerClient schemes.
import type {
  ProviderOfProvidersQueryFragment
} from "../indexerClient/queries/providers-query.generated.js";
import type {
  Effector,
  OfferShort,
  ProviderBase,
  ProviderShort
} from "../types/schemes.js";
import type {
  BasicOfferFragment
} from "../indexerClient/queries/offers-query.generated.js";
import {serializeEffectorDescription, serializeProviderName} from "./logics.js";
import {DEFAULT_TOKEN_VALUE_ROUNDING, tokenValueToRounded} from "../utils.js";

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
