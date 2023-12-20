export interface ProviderShortListView extends Array<ProviderShort> {}

export interface OfferShortListView extends Array<OfferShort> {}

export interface DealShortListView extends Array<DealShort> {}

export type ProviderBase = {
  id: string;
  name: string;
  createdAt: number;
  totalComputeUnits: number;
  freeComputeUnits: number;
  isApproved: boolean;
};

export interface ProviderShort extends ProviderBase {
  offers: Array<OfferShort>;
}

export interface ProviderDetail extends ProviderBase {
  peerCount: number;
  effectorCount: number;
  // deprecated.
  // revenue: Array<Revenue>;
}

// TODO: What is offer.name? deprecated.
export type OfferShort = {
  id: string;
  createdAt: number;
  totalComputeUnits: number;
  freeComputeUnits: number;
  paymentToken: PaymentToken;
  effectors: Array<Effector>;
};

// TODO: maxCollateralPerWorker deprecated
// TODO: minPricePerWorkerEpoch deprecated
export interface OfferDetail extends OfferShort {
  peers: Array<Peer>;
  updatedAt: number;
}

export type PaymentToken = {
  address: string;
  symbol: string;
  decimals: string;
};

export type Revenue = {
  total: number;
  paymentToken: PaymentToken;
  byDays: RevenueByDay[];
};

export type RevenueByDay = {
  time: number;
  value: number;
};

export type Effector = {
  cid: string;
  description: string;
};

// TODO: transactionHash deprecated.
// TODO: workerSlots deprecated.
export type Peer = {
  id: string;
  offerId: string;
  computeUnits: Array<ComputeUnit>;
};

// TODO: deprecated: collateral.
export type ComputeUnit = {
  id: string;
  workerId: string | undefined;
};

export type DealShort = {
  id: string;
  createdAt: number;
  client: string;
  paymentToken: PaymentToken;
  minWorkers: number;
  targetWorkers: number;
  matchedWorkers: number;
  registeredWorkers: number;
  // Active if CU has worker set.
  status: DealStatus;
  balance: string;
  totalEarnings: string;
};

// Collateral deprecated.
export interface DealDetail extends DealShort {
  pricePerWorkerEpoch: string;
  maxWorkersPerProvider: number;
  computeUnits: Array<ComputeUnit>;
  whitelist: Array<string>;
  blacklist: Array<string>;
  effectors: Array<Effector>;
}

// Status undefined == problem with networks, etc.
export type DealStatus = "inactive" | "active" | "ended" | "undefined";

export type ProviderShortOrderBy = "createdAt" | "computeUnitsTotal";
export type OfferShortOrderBy =
  | "createdAt"
  | "pricePerWorkerEpoch"
  | "updatedAt";

export type DealsShortOrderBy = "createdAt";

export type EffectorsOrderBy = "id";
export type PaymentTokenOrderBy = "id" | "symbol";

export type OrderType = "asc" | "desc";
