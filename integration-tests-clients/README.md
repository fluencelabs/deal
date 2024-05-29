# Integration Tests For Fluence Contract Clients

Repository for integrations tests with additional dependencies on Subgraph and Chain RPC. E.g.

-   [presented] Offchain matcher client [../ts-client/src/dealMatcherClient](../ts-client/src/dealMatcherClient)
-   [TODO] Fluence Cli client [../ts-client/src/dealCliClient](../ts-client/src/dealCliClient)
-   [TODO] Fluence Network Explorer Client [../ts-client/src/dealExplorerClient](../ts-client/src/dealExplorerClient)

# Run Tests

> To run these tests, you need the following services up and running: **subgraph**, **chain-rpc**.
> Moreover, Subgraph should be connected to the chain-rpc and index contracts deployed on that chain.

## Initialization

You may want to initialize the infrastructure for the tests in 2 ways:

-   [in case you are develop smth in this repo and want to test] from the sources of this repo
    -   this case will be covered below.
-   [in case you are not working directly with this repo] from the **already** published images
    -   this case is require to define image tags before run containers via `docker compose`,
        e.g. `export CHAIN_RPC=docker.fluence.dev/chain-rpc:feat-optimise-query-for-cc-CHAIN-452-5f1d332-3883-1 && docker compose up -d`

Prerequisites for the 1st case

-   You installed all dependencies from the root README.md (docker, forge/foundry, npm)
    -   TODO: leave instruction only for docker as we have multi target Docker image even with subgraph deploy script.
-   You are not working on Apple Silicon based machine (M1, ...) as we have some issues with docker-compose and docker on M1 for **Subgraph**.
    -   in case if you want to test on Apple Silicon - use remote server and run the infra on this remote host, for Apple Silicon on May 15 2024 there are no garanties that it will work.

Commands:

0. Install packages in this module

```bash
npm i
```

1. Run Infra

```bash
docker compose -f docker/docker-compose.yml up --no-deps ipfs chain-rpc postgres graph-node -d
```

2. Deploy contracts & Subgraph & Build package

```bash
make deploy-contracts-local && make build-all && make deploy-subgraph-local && cd ts-client && npm run build && npm pack
```

## Run

Run prepared tests

```bash
npm run test
```
