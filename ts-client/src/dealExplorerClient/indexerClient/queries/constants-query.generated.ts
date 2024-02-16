/* eslint-disable */
//@ts-nocheck
import * as Types from '../generated.types.js';

import { GraphQLClient } from 'graphql-request';
import type { RequestOptions } from 'graphql-request';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
import gql from 'graphql-tag';
export type ConstantsQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type ConstantsQueryQuery = { __typename?: 'Query', graphNetworks: Array<{ __typename?: 'GraphNetwork', coreEpochDuration?: number | null, initTimestamp?: number | null, MinRequiredProofsPerEpoch?: number | null }> };


export const ConstantsQueryDocument = gql`
    query ConstantsQuery {
  graphNetworks(first: 1) {
    coreEpochDuration
    initTimestamp
    MinRequiredProofsPerEpoch
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    ConstantsQuery(variables?: ConstantsQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ConstantsQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConstantsQueryQuery>(ConstantsQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ConstantsQuery', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
