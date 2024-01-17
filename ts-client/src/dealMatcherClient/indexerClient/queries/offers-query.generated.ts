/* eslint-disable */
//@ts-nocheck
import * as Types from '../generated.types.js';

import { GraphQLClient } from 'graphql-request';
import type { RequestOptions } from 'graphql-request';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
import gql from 'graphql-tag';
export type OffersQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Offer_Filter>;
  peersFilters?: Types.InputMaybe<Types.Peer_Filter>;
  computeUnitsFilters?: Types.InputMaybe<Types.ComputeUnit_Filter>;
  peersLimit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  computeUnitsLimit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  peersOffset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  computeUnitsOffset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  orderBy?: Types.InputMaybe<Types.Offer_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;

export type OffersQueryQuery = {
  __typename?: "Query";
  offers: Array<{
    __typename?: "Offer";
    id: string;
    peers?: Array<{
      __typename?: "Peer";
      computeUnits?: Array<{ __typename?: "ComputeUnit"; id: string }> | null;
    }> | null;
  }>;
};

export const OffersQueryDocument = gql`
  query OffersQuery(
    $filters: Offer_filter
    $peersFilters: Peer_filter
    $computeUnitsFilters: ComputeUnit_filter
    $peersLimit: Int
    $computeUnitsLimit: Int
    $offset: Int
    $peersOffset: Int
    $computeUnitsOffset: Int
    $limit: Int
    $orderBy: Offer_orderBy
    $orderType: OrderDirection
  ) {
    offers(
      where: $filters
      first: $limit
      skip: $offset
      orderBy: $orderBy
      orderDirection: $orderType
    ) {
      id
      peers(where: $peersFilters, first: $peersLimit, skip: $peersOffset) {
        computeUnits(
          where: $computeUnitsFilters
          first: $computeUnitsLimit
          skip: $computeUnitsOffset
        ) {
          id
        }
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    OffersQuery(
      variables?: OffersQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<OffersQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<OffersQueryQuery>(OffersQueryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "OffersQuery",
        "query",
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
