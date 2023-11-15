# Deal Contracts System

* [Develop](#develop)
   * [Publish typechain](#publish-typechain)
   * [Run local network with contracts](#run-local-network-with-contracts)
   * [Run local network with contracts in docker](#run-local-network-with-contracts-in-docker)
* [Deploy](#deploy)
   * [Ethereum Public Networks](#ethereum-public-networks)
   * [Run Deploy](#run-deploy)

# Develop
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
and track differences of the contracts (plugin identifies if the contract changed and deploy/update contract).

Note, that we commit our **deployed contract addresses** into the repo, e.g. `Faucet` contract from the **kras**: [src/deployments/kras/Faucet.json](src/deployments/kras/Faucet.json). Thus, if you run deploy commands described below the addresses may change (if the contract in the network differs from the contract in you repo) and there will be **git diff** you ought to propagate the teams/community.  

> For all available for the hardhat-deploy networks and their writings, please refer to `networks` from [hardhat.config.ts](hardhat.config.ts).

## Ethereum Public Networks
For public test-net chains and production chains: do not forget to set appropriate in your **.env** file:

- `WAIT_CONFIRMATIONS` in `.env` (e.g. 5-8)
- `PRIVATE_KEY` for the deployer (raw private key)

## Run Deploy
After you prepared .env file and did `npm i`, to deploy all contracts to e.g. **kras**:

```bash
npm run deploy:kras
```

> we also have `all` -> `npm run deploy:all`  
