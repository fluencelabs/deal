/* eslint-disable */
//@ts-nocheck
import * as Types from '../generated.types.js';

import { GraphQLClient } from 'graphql-request';
import type { RequestOptions } from 'graphql-request';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
import gql from 'graphql-tag';
export type OffersQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Offer_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.Offer_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type OffersQueryQuery = { __typename?: 'Query', offers: Array<{ __typename?: 'Offer', id: string, createdAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, paymentToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null, provider: { __typename?: 'Provider', id: string, approved: boolean, name: string } }>, graphNetworks: Array<{ __typename?: 'GraphNetwork', offersTotal: any }> };

export type OfferQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type OfferQueryQuery = { __typename?: 'Query', offer?: { __typename?: 'Offer', updatedAt: any, id: string, createdAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, peers?: Array<{ __typename?: 'Peer', id: string, offer: { __typename?: 'Offer', id: string }, provider: { __typename?: 'Provider', id: string }, computeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } }> | null }> | null, paymentToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null, provider: { __typename?: 'Provider', id: string, approved: boolean, name: string } } | null };

export type BasicOfferFragment = { __typename?: 'Offer', id: string, createdAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, paymentToken: { __typename?: 'Token', id: string, symbol: string, decimals: number }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null, provider: { __typename?: 'Provider', id: string, approved: boolean, name: string } };

export type BasicPeerFragment = { __typename?: 'Peer', id: string, offer: { __typename?: 'Offer', id: string }, provider: { __typename?: 'Provider', id: string }, computeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } }> | null };

export type ComputeUnitBasicFragment = { __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } };

export type EffectorBasicFragment = { __typename?: 'Effector', id: string, description: string };

export type EffectorQueryQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.Effector_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type EffectorQueryQuery = { __typename?: 'Query', effectors: Array<{ __typename?: 'Effector', id: string, description: string }>, graphNetworks: Array<{ __typename?: 'GraphNetwork', effectorsTotal: any }> };

export type TokenQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Token_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.Token_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type TokenQueryQuery = { __typename?: 'Query', tokens: Array<{ __typename?: 'Token', id: string, symbol: string, decimals: number }>, graphNetworks: Array<{ __typename?: 'GraphNetwork', tokensTotal: any }> };

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
}
    ${EffectorBasicFragmentDoc}`;
export const ComputeUnitBasicFragmentDoc = gql`
    fragment ComputeUnitBasic on ComputeUnit {
  id
  workerId
  provider {
    id
  }
}
    `;
export const BasicPeerFragmentDoc = gql`
    fragment BasicPeer on Peer {
  id
  offer {
    id
  }
  provider {
    id
  }
  computeUnits {
    ...ComputeUnitBasic
  }
}
    ${ComputeUnitBasicFragmentDoc}`;
export const OffersQueryDocument = gql`
    query OffersQuery($filters: Offer_filter, $offset: Int, $limit: Int, $orderBy: Offer_orderBy, $orderType: OrderDirection) {
  offers(
    where: $filters
    first: $limit
    skip: $offset
    orderBy: $orderBy
    orderDirection: $orderType
  ) {
    ...BasicOffer
  }
  graphNetworks(first: 1) {
    offersTotal
  }
}
    ${BasicOfferFragmentDoc}`;
export const OfferQueryDocument = gql`
    query OfferQuery($id: ID!) {
  offer(id: $id) {
    ...BasicOffer
    updatedAt
    peers {
      ...BasicPeer
    }
  }
}
    ${BasicOfferFragmentDoc}
${BasicPeerFragmentDoc}`;
export const EffectorQueryDocument = gql`
    query EffectorQuery($offset: Int, $limit: Int, $orderBy: Effector_orderBy, $orderType: OrderDirection) {
  effectors(
    first: $limit
    skip: $offset
    orderBy: $orderBy
    orderDirection: $orderType
  ) {
    ...EffectorBasic
  }
  graphNetworks(first: 1) {
    effectorsTotal
  }
}
    ${EffectorBasicFragmentDoc}`;
export const TokenQueryDocument = gql`
    query TokenQuery($filters: Token_filter, $offset: Int, $limit: Int, $orderBy: Token_orderBy, $orderType: OrderDirection) {
  tokens(
    where: $filters
    first: $limit
    skip: $offset
    orderBy: $orderBy
    orderDirection: $orderType
  ) {
    id
    symbol
    decimals
  }
  graphNetworks(first: 1) {
    tokensTotal
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    OffersQuery(variables?: OffersQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<OffersQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OffersQueryQuery>(OffersQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OffersQuery', 'query', variables);
    },
    OfferQuery(variables: OfferQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<OfferQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OfferQueryQuery>(OfferQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OfferQuery', 'query', variables);
    },
    EffectorQuery(variables?: EffectorQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<EffectorQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<EffectorQueryQuery>(EffectorQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EffectorQuery', 'query', variables);
    },
    TokenQuery(variables?: TokenQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<TokenQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TokenQueryQuery>(TokenQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'TokenQuery', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;