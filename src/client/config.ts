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
        dealFactoryAddress: "0xbd679f14b9D913e78a7F737839518B03986b31aD",
        fltToken: "0x3e233943a51C7d3FC1B25bD0BfFaF27CC979616a",
        testUSDToken: "0x732BfdBb03de27c5a5915F5CcdEe85080D1d4C3D",
        chainId: 31_337,
    },
    testnet: {
        globalConfig: "0xc4B7478c185a9CdEfAF7FeF20219de223a07B4a7",
        dealFactoryAddress: "0x3F73c440e067a2BcF7E65145A3C6546FF6467571",
        fltToken: "0xDDb7EC6d96fA8179D13Ab3aeaB1170Fa20f9f2D3",
        testUSDToken: "0x4B9006eD00b37fe5D13A0890740B80aBd0Dbd8df",
        chainId: 1313161555,
    },
};
