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

/**
 * To represent that Peer has capacity commitment for some time.
 *
 */
export type CapacityCommitment = {
  __typename?: 'CapacityCommitment';
  activeUnitCount: Scalars['Int']['output'];
  collateralPerUnit: Scalars['BigInt']['output'];
  computeUnits?: Maybe<Array<CapacityCommitmentToComputeUnit>>;
  computeUnitsCount: Scalars['Int']['output'];
  /** timestamp of creation of CC. It does not mean that CC is started. */
  createdAt: Scalars['BigInt']['output'];
  delegator: Scalars['String']['output'];
  /** If CC deleted before collateral deposited. */
  deleted: Scalars['Boolean']['output'];
  duration: Scalars['BigInt']['output'];
  endEpoch: Scalars['BigInt']['output'];
  exitedUnitCount: Scalars['Int']['output'];
  failedEpoch: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  nextAdditionalActiveUnitCount: Scalars['Int']['output'];
  /** Calculated in subgraph field: next failed epoch means the next epoch without proofs submitted when CC declared to be Failed. */
  nextCCFailedEpoch: Scalars['BigInt']['output'];
  peer: Peer;
  provider: Provider;
  rewardDelegatorRate: Scalars['Int']['output'];
  rewardWithdrawn: Scalars['BigInt']['output'];
  snapshotEpoch: Scalars['BigInt']['output'];
  startEpoch: Scalars['BigInt']['output'];
  /** This status represents last stored status on chain (status that does not depends on the current epoch some how). */
  status?: Maybe<CapacityCommitmentStatus>;
  submittedProofs?: Maybe<Array<SubmittedProof>>;
  submittedProofsCount: Scalars['Int']['output'];
  totalCUFailCount: Scalars['Int']['output'];
  /** Collateral of native token (FLT) that has been deposited. */
  totalCollateral: Scalars['BigInt']['output'];
};


/**
 * To represent that Peer has capacity commitment for some time.
 *
 */
export type CapacityCommitmentComputeUnitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CapacityCommitmentToComputeUnit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CapacityCommitmentToComputeUnit_Filter>;
};


/**
 * To represent that Peer has capacity commitment for some time.
 *
 */
export type CapacityCommitmentSubmittedProofsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SubmittedProof_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SubmittedProof_Filter>;
};

/** To represent statistics per epoch. This entity represent evaluation of CommitmentStatsUpdated events during time (epoch). */
export type CapacityCommitmentStatsPerEpoch = {
  __typename?: 'CapacityCommitmentStatsPerEpoch';
  activeUnitCount: Scalars['Int']['output'];
  blockNumberEnd: Scalars['BigInt']['output'];
  blockNumberStart: Scalars['BigInt']['output'];
  capacityCommitment: CapacityCommitment;
  currentCCNextCCFailedEpoch: Scalars['BigInt']['output'];
  epoch: Scalars['BigInt']['output'];
  exitedUnitCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  nextAdditionalActiveUnitCount: Scalars['Int']['output'];
  submittedProofs?: Maybe<Array<SubmittedProof>>;
  submittedProofsCount: Scalars['Int']['output'];
  totalCUFailCount: Scalars['Int']['output'];
};


/** To represent statistics per epoch. This entity represent evaluation of CommitmentStatsUpdated events during time (epoch). */
export type CapacityCommitmentStatsPerEpochSubmittedProofsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SubmittedProof_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SubmittedProof_Filter>;
};

export type CapacityCommitmentStatsPerEpoch_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeUnitCount?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_gt?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_gte?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  activeUnitCount_lt?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_lte?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_not?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  and?: InputMaybe<Array<InputMaybe<CapacityCommitmentStatsPerEpoch_Filter>>>;
  blockNumberEnd?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberEnd_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberEnd_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberEnd_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumberEnd_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberEnd_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberEnd_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberEnd_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumberStart?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberStart_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberStart_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberStart_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumberStart_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberStart_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberStart_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumberStart_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  capacityCommitment?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_?: InputMaybe<CapacityCommitment_Filter>;
  capacityCommitment_contains?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_ends_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_gt?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_gte?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_in?: InputMaybe<Array<Scalars['String']['input']>>;
  capacityCommitment_lt?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_lte?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_contains?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  capacityCommitment_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_starts_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentCCNextCCFailedEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentCCNextCCFailedEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  epoch?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  epoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  epoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exitedUnitCount?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_gt?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_gte?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  exitedUnitCount_lt?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_lte?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_not?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nextAdditionalActiveUnitCount?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_gt?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_gte?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nextAdditionalActiveUnitCount_lt?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_lte?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_not?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<CapacityCommitmentStatsPerEpoch_Filter>>>;
  submittedProofsCount?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  submittedProofsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_not?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  submittedProofs_?: InputMaybe<SubmittedProof_Filter>;
  totalCUFailCount?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_gt?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_gte?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalCUFailCount_lt?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_lte?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_not?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type CapacityCommitmentStatsPerEpoch_OrderBy =
  | 'activeUnitCount'
  | 'blockNumberEnd'
  | 'blockNumberStart'
  | 'capacityCommitment'
  | 'capacityCommitment__activeUnitCount'
  | 'capacityCommitment__collateralPerUnit'
  | 'capacityCommitment__computeUnitsCount'
  | 'capacityCommitment__createdAt'
  | 'capacityCommitment__delegator'
  | 'capacityCommitment__deleted'
  | 'capacityCommitment__duration'
  | 'capacityCommitment__endEpoch'
  | 'capacityCommitment__exitedUnitCount'
  | 'capacityCommitment__failedEpoch'
  | 'capacityCommitment__id'
  | 'capacityCommitment__nextAdditionalActiveUnitCount'
  | 'capacityCommitment__nextCCFailedEpoch'
  | 'capacityCommitment__rewardDelegatorRate'
  | 'capacityCommitment__rewardWithdrawn'
  | 'capacityCommitment__snapshotEpoch'
  | 'capacityCommitment__startEpoch'
  | 'capacityCommitment__status'
  | 'capacityCommitment__submittedProofsCount'
  | 'capacityCommitment__totalCUFailCount'
  | 'capacityCommitment__totalCollateral'
  | 'currentCCNextCCFailedEpoch'
  | 'epoch'
  | 'exitedUnitCount'
  | 'id'
  | 'nextAdditionalActiveUnitCount'
  | 'submittedProofs'
  | 'submittedProofsCount'
  | 'totalCUFailCount';

