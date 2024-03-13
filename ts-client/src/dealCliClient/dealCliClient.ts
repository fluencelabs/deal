import { IndexerClient } from "./indexerClient/indexerClient.js";
import type { ContractsENV } from "../client/config.js";
import type { OfferDetail } from "./types/schemes.js";
import { serializeOfferDetail } from "./serializers/schemes.js";
import type { SerializationSettings } from "../utils/serializers.js";


/*
 * @dev This client represents endpoints to access desirable indexer data in REST
 * @dev  manner from POV of Fluence CLI.
 * @dev Currently, it uses only data from indexer (subgraph) only.
 * @dev It supports mainnet, testnet by selecting related contractsEnv.
 */
export class DealCliClient {
  public indexerClient: IndexerClient;

  // @param indexerUrl: is optional. If use the param you replace indexer
  //  URL setting from network config mapping.
  // @param chainRpcUrl: is optional (or set caller)
  // @param caller: is optional (or set chainRpcUrl)
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
      this._serializationSettings = {
          parseNativeTokenToFixedDefault: 18,
          parseTokenToFixedDefault: 3,
        }
    }
  }

  // Get Offer detail, i.e. with its peers and compute units.
  // Note, that it can not return more than 1000 peers per offer,
  //  and more than 1000 compute units per each peer.
  async getOffer(offerId: string): Promise<OfferDetail | null> {
    const options = {
      id: offerId,
    };
    const data = await this.indexerClient.getOffer(options);
    if (data.offer) {
      return serializeOfferDetail(data.offer, this._serializationSettings)
    }
    return null
  }

  // TODO: need more info.
  // async getDealsByProvider(providerId: string): Promise<DealByProviderListView> {}
}
