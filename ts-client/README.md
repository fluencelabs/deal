TODO: about other packages...

# deal-explorer-client

# Develop
## GraphQL Scheme Generation
It generates typescripts for the graphQl schemes declared in [src/indexerClient/queries](src/indexerClient/queries) via fetched graphql schemes. Instruction rules are defined in [codegen.ts](codegen.ts).

Thus, TS files with `generated` key word you **should not rewrite manually**.

> Those generated files are under git commit because it is a part of the source code, e.g. 
> [dealExplorerClient.ts](client/dealExplorerClient/dealIndexerClient.ts) & [indexerClient.ts](client/dealExplorerClient/indexerClient/indexerClient.ts).

# ToDo
- [x] rename to deal-explorer-client
- [ ] use deal package instead of import from `../src`
- [ ] commit to the special repo
- [ ] after merge with foundry -> to different npm packages [refactor work with several packages]
- [x] add ulr links to fetch filters...
- [x] TODO: search fields: by client or dealId?
- [ ] resolve registered workers! (separate class?)
- [ ] page counter (thanks to graphQL for no paginators)?
- [x] optional filtering in `.graphql` schemes (discord solution processing...) [currently unsolved]
- [ ] convert values: timestamps, eths
- [x] move to simple client
- [ ] codegen - get url from env
