# Subgraph

- [Project Structure](#project-structure)
- [Develop](#develop)
- [Debug Note](#debug-note)
  - [How to check if error resolved on pre-prod stand?](#how-to-check-if-error-resolved-on-pre-prod-stand)
  - [Setup Environment for Local Subgraph](#setup-environment-for-local-subgraph)
  - [Dev in Subgraph Repo](#dev-in-subgraph-repo)
  - [Query through GUI](#query-through-gui)
  - [Tricks & Tips](#tricks--tips)
- [Deploy](#deploy)
  - [deprecated Fluence Stands Versioning](#fluence-stands-versioning)
  - [To Localhost](#to-localhost)
  - [To TheGraph Studio [not for subnets]](#to-thegraph-studio-not-for-subnets)
  - [To Hosted Service [not for subnets]](#to-hosted-service-not-for-subnets)
- [TODO](#todo)

# Project Structure

- `docker-compose.yaml` - instruction for Docker containers to create local dev environment with **local graph node** connected to **local hardhat node** (for instruction how to use - check [#Develop](#Develop) section below).
- `subgraph.yaml` - The Graph configuration schema to collect rules of indexing and querying contracts event via handlers.
- `schema.graphql` - The subgraph GraphQL schema of types those are indexed and available for querying.
- `mappings.ts` - consists of event handlers and populating logic of `schema.graphql` above.
- `build/` - The auto-generated folder by The Graph's CLI
- `generated/` - The auto-generated folder by The Graph's CLI
- `scripts/`
  - [import-config-networks.ts](scripts/import-config-networks.ts) - to populate configs with networks from Foundry deployments for contrasts needed to be indexed (script should be used via `nom run import-config-networks` command).

# Develop

To start local development with TheGraph and Hardhat:

> Note, that when you are working with upgradable contracts - you leave addresses of proxies, but ABIs of real implementations.

# Debug Note

## How to check if error resolved on pre-prod stand?

All examples below according to **dar** stand.

1. Copy pre prod context to your local graph node that you previously created:
   - set .env for you docker/docker-compose.yml: `GRAPH_NODE_ETHEREUM_PATH=dar:https://ipc.dar.fluence.dev` [TODO: why does not catched?]
2. Run local infrastructure with `docker compose -f docker/docker-compose.yml up`
3. Deploy you new version of subgraph:
   - `npm run create:local && export GRAPH_NETWORK_TMP=kras && graph deploy --node http://localhost:8020 --ipfs http://localhost:5001 --network ${GRAPH_NETWORK_TMP} --network-file configs/${GRAPH_NETWORK_TMP}-networks-config.json --version-label 0.0.0 fluence-deal-contracts`
4. Check logs e.g. via `docker logs -f <contrainer name>` [Note, that syncing may take a while... (5 mins+)]
5. Redeploy subgraph on dar

## Setup Environment for Local Subgraph

1. Run hardhat node from the **root** of the project:

```bash
npx hardhat node --hostname 0.0.0.0
```

2. Run Graph Node with help of Docker Compose: [docker-compose.yml](subgraph/docker-compose.yaml):

```bash
cd subgraph && docker-compose up
```

## Dev in Subgraph Repo

On all steps you could press `npm run compile` to check if everything correct

- add event handler into subgraph.yaml and event signatures
- add types into schema.graphql
- add handler into mappings/<contractName>.ts

0. Ensure you use preferred contract version according to the [subgraph.yaml](subgraph.yaml)

1. Build artifacts and generate the **AssemblyScript** types from the sources:

```bash
npm i
npm run compile
```

2. Create the subgraph

```bash
npm run create:local
```

3. Deploy the subgraph on local graph node
   > Note, that it will get localhost contract addresses and block number from [networks.json](config/networks.json) and inserts into subgraph.yaml.

```bash
npm run deploy:local
```

Since now, you have GUI of the deployed graph: http://localhost:8000/subgraphs/name/<YourContractName>

## Query through GUI

E.g. the graph query to insert in http://localhost:8000/subgraphs/name/<YourContractName>:

```graphql
{
  offers {
    id
    computeUnitsAvailable
    peers {
      id
      computeUnits
    }
  }
}
```

## Tricks & Tips

If you updated contract and want to push this update to the subgraph, I could recommend 1 fully features command:

> but remember that first off all you ought to build those contract with solc compiller (check README of the root of the project).

```bash
npm run compile && npm run create:local && npm run deploy:local
```


# Deploy 
For deploy it uses [fluence-graph.sh](fluence-graph.sh) script. Check its help for more info. Tl;dr: it is gateway to deploy manage subgraph deploy on Fluence stands and store artifacts of those deployments.

## [deprecated] Fluence Stands Versioning

Logic is inside [fluence-graph.sh](fluence-graph.sh) and it is used in package.json and accessed via makefile commands finally as well. Generally, the deploy flow is the next:

1. It creates subgraph for fluence network (stage, dar, etc) via `npm run create:stage` with subgraph named like `fluence-deal-contracts-<commit hash>` (for local hash commit is ignored).
   - it creates log of created subgraph inside [deployments](deployments) dir to not forget to remove then outdated subgraphs.
2. It deploys actual code to index contracts according to [configs](configs) and uses [subgraph.yaml](subgraph.yaml) as template (uses addresses and block number from config).
3. WARN! Currently, after deploy of the new subgraph for the git commit you ought to update url in the [ts-client/src/indexerClient/config.ts](ts-client/src/indexerClient/config.ts) to sync ts-client and newly deployed subraph (ts-client has test for that check).
4. When need to delete you need to delete subgraph you process manually command: `graph remove --node ${GRAPHNODE_URL} ${SUBGRAPH_NAME}` and delete from file currently. Thus, we free resources for current stand indexer.

TODO: make flow better and use template actually instead.
TODO: move this flow into CI/CD process.

## To Localhost

Check `## Dev in Subgraph Repo` section.

## To TheGraph Studio [not for subnets]

> Note, this solution is only for **dev querying** or for **L1** deploy on some networks.

E.g. for the **Mumbai** network

1. Auth in the Graph with deployKey from GUI

```bash
graph auth --studio <deployKey>
```

> Before deploy on **Mumbai** check that `subgraph.yml` consists of mumbai **contract address** and **suitable block number**,
> and network to **mumbai**.

2. Deploy
   > Note, that bia command below it will get mumbai contract addresses and block number from [networks.json](config/networks.json) and inserts into subgraph.yaml.

```bash
npm run deploy:studio:stage
```

## To Hosted Service [not for subnets]

> Note, this solution for deploy only on supported testnets, and instead of **Studio** deploy it gives you full featured query API for free (not simple dev query).

0. Get your token: https://thegraph.com/docs/en/deploying/deploying-a-subgraph-to-hosted/#store-the-access-token

```bash
graph auth --product hosted-service <token>
```

E.g. according to the site after login from Github:

```bash
graph deploy --product hosted-service --network mumbai <githubName>/fluence-deal-contracts
```

# TODO

- [ ] use subgraph templating as it used with the graph project contracts
- [ ] check again https://github.com/graphprotocol/hardhat-graph-demo to find the solution for **auto-populating subgraph.yaml with events**
- [ ] add docker-compose commands to package.json
- [ ] subgraph tests
- [ ] fix docker versions
- [ ] it is mb better to flag CU and etc as removed instead of deleting as it is in, e.g. `store.remove('ComputeUnit', computeUnitEntity.id)`
- [ ] rm warn about to hexString instead of hex()
- [ ] where is delete events? (e.g. peer deleted)
