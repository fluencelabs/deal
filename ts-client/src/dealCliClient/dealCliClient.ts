import { IndexerClient } from "./indexerClient/indexerClient.js";
import type { ContractsENV } from "../client/config.js";
import type { OfferDetail } from "./types/schemes.js";

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
  constructor(network: ContractsENV, indexerUrl?: string) {
    this.indexerClient = new IndexerClient(network, indexerUrl);
  }

  async getOffer(offerId: string): Promise<OfferDetail> {
    const fetchedOffer = (await this.indexerClient.getOffer({ id: offerId }))
      .offer;
    if (!fetchedOffer) {
      throw new Error(`Offer with id ${offerId} does not exist in indexer.`);
    }
    return {
      id: fetchedOffer.id,
      peerIds:
        fetchedOffer.peers?.map((peer) => {
          return peer.id;
        }) ?? [],
      effectors:
        fetchedOffer.effectors?.map((data) => {
          return {
            cid: data.effector.id,
            description: data.effector.description,
          };
        }) ?? [],
    };
  }
}
