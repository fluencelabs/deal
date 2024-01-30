// Module is for filter serializers.
import type {
  CapacityCommitmentsFilters, DealsFilters, OffersFilters,
  ProvidersFilters
} from "../types/filters.js";
import type {
  CapacityCommitment_Filter, Deal_Filter, Offer_Filter,
  Provider_Filter
} from "../indexerClient/generated.types.js";
import {valueToTokenValue} from "../utils.js";

export class FiltersError extends Error {}
export class ValidTogetherFiltersError extends FiltersError {}


export async function serializeProviderFiltersToIndexer(
  providersFilters?: ProvidersFilters,
): Promise<Provider_Filter> {
  // Only for registered providers.
  const convertedFilters: Provider_Filter = { and: [
      {
        registered: true,
      }
    ] };
  if (!providersFilters) {
    return convertedFilters;
  }
  if (providersFilters.onlyApproved) {
    convertedFilters.and?.push({
      approved: true,
    });
  }
  if (providersFilters.search) {
    const search = providersFilters.search;
    convertedFilters.and?.push({
      or: [{ id: search.toLowerCase() }, { name: search }],
    });
  }
  // https://github.com/graphprotocol/graph-node/issues/2539
  // https://github.com/graphprotocol/graph-node/issues/4775
  // https://github.com/graphprotocol/graph-node/blob/ad31fd9699b0957abda459340dff093b2a279074/NEWS.md?plain=1#L30
  // Thus, kinda join should be presented on client side =(.
  if (providersFilters.effectorIds) {
    // composedFilters = { offers_: { effectors_: { effector_in: providersFilters.effectorIds } } };
    console.warn("Currently effectorIds filter does not implemented.");
  }
  return convertedFilters;
}

/*
 * @dev We allow to select paymentTokens and range of values for those tokens.
 * @dev If for selected tokens decimals are not at the same: exception will be raised.
 * @dev Thus, on frontend side this "missmatch" should be avoided by checking selected
 * @dev  tokens on equal "decimals" field.
 * @dev [MVM] If no token is selected DEFAULT_FILTER_TOKEN_DECIMALS is applied.
 * @param tokenDecimals: token decimals to use for token value conversion.
 */
export async function convertOffersFiltersToIndexerType(
  v?: OffersFilters,
  tokenDecimals?: number,
): Promise<Offer_Filter> {
  if (!v) {
    return {};
  }
  const convertedFilters: Offer_Filter = { and: [] };
  if (v.onlyActive) {
    convertedFilters.and?.push({
      computeUnitsAvailable_gt: 0,
    });
  }
  if (v.onlyApproved) {
    convertedFilters.and?.push({
      provider_: { approved: true },
    });
  }
  if (v.search) {
    const search = v.search;
    convertedFilters.and?.push({
      or: [{ id: search }, { provider: search.toLowerCase() }],
    });
  }
  if (v.effectorIds) {
    convertedFilters.and?.push({
      effectors_: { effector_in: v.effectorIds },
    });
  }
  if (v.createdAtFrom) {
    convertedFilters.and?.push({ createdAt_gte: v.createdAtFrom.toString() });
  }
  if (v.createdAtTo) {
    convertedFilters.and?.push({ createdAt_lte: v.createdAtTo.toString() });
  }
  if (v.providerId) {
    convertedFilters.and?.push({ provider: v.providerId });
  }
  // Filters with relation check below.
  const paymentTokensLowerCase = v.paymentTokens?.map((tokenAddress) => {
    return tokenAddress.toLowerCase();
  });
  if (paymentTokensLowerCase) {
    convertedFilters.and?.push({ paymentToken_in: paymentTokensLowerCase });
  }
  if (v.minPricePerWorkerEpoch) {
    convertedFilters.and?.push({
      pricePerEpoch_gte: valueToTokenValue(
        v.minPricePerWorkerEpoch,
        tokenDecimals,
      ),
    });
  }
  if (v.maxPricePerWorkerEpoch) {
    convertedFilters.and?.push({
      pricePerEpoch_lte: valueToTokenValue(
        v.maxPricePerWorkerEpoch,
        tokenDecimals,
      ),
    });
  }
  return convertedFilters;
}

