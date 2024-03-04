/* eslint-disable */
//@ts-nocheck
import * as Types from "../generated.types.js";

import { GraphQLClient } from "graphql-request";
import type { RequestOptions } from "graphql-request";
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
import gql from "graphql-tag";
export type DealQueryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type DealQueryQuery = { __typename?: 'Query', deal?: { __typename?: 'Deal', id: string, maxWorkersPerProvider: number, minWorkers: number, pricePerWorkerEpoch: any, targetWorkers: number, providersAccessType: number, paymentToken: { __typename?: 'Token', id: string }, addedComputeUnits?: Array<{ __typename?: 'ComputeUnit', id: string, provider: { __typename?: 'Provider', id: string } }> | null, effectors?: Array<{ __typename?: 'DealToEffector', effector: { __typename?: 'Effector', id: string } }> | null, providersAccessList?: Array<{ __typename?: 'DealToProvidersAccess', provider: { __typename?: 'Provider', id: string } }> | null } | null, _meta?: { __typename?: '_Meta_', block: { __typename?: '_Block_', timestamp?: number | null } } | null, graphNetworks: Array<{ __typename?: 'GraphNetwork', coreEpochDuration?: number | null, initTimestamp?: number | null }> };


export const DealQueryDocument = gql`
    query DealQuery($id: ID!) {
  deal(id: $id) {
    id
    maxWorkersPerProvider
    minWorkers
    pricePerWorkerEpoch
    paymentToken {
      id
    }
    targetWorkers
    addedComputeUnits {
      id
      provider {
        id
      }
    }
    effectors {
      effector {
        id
      }
    }
    providersAccessType
    providersAccessList {
      provider {
        id
      }
    }
  }
  _meta {
    block {
      timestamp
    }
  }
  graphNetworks(first: 1) {
    coreEpochDuration
    initTimestamp
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    DealQuery(variables: DealQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DealQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DealQueryQuery>(DealQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DealQuery', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
