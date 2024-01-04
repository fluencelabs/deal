Deal Contracts System
---

This repo consists of 3 main parts:
- `contracts` - Foundry (read more https://book.getfoundry.sh/). Generally, repo follow structure of Foundry repo.
- `subgraph` - javascript client to interact with the graph node (read more https://thegraph.com/docs/quick-start)
- `ts-client` - npm package from contract developers to interact with contracts

To access to the general points of the each part in the repo root **makefile** is presented. Below are main commands of the makefile.

# Agenda
* [Requirement](#requirement)
* [Contract](#contract)
   * [Install Foundry](#install-foundry)
   * [Install NPM packages](#install-npm-packages)
   * [Build](#build)
      * [Build contracts and ts-client and subgraph](#build-contracts-and-ts-client-and-subgraph)
      * [Build only contracts](#build-only-contracts)
      * [Build only in npm packages](#build-only-in-npm-packages)
   * [Start Local Subgraph](#start-local-subgraph)
   * [Start local network using docker](#start-local-network-using-docker)
   * [Start local network locally](#start-local-network-locally)
   * [Deploy to network](#deploy-to-network)
   * [Test](#test)
   * [Format](#format)
   * [Troubleshooting](#troubleshooting)
   * [Gas Snapshots](#gas-snapshots)
* [Subgraph (Contract Indexer)](#subgraph-contract-indexer)
   * [Develop Tricks &amp; Tips](#develop-tricks--tips)
* [Develop with Deal Infrastructure](#develop-with-deal-infrastructure)

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

### Build contracts and ts-client and subgraph

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
$ docker compose -f ./docker/docker-compose.yml up
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

Error on `make <soemthing>`: `No such file or directory (os error 2); check configured remappings.`

> `git submodule update --init --recursive`

## Gas Snapshots

```shell
$ forge snapshot
```

# Subgraph (Contract Indexer)
It is a backend for the contracts that collects info from contract events into graphQL schemes.

For more info check out [README.md](subgraph/README.md).

## Develop Tricks & Tips
After [starting local network](#start-local-network-locally) you could create market on our contracts:

```shell
$ make create-pure-market-local
```

# Develop with Deal Infrastructure
Let`s suppose you want to boot up local network and subgraph to develop on the infrastructure of the repo locally.

> TODO: @nashi could prepare new flow or better containers as result of https://github.com/fluencelabs/deal/pull/180

1. You clone this repo and in the root
2. Start local chain node containers (chain, explorer, deploy script):
```bash
docker compose -f ./docker/docker-compose.yml up -d
```
3. Wait for **deploy** docker container script, e.g. with `docker logs -f docker-deploy-script-1`
4. On here you have all contracts deployed and chain running. On the next step will boot subgraph to index contracts. 
5. Before you start **the subgraph** several setups should be done: 
```bash 
make install-npms
make build-npms
```
6. Start subgpraph
```bash
docker compose -f ./subgraph/docker-compose.yaml up -d
```
7. Wait subgraph to start. It should start to print logs like: `Jan 02 10:59:00.970 INFO Syncing 1 blocks from Ethereum, code: BlockIngestionStatus, blocks_needed: 1, blocks_behind: 1, latest_block_head: 45, current_block_head: 44`. To check logs: `docker compose -f ./subgraph/docker-compose.yaml logs -f`
8. 
```bash
make start-local-subgraph
```

9. [Optional] On this step you have empty fresh contracts. To fill it with kinda test data we have make command:
```bash
make make create-pure-market-local
```
