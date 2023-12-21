import { GraphQLClient } from "graphql-request";
import type {
  OffersQueryQueryVariables,
  Sdk as OffersSdk,
} from "./queries/offers-query.generated.js";
import { getSdk as getOffersSdk } from "./queries/offers-query.generated.js";
import {
  type DealQueryQueryVariables, getSdk as getDealsSdk, type Sdk as DealsSdk
} from "./queries/deals-query.generated.js";

/*
 * @title Client of The Graph/GraphQL backend Service.
 */
export class IndexerClient {
  private dealsClient: DealsSdk;
  private offersClient: OffersSdk;
  constructor(url: string) {
    const client = new GraphQLClient(url);
    this.offersClient = getOffersSdk(client);
    this.dealsClient = getDealsSdk(client);
  }

  async getOffers(variables: OffersQueryQueryVariables) {
    return await this.offersClient.OffersQuery(variables);
  }

  async getDeal(variables: DealQueryQueryVariables) {
    return await this.dealsClient.DealQuery(variables);
  }
}
