import type {
  OffersQueryQueryVariables,
  Sdk as OffersSdk,
} from "./queries/offers-query.generated.js";
import { getSdk as getOffersSdk } from "./queries/offers-query.generated.js";
import {
  type DealQueryQueryVariables, getSdk as getDealsSdk, type Sdk as DealsSdk
} from "./queries/deals-query.generated.js";
import {IndexerClientABC} from "../../utils/indexerClientABC.js";

export class IndexerClient extends IndexerClientABC {
  private dealsClient: DealsSdk;
  private offersClient: OffersSdk;
  constructor(url: string) {
    super(url);
    this.offersClient = getOffersSdk(this._graphqlClient);
    this.dealsClient = getDealsSdk(this._graphqlClient);
  }

  async getOffers(variables: OffersQueryQueryVariables) {
    return await this.offersClient.OffersQuery(variables);
  }

  async getDeal(variables: DealQueryQueryVariables) {
    return await this.dealsClient.DealQuery(variables);
  }
}
