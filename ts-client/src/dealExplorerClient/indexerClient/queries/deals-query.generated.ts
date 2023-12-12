/* eslint-disable */
//@ts-nocheck
import * as Types from "../generated.types.js";

import { GraphQLClient } from "graphql-request";
import type { RequestOptions } from "graphql-request";
type GraphQLClientRequestHeaders = RequestOptions["requestHeaders"];
import gql from "graphql-tag";
export type DealsQueryQueryVariables = Types.Exact<{
  filters?: Types.InputMaybe<Types.Deal_Filter>;
  offset?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  limit?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  orderBy?: Types.InputMaybe<Types.Deal_OrderBy>;
  orderType?: Types.InputMaybe<Types.OrderDirection>;
}>;

export type DealsQueryQuery = {
  __typename?: "Query";
  deals: Array<{
    __typename?: "Deal";
    id: string;
    createdAt: any;
    minWorkers: number;
    targetWorkers: number;
    owner: any;
    maxPaidEpoch?: any | null;
    depositedSum: any;
    withdrawalSum: any;
    paymentToken: { __typename?: "Token"; id: string; symbol: string };
    effectors?: Array<{
      __typename?: "DealToEffector";
      effector: { __typename?: "Effector"; id: string; description: string };
    }> | null;
    addedComputeUnits?: Array<{
      __typename?: "ComputeUnit";
      id: string;
      workerId?: string | null;
      provider: { __typename?: "Provider"; id: string };
    }> | null;
  }>;
};

export type DealQueryQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"]["input"];
}>;

export type DealQueryQuery = {
  __typename?: "Query";
  deal?: {
    __typename?: "Deal";
    maxWorkersPerProvider: number;
    appCID: string;
    pricePerWorkerEpoch: any;
    id: string;
    createdAt: any;
    minWorkers: number;
    targetWorkers: number;
    owner: any;
    maxPaidEpoch?: any | null;
    depositedSum: any;
    withdrawalSum: any;
    paymentToken: { __typename?: "Token"; id: string; symbol: string };
    effectors?: Array<{
      __typename?: "DealToEffector";
      effector: { __typename?: "Effector"; id: string; description: string };
    }> | null;
    addedComputeUnits?: Array<{
      __typename?: "ComputeUnit";
      id: string;
      workerId?: string | null;
      provider: { __typename?: "Provider"; id: string };
    }> | null;
  } | null;
};

export type BasicDealFragment = {
  __typename?: "Deal";
  id: string;
  createdAt: any;
  minWorkers: number;
  targetWorkers: number;
  owner: any;
  maxPaidEpoch?: any | null;
  depositedSum: any;
  withdrawalSum: any;
  paymentToken: { __typename?: "Token"; id: string; symbol: string };
  effectors?: Array<{
    __typename?: "DealToEffector";
    effector: { __typename?: "Effector"; id: string; description: string };
  }> | null;
  addedComputeUnits?: Array<{
    __typename?: "ComputeUnit";
    id: string;
    workerId?: string | null;
    provider: { __typename?: "Provider"; id: string };
  }> | null;
};

export const BasicDealFragmentDoc = gql`
  fragment BasicDeal on Deal {
    id
    createdAt
    minWorkers
    targetWorkers
    owner
    paymentToken {
      id
      symbol
    }
    effectors {
      effector {
        id
        description
      }
    }
    addedComputeUnits {
      id
      workerId
      provider {
        id
      }
    }
    maxPaidEpoch
    depositedSum
    withdrawalSum
  }
`;
export const DealsQueryDocument = gql`
  query DealsQuery(
    $filters: Deal_filter
    $offset: Int
    $limit: Int
    $orderBy: Deal_orderBy
    $orderType: OrderDirection
  ) {
    deals(
      where: $filters
      first: $limit
      skip: $offset
      orderBy: $orderBy
      orderDirection: $orderType
    ) {
      ...BasicDeal
    }
  }
  ${BasicDealFragmentDoc}
`;
export const DealQueryDocument = gql`
  query DealQuery($id: ID!) {
    deal(id: $id) {
      ...BasicDeal
      maxWorkersPerProvider
      appCID
      pricePerWorkerEpoch
    }
  }
  ${BasicDealFragmentDoc}
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
    DealsQuery(
      variables?: DealsQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DealsQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DealsQueryQuery>(DealsQueryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "DealsQuery",
        "query",
      );
    },
    DealQuery(
      variables: DealQueryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<DealQueryQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<DealQueryQuery>(DealQueryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        "DealQuery",
        "query",
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
