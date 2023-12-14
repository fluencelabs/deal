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


export type OffersQueryQuery = { __typename?: 'Query', offers: Array<{ __typename?: 'Offer', id: string, createdAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, paymentToken: { __typename?: 'Token', id: string, symbol: string }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null }> };

export type OffersIdQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Offer_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.Offer_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type OffersIdQueryQuery = { __typename?: 'Query', offers: Array<{ __typename?: 'Offer', id: string }> };

export type OfferQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type OfferQueryQuery = { __typename?: 'Query', offer?: { __typename?: 'Offer', updatedAt: any, id: string, createdAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, peers?: Array<{ __typename?: 'Peer', id: string, offer: { __typename?: 'Offer', id: string }, provider: { __typename?: 'Provider', id: string }, computeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } }> | null }> | null, paymentToken: { __typename?: 'Token', id: string, symbol: string }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null } | null };

export type BasicOfferFragment = { __typename?: 'Offer', id: string, createdAt: any, pricePerEpoch: any, computeUnitsTotal?: number | null, computeUnitsAvailable?: number | null, paymentToken: { __typename?: 'Token', id: string, symbol: string }, effectors?: Array<{ __typename?: 'OfferToEffector', effector: { __typename?: 'Effector', id: string, description: string } }> | null };

export type BasicPeerFragment = { __typename?: 'Peer', id: string, offer: { __typename?: 'Offer', id: string }, provider: { __typename?: 'Provider', id: string }, computeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } }> | null };

export type ComputeUnitBasicFragment = { __typename?: 'ComputeUnit', id: string, workerId?: string | null, provider: { __typename?: 'Provider', id: string } };

export type EffectorBasicFragment = { __typename?: 'Effector', id: string, description: string };

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
}
    ${BasicOfferFragmentDoc}`;
export const OffersIdQueryDocument = gql`
    query OffersIdQuery($filters: Offer_filter, $offset: Int, $limit: Int, $orderBy: Offer_orderBy, $orderType: OrderDirection) {
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    OffersQuery(variables?: OffersQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<OffersQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OffersQueryQuery>(OffersQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OffersQuery', 'query');
    },
    OffersIdQuery(variables?: OffersIdQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<OffersIdQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OffersIdQueryQuery>(OffersIdQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OffersIdQuery', 'query');
    },
    OfferQuery(variables: OfferQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<OfferQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OfferQueryQuery>(OfferQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'OfferQuery', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
