export const CHAIN_NETWORKS = [
  "local",
  "testnet",
  //  "mainnet"
] as const;

export type ChainNetwork = (typeof CHAIN_NETWORKS)[number];

type ChainConfig = {
  globalConfig: string;
  dealFactoryAddress: string;
  fltToken: string;
  testUSDToken: string;
  chainId: number;
};

export const DEAL_CONFIG: Record<ChainNetwork, ChainConfig> = {
  local: {
    globalConfig: "0x42e59295F72a5B31884d8532396C0D89732c8e84",
    dealFactoryAddress: "0x908aEBfb6051Bca6d1e684586d7760e53C4c736C",
    fltToken: "",
    testUSDToken: "",
    chainId: 31_337,
  },
  testnet: {
    globalConfig: "0x49199A30Ec5E2683359606D85ddc53FEFb5dAE4f",
    dealFactoryAddress: "0x296A2ed43A3Cbe2C76b64FdF182A02dBBE8ce10F",
    fltToken: "",
    testUSDToken: "",
    chainId: 1313161555,
  },
};
