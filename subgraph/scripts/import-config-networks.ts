import * as path from "path";
import * as fs from "fs";


const DEPLOYMENTS_DIR = '../../deployments'
const CONFIGS_DIR =  "../configs"
const REQUIRED_DEPLOYED_CONTRACT_NAME = "Market"
const STANDS = ["kras", "testnet", "stage", "local"]
// Subgraph repo pattern used to have config dir with networks.json to support
//  deploy on different networks: {mainnet, mumbai, etc}.
//  In our case when we can deploy different stands on the same network, e.g. mumbai we have
//  to have different configs for each stand, and combine the desired deploy
//  through flags: --config-file and --network name in that file.
const STAND_TO_SUBGRAPH_CONFIG = {
  "kras": "kras-networks-config.json",
  "testnet": "testnet-networks-config.json",
  "stage": "stage-networks-config.json",
  "local": "local-networks-config.json",
}
const STAND_TO_SUBGRAPH_NETWORK = {
  "kras": "mumbai",
  "testnet": "mumbai",
  "stage": "stage",
  "local": "localhost",
}

async function saveNetworksConfig(
  contractName: string, standName: keyof typeof STAND_TO_SUBGRAPH_CONFIG, addr: string, blockNumber: number) {
  const networksConfigPath = path.join(__dirname, CONFIGS_DIR, STAND_TO_SUBGRAPH_CONFIG[standName])
  let res: any = {}
  let contractsConfig: any = {}
  contractsConfig[contractName] = {
    address: addr,
    startBlock: blockNumber ?? 0,
  }
  res[STAND_TO_SUBGRAPH_NETWORK[standName]] = contractsConfig
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
    if (!(REQUIRED_DEPLOYED_CONTRACT_NAME in deploymentJson)) {
      console.warn(`${REQUIRED_DEPLOYED_CONTRACT_NAME} not found for stand ${standName} in deployments, skip...`)
      continue;
    }
    const contractDeployment = deploymentJson[REQUIRED_DEPLOYED_CONTRACT_NAME]
    if (!(contractDeployment.addr != null && contractDeployment.blockNumber != null)) {
      console.warn(`addr or blockNumber not found for stand ${standName} in ${JSON.stringify(contractDeployment)} deployment, skip...`)
      continue;
    }

    await saveNetworksConfig(REQUIRED_DEPLOYED_CONTRACT_NAME, standName, contractDeployment.addr, Number(contractDeployment.blockNumber))
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
