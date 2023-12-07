https://book.getfoundry.sh/

Deal Contracts System

# Contract
## Install Foundry

https://book.getfoundry.sh/

## Build

### Build contracts and ts-client

```shell
$ make build
```

### Build only contracts

```shell
$ make build-contracts
```

### Update abi for subgraph and ts-client

```shell
$ make update-abi
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

## Gas Snapshots

```shell
$ forge snapshot
```

# Subgraph (Contract Indexer)
It is a backend for the contracts that collects info from contract events into graphQL schemes.

For more info check out [README.md](subgraph/README.md).

# ToDo
- [ ] we could not be certain that on docker compose up it will deploy on the same addresses, as stated in [ts-client/deployments](ts-client/deployments): mount volume? compose deployments? use the same script that will update in the same format in deployments.
