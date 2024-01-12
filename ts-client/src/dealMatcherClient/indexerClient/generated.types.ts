/* eslint-disable */
//@ts-nocheck
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: string; output: string; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type ComputeUnit = {
  __typename?: 'ComputeUnit';
  deal?: Maybe<Deal>;
  id: Scalars['ID']['output'];
  peer: Peer;
  /** In order to simplify relation. */
  provider: Provider;
  workerId?: Maybe<Scalars['String']['output']>;
};

export type ComputeUnit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ComputeUnit_Filter>>>;
  deal?: InputMaybe<Scalars['String']['input']>;
  deal_?: InputMaybe<Deal_Filter>;
  deal_contains?: InputMaybe<Scalars['String']['input']>;
  deal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  deal_ends_with?: InputMaybe<Scalars['String']['input']>;
  deal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deal_gt?: InputMaybe<Scalars['String']['input']>;
  deal_gte?: InputMaybe<Scalars['String']['input']>;
  deal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  deal_lt?: InputMaybe<Scalars['String']['input']>;
  deal_lte?: InputMaybe<Scalars['String']['input']>;
  deal_not?: InputMaybe<Scalars['String']['input']>;
  deal_not_contains?: InputMaybe<Scalars['String']['input']>;
  deal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  deal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  deal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  deal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  deal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deal_starts_with?: InputMaybe<Scalars['String']['input']>;
  deal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ComputeUnit_Filter>>>;
  peer?: InputMaybe<Scalars['String']['input']>;
  peer_?: InputMaybe<Peer_Filter>;
  peer_contains?: InputMaybe<Scalars['String']['input']>;
  peer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  peer_ends_with?: InputMaybe<Scalars['String']['input']>;
  peer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  peer_gt?: InputMaybe<Scalars['String']['input']>;
  peer_gte?: InputMaybe<Scalars['String']['input']>;
  peer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  peer_lt?: InputMaybe<Scalars['String']['input']>;
  peer_lte?: InputMaybe<Scalars['String']['input']>;
  peer_not?: InputMaybe<Scalars['String']['input']>;
  peer_not_contains?: InputMaybe<Scalars['String']['input']>;
  peer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  peer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  peer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  peer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  peer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  peer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  peer_starts_with?: InputMaybe<Scalars['String']['input']>;
  peer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_?: InputMaybe<Provider_Filter>;
  provider_contains?: InputMaybe<Scalars['String']['input']>;
  provider_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_ends_with?: InputMaybe<Scalars['String']['input']>;
  provider_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_gt?: InputMaybe<Scalars['String']['input']>;
  provider_gte?: InputMaybe<Scalars['String']['input']>;
  provider_in?: InputMaybe<Array<Scalars['String']['input']>>;
  provider_lt?: InputMaybe<Scalars['String']['input']>;
  provider_lte?: InputMaybe<Scalars['String']['input']>;
  provider_not?: InputMaybe<Scalars['String']['input']>;
  provider_not_contains?: InputMaybe<Scalars['String']['input']>;
  provider_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  provider_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  provider_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  provider_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_starts_with?: InputMaybe<Scalars['String']['input']>;
  provider_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  workerId?: InputMaybe<Scalars['String']['input']>;
  workerId_contains?: InputMaybe<Scalars['String']['input']>;
  workerId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  workerId_ends_with?: InputMaybe<Scalars['String']['input']>;
  workerId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  workerId_gt?: InputMaybe<Scalars['String']['input']>;
  workerId_gte?: InputMaybe<Scalars['String']['input']>;
  workerId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  workerId_lt?: InputMaybe<Scalars['String']['input']>;
  workerId_lte?: InputMaybe<Scalars['String']['input']>;
  workerId_not?: InputMaybe<Scalars['String']['input']>;
  workerId_not_contains?: InputMaybe<Scalars['String']['input']>;
  workerId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  workerId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  workerId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  workerId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  workerId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  workerId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  workerId_starts_with?: InputMaybe<Scalars['String']['input']>;
  workerId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type ComputeUnit_OrderBy =
  | 'deal'
  | 'deal__appCID'
  | 'deal__createdAt'
  | 'deal__depositedSum'
  | 'deal__id'
  | 'deal__maxPaidEpoch'
  | 'deal__maxWorkersPerProvider'
  | 'deal__minWorkers'
  | 'deal__owner'
  | 'deal__pricePerWorkerEpoch'
  | 'deal__targetWorkers'
  | 'deal__withdrawalSum'
  | 'id'
  | 'peer'
  | 'peer__id'
  | 'provider'
  | 'provider__computeUnitsAvailable'
  | 'provider__computeUnitsTotal'
  | 'provider__createdAt'
  | 'provider__effectorCount'
  | 'provider__id'
  | 'provider__name'
  | 'provider__peerCount'
  | 'workerId';

