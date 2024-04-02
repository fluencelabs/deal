import { IndexerClient } from "./indexerClient/indexerClient.js";
import type { ContractsENV } from "../client/config.js";
import type {
  DealByProvider,
  OfferByProvider,
  OfferDetail
} from "./types/schemes.js";
import { serializeOfferDetail } from "./serializers/schemes.js";
import type { SerializationSettings } from "../utils/serializers.js";
import type { OffersFilterIn } from "./types/filters.js";
import type { IndexerPaginatorIn } from "./types/paginators.js";
import { serializeOffersFilterIn } from "./serializers/filters.js";
import type { DealsOrderByIn, OffersOrderByIn } from "./types/orders.js";

/*
 * @dev This client represents endpoints to access desirable indexer data in REST
 * @dev  manner from POV of Fluence CLI.
 * @dev Currently, it uses only data from indexer (subgraph) only.
 * @dev It supports mainnet, testnet by selecting related contractsEnv.
 * @dev This client is created in the following hypothesis:
 * @dev  - not more than 1000 Compute Units per Peer exist.
 * @dev  - not more than 1000 Peers per Offer possible.
 * @dev Otherwise there should be additional pagination through child fields of some models
 */
export class DealCliClient {
  public indexerClient: IndexerClient;
  DEFAULT_PAGE_LIMIT = 1000;

  // @param indexerUrl: is optional - you force to replace indexer
  //  URL setting (by default it uses URL from network config mapping).
  // @param serializationSettings: you can control via additional formatters what
  //  to do with token value after under-the-hood serialization:
  //  after serialization of 1e+18 token value with 18 decimals to 1.0..0 ETH.
  // E.g.: transform all 12.00000 -> to 12.0 (v) => v.replace(/\.0+$/, ".0").
  private _serializationSettings: SerializationSettings;
  constructor(
    network: ContractsENV,
    indexerUrl?: string,
    serializationSettings?: SerializationSettings,
  ) {
    this.indexerClient = new IndexerClient(network, indexerUrl);
    if (serializationSettings) {
      this._serializationSettings = serializationSettings;
    } else {
      this._serializationSettings = {};
    }
  }

  // Get Offers details, i.e. with its peers and compute units.
  // Note, that if offer with id does not exist, it silently ignores that fact.
  // Limitations
  // - it can not return more than 1000 offers,
  // - it can not return more than 1000 peers per offer,
  // - it can not return more than 1000 compute units per each peer.
  async getOffers(
    filter: OffersFilterIn,
    paginator: IndexerPaginatorIn = {
      offset: 0,
      limit: this.DEFAULT_PAGE_LIMIT,
    },
    order: OffersOrderByIn = { orderBy: "createdAt", orderType: "desc" },
  ): Promise<OfferDetail[]> {
    const data = await this.indexerClient.getOfferDetails({
      filters: serializeOffersFilterIn(filter),
      offset: paginator.offset,
      limit: paginator.limit,
      orderBy: order.orderBy,
      orderType: order.orderType,
    });
    return data.offers.map((offerIn) => {
      return serializeOfferDetail(offerIn, this._serializationSettings);
    });
  }

  async getDealsByProvider(
    providerId: string,
    paginator: IndexerPaginatorIn = {
      offset: 0,
      limit: this.DEFAULT_PAGE_LIMIT,
    },
    order: DealsOrderByIn = { orderBy: "createdAt", orderType: "desc" },
  ): Promise<Array<DealByProvider>> {
    const data = await this.indexerClient.getDeals({
      filters: {
        addedComputeUnits_: { provider: providerId.toLowerCase() },
      },
      offset: paginator.offset,
      limit: paginator.limit,
      orderBy: order.orderBy,
      orderType: order.orderType,
    });
    return (
      data.deals.map((deal) => {
        return {
          id: deal.id,
        };
      }) || []
    );
  }

  async getOffersByProvider(
    providerId: string,
    paginator: IndexerPaginatorIn = {
      offset: 0,
      limit: this.DEFAULT_PAGE_LIMIT,
    },
    order: OffersOrderByIn = { orderBy: "createdAt", orderType: "desc" },
  ): Promise<Array<OfferByProvider>> {
  const data = await this.indexerClient.getOfferIds(
    {
        filters: {provider_in: [providerId.toLowerCase()]},
        offset: paginator.offset,
        limit: paginator.limit,
        orderBy: order.orderBy,
        orderType: order.orderType,
      }
      )
      return (
        data.offers.map((offer) => {
          return {
            id: offer.id,
          };
        }) || []
      );
  }
}
