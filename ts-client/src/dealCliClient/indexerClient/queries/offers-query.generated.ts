/* eslint-disable */
//@ts-nocheck
import * as Types from '../generated.types.js';

import { GraphQLClient } from 'graphql-request';
import type { RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type OfferDetailsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Offer_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.Offer_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type OfferDetailsQueryQuery = { __typename?: 'Query', offers: Array<{ __typename?: 'Offer', id: string, createdAt: any, updatedAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, paymentToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null, provider: { __typename?: 'Provider', id: string, approved: boolean, name: string }, peers?: Array<{ __typename?: 'Peer', id: string, computeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } }> | null }> | null }> };

export type OfferDetailFragment = { __typename?: 'Offer', id: string, createdAt: any, updatedAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, paymentToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null, provider: { __typename?: 'Provider', id: string, approved: boolean, name: string }, peers?: Array<{ __typename?: 'Peer', id: string, computeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } }> | null }> | null };

export type ComputeUnitBasicFragment = { __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } };

export type EffectorBasicFragment = { __typename?: 'Effector', id: string, description: string };

export type OfferIdsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Offer_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.Offer_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type OfferIdsQueryQuery = { __typename?: 'Query', offers: Array<{ __typename?: 'Offer', id: string }> };

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
export const OfferDetailFragmentDoc = gql`
    fragment OfferDetail on Offer {
  id
  createdAt
  updatedAt
  pricePerEpoch
  paymentToken {
    id
    symbol
    decimals
  }
  computeUnitsTotal
  computeUnitsAvailable
  effectors {
    effector {
      ...EffectorBasic
    }
  }
  provider {
    id
    approved
    name
  }
  peers(where: {deleted: false}) {
    id
    computeUnits(where: {deleted: false}) {
      ...ComputeUnitBasic
    }
  }
}
    ${EffectorBasicFragmentDoc}
${ComputeUnitBasicFragmentDoc}`;
export const OfferDetailsQueryDocument = gql`
    query OfferDetailsQuery($filters: Offer_filter, $offset: Int, $limit: Int, $orderBy: Offer_orderBy, $orderType: OrderDirection) {
  offers(
    where: $filters
    first: $limit
    skip: $offset
    orderBy: $orderBy
    orderDirection: $orderType
  ) {
    ...OfferDetail
  }
}
    ${OfferDetailFragmentDoc}`;
export const OfferIdsQueryDocument = gql`
    query OfferIdsQuery($filters: Offer_filter, $offset: Int, $limit: Int, $orderBy: Offer_orderBy, $orderType: OrderDirection) {
  offers(
    where: $filters
    first: $limit
    skip: $offset
    orderBy: $orderBy
    orderDirection: $orderType
  ) {
    id
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    OfferDetailsQuery(variables?: OfferDetailsQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<OfferDetailsQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OfferDetailsQueryQuery>(OfferDetailsQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OfferDetailsQuery', 'query', variables);
    },
    OfferIdsQuery(variables?: OfferIdsQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<OfferIdsQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OfferIdsQueryQuery>(OfferIdsQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OfferIdsQuery', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
