export const CHAIN_NETWORKS = ["testnet", "local"] as const;

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
    testnet: {
        globalConfig: "0x21bfd785C1bfB7CF73BaBe161a5036b04867E4dE",
        dealFactoryAddress: "0x84a9AFE88E1D3dfd5CA459ff3987F6B5780A29e0",
        fltToken: "0x4980a7fB66C8d8B88Cb3241C9037cD96DA452D34",
        testUSDToken: "0xDAe60a9b3BcF55e6517257Cbfc365147FC190DfA",
        faucet: "0x3c2e185283720D99073D688B50aCd64A9A7B160B",
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

// 0801122058C6FFDA7EAABC545427FF891237078B79CF952AC47366A0042FE33E0735BD0F