export type CapacityCommitmentStatus =
  | 'Active'
  | 'Failed'
  | 'Inactive'
  | 'Removed'
  | 'WaitDelegation'
  | 'WaitStart';

export type CapacityCommitmentToComputeUnit = {
  __typename?: 'CapacityCommitmentToComputeUnit';
  capacityCommitment: CapacityCommitment;
  computeUnit: ComputeUnit;
  id: Scalars['ID']['output'];
};

export type CapacityCommitmentToComputeUnit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<CapacityCommitmentToComputeUnit_Filter>>>;
  capacityCommitment?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_?: InputMaybe<CapacityCommitment_Filter>;
  capacityCommitment_contains?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_ends_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_gt?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_gte?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_in?: InputMaybe<Array<Scalars['String']['input']>>;
  capacityCommitment_lt?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_lte?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_contains?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  capacityCommitment_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_starts_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit?: InputMaybe<Scalars['String']['input']>;
  computeUnit_?: InputMaybe<ComputeUnit_Filter>;
  computeUnit_contains?: InputMaybe<Scalars['String']['input']>;
  computeUnit_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit_ends_with?: InputMaybe<Scalars['String']['input']>;
  computeUnit_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit_gt?: InputMaybe<Scalars['String']['input']>;
  computeUnit_gte?: InputMaybe<Scalars['String']['input']>;
  computeUnit_in?: InputMaybe<Array<Scalars['String']['input']>>;
  computeUnit_lt?: InputMaybe<Scalars['String']['input']>;
  computeUnit_lte?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_contains?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  computeUnit_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit_starts_with?: InputMaybe<Scalars['String']['input']>;
  computeUnit_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<CapacityCommitmentToComputeUnit_Filter>>>;
};

export type CapacityCommitmentToComputeUnit_OrderBy =
  | 'capacityCommitment'
  | 'capacityCommitment__activeUnitCount'
  | 'capacityCommitment__collateralPerUnit'
  | 'capacityCommitment__computeUnitsCount'
  | 'capacityCommitment__createdAt'
  | 'capacityCommitment__delegator'
  | 'capacityCommitment__deleted'
  | 'capacityCommitment__duration'
  | 'capacityCommitment__endEpoch'
  | 'capacityCommitment__exitedUnitCount'
  | 'capacityCommitment__failedEpoch'
  | 'capacityCommitment__id'
  | 'capacityCommitment__nextAdditionalActiveUnitCount'
  | 'capacityCommitment__nextCCFailedEpoch'
  | 'capacityCommitment__rewardDelegatorRate'
  | 'capacityCommitment__rewardWithdrawn'
  | 'capacityCommitment__snapshotEpoch'
  | 'capacityCommitment__startEpoch'
  | 'capacityCommitment__status'
  | 'capacityCommitment__submittedProofsCount'
  | 'capacityCommitment__totalCUFailCount'
  | 'capacityCommitment__totalCollateral'
  | 'computeUnit'
  | 'computeUnit__createdAt'
  | 'computeUnit__id'
  | 'computeUnit__submittedProofsCount'
  | 'computeUnit__workerId'
  | 'id';

