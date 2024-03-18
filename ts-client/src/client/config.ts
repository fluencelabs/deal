export const CONTRACTS_ENV = ["dar", "stage", "local", "kras"];

export type ContractsENV = (typeof CONTRACTS_ENV)[number];
export type Deployment = {
  core: string;
  usdc: string;
  market: string;
  dealFactory: string;
  capacity: string;
  multicall3: string;
  chainId: number;
};

import stage from "./../deployments/stage.json" assert { type: "json" };
import dar from "./../deployments/dar.json" assert { type: "json" };
import local from "./../deployments/local.json" assert { type: "json" };
import kras from "./../deployments/kras.json" assert { type: "json" };

export const getDeployment = (env: ContractsENV) => {
  let chainId = 0;
  let deployment: typeof stage | typeof dar | typeof local | undefined =
    undefined;

  switch (env) {
    case "dar":
      deployment = dar;
      chainId = 3525067388221321;
      break;
    case "stage":
      deployment = stage;
      chainId = 3521768853336688;
      break;
    case "kras":
      deployment = kras;
      chainId = 3521768853336688;
      break;
    case "local":
      deployment = local;
      chainId = 31337;
      break;
    default:
      throw new Error(`Unknown chain env: ${env}`);
  }

  return {
    core: deployment.Core.addr,
    market: deployment.Market.addr,
    capacity: deployment.Capacity.addr,
    dealFactory: deployment.DealFactory.addr,
    usdc: deployment.tUSD.addr,
    multicall3: deployment.Multicall3.addr,
    chainId: chainId,
  };
};
