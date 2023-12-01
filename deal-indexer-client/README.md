# deal-explorer-client

# GraphQL Scheme Generation
This repo uses graphQL to query Indexer (subgraph). Schemes for graphQL query declared in `.graphclient` that populated 
when `npm run load-subgraph-types` (ref to [Graph Client](https://thegraph.com/docs/en/querying/querying-from-an-application/#graphql-clients)).

> Before ypu load typescripts you need to aim client what models you actually waiting for. 
>  You did it via declaring all fields and filters you need in, e.g. [offers-query.graphql](src/indexerClient/offers-query.graphql).

| Thus, with the command above you always ensure, that you work with currently implemented subgraph models in the url declared in [.graphclientrc.yml](.graphclientrc.yml).


# ToDo
- [ ] rename to deal-explorer-client
- [ ] use deal package instead of import from `../src`
- [ ] commit to the special repo
- [ ] after merge with foundry -> to different npm packages [refactor work with several packages]