export type CapacityCommitment_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  activeUnitCount?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_gt?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_gte?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  activeUnitCount_lt?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_lte?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_not?: InputMaybe<Scalars['Int']['input']>;
  activeUnitCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  and?: InputMaybe<Array<InputMaybe<CapacityCommitment_Filter>>>;
  collateralPerUnit?: InputMaybe<Scalars['BigInt']['input']>;
  collateralPerUnit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralPerUnit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralPerUnit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  collateralPerUnit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  collateralPerUnit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  collateralPerUnit_not?: InputMaybe<Scalars['BigInt']['input']>;
  collateralPerUnit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  computeUnitsCount?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsCount_not?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnits_?: InputMaybe<CapacityCommitmentToComputeUnit_Filter>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  delegator?: InputMaybe<Scalars['String']['input']>;
  delegator_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_gt?: InputMaybe<Scalars['String']['input']>;
  delegator_gte?: InputMaybe<Scalars['String']['input']>;
  delegator_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_lt?: InputMaybe<Scalars['String']['input']>;
  delegator_lte?: InputMaybe<Scalars['String']['input']>;
  delegator_not?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains?: InputMaybe<Scalars['String']['input']>;
  delegator_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  delegator_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with?: InputMaybe<Scalars['String']['input']>;
  delegator_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  deleted?: InputMaybe<Scalars['Boolean']['input']>;
  deleted_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  deleted_not?: InputMaybe<Scalars['Boolean']['input']>;
  deleted_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  duration?: InputMaybe<Scalars['BigInt']['input']>;
  duration_gt?: InputMaybe<Scalars['BigInt']['input']>;
  duration_gte?: InputMaybe<Scalars['BigInt']['input']>;
  duration_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  duration_lt?: InputMaybe<Scalars['BigInt']['input']>;
  duration_lte?: InputMaybe<Scalars['BigInt']['input']>;
  duration_not?: InputMaybe<Scalars['BigInt']['input']>;
  duration_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  endEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  endEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  exitedUnitCount?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_gt?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_gte?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  exitedUnitCount_lt?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_lte?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_not?: InputMaybe<Scalars['Int']['input']>;
  exitedUnitCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  failedEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  failedEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  failedEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  failedEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  failedEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  failedEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  failedEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  failedEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  nextAdditionalActiveUnitCount?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_gt?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_gte?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nextAdditionalActiveUnitCount_lt?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_lte?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_not?: InputMaybe<Scalars['Int']['input']>;
  nextAdditionalActiveUnitCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  nextCCFailedEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  nextCCFailedEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  nextCCFailedEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  nextCCFailedEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  nextCCFailedEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  nextCCFailedEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  nextCCFailedEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  nextCCFailedEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<CapacityCommitment_Filter>>>;
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
  rewardDelegatorRate?: InputMaybe<Scalars['Int']['input']>;
  rewardDelegatorRate_gt?: InputMaybe<Scalars['Int']['input']>;
  rewardDelegatorRate_gte?: InputMaybe<Scalars['Int']['input']>;
  rewardDelegatorRate_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rewardDelegatorRate_lt?: InputMaybe<Scalars['Int']['input']>;
  rewardDelegatorRate_lte?: InputMaybe<Scalars['Int']['input']>;
  rewardDelegatorRate_not?: InputMaybe<Scalars['Int']['input']>;
  rewardDelegatorRate_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  rewardWithdrawn?: InputMaybe<Scalars['BigInt']['input']>;
  rewardWithdrawn_gt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardWithdrawn_gte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardWithdrawn_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rewardWithdrawn_lt?: InputMaybe<Scalars['BigInt']['input']>;
  rewardWithdrawn_lte?: InputMaybe<Scalars['BigInt']['input']>;
  rewardWithdrawn_not?: InputMaybe<Scalars['BigInt']['input']>;
  rewardWithdrawn_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  snapshotEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  snapshotEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  snapshotEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  snapshotEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  snapshotEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  snapshotEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  snapshotEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  snapshotEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  startEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  startEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  status?: InputMaybe<CapacityCommitmentStatus>;
  status_in?: InputMaybe<Array<CapacityCommitmentStatus>>;
  status_not?: InputMaybe<CapacityCommitmentStatus>;
  status_not_in?: InputMaybe<Array<CapacityCommitmentStatus>>;
  submittedProofsCount?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  submittedProofsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_not?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  submittedProofs_?: InputMaybe<SubmittedProof_Filter>;
  totalCUFailCount?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_gt?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_gte?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalCUFailCount_lt?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_lte?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_not?: InputMaybe<Scalars['Int']['input']>;
  totalCUFailCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalCollateral?: InputMaybe<Scalars['BigInt']['input']>;
  totalCollateral_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalCollateral_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalCollateral_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalCollateral_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalCollateral_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalCollateral_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalCollateral_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type CapacityCommitment_OrderBy =
  | 'activeUnitCount'
  | 'collateralPerUnit'
  | 'computeUnits'
  | 'computeUnitsCount'
  | 'createdAt'
  | 'delegator'
  | 'deleted'
  | 'duration'
  | 'endEpoch'
  | 'exitedUnitCount'
  | 'failedEpoch'
  | 'id'
  | 'nextAdditionalActiveUnitCount'
  | 'nextCCFailedEpoch'
  | 'peer'
  | 'peer__computeUnitsInCapacityCommitment'
  | 'peer__computeUnitsInDeal'
  | 'peer__computeUnitsTotal'
  | 'peer__currentCCCollateralDepositedAt'
  | 'peer__currentCCEndEpoch'
  | 'peer__currentCCNextCCFailedEpoch'
  | 'peer__id'
  | 'peer__isAnyJoinedDeals'
  | 'provider'
  | 'provider__approved'
  | 'provider__computeUnitsAvailable'
  | 'provider__computeUnitsTotal'
  | 'provider__createdAt'
  | 'provider__id'
  | 'provider__name'
  | 'provider__peerCount'
  | 'provider__registered'
  | 'rewardDelegatorRate'
  | 'rewardWithdrawn'
  | 'snapshotEpoch'
  | 'startEpoch'
  | 'status'
  | 'submittedProofs'
  | 'submittedProofsCount'
  | 'totalCUFailCount'
  | 'totalCollateral';

export type ComputeUnit = {
  __typename?: 'ComputeUnit';
  createdAt: Scalars['BigInt']['output'];
  deal?: Maybe<Deal>;
  id: Scalars['ID']['output'];
  peer: Peer;
  /** In order to simplify relation for query. */
  provider: Provider;
  submittedProofs?: Maybe<Array<SubmittedProof>>;
  submittedProofsCount: Scalars['Int']['output'];
  workerId?: Maybe<Scalars['String']['output']>;
};


export type ComputeUnitSubmittedProofsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SubmittedProof_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SubmittedProof_Filter>;
};

export type ComputeUnit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ComputeUnit_Filter>>>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  submittedProofsCount?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_gt?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_gte?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  submittedProofsCount_lt?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_lte?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_not?: InputMaybe<Scalars['Int']['input']>;
  submittedProofsCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  submittedProofs_?: InputMaybe<SubmittedProof_Filter>;
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
  | 'createdAt'
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
  | 'deal__providersAccessType'
  | 'deal__targetWorkers'
  | 'deal__withdrawalSum'
  | 'id'
  | 'peer'
  | 'peer__computeUnitsInCapacityCommitment'
  | 'peer__computeUnitsInDeal'
  | 'peer__computeUnitsTotal'
  | 'peer__currentCCCollateralDepositedAt'
  | 'peer__currentCCEndEpoch'
  | 'peer__currentCCNextCCFailedEpoch'
  | 'peer__id'
  | 'peer__isAnyJoinedDeals'
  | 'provider'
  | 'provider__approved'
  | 'provider__computeUnitsAvailable'
  | 'provider__computeUnitsTotal'
  | 'provider__createdAt'
  | 'provider__id'
  | 'provider__name'
  | 'provider__peerCount'
  | 'provider__registered'
  | 'submittedProofs'
  | 'submittedProofsCount'
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
  /** Many to many to access joined peers to maintain protocol restrictions */
  joinedPeers?: Maybe<Array<DealToPeer>>;
  maxPaidEpoch?: Maybe<Scalars['BigInt']['output']>;
  maxWorkersPerProvider: Scalars['Int']['output'];
  minWorkers: Scalars['Int']['output'];
  owner: Scalars['String']['output'];
  paymentToken: Token;
  pricePerWorkerEpoch: Scalars['BigInt']['output'];
  providersAccessList?: Maybe<Array<DealToProvidersAccess>>;
  /** It represents AccessType of Deal contract. */
  providersAccessType: Scalars['Int']['output'];
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