export async function convertDealsFiltersToIndexerType(
  v?: DealsFilters,
  tokenDecimals?: number,
): Promise<Deal_Filter> {
  if (!v) {
    return {};
  }
  if (v.onlyApproved) {
    console.warn("Currently onlyApproved filter does not implemented.");
  }
  if (v.status) {
    console.warn("Currently status filter does not implemented.");
  }
  const convertedFilters: Deal_Filter = { and: [] };
  if (v.search) {
    const search = v.search.toLowerCase();
    convertedFilters.and?.push({ or: [{ id: search }, { owner: search }] });
  }
  if (v.effectorIds) {
    convertedFilters.and?.push({
      effectors_: { effector_in: v.effectorIds },
    });
  }
  if (v.createdAtFrom) {
    convertedFilters.and?.push({ createdAt_gte: v.createdAtFrom.toString() });
  }
  if (v.createdAtTo) {
    convertedFilters.and?.push({ createdAt_lte: v.createdAtTo.toString() });
  }
  if (v.providerId) {
    convertedFilters.and?.push({
      addedComputeUnits_: { provider: v.providerId.toLowerCase() },
    });
  }
  // Filters with relation check below.
  const paymentTokensLowerCase = v.paymentTokens?.map((tokenAddress) => {
    return tokenAddress.toLowerCase();
  });
  if (paymentTokensLowerCase) {
    convertedFilters.and?.push({ paymentToken_in: paymentTokensLowerCase });
  }
  if (v.minPricePerWorkerEpoch) {
    convertedFilters.and?.push({
      pricePerWorkerEpoch_gte: valueToTokenValue(
        v.minPricePerWorkerEpoch,
        tokenDecimals,
      ),
    });
  }
  if (v.maxPricePerWorkerEpoch) {
    convertedFilters.and?.push({
      pricePerWorkerEpoch_lte: valueToTokenValue(
        v.maxPricePerWorkerEpoch,
        tokenDecimals,
      ),
    });
  }
  return convertedFilters;
}


export function serializeCapacityCommitmentsFiltersToIndexer(
  v?: CapacityCommitmentsFilters,
  currentEpoch?: string,
): CapacityCommitment_Filter {
  if (!v) {
    return {};
  }
  const convertedFilters: CapacityCommitment_Filter = { and: [] };
  if (v.search) {
    convertedFilters.and?.push({
      or: [
        {id: v.search},
        {peer_: {id: v.search}},
        {provider_: {id: v.search}},
      ],
    });
  }
  if (v.createdAtFrom) {
    convertedFilters.and?.push({ createdAt_gte: v.createdAtFrom.toString() });
  }
  if (v.createdAtTo) {
    convertedFilters.and?.push({ createdAt_lte: v.createdAtTo.toString() });
  }
  if (v.computeUnitsCountFrom) {
    convertedFilters.and?.push({ computeUnitsCount_gte: v.computeUnitsCountFrom });
  }
  if (v.computeUnitsCountTo) {
    convertedFilters.and?.push({ computeUnitsCount_lte: v.computeUnitsCountTo });
  }
  if (v.rewardDelegatorRateFrom) {
    convertedFilters.and?.push({ rewardDelegatorRate_gte: v.rewardDelegatorRateFrom });
  }
  if (v.rewardDelegatorRateTo) {
    convertedFilters.and?.push({ rewardDelegatorRate_lte: v.rewardDelegatorRateTo });
  }
  if (v.onlyActive) {
    if (currentEpoch == undefined) {
      throw new Error("Assertion: currentEpoch is undefined but v.onlyActive filter is used.");
    }
    convertedFilters.and?.push({
      // Duplication as it is in DealExplorerClient: serializeCapacityCommitmentsFiltersToIndexer.
      startEpoch_lte: currentEpoch,
      endEpoch_gt: currentEpoch,
      // On each submitProof indexer should save nextCCFailedEpoch, and
      //  in query we relay on that field to filter Failed CC.
      nextCCFailedEpoch_gt: currentEpoch,
      deleted: false,
      // Wait delegation is duplicating startEpoch_lte check, though.
      status_not_in: ["WaitDelegation", "Removed", "Failed"],
    });
  }
  return {}
}
