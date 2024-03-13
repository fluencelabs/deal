/* eslint-disable */
//@ts-nocheck
import * as Types from "../generated.types.js";

import { GraphQLClient, RequestOptions } from "graphql-request";
import gql from "graphql-tag";
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
export type CapacityCommitmentsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.CapacityCommitment_Filter>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  orderBy?: Types.InputMaybe<Types.CapacityCommitment_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;

export type CapacityCommitmentsQueryQuery = {
  __typename?: "Query";
  capacityCommitments: Array<{
    __typename?: "CapacityCommitment";
    id: string;
    status?: Types.CapacityCommitmentStatus | null;
    createdAt: any;
    startEpoch: any;
    endEpoch: any;
    computeUnitsCount: number;
    totalCollateral: any;
    rewardWithdrawn: any;
    rewardDelegatorRate: number;
    duration: any;
    peer: {
      __typename?: "Peer";
      id: string;
      provider: { __typename?: "Provider"; id: string };
    };
  }>;
  graphNetworks: Array<{
    __typename?: "GraphNetwork";
    capacityCommitmentsTotal: any;
  }>;
};

export type CapacityCommitmentQueryQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type CapacityCommitmentQueryQuery = {
  __typename?: "Query";
  capacityCommitment?: {
    __typename?: "CapacityCommitment";
    delegator: string;
    id: string;
    status?: Types.CapacityCommitmentStatus | null;
    createdAt: any;
    startEpoch: any;
    endEpoch: any;
    computeUnitsCount: number;
    totalCollateral: any;
    rewardWithdrawn: any;
    rewardDelegatorRate: number;
    duration: any;
    computeUnits?: Array<{
      __typename?: "CapacityCommitmentToComputeUnit";
      computeUnit: {
        __typename?: "ComputeUnit";
        id: string;
        deal?: { __typename?: "Deal"; id: string } | null;
      };
    }> | null;
    peer: {
      __typename?: "Peer";
      id: string;
      provider: { __typename?: "Provider"; id: string };
    };
  } | null;
};

export type SubmittedProofsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.SubmittedProof_Filter>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  orderBy?: Types.InputMaybe<Types.SubmittedProof_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;

export type SubmittedProofsQueryQuery = {
  __typename?: "Query";
  submittedProofs: Array<{
    __typename?: "SubmittedProof";
    id: string;
    createdAt: any;
    createdEpoch: any;
    capacityCommitment: {
      __typename?: "CapacityCommitment";
      id: string;
      startEpoch: any;
      endEpoch: any;
    };
    computeUnit: { __typename?: "ComputeUnit"; id: string };
    peer: {
      __typename?: "Peer";
      id: string;
      provider: { __typename?: "Provider"; id: string };
    };
  }>;
  graphNetworks: Array<{ __typename?: "GraphNetwork"; proofsTotal: any }>;
};

export type CapacityCommitmentBasicFragment = {
  __typename?: "CapacityCommitment";
  id: string;
  status?: Types.CapacityCommitmentStatus | null;
  createdAt: any;
  startEpoch: any;
  endEpoch: any;
  computeUnitsCount: number;
  totalCollateral: any;
  rewardWithdrawn: any;
  rewardDelegatorRate: number;
  duration: any;
  peer: {
    __typename?: "Peer";
    id: string;
    provider: { __typename?: "Provider"; id: string };
  };
};

export type ComputeUnitBasicFragment = {
  __typename?: "ComputeUnit";
  id: string;
  workerId?: string | null;
  provider: { __typename?: "Provider"; id: string };
};

export type EffectorBasicFragment = {
  __typename?: "Effector";
  id: string;
  description: string;
};

export type CapacityCommitmentStatsPerEpochQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.CapacityCommitmentStatsPerEpoch_Filter>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  orderBy?: Types.InputMaybe<Types.CapacityCommitmentStatsPerEpoch_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;

export type CapacityCommitmentStatsPerEpochQueryQuery = {
  __typename?: "Query";
  capacityCommitmentStatsPerEpochs: Array<{
    __typename?: "CapacityCommitmentStatsPerEpoch";
    id: string;
    epoch: any;
    blockNumberEnd: any;
    blockNumberStart: any;
    totalFailCount: number;
    exitedUnitCount: number;
    activeUnitCount: number;
    nextAdditionalActiveUnitCount: number;
    currentCCNextCCFailedEpoch: any;
    submittedProofsCount: number;
    computeUnitsWithMinRequiredProofsSubmittedCounter: number;
    capacityCommitment: { __typename?: "CapacityCommitment"; id: string };
    submittedProofs?: Array<{
      __typename?: "SubmittedProof";
      id: string;
      computeUnit: { __typename?: "ComputeUnit"; id: string };
    }> | null;
  }>;
};

export type ComputeUnitPerEpochStatsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.ComputeUnitPerEpochStat_Filter>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  orderBy?: Types.InputMaybe<Types.ComputeUnitPerEpochStat_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;

export type ComputeUnitPerEpochStatsQueryQuery = {
  __typename?: "Query";
  computeUnitPerEpochStats: Array<{
    __typename?: "ComputeUnitPerEpochStat";
    id: string;
    epoch: any;
    submittedProofsCount: number;
    computeUnit: { __typename?: "ComputeUnit"; id: string };
  }>;
};

