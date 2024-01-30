/* eslint-disable */
//@ts-nocheck
import * as Types from '../generated.types.js';

import { GraphQLClient } from 'graphql-request';
import type { RequestOptions } from 'graphql-request';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
import gql from 'graphql-tag';
export type CapacityCommitmentsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.CapacityCommitment_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.CapacityCommitment_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type CapacityCommitmentsQueryQuery = { __typename?: 'Query', capacityCommitments: Array<{ __typename?: 'CapacityCommitment', id: string, status?: Types.CapacityCommitmentStatus | null, createdAt: any, startEpoch: any, endEpoch: any, computeUnitsCount: number, peer: { __typename?: 'Peer', id: string, provider: { __typename?: 'Provider', id: string } } }>, graphNetworks: Array<{ __typename?: 'GraphNetwork', capacityCommitmentsTotal: any, coreEpochDuration?: number | null, initTimestamp?: number | null }> };

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
    coreEpochDuration
    initTimestamp
  }
}
    ${CapacityCommitmentBasicFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    CapacityCommitmentsQuery(variables?: CapacityCommitmentsQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CapacityCommitmentsQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CapacityCommitmentsQueryQuery>(CapacityCommitmentsQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CapacityCommitmentsQuery', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
