export const CONTRACTS_ENV = ["testnet", "local"] as const;

export type ContractsENV = (typeof CONTRACTS_ENV)[number];

export type ChainConfig = {
    globalConfig: string;
    dealFactoryAddress: string;
    fltToken: string;
    chainId: number;
};

export const DEAL_CONFIG: Record<ContractsENV, () => Promise<ChainConfig>> = {
    testnet: async (): Promise<ChainConfig> => {
        throw new Error("DealClient: testnet config not implemented");
        /*const globalConfig = await import("../deployments/testnet/GlobalConfig.json");
        //const factory = await import("../deployments/testnet/Factory.json");
        //const flt = await import("../deployments/testnet/FLT.json");

        return {
            globalConfig: globalConfig.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 1313161555,
        };*/
    },
    local: async (): Promise<ChainConfig> => {
        const globalConfig = await import("../deployments/localhost/GlobalConfig.json");
        const factory = await import("../deployments/localhost/Factory.json");
        const flt = await import("../deployments/localhost/FLT.json");

        return {
            globalConfig: globalConfig.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 31337,
        };
    },
};