export const CapacityCommitmentBasicFragmentDoc = gql`
  fragment CapacityCommitmentBasic on CapacityCommitment {
    id
    peer {
      id
      provider {
        id
      }
    }
    status
    createdAt
    startEpoch
    endEpoch
    computeUnitsCount
    totalCollateral
    rewardWithdrawn
    rewardDelegatorRate
    duration
  }
`;
export const ComputeUnitBasicFragmentDoc = gql`
  fragment ComputeUnitBasic on ComputeUnit {
    id
    workerId
    provider {
      id
    }
  }
`;
export const EffectorBasicFragmentDoc = gql`
  fragment EffectorBasic on Effector {
    id
    description
  }
`;
export const CapacityCommitmentsQueryDocument = gql`
  query CapacityCommitmentsQuery(
    $filters: CapacityCommitment_filter
    $offset: Int
    $limit: Int
    $orderBy: CapacityCommitment_orderBy
    $orderType: OrderDirection
  ) {
    capacityCommitments(
      where: $filters
      first: $limit
      skip: $offset
      orderBy: $orderBy
      orderDirection: $orderType
    ) {
      ...CapacityCommitmentBasic
    }
    graphNetworks(first: 1) {
      capacityCommitmentsTotal
    }
  }
  ${CapacityCommitmentBasicFragmentDoc}
`;
export const CapacityCommitmentQueryDocument = gql`
  query CapacityCommitmentQuery($id: ID!) {
    capacityCommitment(id: $id) {
      ...CapacityCommitmentBasic
      delegator
      computeUnits {
        computeUnit {
          id
          deal {
            id
          }
        }
      }
    }
  }
  ${CapacityCommitmentBasicFragmentDoc}
`;
export const SubmittedProofsQueryDocument = gql`
  query SubmittedProofsQuery(
    $filters: SubmittedProof_filter
    $offset: Int
    $limit: Int
    $orderBy: SubmittedProof_orderBy
    $orderType: OrderDirection
  ) {
    submittedProofs(
      where: $filters
      first: $limit
      skip: $offset
      orderBy: $orderBy
      orderDirection: $orderType
    ) {
      id
      capacityCommitment {
        id
        startEpoch
        endEpoch
      }
      computeUnit {
        id
      }
      createdAt
      createdEpoch
      peer {
        id
        provider {
          id
        }
      }
    }
    graphNetworks(first: 1) {
      proofsTotal
    }
  }
`;
export const CapacityCommitmentStatsPerEpochQueryDocument = gql`
  query CapacityCommitmentStatsPerEpochQuery(
    $filters: CapacityCommitmentStatsPerEpoch_filter
    $offset: Int
    $limit: Int
    $orderBy: CapacityCommitmentStatsPerEpoch_orderBy
    $orderType: OrderDirection
  ) {
    capacityCommitmentStatsPerEpochs(
      where: $filters
      first: $limit
      skip: $offset
      orderBy: $orderBy
      orderDirection: $orderType
    ) {
      id
      epoch
      blockNumberEnd
      blockNumberStart
      capacityCommitment {
        id
      }
      totalFailCount
      exitedUnitCount
      activeUnitCount
      nextAdditionalActiveUnitCount
      currentCCNextCCFailedEpoch
      submittedProofsCount
      computeUnitsWithMinRequiredProofsSubmittedCounter
      submittedProofs {
        id
        computeUnit {
          id
        }
      }
    }
  }
`;
export const ComputeUnitPerEpochStatsQueryDocument = gql`
  query ComputeUnitPerEpochStatsQuery(
    $filters: ComputeUnitPerEpochStat_filter
    $offset: Int
    $limit: Int
    $orderBy: ComputeUnitPerEpochStat_orderBy
    $orderType: OrderDirection
  ) {
    computeUnitPerEpochStats(
      where: $filters
      first: $limit
      skip: $offset
      orderBy: $orderBy
      orderDirection: $orderType
    ) {
      id
      computeUnit {
        id
      }
      epoch
      submittedProofsCount
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    CapacityCommitmentsQuery(
      variables?: CapacityCommitmentsQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CapacityCommitmentsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CapacityCommitmentsQueryQuery>(
            CapacityCommitmentsQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "CapacityCommitmentsQuery",
        "query",
        variables,
      );
    },
    CapacityCommitmentQuery(
      variables: CapacityCommitmentQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CapacityCommitmentQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CapacityCommitmentQueryQuery>(
            CapacityCommitmentQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "CapacityCommitmentQuery",
        "query",
        variables,
      );
    },
    SubmittedProofsQuery(
      variables?: SubmittedProofsQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<SubmittedProofsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<SubmittedProofsQueryQuery>(
            SubmittedProofsQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "SubmittedProofsQuery",
        "query",
        variables,
      );
    },
    CapacityCommitmentStatsPerEpochQuery(
      variables?: CapacityCommitmentStatsPerEpochQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CapacityCommitmentStatsPerEpochQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CapacityCommitmentStatsPerEpochQueryQuery>(
            CapacityCommitmentStatsPerEpochQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "CapacityCommitmentStatsPerEpochQuery",
        "query",
        variables,
      );
    },
    ComputeUnitPerEpochStatsQuery(
      variables?: ComputeUnitPerEpochStatsQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ComputeUnitPerEpochStatsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ComputeUnitPerEpochStatsQueryQuery>(
            ComputeUnitPerEpochStatsQueryDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        "ComputeUnitPerEpochStatsQuery",
        "query",
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
