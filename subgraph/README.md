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

## Environment for Local Subgraph
1. Run hardhat node from the **root** of the project:
```bash
npx hardhat node --hostname 0.0.0.0 
```

2. Run Graph Node with help of Docker Compose and [instruction](graph-node/docker-compose.yaml):
```bash
cd graph-node && docker-compose up
```

## Subgraph Repo
How to run install package and build artifacts flow is below.

1. Build artifacts and generate the **AssemblyScript** types from the sources:
```bash
npm i
npm run compile
```

2. Create the subgraph
```bash
npm run create-local
```

4. Deploy the subgraph on local graph node
```bash
npm run deploy-local 
```

Since now, you have GUI of the deployed graph: http://localhost:8000/subgraphs/name/<YourContractName>

# TODO
- [ ] integrate subgraph more smoothly with hardhat, and esp. with hardhat-deploy plugin
- [ ] use subgraph templating as it used with the graph project contracts
- [ ] check again https://github.com/graphprotocol/hardhat-graph-demo to find the solution for **auto-populating subgraph.yaml with events**
