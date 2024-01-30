import type {
  CapacityCommitmentsFilters,
  ProvidersFilters
} from "../types/filters.js";
import type {
  CapacityCommitment_Filter,
  Provider_Filter
} from "../indexerClient/generated.types.js";

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

export async function serializeCapacityCommitmentsFiltersToIndexer(
  filters?: CapacityCommitmentsFilters
): Promise<CapacityCommitment_Filter> {
  if (!filters) {
    return {};
  }
  // TODO
  return {}
}
