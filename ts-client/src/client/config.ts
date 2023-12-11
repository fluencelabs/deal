import path from "path";

export declare const NETWORL_NAME: readonly [
  "kras",
  "testnet",
  "stage",
  "local",
];

export const DEPLOYMENTS_DIR = path.join("../deployments");
export type Network = (typeof NETWORL_NAME)[number];
export type Deployment = {
  core: string;
  flt: string;
  usdc: string;
  chainId: number;
};

export const getDeployment = async (network: Network): Promise<Deployment> => {
  switch (network) {
    case "kras":
      return await _getDeployment("kras", 80001);
    case "testnet":
      return await _getDeployment("testnet", 80001);
    case "stage":
      return await _getDeployment("stage", 80001);
    case "local":
      return await _getDeployment("local", 31337);
    default:
      throw new Error(`Unknown network: ${network}`);
  }
};

async function _getDeployment(
  networkName: Network,
  chainId: number,
): Promise<Deployment> {
  const deployment = await await import(
    path.join(DEPLOYMENTS_DIR, String(chainId) + ".json")
  );

  if (deployment?.core?.address === undefined) {
    throw new Error(
      `Could not find global core address for network: ${networkName}`,
    );
  } else if (deployment?.flt?.address === undefined) {
    throw new Error(
      `Could not find flt token address for network: ${networkName}`,
    );
  } else if (deployment?.usdc?.address === undefined) {
    throw new Error(
      `Could not find usdc token address for network: ${networkName}`,
    );
  }

  return {
    core: deployment.core.address,
    flt: deployment.tFLT.address,
    usdc: deployment.tUSD.address,
    chainId: chainId,
  };
}