export type DealJoinedPeersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToPeer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DealToPeer_Filter>;
};


export type DealProvidersAccessListArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToProvidersAccess_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DealToProvidersAccess_Filter>;
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
  | 'deal__providersAccessType'
  | 'deal__targetWorkers'
  | 'deal__withdrawalSum'
  | 'effector'
  | 'effector__description'
  | 'effector__id'
  | 'id';

/**
 * TODO: deprecate.
 * To add possibility to filter already joined peers into a Deal from perspective of an Offer
 * (protocol does not allow more than one CU per peer for the same Deal).
 *
 */
export type DealToJoinedOfferPeer = {
  __typename?: 'DealToJoinedOfferPeer';
  deal: Deal;
  id: Scalars['ID']['output'];
  offer: Offer;
  peer: Peer;
};

export type DealToJoinedOfferPeer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DealToJoinedOfferPeer_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<DealToJoinedOfferPeer_Filter>>>;
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
};

export type DealToJoinedOfferPeer_OrderBy =
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
  | 'deal__providersAccessType'
  | 'deal__targetWorkers'
  | 'deal__withdrawalSum'
  | 'id'
  | 'offer'
  | 'offer__computeUnitsAvailable'
  | 'offer__computeUnitsTotal'
  | 'offer__createdAt'
  | 'offer__id'
  | 'offer__pricePerEpoch'
  | 'offer__updatedAt'
  | 'peer'
  | 'peer__computeUnitsInCapacityCommitment'
  | 'peer__computeUnitsInDeal'
  | 'peer__computeUnitsTotal'
  | 'peer__currentCCCollateralDepositedAt'
  | 'peer__currentCCEndEpoch'
  | 'peer__currentCCNextCCFailedEpoch'
  | 'peer__id'
  | 'peer__isAnyJoinedDeals';

export type DealToPeer = {
  __typename?: 'DealToPeer';
  deal: Deal;
  id: Scalars['ID']['output'];
  peer: Peer;
};

export type DealToPeer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DealToPeer_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<DealToPeer_Filter>>>;
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
};

export type DealToPeer_OrderBy =
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
  | 'deal__providersAccessType'
  | 'deal__targetWorkers'
  | 'deal__withdrawalSum'
  | 'id'
  | 'peer'
  | 'peer__computeUnitsInCapacityCommitment'
  | 'peer__computeUnitsInDeal'
  | 'peer__computeUnitsTotal'
  | 'peer__currentCCCollateralDepositedAt'
  | 'peer__currentCCEndEpoch'
  | 'peer__currentCCNextCCFailedEpoch'
  | 'peer__id'
  | 'peer__isAnyJoinedDeals';

/** It represents m2m b/w deal and provider in context of access list. */
export type DealToProvidersAccess = {
  __typename?: 'DealToProvidersAccess';
  deal: Deal;
  id: Scalars['ID']['output'];
  provider: Provider;
};

export type DealToProvidersAccess_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DealToProvidersAccess_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<DealToProvidersAccess_Filter>>>;
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

export type DealToProvidersAccess_OrderBy =
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
  | 'deal__providersAccessType'
  | 'deal__targetWorkers'
  | 'deal__withdrawalSum'
  | 'id'
  | 'provider'
  | 'provider__approved'
  | 'provider__computeUnitsAvailable'
  | 'provider__computeUnitsTotal'
  | 'provider__createdAt'
  | 'provider__id'
  | 'provider__name'
  | 'provider__peerCount'
  | 'provider__registered';

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
  joinedPeers_?: InputMaybe<DealToPeer_Filter>;
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
  providersAccessList_?: InputMaybe<DealToProvidersAccess_Filter>;
  providersAccessType?: InputMaybe<Scalars['Int']['input']>;
  providersAccessType_gt?: InputMaybe<Scalars['Int']['input']>;
  providersAccessType_gte?: InputMaybe<Scalars['Int']['input']>;
  providersAccessType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  providersAccessType_lt?: InputMaybe<Scalars['Int']['input']>;
  providersAccessType_lte?: InputMaybe<Scalars['Int']['input']>;
  providersAccessType_not?: InputMaybe<Scalars['Int']['input']>;
  providersAccessType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  | 'joinedPeers'
  | 'maxPaidEpoch'
  | 'maxWorkersPerProvider'
  | 'minWorkers'
  | 'owner'
  | 'paymentToken'
  | 'paymentToken__decimals'
  | 'paymentToken__id'
  | 'paymentToken__symbol'
  | 'pricePerWorkerEpoch'
  | 'providersAccessList'
  | 'providersAccessType'
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
  MinRequiredProofsPerEpoch?: Maybe<Scalars['Int']['output']>;
  capacityCommitmentsTotal: Scalars['BigInt']['output'];
  capacityMaxFailedRatio?: Maybe<Scalars['Int']['output']>;
  coreEpochDuration?: Maybe<Scalars['Int']['output']>;
  dealsTotal: Scalars['BigInt']['output'];
  effectorsTotal: Scalars['BigInt']['output'];
  /** ID is set to 1 */
  id: Scalars['ID']['output'];
  initTimestamp?: Maybe<Scalars['Int']['output']>;
  offersTotal: Scalars['BigInt']['output'];
  proofsTotal: Scalars['BigInt']['output'];
  providersTotal: Scalars['BigInt']['output'];
  tokensTotal: Scalars['BigInt']['output'];
};

