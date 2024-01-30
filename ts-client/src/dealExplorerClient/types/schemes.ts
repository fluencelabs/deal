// Schemes that dealExplorerClient should compose and return (aka API of dealExplorerClient).
interface ListViewABC {
  total: string | null;
}

export interface ProviderShortListView extends ListViewABC {
  data: Array<ProviderShort>;
}

export interface OfferShortListView extends ListViewABC {
  data: Array<OfferShort>;
}

export interface DealShortListView extends ListViewABC {
  data: Array<DealShort>;
}

export interface EffectorListView extends ListViewABC {
  data: Array<Effector>;
}

export interface PaymentTokenListView extends ListViewABC {
  data: Array<PaymentToken>;
}

export interface CapacityCommitmentListView extends ListViewABC {
  data: Array<CapacityCommitment>;
}

// @param expiredAt: null if not CC have not been activated yet.
export type CapacityCommitment = {
  id: string;
  createdAt: number;
  expiredAt: number | null;
  providerId: string;
  peerId: string;
  computeUnitsCount: number;
  // TODO: implement.
  // status: CapacityCommitmentStatus;
};

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
  pricePerEpoch: string;
  providerId: string;
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

// export type CapacityCommitmentStatus = "active" | "ended";