export type Deal = {
  __typename?: 'Deal';
  /** I.e. Matching Result (Figma). */
  addedComputeUnits?: Maybe<Array<ComputeUnit>>;
  appCID: Scalars['String']['output'];
  createdAt: Scalars['BigInt']['output'];
  depositedSum: Scalars['BigInt']['output'];
  effectors?: Maybe<Array<DealToEffector>>;
  id: Scalars['ID']['output'];
  maxPaidEpoch?: Maybe<Scalars['BigInt']['output']>;
  maxWorkersPerProvider: Scalars['Int']['output'];
  minWorkers: Scalars['Int']['output'];
  owner: Scalars['String']['output'];
  paymentToken: Token;
  pricePerWorkerEpoch: Scalars['BigInt']['output'];
  targetWorkers: Scalars['Int']['output'];
  withdrawalSum: Scalars['BigInt']['output'];
};


export type DealAddedComputeUnitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ComputeUnit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ComputeUnit_Filter>;
};


export type DealEffectorsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToEffector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DealToEffector_Filter>;
};

export type DealToEffector = {
  __typename?: 'DealToEffector';
  deal: Deal;
  effector: Effector;
  id: Scalars['ID']['output'];
};

export type DealToEffector_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DealToEffector_Filter>>>;
  deal?: InputMaybe<Scalars['String']['input']>;
  deal_?: InputMaybe<Deal_Filter>;
  deal_contains?: InputMaybe<Scalars['String']['input']>;
  deal_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  deal_ends_with?: InputMaybe<Scalars['String']['input']>;
  deal_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deal_gt?: InputMaybe<Scalars['String']['input']>;
  deal_gte?: InputMaybe<Scalars['String']['input']>;
  deal_in?: InputMaybe<Array<Scalars['String']['input']>>;
  deal_lt?: InputMaybe<Scalars['String']['input']>;
  deal_lte?: InputMaybe<Scalars['String']['input']>;
  deal_not?: InputMaybe<Scalars['String']['input']>;
  deal_not_contains?: InputMaybe<Scalars['String']['input']>;
  deal_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  deal_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  deal_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deal_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  deal_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  deal_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deal_starts_with?: InputMaybe<Scalars['String']['input']>;
  deal_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  effector?: InputMaybe<Scalars['String']['input']>;
  effector_?: InputMaybe<Effector_Filter>;
  effector_contains?: InputMaybe<Scalars['String']['input']>;
  effector_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  effector_ends_with?: InputMaybe<Scalars['String']['input']>;
  effector_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  effector_gt?: InputMaybe<Scalars['String']['input']>;
  effector_gte?: InputMaybe<Scalars['String']['input']>;
  effector_in?: InputMaybe<Array<Scalars['String']['input']>>;
  effector_lt?: InputMaybe<Scalars['String']['input']>;
  effector_lte?: InputMaybe<Scalars['String']['input']>;
  effector_not?: InputMaybe<Scalars['String']['input']>;
  effector_not_contains?: InputMaybe<Scalars['String']['input']>;
  effector_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  effector_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  effector_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  effector_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  effector_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  effector_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  effector_starts_with?: InputMaybe<Scalars['String']['input']>;
  effector_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DealToEffector_Filter>>>;
};

