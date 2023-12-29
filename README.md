Deal Contracts System
---

This repo consists of 3 main parts:
- `contracts` - Foundry (read more https://book.getfoundry.sh/). Generally, repo follow structure of Foundry repo.
- `subgraph` - javascript client to interact with the graph node (read more https://thegraph.com/docs/quick-start)
- `ts-client` - npm package from contract developers to interact with contracts

To access to the general points of the each part in the repo root **makefile** is presented. Below are main commands of the makefile.

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
