export const CONTRACTS_ENV = ["main", "local"] as const;

export type ContractsENV = (typeof CONTRACTS_ENV)[number];

type ChainConfig = {
    globalConfig: string;
    dealFactoryAddress: string;
    fltToken: string;
    chainId: number;
};

export const DEAL_CONFIG: Record<ContractsENV, ChainConfig> = {
    main: {
        globalConfig: "0x3731D4F9C4C64234f424db5159efB70Aa3284592",
        dealFactoryAddress: "0xD8B2391b47a814955BE5eFfcae3C7745201E75cD",
        fltToken: "0xec3Ad00047d1cf27b0470D524583d554c3B68c8d",
        chainId: 1313161555,
    },
    local: {
        globalConfig: "0x42e59295F72a5B31884d8532396C0D89732c8e84",
        dealFactoryAddress: "0xbd679f14b9D913e78a7F737839518B03986b31aD",
        fltToken: "0x3e233943a51C7d3FC1B25bD0BfFaF27CC979616a",
        chainId: 31337,
    },
};
