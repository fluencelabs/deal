export type ProviderShort = {
    id: string;
    name: string;
    createdAt: number;
    totalComputeUnits: number;
    freeComputeUnits: number;
    isApproved: boolean;
    offers: Array<OfferShort>;
};

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
}

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
    // deprecated.
    // revenue: Array<Revenue>;
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

export type ProviderShortOrderBy = "createdAt" | "computeUnitsTotal";

export type OfferShortOrderBy = "createdAt" | "pricePerWorkerEpoch" | "maxCollateralPerWorker" | "updatedAt";
export type OrderType = "asc" | "desc";

export enum ProviderDetailsStatusFilter {
    All,
    Active,
    Inactive,
}