export type GraphNetwork_Filter = {
  MinRequiredProofsPerEpoch?: InputMaybe<Scalars['Int']['input']>;
  MinRequiredProofsPerEpoch_gt?: InputMaybe<Scalars['Int']['input']>;
  MinRequiredProofsPerEpoch_gte?: InputMaybe<Scalars['Int']['input']>;
  MinRequiredProofsPerEpoch_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  MinRequiredProofsPerEpoch_lt?: InputMaybe<Scalars['Int']['input']>;
  MinRequiredProofsPerEpoch_lte?: InputMaybe<Scalars['Int']['input']>;
  MinRequiredProofsPerEpoch_not?: InputMaybe<Scalars['Int']['input']>;
  MinRequiredProofsPerEpoch_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GraphNetwork_Filter>>>;
  capacityCommitmentsTotal?: InputMaybe<Scalars['BigInt']['input']>;
  capacityCommitmentsTotal_gt?: InputMaybe<Scalars['BigInt']['input']>;
  capacityCommitmentsTotal_gte?: InputMaybe<Scalars['BigInt']['input']>;
  capacityCommitmentsTotal_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  capacityCommitmentsTotal_lt?: InputMaybe<Scalars['BigInt']['input']>;
  capacityCommitmentsTotal_lte?: InputMaybe<Scalars['BigInt']['input']>;
  capacityCommitmentsTotal_not?: InputMaybe<Scalars['BigInt']['input']>;
  capacityCommitmentsTotal_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  capacityMaxFailedRatio?: InputMaybe<Scalars['Int']['input']>;
  capacityMaxFailedRatio_gt?: InputMaybe<Scalars['Int']['input']>;
  capacityMaxFailedRatio_gte?: InputMaybe<Scalars['Int']['input']>;
  capacityMaxFailedRatio_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  capacityMaxFailedRatio_lt?: InputMaybe<Scalars['Int']['input']>;
  capacityMaxFailedRatio_lte?: InputMaybe<Scalars['Int']['input']>;
  capacityMaxFailedRatio_not?: InputMaybe<Scalars['Int']['input']>;
  capacityMaxFailedRatio_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  coreEpochDuration?: InputMaybe<Scalars['Int']['input']>;
  coreEpochDuration_gt?: InputMaybe<Scalars['Int']['input']>;
  coreEpochDuration_gte?: InputMaybe<Scalars['Int']['input']>;
  coreEpochDuration_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  coreEpochDuration_lt?: InputMaybe<Scalars['Int']['input']>;
  coreEpochDuration_lte?: InputMaybe<Scalars['Int']['input']>;
  coreEpochDuration_not?: InputMaybe<Scalars['Int']['input']>;
  coreEpochDuration_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  initTimestamp?: InputMaybe<Scalars['Int']['input']>;
  initTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  initTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  initTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  initTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  initTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  initTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  initTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  offersTotal?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_gt?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_gte?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  offersTotal_lt?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_lte?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_not?: InputMaybe<Scalars['BigInt']['input']>;
  offersTotal_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GraphNetwork_Filter>>>;
  proofsTotal?: InputMaybe<Scalars['BigInt']['input']>;
  proofsTotal_gt?: InputMaybe<Scalars['BigInt']['input']>;
  proofsTotal_gte?: InputMaybe<Scalars['BigInt']['input']>;
  proofsTotal_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  proofsTotal_lt?: InputMaybe<Scalars['BigInt']['input']>;
  proofsTotal_lte?: InputMaybe<Scalars['BigInt']['input']>;
  proofsTotal_not?: InputMaybe<Scalars['BigInt']['input']>;
  proofsTotal_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  | 'MinRequiredProofsPerEpoch'
  | 'capacityCommitmentsTotal'
  | 'capacityMaxFailedRatio'
  | 'coreEpochDuration'
  | 'dealsTotal'
  | 'effectorsTotal'
  | 'id'
  | 'initTimestamp'
  | 'offersTotal'
  | 'proofsTotal'
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
  /** To support check that a peer already in a deal. */
  joinedOfferPeers?: Maybe<Array<DealToJoinedOfferPeer>>;
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


export type OfferJoinedOfferPeersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToJoinedOfferPeer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DealToJoinedOfferPeer_Filter>;
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
  joinedOfferPeers_?: InputMaybe<DealToJoinedOfferPeer_Filter>;
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
  | 'joinedOfferPeers'
  | 'paymentToken'
  | 'paymentToken__decimals'
  | 'paymentToken__id'
  | 'paymentToken__symbol'
  | 'peers'
  | 'pricePerEpoch'
  | 'provider'
  | 'provider__approved'
  | 'provider__computeUnitsAvailable'
  | 'provider__computeUnitsTotal'
  | 'provider__createdAt'
  | 'provider__id'
  | 'provider__name'
  | 'provider__peerCount'
  | 'provider__registered'
  | 'updatedAt';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Peer = {
  __typename?: 'Peer';
  /** To access history of capacity commitments. */
  capacityCommitments?: Maybe<Array<CapacityCommitment>>;
  computeUnits?: Maybe<Array<ComputeUnit>>;
  /** Compute units in any cc: update only when moved to CC or out: {UnitActivated, UnitDeactivated}. */
  computeUnitsInCapacityCommitment: Scalars['Int']['output'];
  /** Compute units in any deals: update only when moved to deal or out. */
  computeUnitsInDeal: Scalars['Int']['output'];
  computeUnitsTotal: Scalars['Int']['output'];
  /** To understand if collateral for peer have been submitted. This field should be use in conjunction with currentCapacityCommitment. */
  currentCCCollateralDepositedAt?: Maybe<Scalars['BigInt']['output']>;
  currentCCEndEpoch?: Maybe<Scalars['BigInt']['output']>;
  currentCCNextCCFailedEpoch?: Maybe<Scalars['BigInt']['output']>;
  currentCapacityCommitment?: Maybe<CapacityCommitment>;
  /** ref to peerId in contract. */
  id: Scalars['ID']['output'];
  isAnyJoinedDeals: Scalars['Boolean']['output'];
  joinedDeals?: Maybe<Array<DealToPeer>>;
  offer: Offer;
  provider: Provider;
};


export type PeerCapacityCommitmentsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CapacityCommitment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CapacityCommitment_Filter>;
};


