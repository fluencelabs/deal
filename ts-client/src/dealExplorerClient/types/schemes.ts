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
  data: Array<CapacityCommitmentShort>;
}

// @param expiredAt: null if not CC have not been activated yet.
// @param startedAt: is not null when delegator deposited collateral and CC could be activated.
export interface CapacityCommitmentShort {
  id: string;
  createdAt: number;
  startedAt: number | null;
  expiredAt: number | null;
  providerId: string;
  peerId: string;
  computeUnitsCount: number;
  status: CapacityCommitmentStatus;
}

// Other related fields to CC should be fetched separately, e.g.
// - list of CUs
// - proofs
// @param totalCollateral: collateral that deposited.
// @param unlockedRewards: reward for CC that unlocked to withdraw.
// @param totalRewards: total rewards collected - already withdrawn.
export interface CapacityCommitmentDetail extends CapacityCommitmentShort {
  totalCollateral: string;
  collateralToken: NativeToken;
  rewardDelegatorRate: number;
  unlockedRewards: string;
  totalRewards: string;
}

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

// Token that is used for the blockchain.
// This is a constant per chain type.
export interface NativeToken {
  symbol: string;
  decimals: string;
}

// Other tokens
export interface PaymentToken extends NativeToken {
  address: string;
}

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

export type Peer = {
  id: string;
  offerId: string;
  computeUnits: Array<ComputeUnit>;
};

export interface ComputeUnit {
  id: string;
  workerId: string | undefined;
}

// @param status: might be undefined when CU not in deal and peer of the CU is not in CC.
export interface ComputeUnitDetail extends ComputeUnit {
  providerId: string;
  currentCommitmentId: string | undefined;
  peerId: string;
  collateral: string;
  status: ComputeUnitStatus;
  expectedProofsDueNow: number;
  successProofs: number;
  collateralToken: NativeToken;
}

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

export interface DealDetail extends DealShort {
  pricePerWorkerEpoch: string;
  maxWorkersPerProvider: number;
  computeUnits: Array<ComputeUnit>;
  whitelist: Array<string>;
  blacklist: Array<string>;
  effectors: Array<Effector>;
}

// [Figma: Peer ID]
export interface PeerDetail {
  id: string;
  providerId: string;
  offerId: string;
  computeUnitsInDeal: number;
  computeUnitsInCapacityCommitment: number;
  computeUnitsTotal: number;
}

// [Figma: Peer ID]
export interface DealsByPeerListView extends ListViewABC {
  data: Array<DealByPeer>;
}

// [Figma: Peer ID] Scheme represents entity of Array<Deal> for complex PeerDetail View.
export interface DealByPeer {
  dealId: string;
  computeUnitId: string;
  workerId: string;
}

export interface ProofBasic {
  transactionId: string;
  capacityCommitmentId: string;
  computeUnitId: string;
  peerId: string;
  createdAt: number;
}

export interface ProofBasicListView extends ListViewABC {
  data: Array<ProofBasic>;
}

// @deprecated.
// @param status: might be failed when no proof submitted for the epoch.
// @param transactionId: undefined when no proof submitted for the epoch.
export interface ProofByComputeUnit {
  status: "success" | "failed";
  transactionId: string | undefined;
  createdAt: number;
  createdAtEpoch: number;
}

// @deprecated.
export interface ProofByComputeUnitListView extends ListViewABC {
  data: Array<ProofByComputeUnit>;
}

// Status undefined == problem with networks, etc.
export type DealStatus = "inactive" | "active" | "ended" | "undefined";
export type CapacityCommitmentStatus =
  | "active"
  | "waitDelegation"
  | "waitStart"
  | "inactive"
  | "failed"
  | "removed"
  | "undefined";

export type ComputeUnitStatus = "deal" | "capacity" | "undefined";
