import type {
  OfferQueryQueryVariables,
  Sdk as OffersSdk,
} from "./queries/offers-query.generated.js";
import { getSdk as getOffersSdk } from "./queries/offers-query.generated.js";
import { IndexerClientABC } from "../../utils/indexerClientABC/indexerClientABC.js";
import type { ContractsENV } from "../../client/config.js";

export class IndexerClient extends IndexerClientABC {
  private offersClient: OffersSdk;
  constructor(network: ContractsENV, indexerUrl?: string) {
    super(network, indexerUrl);
    this.offersClient = getOffersSdk(this._graphqlClient);
  }

  async getOffer(variables: OfferQueryQueryVariables) {
    return await this.offersClient.OfferQuery(variables);
  }
}
