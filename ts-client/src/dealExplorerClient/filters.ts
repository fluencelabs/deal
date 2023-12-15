import type { DealStatus } from "./types.js";

export type ProviderDetailsStatusFilter = "all" | "active" | "inactive";

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
