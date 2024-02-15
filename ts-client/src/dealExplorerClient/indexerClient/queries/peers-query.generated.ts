/* eslint-disable */
//@ts-nocheck
import * as Types from "../generated.types.js";

import { GraphQLClient } from "graphql-request";
import type { RequestOptions } from "graphql-request";
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
import gql from "graphql-tag";
export type PeerQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type PeerQueryQuery = { __typename?: 'Query', peer?: { __typename?: 'Peer', id: string, computeUnitsTotal: number, computeUnitsInDeal: number, computeUnitsInCapacityCommitment: number, offer: { __typename?: 'Offer', id: string }, provider: { __typename?: 'Provider', id: string, name: string } } | null };

export type ComputeUnitQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type ComputeUnitQueryQuery = { __typename?: 'Query', computeUnit?: { __typename?: 'ComputeUnit', id: string, workerId?: string | null, deal?: { __typename?: 'Deal', id: string } | null, peer: { __typename?: 'Peer', id: string, currentCapacityCommitment?: { __typename?: 'CapacityCommitment', id: string, collateralPerUnit: any, submittedProofsCount: number, startEpoch: any } | null }, provider: { __typename?: 'Provider', id: string, name: string } } | null };


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
export const ComputeUnitQueryDocument = gql`
    query ComputeUnitQuery($id: ID!) {
  computeUnit(id: $id) {
    id
    deal {
      id
    }
    peer {
      id
      currentCapacityCommitment {
        id
        collateralPerUnit
        submittedProofsCount
        startEpoch
      }
    }
    provider {
      id
      name
    }
    workerId
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    PeerQuery(variables: PeerQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PeerQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PeerQueryQuery>(PeerQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PeerQuery', 'query', variables);
    },
    ComputeUnitQuery(variables: ComputeUnitQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ComputeUnitQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ComputeUnitQueryQuery>(ComputeUnitQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ComputeUnitQuery', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