export type DealToEffector_OrderBy =
  | 'deal'
  | 'deal__appCID'
  | 'deal__createdAt'
  | 'deal__depositedSum'
  | 'deal__id'
  | 'deal__maxPaidEpoch'
  | 'deal__maxWorkersPerProvider'
  | 'deal__minWorkers'
  | 'deal__owner'
  | 'deal__pricePerWorkerEpoch'
  | 'deal__targetWorkers'
  | 'deal__withdrawalSum'
  | 'effector'
  | 'effector__description'
  | 'effector__id'
  | 'id';

export type Deal_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addedComputeUnits_?: InputMaybe<ComputeUnit_Filter>;
  and?: InputMaybe<Array<InputMaybe<Deal_Filter>>>;
  appCID?: InputMaybe<Scalars['String']['input']>;
  appCID_contains?: InputMaybe<Scalars['String']['input']>;
  appCID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  appCID_ends_with?: InputMaybe<Scalars['String']['input']>;
  appCID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  appCID_gt?: InputMaybe<Scalars['String']['input']>;
  appCID_gte?: InputMaybe<Scalars['String']['input']>;
  appCID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  appCID_lt?: InputMaybe<Scalars['String']['input']>;
  appCID_lte?: InputMaybe<Scalars['String']['input']>;
  appCID_not?: InputMaybe<Scalars['String']['input']>;
  appCID_not_contains?: InputMaybe<Scalars['String']['input']>;
  appCID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  appCID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  appCID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  appCID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  appCID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  appCID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  appCID_starts_with?: InputMaybe<Scalars['String']['input']>;
  appCID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedSum?: InputMaybe<Scalars['BigInt']['input']>;
  depositedSum_gt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedSum_gte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedSum_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  depositedSum_lt?: InputMaybe<Scalars['BigInt']['input']>;
  depositedSum_lte?: InputMaybe<Scalars['BigInt']['input']>;
  depositedSum_not?: InputMaybe<Scalars['BigInt']['input']>;
  depositedSum_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  effectors_?: InputMaybe<DealToEffector_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  maxPaidEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  maxPaidEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxPaidEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxPaidEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxPaidEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxPaidEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxPaidEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxPaidEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxWorkersPerProvider?: InputMaybe<Scalars['Int']['input']>;
  maxWorkersPerProvider_gt?: InputMaybe<Scalars['Int']['input']>;
  maxWorkersPerProvider_gte?: InputMaybe<Scalars['Int']['input']>;
  maxWorkersPerProvider_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  maxWorkersPerProvider_lt?: InputMaybe<Scalars['Int']['input']>;
  maxWorkersPerProvider_lte?: InputMaybe<Scalars['Int']['input']>;
  maxWorkersPerProvider_not?: InputMaybe<Scalars['Int']['input']>;
  maxWorkersPerProvider_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minWorkers?: InputMaybe<Scalars['Int']['input']>;
  minWorkers_gt?: InputMaybe<Scalars['Int']['input']>;
  minWorkers_gte?: InputMaybe<Scalars['Int']['input']>;
  minWorkers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  minWorkers_lt?: InputMaybe<Scalars['Int']['input']>;
  minWorkers_lte?: InputMaybe<Scalars['Int']['input']>;
  minWorkers_not?: InputMaybe<Scalars['Int']['input']>;
  minWorkers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Deal_Filter>>>;
  owner?: InputMaybe<Scalars['String']['input']>;
  owner_contains?: InputMaybe<Scalars['String']['input']>;
  owner_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_gt?: InputMaybe<Scalars['String']['input']>;
  owner_gte?: InputMaybe<Scalars['String']['input']>;
  owner_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_lt?: InputMaybe<Scalars['String']['input']>;
  owner_lte?: InputMaybe<Scalars['String']['input']>;
  owner_not?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains?: InputMaybe<Scalars['String']['input']>;
  owner_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with?: InputMaybe<Scalars['String']['input']>;
  owner_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken?: InputMaybe<Scalars['String']['input']>;
  paymentToken_?: InputMaybe<Token_Filter>;
  paymentToken_contains?: InputMaybe<Scalars['String']['input']>;
  paymentToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  paymentToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken_gt?: InputMaybe<Scalars['String']['input']>;
  paymentToken_gte?: InputMaybe<Scalars['String']['input']>;
  paymentToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentToken_lt?: InputMaybe<Scalars['String']['input']>;
  paymentToken_lte?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  paymentToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pricePerWorkerEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerWorkerEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerWorkerEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerWorkerEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerWorkerEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerWorkerEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerWorkerEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerWorkerEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  targetWorkers?: InputMaybe<Scalars['Int']['input']>;
  targetWorkers_gt?: InputMaybe<Scalars['Int']['input']>;
  targetWorkers_gte?: InputMaybe<Scalars['Int']['input']>;
  targetWorkers_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  targetWorkers_lt?: InputMaybe<Scalars['Int']['input']>;
  targetWorkers_lte?: InputMaybe<Scalars['Int']['input']>;
  targetWorkers_not?: InputMaybe<Scalars['Int']['input']>;
  targetWorkers_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  withdrawalSum?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawalSum_gt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawalSum_gte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawalSum_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  withdrawalSum_lt?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawalSum_lte?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawalSum_not?: InputMaybe<Scalars['BigInt']['input']>;
  withdrawalSum_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Deal_OrderBy =
  | 'addedComputeUnits'
  | 'appCID'
  | 'createdAt'
  | 'depositedSum'
  | 'effectors'
  | 'id'
  | 'maxPaidEpoch'
  | 'maxWorkersPerProvider'
  | 'minWorkers'
  | 'owner'
  | 'paymentToken'
  | 'paymentToken__decimals'
  | 'paymentToken__id'
  | 'paymentToken__symbol'
  | 'pricePerWorkerEpoch'
  | 'targetWorkers'
  | 'withdrawalSum';

