/*
 * @title Client of The Graph/GraphQL backend Service.
 */
import { GraphQLClient } from "graphql-request";
import { getIndexerUrl } from "./config.js";
import type { ContractsENV } from "../client/config.js";

export abstract class IndexerClientABC {
  // There is a limitation for the 1 page.
  INDEXER_MAX_FIRST = 1000;
  protected _graphqlClient: GraphQLClient;
  constructor(network: ContractsENV) {
    this._graphqlClient = new GraphQLClient(getIndexerUrl(network));
  }
}
