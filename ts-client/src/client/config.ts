export const CONTRACTS_ENV = ["kras", "testnet", "stage", "local"];

export const DEPLOYMENTS_DIR = "src/deployments";
export type ContractsENV = (typeof CONTRACTS_ENV)[number];
export type Deployment = {
  core: string;
  usdc: string;
  market: string;
  capacity: string;
  multicall3: string;
  chainId: number;
};

import stage from "./../deployments/stage.json" assert { type: "json" };
import testnet from "./../deployments/testnet.json" assert { type: "json" };
import kras from "./../deployments/kras.json" assert { type: "json" };
import local from "./../deployments/local.json" assert { type: "json" };

export const getDeployment = async (env: ContractsENV) => {
  let chainId = 0;
  let deployment: any | undefined = undefined;

  switch (env) {
    case "kras":
      deployment = kras;
      chainId = 80001;
      break;
    case "testnet":
      deployment = testnet;
      chainId = 80001;
      break;
    case "stage":
      deployment = stage;
      chainId = 3521768853336688;
      break;
    case "local":
      deployment = local;
      chainId = 31337;
      break;
    default:
      throw new Error(`Unknown chain env: ${env}`);
  }

  //TODO: add verification of deployment object (JSON schema)

  const contracts = ["Core", "Market", "Capacity", "tUSD", "Multicall3"];

  for (const contract of contracts) {
    if (deployment[contract] === undefined) {
      throw new Error(`Could not find contract: ${contract} for env: ${env}`);
    }
  }

  return {
    core: deployment.Core.addr,
    market: deployment.Market.addr,
    capacity: deployment.Capacity.addr,
    usdc: deployment.tUSD.addr,
    multicall3: deployment.Multicall3.addr,
    chainId: chainId,
  };
};