/** Effector table is obsolete table since it is a simple mapping. */
export type Effector = {
  __typename?: 'Effector';
  description: Scalars['String']['output'];
  /** id and CID are the same. */
  id: Scalars['ID']['output'];
  offers?: Maybe<Array<OfferToEffector>>;
};


/** Effector table is obsolete table since it is a simple mapping. */
export type EffectorOffersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OfferToEffector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OfferToEffector_Filter>;
};

export type Effector_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Effector_Filter>>>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_contains?: InputMaybe<Scalars['String']['input']>;
  description_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_gt?: InputMaybe<Scalars['String']['input']>;
  description_gte?: InputMaybe<Scalars['String']['input']>;
  description_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_lt?: InputMaybe<Scalars['String']['input']>;
  description_lte?: InputMaybe<Scalars['String']['input']>;
  description_not?: InputMaybe<Scalars['String']['input']>;
  description_not_contains?: InputMaybe<Scalars['String']['input']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  description_starts_with?: InputMaybe<Scalars['String']['input']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  offers_?: InputMaybe<OfferToEffector_Filter>;
  or?: InputMaybe<Array<InputMaybe<Effector_Filter>>>;
};

export type Effector_OrderBy =
  | 'description'
  | 'id'
  | 'offers';

export type GraphNetwork = {
  __typename?: 'GraphNetwork';
  dealsTotal: Scalars['BigInt']['output'];
  effectorsTotal: Scalars['BigInt']['output'];
  /** ID is set to 1 */
  id: Scalars['ID']['output'];
  offersTotal: Scalars['BigInt']['output'];
  providersTotal: Scalars['BigInt']['output'];
  tokensTotal: Scalars['BigInt']['output'];
};

