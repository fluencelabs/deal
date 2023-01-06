# Deal Contracts System

## Publish typechain
You have to open the main branch and pull the latest version of it locally
Then do the following (replace versions with the actual versions that you want):
```shell
git tag -a v0.0.0 -m ""
git push origin v0.0.0
```

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
