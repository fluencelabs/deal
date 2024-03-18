import * as path from "path";
import * as fs from "fs";


const DEPLOYMENTS_DIR = '../../deployments'
const CONFIGS_DIR = "../configs"
const REQUIRED_DEPLOYED_CONTRACT_NAMES = ["Market", "Capacity", "Core", "DealFactory"]
const STANDS = ["kras", "stage", "local", "dar"]
// Subgraph repo pattern used to have config dir with networks.json to support
//  deploy on different networks: {mainnet, mumbai, etc}.
//  In our case when we can deploy different stands on the same network, e.g. mumbai we have
//  to have different configs for each stand, and combine the desired deploy
//  through flags: --config-file and --network name in that file.
const STAND_TO_SUBGRAPH_CONFIG = {
  "kras": "kras-networks-config.json",
  "stage": "stage-networks-config.json",
  "dar": "dar-networks-config.json",
  "local": "local-networks-config.json",
}
const STAND_TO_SUBGRAPH_NETWORK = {
  "kras": "kras",
  "stage": "stage",
  "dar": "dar",
  "local": "local",
}

// Save subgraph networks config from info of several contracts.
async function saveNetworksConfig(
  standName: keyof typeof STAND_TO_SUBGRAPH_CONFIG, subgraphContractsDataToStore: any) {
  const networksConfigPath = path.join(__dirname, CONFIGS_DIR, STAND_TO_SUBGRAPH_CONFIG[standName])
  let res: any = {}
  res[STAND_TO_SUBGRAPH_NETWORK[standName]] = subgraphContractsDataToStore
  fs.writeFileSync(
    networksConfigPath,
    JSON.stringify(res, null, 2)
  )
  console.info(`Saved successfully networks config for stand ${standName} to ${networksConfigPath}`)
}


// TODO: this script merely should reuse code from ts-client/src/client/config.ts
//  after migrating to the pnpm.
async function main() {
  const deploymentsPath = path.join(__dirname, DEPLOYMENTS_DIR)
  for (const deployment of fs.readdirSync(deploymentsPath)) {
    const standName = deployment.split('.')[0] as keyof typeof STAND_TO_SUBGRAPH_CONFIG
    if (!STANDS.includes(standName)) {
      console.warn(`Unknown stand name: ${standName}, skip...`)
      continue;
    }
    const deploymentPath = path.join(deploymentsPath, deployment)
    const readJson = fs.readFileSync(deploymentPath, { encoding: 'utf-8' })
    const deploymentJson = JSON.parse(readJson)

    let subgraphContractsDataToStore = {}
    for (const contractName of REQUIRED_DEPLOYED_CONTRACT_NAMES) {
      if (!(contractName in deploymentJson)) {
        console.warn(`${contractName} not found for stand ${standName} in deployments, skip...`)
        continue;
      }
      const contractDeployment = deploymentJson[contractName]
      if (!(contractDeployment.addr != null && contractDeployment.blockNumber != null)) {
        console.warn(`addr or blockNumber not found for stand ${standName} in ${JSON.stringify(contractDeployment)} deployment, skip...`)
        continue;
      }

      subgraphContractsDataToStore[contractName] = {
        address: contractDeployment.addr,
        startBlock: Number(contractDeployment.blockNumber ?? 0),
      }
    }

    if (Object.keys(subgraphContractsDataToStore).length !== REQUIRED_DEPLOYED_CONTRACT_NAMES.length) {
      console.warn(`subgraphContractsDataToStore for stand ${standName} is not consists of all required contracts, skip...`)
      continue;
    }

    await saveNetworksConfig(standName, subgraphContractsDataToStore)
  }
}

type asyncRuntimeDecoratorType = (func: Function) => void;
const asyncRuntimeDecorator: asyncRuntimeDecoratorType = (func) => {
  func()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
};

asyncRuntimeDecorator(main);
