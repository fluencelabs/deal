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
import { IndexerClientABC } from "../../indexerClient/indexerClientABC.js";
import type { ContractsENV } from "../../client/config.js";

export class IndexerClient extends IndexerClientABC {
  private dealsClient: DealsSdk;
  private offersClient: OffersSdk;
  private providersClient: ProvidersSdk;
  constructor(network: ContractsENV) {
    super(network);
    this.dealsClient = getDealsSdk(this._graphqlClient);
    this.offersClient = getOffersSdk(this._graphqlClient);
    this.providersClient = getProvidersSdk(this._graphqlClient);
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
