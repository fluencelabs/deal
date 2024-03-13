// Schemes that client composes and return (aka REST API).

export interface ComputeUnit {
  id: string;
  workerId: string | undefined;
}

export interface NativeToken {
  symbol: string;
  decimals: string;
}

export interface PaymentToken extends NativeToken {
  address: string;
}

export type Peer = {
  id: string;
  computeUnits: Array<ComputeUnit>;
};


export type Effector = {
  cid: string;
  description: string;
};


export interface OfferDetail {
  id: string;
  createdAt: number;
  totalComputeUnits: number;
  freeComputeUnits: number;
  paymentToken: PaymentToken;
  effectors: Array<Effector>;
  pricePerEpoch: string;
  providerId: string;
  peersCount: number;
  peers: Array<Peer>;
  updatedAt: number;
}

// export interface DealByProvider {
//   id: string;
// }
//
// export interface DealByProviderListView {
//   data: Array<DealByProvider>
//   total: number
// }
