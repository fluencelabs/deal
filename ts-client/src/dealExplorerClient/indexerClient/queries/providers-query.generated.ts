/* eslint-disable */
//@ts-nocheck
import * as Types from '../generated.types.js';

import { GraphQLClient } from 'graphql-request';
import type { RequestOptions } from 'graphql-request';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
import gql from 'graphql-tag';
export type ProvidersQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Provider_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.Provider_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type ProvidersQueryQuery = { __typename?: 'Query', providers: Array<{ __typename?: 'Provider', id: string, name: string, createdAt: any, computeUnitsAvailable: number, computeUnitsTotal: number, offers?: Array<{ __typename?: 'Offer', id: string, createdAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, paymentToken: { __typename?: 'Token', id: string, symbol: string }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null }> | null }> };

export type ProvidersIdQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Provider_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.Provider_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type ProvidersIdQueryQuery = { __typename?: 'Query', providers: Array<{ __typename?: 'Provider', id: string }> };

export type ProviderOfProvidersQueryFragment = { __typename?: 'Provider', id: string, name: string, createdAt: any, computeUnitsAvailable: number, computeUnitsTotal: number, offers?: Array<{ __typename?: 'Offer', id: string, createdAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, paymentToken: { __typename?: 'Token', id: string, symbol: string }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null }> | null };

export type ProviderQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ProviderQueryQuery = { __typename?: 'Query', provider?: { __typename?: 'Provider', peerCount: number, effectorCount: number, id: string, name: string, createdAt: any, computeUnitsAvailable: number, computeUnitsTotal: number } | null };

export type ProviderAbcFragment = { __typename?: 'Provider', id: string, name: string, createdAt: any, computeUnitsAvailable: number, computeUnitsTotal: number };

export type BasicOfferFragment = { __typename?: 'Offer', id: string, createdAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, paymentToken: { __typename?: 'Token', id: string, symbol: string }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null };

export type EffectorBasicFragment = { __typename?: 'Effector', id: string, description: string };

export const ProviderAbcFragmentDoc = gql`
    fragment ProviderABC on Provider {
  id
  name
  createdAt
  computeUnitsAvailable
  computeUnitsTotal
}
    `;
export const EffectorBasicFragmentDoc = gql`
    fragment EffectorBasic on Effector {
  id
  description
}
    `;
export const BasicOfferFragmentDoc = gql`
    fragment BasicOffer on Offer {
  id
  createdAt
  pricePerEpoch
  paymentToken {
    id
    symbol
  }
  computeUnitsTotal
  computeUnitsAvailable
  effectors {
    effector {
      ...EffectorBasic
    }
  }
}
    ${EffectorBasicFragmentDoc}`;
export const ProviderOfProvidersQueryFragmentDoc = gql`
    fragment ProviderOfProvidersQuery on Provider {
  ...ProviderABC
  offers {
    ...BasicOffer
  }
}
    ${ProviderAbcFragmentDoc}
${BasicOfferFragmentDoc}`;
export const ProvidersQueryDocument = gql`
    query ProvidersQuery($filters: Provider_filter, $offset: Int, $limit: Int, $orderBy: Provider_orderBy, $orderType: OrderDirection) {
  providers(
    where: $filters
    first: $limit
    skip: $offset
    orderBy: $orderBy
    orderDirection: $orderType
  ) {
    ...ProviderOfProvidersQuery
  }
}
    ${ProviderOfProvidersQueryFragmentDoc}`;
export const ProvidersIdQueryDocument = gql`
    query ProvidersIdQuery($filters: Provider_filter, $offset: Int, $limit: Int, $orderBy: Provider_orderBy, $orderType: OrderDirection) {
  providers(
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
export const ProviderQueryDocument = gql`
    query ProviderQuery($id: ID!) {
  provider(id: $id) {
    ...ProviderABC
    peerCount
    effectorCount
  }
}
    ${ProviderAbcFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    ProvidersQuery(variables?: ProvidersQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ProvidersQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProvidersQueryQuery>(ProvidersQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProvidersQuery', 'query');
    },
    ProvidersIdQuery(variables?: ProvidersIdQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ProvidersIdQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProvidersIdQueryQuery>(ProvidersIdQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProvidersIdQuery', 'query');
    },
    ProviderQuery(variables: ProviderQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ProviderQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProviderQueryQuery>(ProviderQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ProviderQuery', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
