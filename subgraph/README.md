# Subgraph

# Project Structure

- `docker-compose.yaml` - instruction for Docker containers to create local dev environment with **local graph node** connected to **local hardhat node** (for instruction how to use - check [#Develop](#Develop) section below).
- `subgraph.yaml` - The Graph configuration schema to collect rules of indexing and querying contracts event via handlers.
- `schema.graphql` - The subgraph GraphQL schema of types those are indexed and available for querying.
- `mappings.ts` - consists of event handlers and populating logic of schema.graphql above.
- `build/` - The auto-generated folder by The Graph's CLI
- `generated/` - The auto-generated folder by The Graph's CLI

# Develop
To start local development with TheGraph and Hardhat:

> Note, that when you are working with upgradeble contracts - you leave addresses of proxies, but ABIs of real implementations. Thus, [importContractsAbi.ts](scripts/importContractsAbi.ts) should be maintained with implementations only, and [subgraph.yaml](subgraph.yaml) with addresses of proxies only.

## Setup Environment for Local Subgraph
1. Run hardhat node from the **root** of the project:
```bash
npx hardhat node --hostname 0.0.0.0 
```

2. Run Graph Node with help of Docker Compose and [instruction](graph-node/docker-compose.yaml):
```bash
cd graph-node && docker-compose up
```

## Dev in Subgraph Repo
How to run install package and build artifacts flow is below.

0. Add abi of contracts you are going to work with:
```bash
npm run import-contracts-abi
```

2. Build artifacts and generate the **AssemblyScript** types from the sources:
```bash
npm i
npm run compile
```

2. Create the subgraph
```bash
npm run create:local
```

4. Deploy the subgraph on local graph node
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

but first: you should deploy on localhost your updated contract, e.g. `npx hardhat deploy --network localhost`

```bash
ts-node scripts/importContractsAbi.ts && npm run compile && npm run create-local && npm run deploy:local
```

# Deploy 

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
>  and network to **mumbai**.

2. Deploy
> Note, that bia command below it will get mumbai contract addresses and block number from [networks.json](config/networks.json) and inserts into subgraph.yaml.

```bash
npm run deploy:studio:stage
```

## To Hosted Service [not for subnets]
> Note, this solution for deploy only on supported testnets, and instead of  **Studio** deploy it gives you full featured query API for free (not simple dev quiery). 

0. Get your token: https://thegraph.com/docs/en/deploying/deploying-a-subgraph-to-hosted/#store-the-access-token
```bash
graph auth --product hosted-service <token>
```

E.g. according to the site after login from Github:
```bash
graph deploy --product hosted-service --network mumbai <githubName>/fluence-deal-contracts
```

# TODO
- [ ] integrate subgraph more smoothly with hardhat, and esp. with hardhat-deploy plugin
- [ ] use subgraph templating as it used with the graph project contracts
- [ ] check again https://github.com/graphprotocol/hardhat-graph-demo to find the solution for **auto-populating subgraph.yaml with events**
- [ ] add docker-compose commands to package.json
- [ ] subgraph tests
- [ ] fix docker versions
- [ ] it is mb better to flag CU and etc as removed instead of deleting as it is in, e.g. `store.remove('ComputeUnit', computeUnitEntity.id)`
- [ ] rm warn about to hexString instead of hex()
