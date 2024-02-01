/* eslint-disable */
//@ts-nocheck
import * as Types from "../generated.types.js";

import { GraphQLClient } from "graphql-request";
import type { RequestOptions } from "graphql-request";
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
import gql from "graphql-tag";
export type PeerQueryQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type PeerQueryQuery = {
  __typename?: "Query";
  peer?: {
    __typename?: "Peer";
    id: string;
    computeUnitsTotal: number;
    computeUnitsInDeal: number;
    computeUnitsInCapacityCommitment: number;
    offer: { __typename?: "Offer"; id: string };
    provider: { __typename?: "Provider"; id: string; name: string };
  } | null;
};

export const PeerQueryDocument = gql`
  query PeerQuery($id: ID!) {
    peer(id: $id) {
      id
      offer {
        id
      }
      provider {
        id
        name
      }
      computeUnitsTotal
      computeUnitsInDeal
      computeUnitsInCapacityCommitment
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
  variables,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    PeerQuery(
      variables: PeerQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<PeerQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<PeerQueryQuery>(PeerQueryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "PeerQuery",
        "query",
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
