https://book.getfoundry.sh/

Deal Contracts System

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

## Develop
After [starting local network](#start-local-network-locally) you could create market on our contracts:

```shell
$ make create-pure-market-local
```