export type PeerComputeUnitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ComputeUnit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ComputeUnit_Filter>;
};


export type PeerJoinedDealsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToPeer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DealToPeer_Filter>;
};

export type Peer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Peer_Filter>>>;
  capacityCommitments_?: InputMaybe<CapacityCommitment_Filter>;
  computeUnitsInCapacityCommitment?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInCapacityCommitment_gt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInCapacityCommitment_gte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInCapacityCommitment_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsInCapacityCommitment_lt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInCapacityCommitment_lte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInCapacityCommitment_not?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInCapacityCommitment_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsInDeal?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInDeal_gt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInDeal_gte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInDeal_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsInDeal_lt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInDeal_lte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInDeal_not?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsInDeal_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsTotal?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_gt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_gte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnitsTotal_lt?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_lte?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_not?: InputMaybe<Scalars['Int']['input']>;
  computeUnitsTotal_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  computeUnits_?: InputMaybe<ComputeUnit_Filter>;
  currentCCCollateralDepositedAt?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCCollateralDepositedAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCCollateralDepositedAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCCollateralDepositedAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentCCCollateralDepositedAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCCollateralDepositedAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCCollateralDepositedAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCCollateralDepositedAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentCCEndEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCEndEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCEndEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCEndEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentCCEndEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCEndEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCEndEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCEndEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentCCNextCCFailedEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentCCNextCCFailedEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  currentCCNextCCFailedEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  currentCapacityCommitment?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_?: InputMaybe<CapacityCommitment_Filter>;
  currentCapacityCommitment_contains?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_ends_with?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_gt?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_gte?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentCapacityCommitment_lt?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_lte?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_not?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_not_contains?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  currentCapacityCommitment_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_starts_with?: InputMaybe<Scalars['String']['input']>;
  currentCapacityCommitment_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isAnyJoinedDeals?: InputMaybe<Scalars['Boolean']['input']>;
  isAnyJoinedDeals_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isAnyJoinedDeals_not?: InputMaybe<Scalars['Boolean']['input']>;
  isAnyJoinedDeals_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  joinedDeals_?: InputMaybe<DealToPeer_Filter>;
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
  | 'capacityCommitments'
  | 'computeUnits'
  | 'computeUnitsInCapacityCommitment'
  | 'computeUnitsInDeal'
  | 'computeUnitsTotal'
  | 'currentCCCollateralDepositedAt'
  | 'currentCCEndEpoch'
  | 'currentCCNextCCFailedEpoch'
  | 'currentCapacityCommitment'
  | 'currentCapacityCommitment__activeUnitCount'
  | 'currentCapacityCommitment__collateralPerUnit'
  | 'currentCapacityCommitment__computeUnitsCount'
  | 'currentCapacityCommitment__createdAt'
  | 'currentCapacityCommitment__delegator'
  | 'currentCapacityCommitment__deleted'
  | 'currentCapacityCommitment__duration'
  | 'currentCapacityCommitment__endEpoch'
  | 'currentCapacityCommitment__exitedUnitCount'
  | 'currentCapacityCommitment__failedEpoch'
  | 'currentCapacityCommitment__id'
  | 'currentCapacityCommitment__nextAdditionalActiveUnitCount'
  | 'currentCapacityCommitment__nextCCFailedEpoch'
  | 'currentCapacityCommitment__rewardDelegatorRate'
  | 'currentCapacityCommitment__rewardWithdrawn'
  | 'currentCapacityCommitment__snapshotEpoch'
  | 'currentCapacityCommitment__startEpoch'
  | 'currentCapacityCommitment__status'
  | 'currentCapacityCommitment__submittedProofsCount'
  | 'currentCapacityCommitment__totalCUFailCount'
  | 'currentCapacityCommitment__totalCollateral'
  | 'id'
  | 'isAnyJoinedDeals'
  | 'joinedDeals'
  | 'offer'
  | 'offer__computeUnitsAvailable'
  | 'offer__computeUnitsTotal'
  | 'offer__createdAt'
  | 'offer__id'
  | 'offer__pricePerEpoch'
  | 'offer__updatedAt'
  | 'provider'
  | 'provider__approved'
  | 'provider__computeUnitsAvailable'
  | 'provider__computeUnitsTotal'
  | 'provider__createdAt'
  | 'provider__id'
  | 'provider__name'
  | 'provider__peerCount'
  | 'provider__registered';

