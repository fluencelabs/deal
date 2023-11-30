export type ProviderShort = {
  id: string;
  name: string;
  createdAt: number;
  totalComputeUnits: number;
  freeComputeUnits: number;
  isApproved: boolean;
  offers: Array<OfferShort>;
};

export type OfferShort = {
  name: string;
  createdAt: number;
  totalComputeUnits: number;
  freeComputeUnits: number;
  paymentToken: PaymentToken;
  effectors: Array<Effector>;
};

export type PaymentToken = {
  address: string;
  symbol: string;
};

export type Provider = {
  id: string;
  name: string;
  createdAt: number;
  totalComputeUnits: number;
  freeComputeUnits: number;
  isApproved: boolean;
  peerCount: number;
  effectorCount: number;
  revenue: Array<Revenue>;
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

export type Offer = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  maxCollateralPerWorker: number;
  minPricePerWorkerEpoch: number;
  paymentToken: PaymentToken;
  totalComputeUnits: number;
  freeComputeUnits: number;
  effectors: Array<Effector>;
  peers: Array<Peer>;
};

export type Effector = {
  cid: string;
  description: string;
};

export type Peer = {
  id: string;
  offerId: string;
  transactionHash: string;
  workerSlots: number;
  computeUnits: Array<ComputeUnit>;
};

export type ComputeUnit = {
  id: string;
  collateral: number;
  workerId: string | undefined;
};

export type ShortDeal = {
  id: string;
  offerId: string;
  client: string;
  paymentToken: PaymentToken;
  createdAt: number;
  minWorkers: number;
  targetWorkers: number;
  registeredWorkers: number;
  status: DealStatus;
};

export type DealShort = {
  id: string;
  createdAt: number;
  owner: string;
  minWorkers: number;
  targetWorkers: number;
  matchedWorkers: number;
  registeredWorkers: number;
  balance: number;
  status: DealStatus;
};

export type Deal = {
  id: string;
  appCID: string;
  owner: string;
  createdAt: number;
  minWorkers: number;
  targetWorkers: number;
  matchedWorkers: number;
  registeredWorkers: number;
  paymentToken: PaymentToken;
  pricePerWorkerEpoch: number;
  collateral: number;
  computeUnits: Array<ComputeUnit>;
  whitelist: Array<string>;
  blacklist: Array<string>;
  effectors: Array<Effector>;
  totalPaidAmount: number;
  status: DealStatus;
};

export enum DealStatus {
  Inactive,
  Active,
  Ended,
}

export enum ProviderShortOrder {
  TotalComputeUnits,
  CreatedAt,
}

export enum OfferShortOrder {
  CreatedAt,
  PricePerWorkerEpoch,
  MaxCollateralPerWorker,
  UpdatedAt,
}

export enum ProviderShortSearch {
  None,
  Id,
  Name,
  EffectorIds,
}

export enum ProviderDetailsStatusFilter {
  All,
  Active,
  Inactive,
}
