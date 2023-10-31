# Deal Contracts System

## Publish typechain

You have to open the main branch and pull the latest version of it locally Then
do the following (replace versions with the actual versions that you want):

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

## Run local network with contracts in docker

```shell
docker-compose up -d
```

# Deploy
We used to use [hardhat-deploy](https://github.com/wighawag/hardhat-deploy) plugin to deploy smart contracts on chains 
and track differences.

## Ethereum Public Networks
For test net chains and production chains: do not forget to set envs in your **.env** file:

- `WAIT_CONFIRMATIONS` in `.env`
- `PRIVATE_KEY` for the deployer