export type GraphNetwork_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GraphNetwork_Filter>>>;
  dealsTotal?: InputMaybe<Scalars['BigInt']['input']>;
  dealsTotal_gt?: InputMaybe<Scalars['BigInt']['input']>;
  dealsTotal_gte?: InputMaybe<Scalars['BigInt']['input']>;
  dealsTotal_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  dealsTotal_lt?: InputMaybe<Scalars['BigInt']['input']>;
  dealsTotal_lte?: InputMaybe<Scalars['BigInt']['input']>;
  dealsTotal_not?: InputMaybe<Scalars['BigInt']['input']>;
  dealsTotal_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  effectorsTotal?: InputMaybe<Scalars['BigInt']['input']>;
  effectorsTotal_gt?: InputMaybe<Scalars['BigInt']['input']>;
  effectorsTotal_gte?: InputMaybe<Scalars['BigInt']['input']>;
  effectorsTotal_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  effectorsTotal_lt?: InputMaybe<Scalars['BigInt']['input']>;
  effectorsTotal_lte?: InputMaybe<Scalars['BigInt']['input']>;
  effectorsTotal_not?: InputMaybe<Scalars['BigInt']['input']>;
  effectorsTotal_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  offersTotal?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_gt?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_gte?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  offersTotal_lt?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_lte?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_not?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GraphNetwork_Filter>>>;
  providersTotal?: InputMaybe<Scalars['BigInt']['input']>;
  providersTotal_gt?: InputMaybe<Scalars['BigInt']['input']>;
  providersTotal_gte?: InputMaybe<Scalars['BigInt']['input']>;
  providersTotal_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  providersTotal_lt?: InputMaybe<Scalars['BigInt']['input']>;
  providersTotal_lte?: InputMaybe<Scalars['BigInt']['input']>;
  providersTotal_not?: InputMaybe<Scalars['BigInt']['input']>;
  providersTotal_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokensTotal?: InputMaybe<Scalars['BigInt']['input']>;
  tokensTotal_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokensTotal_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokensTotal_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokensTotal_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokensTotal_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokensTotal_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokensTotal_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type GraphNetwork_OrderBy =
  | 'dealsTotal'
  | 'effectorsTotal'
  | 'id'
  | 'offersTotal'
  | 'providersTotal'
  | 'tokensTotal';

export type Offer = {
  __typename?: 'Offer';
  computeUnitsAvailable?: Maybe<Scalars['Int']['output']>;
  computeUnitsTotal?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['BigInt']['output'];
  effectors?: Maybe<Array<OfferToEffector>>;
  /**
   * Used in the next figma views:
   * - Offer from List Of offers 1.2.
   * - Offer 1.2
   *
   */
  id: Scalars['ID']['output'];
  paymentToken: Token;
  peers?: Maybe<Array<Peer>>;
  pricePerEpoch: Scalars['BigInt']['output'];
  provider: Provider;
  updatedAt: Scalars['BigInt']['output'];
};


export type OfferEffectorsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OfferToEffector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OfferToEffector_Filter>;
};


export type OfferPeersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Peer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Peer_Filter>;
};

/**
 * To support many2many b/w offer and effector.
 * E.g. to use
 * {
 *   offers {
 *     effectors {
 *       effector {
 *         description
 *       }
 *     }
 *   }
 * }
 *
 */
export type OfferToEffector = {
  __typename?: 'OfferToEffector';
  effector: Effector;
  id: Scalars['ID']['output'];
  offer: Offer;
};

export type OfferToEffector_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OfferToEffector_Filter>>>;
  effector?: InputMaybe<Scalars['String']['input']>;
  effector_?: InputMaybe<Effector_Filter>;
  effector_contains?: InputMaybe<Scalars['String']['input']>;
  effector_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  effector_ends_with?: InputMaybe<Scalars['String']['input']>;
  effector_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  effector_gt?: InputMaybe<Scalars['String']['input']>;
  effector_gte?: InputMaybe<Scalars['String']['input']>;
  effector_in?: InputMaybe<Array<Scalars['String']['input']>>;
  effector_lt?: InputMaybe<Scalars['String']['input']>;
  effector_lte?: InputMaybe<Scalars['String']['input']>;
  effector_not?: InputMaybe<Scalars['String']['input']>;
  effector_not_contains?: InputMaybe<Scalars['String']['input']>;
  effector_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  effector_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  effector_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  effector_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  effector_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  effector_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  effector_starts_with?: InputMaybe<Scalars['String']['input']>;
  effector_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  offer?: InputMaybe<Scalars['String']['input']>;
  offer_?: InputMaybe<Offer_Filter>;
  offer_contains?: InputMaybe<Scalars['String']['input']>;
  offer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  offer_ends_with?: InputMaybe<Scalars['String']['input']>;
  offer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  offer_gt?: InputMaybe<Scalars['String']['input']>;
  offer_gte?: InputMaybe<Scalars['String']['input']>;
  offer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  offer_lt?: InputMaybe<Scalars['String']['input']>;
  offer_lte?: InputMaybe<Scalars['String']['input']>;
  offer_not?: InputMaybe<Scalars['String']['input']>;
  offer_not_contains?: InputMaybe<Scalars['String']['input']>;
  offer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  offer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  offer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  offer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  offer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  offer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  offer_starts_with?: InputMaybe<Scalars['String']['input']>;
  offer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<OfferToEffector_Filter>>>;
};

