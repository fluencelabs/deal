import type {DealStatus} from "./schemes.js";

export type ProviderDetailsStatusFilter = "all" | "active" | "inactive";

/*
 * @dev :param paymentTokens: tokens addresses.
 * @dev :para search: strict search only.
 */
export interface OffersFilters {
  search?: string | undefined;
  effectorIds?: Array<string> | undefined;
  paymentTokens?: Array<string> | undefined;
  minPricePerWorkerEpoch?: number | undefined;
  maxPricePerWorkerEpoch?: number | undefined;
  //? eslint-disable-next-line @typescript-eslint/no-unused-vars
  onlyApproved?: boolean;
  createdAtFrom?: number | undefined;
  createdAtTo?: number | undefined;
  providerId?: string | undefined;
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

// Order Types.
export type OfferShortOrderBy =
  | "createdAt"
  | "pricePerWorkerEpoch"
  | "updatedAt";

export type ProviderShortOrderBy = "createdAt" | "computeUnitsTotal";

export type DealsShortOrderBy = "createdAt";

export type EffectorsOrderBy = "id";
export type PaymentTokenOrderBy = "id" | "symbol";

export type OrderType = "asc" | "desc";