export type Provider = {
  __typename?: 'Provider';
  approved: Scalars['Boolean']['output'];
  computeUnitsAvailable: Scalars['Int']['output'];
  computeUnitsTotal: Scalars['Int']['output'];
  createdAt: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  offers?: Maybe<Array<Offer>>;
  peerCount: Scalars['Int']['output'];
  /** Is provider registered in the network (if false - possible just mentioned). */
  registered: Scalars['Boolean']['output'];
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
  approved?: InputMaybe<Scalars['Boolean']['input']>;
  approved_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  approved_not?: InputMaybe<Scalars['Boolean']['input']>;
  approved_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
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
  registered?: InputMaybe<Scalars['Boolean']['input']>;
  registered_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  registered_not?: InputMaybe<Scalars['Boolean']['input']>;
  registered_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

export type Provider_OrderBy =
  | 'approved'
  | 'computeUnitsAvailable'
  | 'computeUnitsTotal'
  | 'createdAt'
  | 'id'
  | 'name'
  | 'offers'
  | 'peerCount'
  | 'registered';

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  capacityCommitment?: Maybe<CapacityCommitment>;
  capacityCommitmentStatsPerEpoch?: Maybe<CapacityCommitmentStatsPerEpoch>;
  capacityCommitmentStatsPerEpoches: Array<CapacityCommitmentStatsPerEpoch>;
  capacityCommitmentToComputeUnit?: Maybe<CapacityCommitmentToComputeUnit>;
  capacityCommitmentToComputeUnits: Array<CapacityCommitmentToComputeUnit>;
  capacityCommitments: Array<CapacityCommitment>;
  computeUnit?: Maybe<ComputeUnit>;
  computeUnits: Array<ComputeUnit>;
  deal?: Maybe<Deal>;
  dealToEffector?: Maybe<DealToEffector>;
  dealToEffectors: Array<DealToEffector>;
  dealToJoinedOfferPeer?: Maybe<DealToJoinedOfferPeer>;
  dealToJoinedOfferPeers: Array<DealToJoinedOfferPeer>;
  dealToPeer?: Maybe<DealToPeer>;
  dealToPeers: Array<DealToPeer>;
  dealToProvidersAccess?: Maybe<DealToProvidersAccess>;
  dealToProvidersAccesses: Array<DealToProvidersAccess>;
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
  submittedProof?: Maybe<SubmittedProof>;
  submittedProofs: Array<SubmittedProof>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryCapacityCommitmentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCapacityCommitmentStatsPerEpochArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCapacityCommitmentStatsPerEpochesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CapacityCommitmentStatsPerEpoch_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CapacityCommitmentStatsPerEpoch_Filter>;
};


export type QueryCapacityCommitmentToComputeUnitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCapacityCommitmentToComputeUnitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CapacityCommitmentToComputeUnit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CapacityCommitmentToComputeUnit_Filter>;
};


export type QueryCapacityCommitmentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CapacityCommitment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CapacityCommitment_Filter>;
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


export type QueryDealToJoinedOfferPeerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDealToJoinedOfferPeersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToJoinedOfferPeer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DealToJoinedOfferPeer_Filter>;
};


export type QueryDealToPeerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDealToPeersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToPeer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DealToPeer_Filter>;
};


export type QueryDealToProvidersAccessArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDealToProvidersAccessesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToProvidersAccess_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DealToProvidersAccess_Filter>;
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


export type QuerySubmittedProofArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySubmittedProofsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SubmittedProof_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SubmittedProof_Filter>;
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

export type SubmittedProof = {
  __typename?: 'SubmittedProof';
  capacityCommitment: CapacityCommitment;
  capacityCommitmentStatsPerEpoch: CapacityCommitmentStatsPerEpoch;
  computeUnit: ComputeUnit;
  createdAt: Scalars['BigInt']['output'];
  createdEpoch: Scalars['BigInt']['output'];
  /** Id here is a transaction hash. */
  id: Scalars['ID']['output'];
  localUnitNonce: Scalars['Bytes']['output'];
  peer: Peer;
  provider: Provider;
};

export type SubmittedProof_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SubmittedProof_Filter>>>;
  capacityCommitment?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_?: InputMaybe<CapacityCommitmentStatsPerEpoch_Filter>;
  capacityCommitmentStatsPerEpoch_contains?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_ends_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_gt?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_gte?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_in?: InputMaybe<Array<Scalars['String']['input']>>;
  capacityCommitmentStatsPerEpoch_lt?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_lte?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_not?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_not_contains?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  capacityCommitmentStatsPerEpoch_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_starts_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitmentStatsPerEpoch_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_?: InputMaybe<CapacityCommitment_Filter>;
  capacityCommitment_contains?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_ends_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_gt?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_gte?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_in?: InputMaybe<Array<Scalars['String']['input']>>;
  capacityCommitment_lt?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_lte?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_contains?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  capacityCommitment_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_starts_with?: InputMaybe<Scalars['String']['input']>;
  capacityCommitment_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit?: InputMaybe<Scalars['String']['input']>;
  computeUnit_?: InputMaybe<ComputeUnit_Filter>;
  computeUnit_contains?: InputMaybe<Scalars['String']['input']>;
  computeUnit_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit_ends_with?: InputMaybe<Scalars['String']['input']>;
  computeUnit_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit_gt?: InputMaybe<Scalars['String']['input']>;
  computeUnit_gte?: InputMaybe<Scalars['String']['input']>;
  computeUnit_in?: InputMaybe<Array<Scalars['String']['input']>>;
  computeUnit_lt?: InputMaybe<Scalars['String']['input']>;
  computeUnit_lte?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_contains?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  computeUnit_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  computeUnit_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  computeUnit_starts_with?: InputMaybe<Scalars['String']['input']>;
  computeUnit_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdEpoch?: InputMaybe<Scalars['BigInt']['input']>;
  createdEpoch_gt?: InputMaybe<Scalars['BigInt']['input']>;
  createdEpoch_gte?: InputMaybe<Scalars['BigInt']['input']>;
  createdEpoch_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  createdEpoch_lt?: InputMaybe<Scalars['BigInt']['input']>;
  createdEpoch_lte?: InputMaybe<Scalars['BigInt']['input']>;
  createdEpoch_not?: InputMaybe<Scalars['BigInt']['input']>;
  createdEpoch_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  localUnitNonce?: InputMaybe<Scalars['Bytes']['input']>;
  localUnitNonce_contains?: InputMaybe<Scalars['Bytes']['input']>;
  localUnitNonce_gt?: InputMaybe<Scalars['Bytes']['input']>;
  localUnitNonce_gte?: InputMaybe<Scalars['Bytes']['input']>;
  localUnitNonce_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  localUnitNonce_lt?: InputMaybe<Scalars['Bytes']['input']>;
  localUnitNonce_lte?: InputMaybe<Scalars['Bytes']['input']>;
  localUnitNonce_not?: InputMaybe<Scalars['Bytes']['input']>;
  localUnitNonce_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  localUnitNonce_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SubmittedProof_Filter>>>;
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
};

