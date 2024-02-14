/* eslint-disable */
//@ts-nocheck
import * as Types from "../generated.types.js";

import { GraphQLClient } from "graphql-request";
import type { RequestOptions } from "graphql-request";
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
import gql from "graphql-tag";
export type DealsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Deal_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.Deal_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type DealsQueryQuery = { __typename?: 'Query', deals: Array<{ __typename?: 'Deal', id: string, createdAt: any, minWorkers: number, targetWorkers: number, owner: string, providersAccessType: number, maxPaidEpoch?: any | null, depositedSum: any, withdrawalSum: any, paymentToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, effectors?: Array<{ __typename?: 'DealToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null, addedComputeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } }> | null, providersAccessList?: Array<{ __typename?: 'DealToProvidersAccess', id: string }> | null }>, graphNetworks: Array<{ __typename?: 'GraphNetwork', dealsTotal: any }> };

export type DealQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DealQueryQuery = { __typename?: 'Query', deal?: { __typename?: 'Deal', maxWorkersPerProvider: number, appCID: string, pricePerWorkerEpoch: any, id: string, createdAt: any, minWorkers: number, targetWorkers: number, owner: string, providersAccessType: number, maxPaidEpoch?: any | null, depositedSum: any, withdrawalSum: any, paymentToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, effectors?: Array<{ __typename?: 'DealToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null, addedComputeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } }> | null, providersAccessList?: Array<{ __typename?: 'DealToProvidersAccess', id: string }> | null } | null };

export type BasicDealFragment = { __typename?: 'Deal', id: string, createdAt: any, minWorkers: number, targetWorkers: number, owner: string, providersAccessType: number, maxPaidEpoch?: any | null, depositedSum: any, withdrawalSum: any, paymentToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, effectors?: Array<{ __typename?: 'DealToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null, addedComputeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } }> | null, providersAccessList?: Array<{ __typename?: 'DealToProvidersAccess', id: string }> | null };

export type ComputeUnitBasicFragment = { __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } };

export type EffectorBasicFragment = { __typename?: 'Effector', id: string, description: string };

export type DealsByPeerQueryQueryVariables = Types.Exact<{
  peerId: Types.Scalars['ID']['input'];
  dealsOffset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  dealsLimit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  dealsOrderBy?: Types.InputMaybe<Types.DealToPeer_OrderBy>;
  dealsOrderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type DealsByPeerQueryQuery = { __typename?: 'Query', peer?: { __typename?: 'Peer', id: string, joinedDeals?: Array<{ __typename?: 'DealToPeer', deal: { __typename?: 'Deal', id: string, addedComputeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, workerId?: string | null }> | null } }> | null } | null };

export const EffectorBasicFragmentDoc = gql`
    fragment EffectorBasic on Effector {
  id
  description
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
export const BasicDealFragmentDoc = gql`
    fragment BasicDeal on Deal {
  id
  createdAt
  minWorkers
  targetWorkers
  owner
  paymentToken {
    id
    symbol
    decimals
  }
  effectors {
    effector {
      ...EffectorBasic
    }
  }
  addedComputeUnits {
    ...ComputeUnitBasic
  }
  providersAccessType
  providersAccessList {
    id
  }
  maxPaidEpoch
  depositedSum
  withdrawalSum
}
    ${EffectorBasicFragmentDoc}
${ComputeUnitBasicFragmentDoc}`;
export const DealsQueryDocument = gql`
    query DealsQuery($filters: Deal_filter, $offset: Int, $limit: Int, $orderBy: Deal_orderBy, $orderType: OrderDirection) {
  deals(
    where: $filters
    first: $limit
    skip: $offset
    orderBy: $orderBy
    orderDirection: $orderType
  ) {
    ...BasicDeal
  }
  graphNetworks(first: 1) {
    dealsTotal
  }
}
    ${BasicDealFragmentDoc}`;
export const DealQueryDocument = gql`
    query DealQuery($id: ID!) {
  deal(id: $id) {
    ...BasicDeal
    maxWorkersPerProvider
    appCID
    pricePerWorkerEpoch
  }
}
    ${BasicDealFragmentDoc}`;
export const DealsByPeerQueryDocument = gql`
    query DealsByPeerQuery($peerId: ID!, $dealsOffset: Int, $dealsLimit: Int, $dealsOrderBy: DealToPeer_orderBy, $dealsOrderType: OrderDirection) {
  peer(id: $peerId) {
    id
    joinedDeals(
      skip: $dealsOffset
      first: $dealsLimit
      orderBy: $dealsOrderBy
      orderDirection: $dealsOrderType
    ) {
      deal {
        id
        addedComputeUnits {
          id
          workerId
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    DealsQuery(variables?: DealsQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DealsQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DealsQueryQuery>(DealsQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DealsQuery', 'query', variables);
    },
    DealQuery(variables: DealQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DealQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DealQueryQuery>(DealQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DealQuery', 'query', variables);
    },
    DealsByPeerQuery(variables: DealsByPeerQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DealsByPeerQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DealsByPeerQueryQuery>(DealsByPeerQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DealsByPeerQuery', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
