# Subgraph

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


