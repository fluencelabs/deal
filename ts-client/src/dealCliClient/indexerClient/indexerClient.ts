import type {
  OfferQueryQueryVariables,
  Sdk as OffersSdk,
} from "./queries/offers-query.generated.js";
import type {
  DealsQueryQueryVariables,
  Sdk as DealsSdk,
} from "./queries/deals-query.generated.js";
import { getSdk as getOffersSdk } from "./queries/offers-query.generated.js";
import { getSdk as getDealsSdk } from "./queries/deals-query.generated.js";
import { IndexerClientABC } from "../../utils/indexerClient/indexerClientABC.js";
import type { ContractsENV } from "../../client/config.js";

export class IndexerClient extends IndexerClientABC {
  private offersClient: OffersSdk;
  private dealsClient: DealsSdk;
  constructor(network: ContractsENV, indexerUrl?: string) {
    super(network, indexerUrl);
    this.offersClient = getOffersSdk(this._graphqlClient);
    this.dealsClient = getDealsSdk(this._graphqlClient);
  }

  async getOffer(variables: OfferQueryQueryVariables) {
    return await this.offersClient.OfferQuery(variables);
  }

  async getDeals(variables: DealsQueryQueryVariables) {
    return await this.offersClient.DealsQuery(variables);
  }
}