export type OfferToEffector_OrderBy =
  | 'effector'
  | 'effector__description'
  | 'effector__id'
  | 'id'
  | 'offer'
  | 'offer__computeUnitsAvailable'
  | 'offer__computeUnitsTotal'
  | 'offer__createdAt'
  | 'offer__id'
  | 'offer__pricePerEpoch'
  | 'offer__updatedAt';

export type Offer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Offer_Filter>>>;
  computeUnitsAvailable?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_gt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_gte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsAvailable_lt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_lte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_not?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsTotal?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_gt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_gte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsTotal_lt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_lte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_not?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  effectors_?: InputMaybe<OfferToEffector_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Offer_Filter>>>;
  paymentToken?: InputMaybe<Scalars['String']['input']>;
  paymentToken_?: InputMaybe<Token_Filter>;
  paymentToken_contains?: InputMaybe<Scalars['String']['input']>;
  paymentToken_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken_ends_with?: InputMaybe<Scalars['String']['input']>;
  paymentToken_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken_gt?: InputMaybe<Scalars['String']['input']>;
  paymentToken_gte?: InputMaybe<Scalars['String']['input']>;
  paymentToken_in?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentToken_lt?: InputMaybe<Scalars['String']['input']>;
  paymentToken_lte?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_contains?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  paymentToken_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  paymentToken_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  paymentToken_starts_with?: InputMaybe<Scalars['String']['input']>;
  paymentToken_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  peers_?: InputMaybe<Peer_Filter>;
  pricePerEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pricePerEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  pricePerEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_?: InputMaybe<Provider_Filter>;
  provider_contains?: InputMaybe<Scalars['String']['input']>;
  provider_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_ends_with?: InputMaybe<Scalars['String']['input']>;
  provider_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_gt?: InputMaybe<Scalars['String']['input']>;
  provider_gte?: InputMaybe<Scalars['String']['input']>;
  provider_in?: InputMaybe<Array<Scalars['String']['input']>>;
  provider_lt?: InputMaybe<Scalars['String']['input']>;
  provider_lte?: InputMaybe<Scalars['String']['input']>;
  provider_not?: InputMaybe<Scalars['String']['input']>;
  provider_not_contains?: InputMaybe<Scalars['String']['input']>;
  provider_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  provider_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  provider_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  provider_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_starts_with?: InputMaybe<Scalars['String']['input']>;
  provider_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Offer_OrderBy =
  | 'computeUnitsAvailable'
  | 'computeUnitsTotal'
  | 'createdAt'
  | 'effectors'
  | 'id'
  | 'paymentToken'
  | 'paymentToken__decimals'
  | 'paymentToken__id'
  | 'paymentToken__symbol'
  | 'peers'
  | 'pricePerEpoch'
  | 'provider'
  | 'provider__computeUnitsAvailable'
  | 'provider__computeUnitsTotal'
  | 'provider__createdAt'
  | 'provider__effectorCount'
  | 'provider__id'
  | 'provider__name'
  | 'provider__peerCount'
  | 'updatedAt';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Peer = {
  __typename?: 'Peer';
  computeUnits?: Maybe<Array<ComputeUnit>>;
  /** ref to peerId in contract. */
  id: Scalars['ID']['output'];
  offer: Offer;
  provider: Provider;
};


