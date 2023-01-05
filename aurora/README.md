# Deal Contracts System

## Run local network with contracts

```shell
npm install
npm run compile
npx hardhat node
```

## Run local network with contracts (docker

```shell
docker build -f docker/Dockerfile . -t contracts-env
docker run -p 8545:8545 contracts-env
```
