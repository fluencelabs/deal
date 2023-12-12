import path from "path";

export const CONTRACTS_ENV = ["kras", "testnet", "stage", "local"];

export const DEPLOYMENTS_DIR = path.join("../deployments");
export type ContractsENV = (typeof CONTRACTS_ENV)[number];
export type Deployment = {
  core: string;
  flt: string;
  usdc: string;
  chainId: number;
};

export const getDeployment = async (env: ContractsENV): Promise<Deployment> => {
  let chainId = 0;
  switch (env) {
    case "kras":
      chainId = 80001;
      break;
    case "testnet":
      chainId = 137;
      break;
    case "stage":
      chainId = 1337;
      break;
    case "local":
      chainId = 31337;
      break;
    default:
      throw new Error(`Unknown chain env: ${env}`);
  }

  return _getDeployment(env, chainId);
};

async function _getDeployment(
  env: ContractsENV,
  chainId: number,
): Promise<Deployment> {
  const deployment = await await import(
    path.join(DEPLOYMENTS_DIR, String(chainId), ".json")
  );

  if (deployment?.core?.address === undefined) {
    throw new Error(`Could not find global core address for env: ${env}`);
  } else if (deployment?.flt?.address === undefined) {
    throw new Error(`Could not find flt token address for env: ${env}`);
  } else if (deployment?.usdc?.address === undefined) {
    throw new Error(`Could not find usdc token address for env: ${env}`);
  }

  return {
    core: deployment.core.address,
    flt: deployment.tFLT.address,
    usdc: deployment.tUSD.address,
    chainId: chainId,
  };
}
