import type { OffersFilterIn } from "../types/filters.js";
import type { Offer_Filter } from "../indexerClient/generated.types.js";

export function serializeOffersFilterIn(filter?: OffersFilterIn): Offer_Filter {
  if (!filter) {
    return {};
  }
  const serialized: Offer_Filter = {};
  if (filter.ids) {
    serialized["id_in"] = filter.ids;
  }
  return serialized;
}
