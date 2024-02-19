// Seralizers for order by fields: b/w scheme and indexer.
import type {
  CapacityCommitmentsOrderBy,
  DealsShortOrderBy,
  OfferShortOrderBy,
  ProofsOrderBy,
} from "../types/filters.js";
import type {
  CapacityCommitment_OrderBy,
  Deal_OrderBy,
  Offer_OrderBy,
  SubmittedProof_OrderBy,
} from "../indexerClient/generated.types.js";

export function serializeOfferShortOrderByToIndexer(
  v: OfferShortOrderBy,
): Offer_OrderBy {
  if (v == "pricePerWorkerEpoch") {
    return "pricePerEpoch" as Offer_OrderBy;
  }
  return v as Offer_OrderBy;
}

export function serializeDealShortOrderByToIndexer(
  v: DealsShortOrderBy,
): Deal_OrderBy {
  // Currently no needs in convert because only createdAt.
  return v as Deal_OrderBy;
}

export function serializeCapacityCommitmentsOrderByToIndexer(
  v: CapacityCommitmentsOrderBy,
): CapacityCommitment_OrderBy {
  if (v == "createdAt") {
    return "startEpoch";
  }
  if (v == "expirationAt") {
    return "endEpoch";
  }
  if (v == "computeUnitsCount") {
    return "computeUnitsCount";
  }
  throw new Error(`Assertion: unknown CapacityCommitmentsOrderBy value: ${v}`);
}

export function serializeProofsOrderByToIndexer(
  v: ProofsOrderBy,
): SubmittedProof_OrderBy {
  const res = "createdAt";
  if (v == "createdAt" || v == "epoch") {
    return res;
  }
  throw new Error(`Assertion: unknown ProofsOrderBy value: ${v}`);
}
