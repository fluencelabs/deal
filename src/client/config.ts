export const CHAIN_NETWORKS = ["kras", "stage", "testnet", "local"] as const;

export type ChainNetwork = (typeof CHAIN_NETWORKS)[number];

type ChainConfig = {
    globalConfig: string;
    dealFactoryAddress: string;
    faucet: string;
    fltToken: string;
    testUSDToken: string;
    chainId: number;
};

export const DEAL_CONFIG: Record<ChainNetwork, ChainConfig> = {
    kras: {
        globalConfig: "0x21bfd785C1bfB7CF73BaBe161a5036b04867E4dE",
        dealFactoryAddress: "0x84a9AFE88E1D3dfd5CA459ff3987F6B5780A29e0",
        fltToken: "0x4980a7fB66C8d8B88Cb3241C9037cD96DA452D34",
        testUSDToken: "0xDAe60a9b3BcF55e6517257Cbfc365147FC190DfA",
        faucet: "0x3c2e185283720D99073D688B50aCd64A9A7B160B",
        chainId: 1313161555,
    },
    stage: {
        globalConfig: "0xDD988DF5350CC64451A19066A31C840A8dD09eb3",
        dealFactoryAddress: "0x7530ae3f50fe4AAC21e53dC5cDD871BF522dA278",
        fltToken: "0xA58270c62814b318e80fa652b7b70Dc48BF113C1",
        testUSDToken: "0xeC9D74C9a8BD2090B6dCA9018a6c14426EA0Cc78",
        faucet: "0x64934429354065B921CC711319E2dfc313ee7D92",
        chainId: 1313161555,
    },
    testnet: {
        globalConfig: "0x3731D4F9C4C64234f424db5159efB70Aa3284592",
        dealFactoryAddress: "0xD8B2391b47a814955BE5eFfcae3C7745201E75cD",
        fltToken: "0xec3Ad00047d1cf27b0470D524583d554c3B68c8d",
        testUSDToken: "0x8e9A5BA19AC845fbe5d48d40b37e9808Be5fC684",
        faucet: "0x3c67F7a6c00013D179e277f3Eb711E2F7552bA0a",
        chainId: 1313161555,
    },
    local: {
        globalConfig: "0x42e59295F72a5B31884d8532396C0D89732c8e84",
        dealFactoryAddress: "0xbd679f14b9D913e78a7F737839518B03986b31aD",
        fltToken: "0x3e233943a51C7d3FC1B25bD0BfFaF27CC979616a",
        testUSDToken: "0x732BfdBb03de27c5a5915F5CcdEe85080D1d4C3D",
        faucet: "0x3D56d40F298AaC494EE4612d39edF591ed8C5c69",
        chainId: 31337,
    },
};