export type PeerComputeUnitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ComputeUnit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ComputeUnit_Filter>;
};

export type Peer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Peer_Filter>>>;
  computeUnits_?: InputMaybe<ComputeUnit_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  offer?: InputMaybe<Scalars['String']['input']>;
  offer_?: InputMaybe<Offer_Filter>;
  offer_contains?: InputMaybe<Scalars['String']['input']>;
  offer_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  offer_ends_with?: InputMaybe<Scalars['String']['input']>;
  offer_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  offer_gt?: InputMaybe<Scalars['String']['input']>;
  offer_gte?: InputMaybe<Scalars['String']['input']>;
  offer_in?: InputMaybe<Array<Scalars['String']['input']>>;
  offer_lt?: InputMaybe<Scalars['String']['input']>;
  offer_lte?: InputMaybe<Scalars['String']['input']>;
  offer_not?: InputMaybe<Scalars['String']['input']>;
  offer_not_contains?: InputMaybe<Scalars['String']['input']>;
  offer_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  offer_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  offer_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  offer_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  offer_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  offer_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  offer_starts_with?: InputMaybe<Scalars['String']['input']>;
  offer_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Peer_Filter>>>;
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_?: InputMaybe<Provider_Filter>;
  provider_contains?: InputMaybe<Scalars['String']['input']>;
  provider_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_ends_with?: InputMaybe<Scalars['String']['input']>;
  provider_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_gt?: InputMaybe<Scalars['String']['input']>;
  provider_gte?: InputMaybe<Scalars['String']['input']>;
  provider_in?: InputMaybe<Array<Scalars['String']['input']>>;
  provider_lt?: InputMaybe<Scalars['String']['input']>;
  provider_lte?: InputMaybe<Scalars['String']['input']>;
  provider_not?: InputMaybe<Scalars['String']['input']>;
  provider_not_contains?: InputMaybe<Scalars['String']['input']>;
  provider_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  provider_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  provider_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  provider_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  provider_starts_with?: InputMaybe<Scalars['String']['input']>;
  provider_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Peer_OrderBy =
  | 'computeUnits'
  | 'id'
  | 'offer'
  | 'offer__computeUnitsAvailable'
  | 'offer__computeUnitsTotal'
  | 'offer__createdAt'
  | 'offer__id'
  | 'offer__pricePerEpoch'
  | 'offer__updatedAt'
  | 'provider'
  | 'provider__computeUnitsAvailable'
  | 'provider__computeUnitsTotal'
  | 'provider__createdAt'
  | 'provider__effectorCount'
  | 'provider__id'
  | 'provider__name'
  | 'provider__peerCount';

export type Provider = {
  __typename?: 'Provider';
  computeUnitsAvailable: Scalars['Int']['output'];
  computeUnitsTotal: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  effectorCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  offers?: Maybe<Array<Offer>>;
  peerCount: Scalars['Int']['output'];
};


export type ProviderOffersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Offer_Filter>;
};

