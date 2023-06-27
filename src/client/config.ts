export const CHAIN_NETWORKS = ["kras", "stage", "testnet", "local"] as const;

export type ChainNetwork = (typeof CHAIN_NETWORKS)[number];

type ChainConfig = {
    globalConfig: string;
    dealFactoryAddress: string;
    fltToken: string;
    testUSDToken: string;
    chainId: number;
};

export const DEAL_CONFIG: Record<ChainNetwork, ChainConfig> = {
    kras: {
        globalConfig: "0x146fc71dB2A7BCd236eC92bf7DE3Bfb555881670",
        dealFactoryAddress: "0x1b9a769Ff179F8bb487FBd3A00BDbF80dd002c5e",
        fltToken: "0x9076297aAD6374CB2A4CA252708839713B7179ae",
        testUSDToken: "0xa11c3F0f2DF07d1f0d32124Dc80EF21638D90FAb",
        chainId: 1313161555,
    },
    stage: {
        globalConfig: "0x146fc71dB2A7BCd236eC92bf7DE3Bfb555881670",
        dealFactoryAddress: "0x1b9a769Ff179F8bb487FBd3A00BDbF80dd002c5e",
        fltToken: "0x9076297aAD6374CB2A4CA252708839713B7179ae",
        testUSDToken: "0xa11c3F0f2DF07d1f0d32124Dc80EF21638D90FAb",
        chainId: 1313161555,
    },
    testnet: {
        globalConfig: "0x146fc71dB2A7BCd236eC92bf7DE3Bfb555881670",
        dealFactoryAddress: "0x1b9a769Ff179F8bb487FBd3A00BDbF80dd002c5e",
        fltToken: "0x9076297aAD6374CB2A4CA252708839713B7179ae",
        testUSDToken: "0xa11c3F0f2DF07d1f0d32124Dc80EF21638D90FAb",
        chainId: 1313161555,
    },
    local: {
        globalConfig: "0x42e59295F72a5B31884d8532396C0D89732c8e84",
        dealFactoryAddress: "0xbd679f14b9D913e78a7F737839518B03986b31aD",
        fltToken: "0x3e233943a51C7d3FC1B25bD0BfFaF27CC979616a",
        testUSDToken: "0x732BfdBb03de27c5a5915F5CcdEe85080D1d4C3D",
        chainId: 31_337,
    },
};
