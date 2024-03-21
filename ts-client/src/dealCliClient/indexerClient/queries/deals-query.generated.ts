/* eslint-disable */
//@ts-nocheck
import * as Types from '../generated.types.js';

import { GraphQLClient } from 'graphql-request';
import type { RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type DealsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Deal_Filter>;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  orderBy?: Types.InputMaybe<Types.Deal_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;


export type DealsQueryQuery = { __typename?: 'Query', deals: Array<{ __typename?: 'Deal', id: string }> };


export const DealsQueryDocument = gql`
    query DealsQuery($filters: Deal_filter, $offset: Int, $limit: Int, $orderBy: Deal_orderBy, $orderType: OrderDirection) {
  deals(
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
    DealsQuery(variables?: DealsQueryQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DealsQueryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DealsQueryQuery>(DealsQueryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DealsQuery', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
