import { GraphQLClient } from "graphql-request";
import type {
  DealQueryQueryVariables,
  DealsQueryQueryVariables,
  Sdk as DealsSdk,
} from "./queries/deals-query.generated.js";
import { getSdk as getDealsSdk } from "./queries/deals-query.generated.js";
import type {
  OfferQueryQueryVariables,
  OffersQueryQueryVariables,
  Sdk as OffersSdk,
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
  PAGINATOR_ENITIES_LIMIT = 1000;
  public dealsClient: DealsSdk;
  public offersClient: OffersSdk;
  public providersClient: ProvidersSdk;
  constructor(url: string) {
    const client = new GraphQLClient(url);
    this.dealsClient = getDealsSdk(client);
    this.offersClient = getOffersSdk(client);
    this.providersClient = getProvidersSdk(client);
  }

  async getTotalProviders(variables?: ProvidersQueryQueryVariables, offset: number = 0): Promise<number> {
    const paginatorVars: ProvidersQueryQueryVariables = { ...variables } || {};
    paginatorVars.limit = this.PAGINATOR_ENITIES_LIMIT
    paginatorVars.offset = offset

    const entities = await this.providersClient.ProvidersIdQuery(paginatorVars);
    const fetchedEntities = entities.providers.length
    // Check if it should request more.
    if (fetchedEntities == this.PAGINATOR_ENITIES_LIMIT) {
      return fetchedEntities + await this.getTotalProviders(variables, offset + this.PAGINATOR_ENITIES_LIMIT)
    }
    return fetchedEntities
  }

  async getProviders(variables: ProvidersQueryQueryVariables) {
    return await this.providersClient.ProvidersQuery(variables);
  }

  async getProvider(variables: ProviderQueryQueryVariables) {
    return await this.providersClient.ProviderQuery(variables);
  }

  async getTotalOffers(variables?: OffersQueryQueryVariables, offset: number = 0): Promise<number> {
    const paginatorVars: OffersQueryQueryVariables = { ...variables } || {};
    paginatorVars.limit = this.PAGINATOR_ENITIES_LIMIT
    paginatorVars.offset = offset

    const entities = await this.offersClient.OffersIdQuery(paginatorVars);
    const fetchedEntities = entities.offers.length
    // Check if it should request more.
    if (fetchedEntities == this.PAGINATOR_ENITIES_LIMIT) {
      return fetchedEntities + await this.getTotalOffers(variables, offset + this.PAGINATOR_ENITIES_LIMIT)
    }
    return fetchedEntities
  }

  async getOffers(variables: OffersQueryQueryVariables) {
    return await this.offersClient.OffersQuery(variables);
  }

  async getOffer(variables: OfferQueryQueryVariables) {
    return await this.offersClient.OfferQuery(variables);
  }

  // TODO: create generic instead.
  async getTotalDeals(variables?: DealsQueryQueryVariables, offset: number = 0): Promise<number> {
    const paginatorVars: DealsQueryQueryVariables = { ...variables } || {};
    paginatorVars.limit = this.PAGINATOR_ENITIES_LIMIT
    paginatorVars.offset = offset

    const entities = await this.dealsClient.DealsIdQuery(paginatorVars);
    const fetchedEntities = entities.deals.length
    // Check if it should request more.
    if (fetchedEntities == this.PAGINATOR_ENITIES_LIMIT) {
      return fetchedEntities + await this.getTotalDeals(variables, offset + this.PAGINATOR_ENITIES_LIMIT)
    }
    return fetchedEntities
  }

  async getDeals(variables: DealsQueryQueryVariables) {
    return await this.dealsClient.DealsQuery(variables);
  }

  async getDeal(variables: DealQueryQueryVariables) {
    return await this.dealsClient.DealQuery(variables);
  }
}
