## Deal Contracts System

This repo consists of 3 main parts:

- `contracts` - Foundry (read more https://book.getfoundry.sh/). Generally, repo
  follow structure of Foundry repo.
- `subgraph` - javascript client to interact with the graph node (read more
  https://thegraph.com/docs/quick-start)
- `ts-client` - npm package from contract developers to interact with contracts

To access to the general points of the each part in the repo root **makefile**
is presented. Below are main commands of the makefile.

# Agenda

- [Requirement](#requirement)
- [Contract](#contract)
  - [Install Foundry](#install-foundry)
  - [Install NPM packages](#install-npm-packages)
  - [Build](#build)
    - [Build contracts and ts-client and subgraph](#build-contracts-and-ts-client-and-subgraph)
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
  - [Develop Tricks &amp; Tips](#develop-tricks--tips)
- [Develop with Deal Infrastructure](#develop-with-deal-infrastructure)

# Requirement

- foundry
- makefile (TODO)
- node version 18.16

# Contract

## Install Foundry

https://book.getfoundry.sh/

## Install NPM packages

```shell
$ make install-npms
```

## Build

### Build contracts and deal-ts-clients and subgraph

```shell
$ make build-all
```

### Build only contracts

```shell
$ make build-contracts
```

### Build only in npm packages

```shell
$ make build-npms
```

## Start Local Subgraph

```shell
$ make start-local-subgraph
```

## Start local network using docker

```shell
$ docker compose -f docker/docker-compose.yml up
```

RPC: [http://0.0.0.0:8545](http://0.0.0.0:8545)

Explorer: [http://localhost:4000](http://localhost:4000)

## Start local network locally

```shell
$ make start-local-chain
```

```shell
$ make deploy-local
```

## Deploy to network

```shell
$ PRIVATE_KEY=${} make deploy-{network_name}
```

## Test

```shell
$ forge test
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

# Development with Deal Infrastructure

> TODO: add flow on how to work with already built images from registry.

Let`s suppose you want to boot up local network and subgraph to develop on the
infrastructure of the repo locally.

1. Clone this repo. Clone with submodules, e.g.: `git submodule update --init --recursive`

```bash
2. Start local chain node containers (chain, explorer, deploy script):

```bash
docker compose -f docker/docker-compose.yml up -d
```

`chain-deploy-script` will produce `deployment/local.json` file that is used in
the next steps.

3. Prepare npm packages:

```bash
make install-npms
make build-npms
```

4. Deploy subgraph:

```bash
make start-local-subgraph
```

5. [Optional] Since contracts are fresh and empty you can fill them with test
   data:

```bash
make make create-pure-market-local
```

To stop and cleanup dev environment run:

```bash
docker-compose -f docker/docker-compose.yml down --volumes
```
