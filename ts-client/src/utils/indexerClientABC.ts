
/*
 * @title Client of The Graph/GraphQL backend Service.
 */
import {GraphQLClient} from "graphql-request";

export abstract class IndexerClientABC {
  protected _graphqlClient: GraphQLClient;
  constructor(url: string) {
    this._graphqlClient = new GraphQLClient(url);
  }
}
