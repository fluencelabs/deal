/* eslint-disable */
//@ts-nocheck
import * as Types from "../generated.types.js";

import { GraphQLClient } from "graphql-request";
import type { RequestOptions } from "graphql-request";
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
import gql from "graphql-tag";
export type CapacityCommitmentsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.CapacityCommitment_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.CapacityCommitment_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type CapacityCommitmentsQueryQuery = { __typename?: 'Query', capacityCommitments: Array<{ __typename?: 'CapacityCommitment', id: string, status?: Types.CapacityCommitmentStatus | null, createdAt: any, startEpoch: any, endEpoch: any, computeUnitsCount: number, peer: { __typename?: 'Peer', id: string, provider: { __typename?: 'Provider', id: string } } }>, graphNetworks: Array<{ __typename?: 'GraphNetwork', capacityCommitmentsTotal: any }> };

export type CapacityCommitmentQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type CapacityCommitmentQueryQuery = { __typename?: 'Query', capacityCommitment?: { __typename?: 'CapacityCommitment', totalCollateral: any, rewardDelegatorRate: number, id: string, status?: Types.CapacityCommitmentStatus | null, createdAt: any, startEpoch: any, endEpoch: any, computeUnitsCount: number, peer: { __typename?: 'Peer', id: string, provider: { __typename?: 'Provider', id: string } } } | null };

export type SubmittedProofsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.SubmittedProof_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.SubmittedProof_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type SubmittedProofsQueryQuery = { __typename?: 'Query', submittedProofs: Array<{ __typename?: 'SubmittedProof', id: string, createdAt: any, createdEpoch: any, capacityCommitment: { __typename?: 'CapacityCommitment', id: string }, computeUnit: { __typename?: 'ComputeUnit', id: string }, peer: { __typename?: 'Peer', id: string } }>, graphNetworks: Array<{ __typename?: 'GraphNetwork', proofsTotal: any }> };

export type CapacityCommitmentBasicFragment = { __typename?: 'CapacityCommitment', id: string, status?: Types.CapacityCommitmentStatus | null, createdAt: any, startEpoch: any, endEpoch: any, computeUnitsCount: number, peer: { __typename?: 'Peer', id: string, provider: { __typename?: 'Provider', id: string } } };

export type ComputeUnitBasicFragment = { __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } };

export type EffectorBasicFragment = { __typename?: 'Effector', id: string, description: string };

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
    query CapacityCommitmentsQuery($filters: CapacityCommitment_filter, $offset: Int, $limit: Int, $orderBy: CapacityCommitment_orderBy, $orderType: OrderDirection) {
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
    ${CapacityCommitmentBasicFragmentDoc}`;
export const CapacityCommitmentQueryDocument = gql`
    query CapacityCommitmentQuery($id: ID!) {
  capacityCommitment(id: $id) {
    ...CapacityCommitmentBasic
    totalCollateral
    rewardDelegatorRate
  }
}
    ${CapacityCommitmentBasicFragmentDoc}`;
export const SubmittedProofsQueryDocument = gql`
    query SubmittedProofsQuery($filters: SubmittedProof_filter, $offset: Int, $limit: Int, $orderBy: SubmittedProof_orderBy, $orderType: OrderDirection) {
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
    }
    computeUnit {
      id
    }
    createdAt
    createdEpoch
    peer {
      id
    }
  }
  graphNetworks(first: 1) {
    proofsTotal
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CapacityCommitmentsQuery(variables?: CapacityCommitmentsQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CapacityCommitmentsQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CapacityCommitmentsQueryQuery>(CapacityCommitmentsQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CapacityCommitmentsQuery', 'query', variables);
    },
    CapacityCommitmentQuery(variables: CapacityCommitmentQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CapacityCommitmentQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CapacityCommitmentQueryQuery>(CapacityCommitmentQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CapacityCommitmentQuery', 'query', variables);
    },
    SubmittedProofsQuery(variables?: SubmittedProofsQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SubmittedProofsQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SubmittedProofsQueryQuery>(SubmittedProofsQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SubmittedProofsQuery', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