export type SubmittedProof_OrderBy =
  | 'capacityCommitment'
  | 'capacityCommitmentStatsPerEpoch'
  | 'capacityCommitmentStatsPerEpoch__activeUnitCount'
  | 'capacityCommitmentStatsPerEpoch__blockNumberEnd'
  | 'capacityCommitmentStatsPerEpoch__blockNumberStart'
  | 'capacityCommitmentStatsPerEpoch__currentCCNextCCFailedEpoch'
  | 'capacityCommitmentStatsPerEpoch__epoch'
  | 'capacityCommitmentStatsPerEpoch__exitedUnitCount'
  | 'capacityCommitmentStatsPerEpoch__id'
  | 'capacityCommitmentStatsPerEpoch__nextAdditionalActiveUnitCount'
  | 'capacityCommitmentStatsPerEpoch__submittedProofsCount'
  | 'capacityCommitmentStatsPerEpoch__totalCUFailCount'
  | 'capacityCommitment__activeUnitCount'
  | 'capacityCommitment__collateralPerUnit'
  | 'capacityCommitment__computeUnitsCount'
  | 'capacityCommitment__createdAt'
  | 'capacityCommitment__delegator'
  | 'capacityCommitment__deleted'
  | 'capacityCommitment__duration'
  | 'capacityCommitment__endEpoch'
  | 'capacityCommitment__exitedUnitCount'
  | 'capacityCommitment__failedEpoch'
  | 'capacityCommitment__id'
  | 'capacityCommitment__nextAdditionalActiveUnitCount'
  | 'capacityCommitment__nextCCFailedEpoch'
  | 'capacityCommitment__rewardDelegatorRate'
  | 'capacityCommitment__rewardWithdrawn'
  | 'capacityCommitment__snapshotEpoch'
  | 'capacityCommitment__startEpoch'
  | 'capacityCommitment__status'
  | 'capacityCommitment__submittedProofsCount'
  | 'capacityCommitment__totalCUFailCount'
  | 'capacityCommitment__totalCollateral'
  | 'computeUnit'
  | 'computeUnit__createdAt'
  | 'computeUnit__id'
  | 'computeUnit__submittedProofsCount'
  | 'computeUnit__workerId'
  | 'createdAt'
  | 'createdEpoch'
  | 'id'
  | 'localUnitNonce'
  | 'peer'
  | 'peer__computeUnitsInCapacityCommitment'
  | 'peer__computeUnitsInDeal'
  | 'peer__computeUnitsTotal'
  | 'peer__currentCCCollateralDepositedAt'
  | 'peer__currentCCEndEpoch'
  | 'peer__currentCCNextCCFailedEpoch'
  | 'peer__id'
  | 'peer__isAnyJoinedDeals'
  | 'provider'
  | 'provider__approved'
  | 'provider__computeUnitsAvailable'
  | 'provider__computeUnitsTotal'
  | 'provider__createdAt'
  | 'provider__id'
  | 'provider__name'
  | 'provider__peerCount'
  | 'provider__registered';

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  capacityCommitment?: Maybe<CapacityCommitment>;
  capacityCommitmentStatsPerEpoch?: Maybe<CapacityCommitmentStatsPerEpoch>;
  capacityCommitmentStatsPerEpoches: Array<CapacityCommitmentStatsPerEpoch>;
  capacityCommitmentToComputeUnit?: Maybe<CapacityCommitmentToComputeUnit>;
  capacityCommitmentToComputeUnits: Array<CapacityCommitmentToComputeUnit>;
  capacityCommitments: Array<CapacityCommitment>;
  computeUnit?: Maybe<ComputeUnit>;
  computeUnits: Array<ComputeUnit>;
  deal?: Maybe<Deal>;
  dealToEffector?: Maybe<DealToEffector>;
  dealToEffectors: Array<DealToEffector>;
  dealToJoinedOfferPeer?: Maybe<DealToJoinedOfferPeer>;
  dealToJoinedOfferPeers: Array<DealToJoinedOfferPeer>;
  dealToPeer?: Maybe<DealToPeer>;
  dealToPeers: Array<DealToPeer>;
  dealToProvidersAccess?: Maybe<DealToProvidersAccess>;
  dealToProvidersAccesses: Array<DealToProvidersAccess>;
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
  submittedProof?: Maybe<SubmittedProof>;
  submittedProofs: Array<SubmittedProof>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionCapacityCommitmentArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCapacityCommitmentStatsPerEpochArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCapacityCommitmentStatsPerEpochesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CapacityCommitmentStatsPerEpoch_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CapacityCommitmentStatsPerEpoch_Filter>;
};


export type SubscriptionCapacityCommitmentToComputeUnitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCapacityCommitmentToComputeUnitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CapacityCommitmentToComputeUnit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CapacityCommitmentToComputeUnit_Filter>;
};


export type SubscriptionCapacityCommitmentsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CapacityCommitment_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CapacityCommitment_Filter>;
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


export type SubscriptionDealToJoinedOfferPeerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDealToJoinedOfferPeersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToJoinedOfferPeer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DealToJoinedOfferPeer_Filter>;
};


export type SubscriptionDealToPeerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDealToPeersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToPeer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DealToPeer_Filter>;
};


export type SubscriptionDealToProvidersAccessArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDealToProvidersAccessesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DealToProvidersAccess_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DealToProvidersAccess_Filter>;
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


export type SubscriptionSubmittedProofArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSubmittedProofsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SubmittedProof_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SubmittedProof_Filter>;
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
