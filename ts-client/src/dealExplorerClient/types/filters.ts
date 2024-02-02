import type { DealStatus } from "./schemes.js";

export type ProviderDetailsStatusFilter = "all" | "active" | "inactive";

/*
 * @dev :param paymentTokens: tokens addresses.
 * @dev :para search: strict search only.
 * @dev :param onlyApproved: if provider of the offer is Approved.
 * @dev :param onlyActive: if any of the CUs in the offer is Active (available for matching).
 */
export interface OffersFilters {
  search?: string | undefined;
  effectorIds?: Array<string> | undefined;
  paymentTokens?: Array<string> | undefined;
  minPricePerWorkerEpoch?: number | undefined;
  maxPricePerWorkerEpoch?: number | undefined;
  onlyApproved?: boolean;
  createdAtFrom?: number | undefined;
  createdAtTo?: number | undefined;
  providerId?: string | undefined;
  onlyActive?: boolean | undefined;
}

export interface ProvidersFilters {
  search?: string | undefined;
  effectorIds?: Array<string> | undefined;
  onlyApproved?: boolean;
}

export interface ByProviderAndStatusFilter {
  providerId?: string | undefined;
  status?: ProviderDetailsStatusFilter | undefined;
}

// @dev Where is "OnlyActive" filter? - currently, it should be filtered by
// @dev  frontend itself by Deal field: status.
export interface DealsFilters {
  search?: string | undefined;
  effectorIds?: Array<string> | undefined;
  paymentTokens?: Array<string> | undefined;
  minPricePerWorkerEpoch?: number | undefined;
  maxPricePerWorkerEpoch?: number | undefined;
  createdAtFrom?: number | undefined;
  createdAtTo?: number | undefined;
  onlyApproved?: boolean;
  providerId?: string | undefined;
  status?: DealStatus | undefined;
}

// @param search: search by provider id, commitment id, peer id
//  (strict search only).
// @param onlyActive: deprecated - use status filter instead.
export interface CapacityCommitmentsFilters {
  search?: string | undefined;
  computeUnitsCountFrom?: number | undefined;
  computeUnitsCountTo?: number | undefined;
  createdAtFrom?: number | undefined;
  createdAtTo?: number | undefined;
  onlyActive?: boolean;
  status?: "active" | "inactive";
  rewardDelegatorRateFrom?: number | undefined;
  rewardDelegatorRateTo?: number | undefined;
}

// Order Types.
export type OfferShortOrderBy =
  | "createdAt"
  | "pricePerWorkerEpoch"
  | "updatedAt";

export type ProviderShortOrderBy = "createdAt" | "computeUnitsTotal";
export type DealsShortOrderBy = "createdAt";
export type EffectorsOrderBy = "id";
export type PaymentTokenOrderBy = "id" | "symbol";
export type CapacityCommitmentsOrderBy =
  | "createdAt"
  | "computeUnitsCount"
  | "expirationAt";

export type OrderType = "asc" | "desc";
