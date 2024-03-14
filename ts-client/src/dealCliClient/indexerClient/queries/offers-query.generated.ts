/* eslint-disable */
//@ts-nocheck
import * as Types from "../generated.types.js";

import type { GraphQLClient, RequestOptions } from "graphql-request";
import gql from "graphql-tag";
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
export type OfferQueryQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type OfferQueryQuery = {
  __typename?: "Query";
  offer?: {
    __typename?: "Offer";
    id: string;
    effectors?: Array<{
      __typename?: "OfferToEffector";
      effector: { __typename?: "Effector"; id: string; description: string };
    }> | null;
    peers?: Array<{ __typename?: "Peer"; id: string }> | null;
  } | null;
};

export const OfferQueryDocument = gql`
  query OfferQuery($id: ID!) {
    offer(id: $id) {
      id
      effectors {
        effector {
          id
          description
        }
      }
      peers {
        id
      }
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
    OfferQuery(
      variables: OfferQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<OfferQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<OfferQueryQuery>(OfferQueryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "OfferQuery",
        "query",
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
