## Deal Contracts System

This repo consists of 3 main parts:

- `contracts` - Foundry (read more https://book.getfoundry.sh/). Generally, repo
  follow structure of Foundry repo.
- `subgraph` - javascript client to interact with the graph node (read more
  https://thegraph.com/docs/quick-start)
- `ts-client` - npm package from contract developers to interact with contracts

To access to the general points of the each part in the repo root **makefile**
is presented. Below are main commands of the makefile.

# Table of contents

- [Deal Contracts System](#deal-contracts-system)
- [Table of contents](#table-of-contents)
- [Requirements](#requirements)
- [Contract](#contract)
  - [Env](#env)
    - [Notable Env](#notable-env)
  - [Makefile](#makefile)
    - [Install NPM packages](#install-npm-packages)
    - [Build](#build)
      - [Build contracts and deal-ts-clients and subgraph](#build-contracts-and-deal-ts-clients-and-subgraph)
      - [Build only contracts](#build-only-contracts)
      - [Build only in npm packages](#build-only-in-npm-packages)
    - [Start Local Subgraph](#start-local-subgraph)
    - [Start local network using docker](#start-local-network-using-docker)
    - [Start local network locally](#start-local-network-locally)
    - [Deploy to network](#deploy-to-network)
  - [Test](#test)
  - [Format](#format)
  - [Troubleshooting](#troubleshooting)
  - [Gas Snapshots](#gas-snapshots)
- [Subgraph (Contract Indexer)](#subgraph-contract-indexer)
  - [Development Tricks & Tips](#development-tricks--tips)
- [Development Guid (with Deal Infrastructure)](#development-guid-with-deal-infrastructure)
  - [Tips](#tips)
- [Ts-Client](#ts-client)


# Requirements
Full requirements to develop in this repo.

- foundry (https://book.getfoundry.sh/)
- makefile (TODO)
- node version 18.16

# Contract
To work with contracts we use forge (foundry): to deploy, to test unittests. Thus, to work in the repo you first of all should install Foundry: https://book.getfoundry.sh/

To run foundry commands and commands that create artifacts and insert contract artifacts into packages/modules: ts-client, subgraph we use `makefile` (and we use makefile for even further steps after: to build & deploy those modules after injecting artefacts of contracts into them).

## Env
Because scripts and makefile supports env (actually makefile reads env from .env) we note that in the repo we leave [.example.env](.example.env).

### Notable Env
Below is the list of env. For description we aim you to [.example.env](.example.env) directly.

- PRIVATE_KEY
- LOCAL_CHAIN_BLOCK_MINING_INTERVAL
- MAX_FAILED_RATIO
- IS_MOCKED_RANDOMX

## Makefile
Below is some of useful **makefile** commands with their descriptions. To check out all commands run `make help`.

### Install NPM packages

```shell
$ make install-npms
```

### Build

#### Build contracts and deal-ts-clients and subgraph

```shell
$ make build-all
```

#### Build only contracts

```shell
$ make build-contracts
```

#### Build only in npm packages

```shell
$ make build-npms
```

### Start Local Subgraph

```shell
$ make deploy-subgraph-local
```

### Start local network using docker

```shell
$ docker compose -f docker/docker-compose.yml up
```

RPC: [http://0.0.0.0:8545](http://0.0.0.0:8545)

Explorer: [http://localhost:4000](http://localhost:4000)

### Start local network locally

```shell
$ make start-local-chain
```

```shell
$ make deploy-contracts-local
```

### Deploy to network

```shell
$ PRIVATE_KEY=${} make deploy-{network_name}
```

## Test

- Contracts

```shell
$ forge test
```

- TS Clients

```shell
cd ts-client && npm test unittests
cd ts-client && npm test integrational-tests
```

## Format

```shell
$ forge fmt
```

## Troubleshooting

Error on `make <soemthing>`:
`No such file or directory (os error 2); check configured remappings.`

> `git submodule update --init --recursive`

## Gas Snapshots

```shell
$ forge snapshot
```

# Subgraph (Contract Indexer)

It is a backend for the contracts that collects info from contract events into
graphQL schemes.

For more info check out [README.md](subgraph/README.md).

## Development Tricks & Tips

After [starting local network](#start-local-network-locally) you could create
market on our contracts:

```shell
$ make create-pure-market-local
```

# Development Guid (with Deal Infrastructure)

> TODO: add flow on how to work with already built images from registry.

Let`s suppose you want to boot up local network and subgraph (thus, all deal infrastructure) to develop on the repo locally.

1. Clone this repo. Clone with submodules, e.g.: `git submodule update --init --recursive`

````bash
2. Start local chain node containers (chain, explorer, deploy script):

```bash
docker compose -f docker/docker-compose.yml up -d --build
````

| Note, you can omit `--build` flag if you have already built images locally, nothing to rebuild.

| Note, that `chain-deploy-script` will produce `deployment/local.json` file that is used in
the next steps.

3. Prepare npm packages:

```bash
make install-npms
make build-npms
```

4. Deploy subgraph:

```bash
make deploy-subgraph-local
```

5. [Optional] Since contracts are fresh and empty you can fill them with test
   data:

```bash
make create-pure-market-local
```

## Tips
- To stop and cleanup dev environment run:

```bash
docker-compose -f docker/docker-compose.yml down --volumes
```

- To redeploy contracts:

```bash
make deploy-contracts-local
```

and do not forget to repeat from 3d step (depends on your needs). 

# Ts-Client
for `ts-client` module check out [README.md](ts-client/README.md).
