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
        globalConfig: "0xe2F6b84b3b2B3F2719F6034Bc5205d6d49B11B84",
        dealFactoryAddress: "0xa201799B530BDDd55DE804b8A5E3bc274da506a9",
        fltToken: "0x8F7BE4b5Ac96247416c85bC9BB701608335DE64D",
        testUSDToken: "0xB704Ce45F75B0E85c658DE1c5E23D17BEb4b246b",
        faucet: "0xC59989a9Fe5A37c2414b212A18912c62533bCDdF",
        chainId: 1313161555,
    },
    stage: {
        globalConfig: "0xF70a2528eFd0fD1938Bf5f01cDc8D1c7645De01a",
        dealFactoryAddress: "0xc3458ac2153966Cd1C57770ca241951f4729F0e3",
        fltToken: "0x5781BD778F4833491A793BA8348724CF9f9FF904",
        testUSDToken: "0x067968aBa9B7dC8c5bD020f046dE138E8dB46190",
        faucet: "0x034eBe353eEE6BcB435Edab7d59C64Ff48C69421",
        chainId: 1313161555,
    },
    testnet: {
        globalConfig: "0xEa6Af513855796d6DA61650962402FaEb3F4508d",
        dealFactoryAddress: "0x9aB4113bC7691F200761438Ed0649B274753d33E",
        fltToken: "0x44C34F0Dfe06Dc44576Ff10D1ac43d8090D7C7c5",
        testUSDToken: "0xb14105338e20bf304C5eAfb924d1a953Fa53a445",
        faucet: "0x55d94F584C7bc940bCf5b1e8A1B2D447B3791cae",
        chainId: 1313161555,
    },
    local: {
        globalConfig: "0x42e59295F72a5B31884d8532396C0D89732c8e84",
        dealFactoryAddress: "0xbd679f14b9D913e78a7F737839518B03986b31aD",
        fltToken: "0x3e233943a51C7d3FC1B25bD0BfFaF27CC979616a",
        testUSDToken: "0x732BfdBb03de27c5a5915F5CcdEe85080D1d4C3D",
        faucet: "0x3D56d40F298AaC494EE4612d39edF591ed8C5c69",
        chainId: 31_337,
    },
};
