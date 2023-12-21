import { GraphQLClient } from "graphql-request";
import type {
  DealQueryQueryVariables,
  DealsQueryQueryVariables,
  Sdk as DealsSdk,
} from "./queries/deals-query.generated.js";
import { getSdk as getDealsSdk } from "./queries/deals-query.generated.js";
import type {
  EffectorQueryQueryVariables,
  OfferQueryQueryVariables,
  OffersQueryQueryVariables,
  Sdk as OffersSdk,
  TokenQueryQueryVariables,
} from "./queries/offers-query.generated.js";
import { getSdk as getOffersSdk } from "./queries/offers-query.generated.js";
import type {
  ProviderQueryQueryVariables,
  ProvidersQueryQueryVariables,
  Sdk as ProvidersSdk,
} from "./queries/providers-query.generated.js";
import { getSdk as getProvidersSdk } from "./queries/providers-query.generated.js";

/*
 * @title Client of The Graph/GraphQL backend Service.
 */
export class IndexerClient {
  private dealsClient: DealsSdk;
  private offersClient: OffersSdk;
  private providersClient: ProvidersSdk;
  constructor(url: string) {
    const client = new GraphQLClient(url);
    this.dealsClient = getDealsSdk(client);
    this.offersClient = getOffersSdk(client);
    this.providersClient = getProvidersSdk(client);
  }

  async getProviders(variables: ProvidersQueryQueryVariables) {
    return await this.providersClient.ProvidersQuery(variables);
  }

  async getProvider(variables: ProviderQueryQueryVariables) {
    return await this.providersClient.ProviderQuery(variables);
  }

  async getOffers(variables: OffersQueryQueryVariables) {
    return await this.offersClient.OffersQuery(variables);
  }

  async getOffer(variables: OfferQueryQueryVariables) {
    return await this.offersClient.OfferQuery(variables);
  }

  async getDeals(variables: DealsQueryQueryVariables) {
    return await this.dealsClient.DealsQuery(variables);
  }

  async getDeal(variables: DealQueryQueryVariables) {
    return await this.dealsClient.DealQuery(variables);
  }

  async getEffectors(variables: EffectorQueryQueryVariables) {
    return await this.offersClient.EffectorQuery(variables);
  }

  async getTokens(variables: TokenQueryQueryVariables) {
    return await this.offersClient.TokenQuery(variables);
  }
}