export type Provider_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Provider_Filter>>>;
  computeUnitsAvailable?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_gt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_gte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsAvailable_lt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_lte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_not?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsAvailable_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsTotal?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_gt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_gte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsTotal_lt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_lte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_not?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  effectorCount?: InputMaybe<Scalars['Int']['input']>;
  effectorCount_gt?: InputMaybe<Scalars['Int']['input']>;
  effectorCount_gte?: InputMaybe<Scalars['Int']['input']>;
  effectorCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  effectorCount_lt?: InputMaybe<Scalars['Int']['input']>;
  effectorCount_lte?: InputMaybe<Scalars['Int']['input']>;
  effectorCount_not?: InputMaybe<Scalars['Int']['input']>;
  effectorCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  offers_?: InputMaybe<Offer_Filter>;
  or?: InputMaybe<Array<InputMaybe<Provider_Filter>>>;
  peerCount?: InputMaybe<Scalars['Int']['input']>;
  peerCount_gt?: InputMaybe<Scalars['Int']['input']>;
  peerCount_gte?: InputMaybe<Scalars['Int']['input']>;
  peerCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  peerCount_lt?: InputMaybe<Scalars['Int']['input']>;
  peerCount_lte?: InputMaybe<Scalars['Int']['input']>;
  peerCount_not?: InputMaybe<Scalars['Int']['input']>;
  peerCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Provider_OrderBy =
  | 'computeUnitsAvailable'
  | 'computeUnitsTotal'
  | 'createdAt'
  | 'effectorCount'
  | 'id'
  | 'name'
  | 'offers'
  | 'peerCount';

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  computeUnit?: Maybe<ComputeUnit>;
  computeUnits: Array<ComputeUnit>;
  deal?: Maybe<Deal>;
  dealToEffector?: Maybe<DealToEffector>;
  dealToEffectors: Array<DealToEffector>;
  deals: Array<Deal>;
  effector?: Maybe<Effector>;
  effectors: Array<Effector>;
  graphNetwork?: Maybe<GraphNetwork>;
  graphNetworks: Array<GraphNetwork>;
  offer?: Maybe<Offer>;
  offerToEffector?: Maybe<OfferToEffector>;
  offerToEffectors: Array<OfferToEffector>;
  offers: Array<Offer>;
  peer?: Maybe<Peer>;
  peers: Array<Peer>;
  provider?: Maybe<Provider>;
  providers: Array<Provider>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryComputeUnitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryComputeUnitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ComputeUnit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ComputeUnit_Filter>;
};


export type QueryDealArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDealToEffectorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDealToEffectorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToEffector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DealToEffector_Filter>;
};


export type QueryDealsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deal_Filter>;
};


export type QueryEffectorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEffectorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Effector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Effector_Filter>;
};


export type QueryGraphNetworkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGraphNetworksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GraphNetwork_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GraphNetwork_Filter>;
};


export type QueryOfferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOfferToEffectorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOfferToEffectorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OfferToEffector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OfferToEffector_Filter>;
};


export type QueryOffersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Offer_Filter>;
};


export type QueryPeerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPeersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Peer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Peer_Filter>;
};


export type QueryProviderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProvidersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Provider_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Provider_Filter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  computeUnit?: Maybe<ComputeUnit>;
  computeUnits: Array<ComputeUnit>;
  deal?: Maybe<Deal>;
  dealToEffector?: Maybe<DealToEffector>;
  dealToEffectors: Array<DealToEffector>;
  deals: Array<Deal>;
  effector?: Maybe<Effector>;
  effectors: Array<Effector>;
  graphNetwork?: Maybe<GraphNetwork>;
  graphNetworks: Array<GraphNetwork>;
  offer?: Maybe<Offer>;
  offerToEffector?: Maybe<OfferToEffector>;
  offerToEffectors: Array<OfferToEffector>;
  offers: Array<Offer>;
  peer?: Maybe<Peer>;
  peers: Array<Peer>;
  provider?: Maybe<Provider>;
  providers: Array<Provider>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionComputeUnitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionComputeUnitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ComputeUnit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ComputeUnit_Filter>;
};


export type SubscriptionDealArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDealToEffectorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDealToEffectorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToEffector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DealToEffector_Filter>;
};


export type SubscriptionDealsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Deal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Deal_Filter>;
};


export type SubscriptionEffectorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionEffectorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Effector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Effector_Filter>;
};


export type SubscriptionGraphNetworkArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGraphNetworksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GraphNetwork_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GraphNetwork_Filter>;
};


export type SubscriptionOfferArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOfferToEffectorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOfferToEffectorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OfferToEffector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OfferToEffector_Filter>;
};


export type SubscriptionOffersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Offer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Offer_Filter>;
};


export type SubscriptionPeerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPeersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Peer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Peer_Filter>;
};


export type SubscriptionProviderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProvidersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Provider_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Provider_Filter>;
};


export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type Token = {
  __typename?: 'Token';
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  symbol: Scalars['String']['output'];
};

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Token_OrderBy =
  | 'decimals'
  | 'id'
  | 'symbol';

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';
