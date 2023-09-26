export const CONTRACTS_ENV = ["kras", "testnet", "stage", "local"] as const;

export type ContractsENV = (typeof CONTRACTS_ENV)[number];

export type ChainConfig = {
    globalConfig: string;
    dealFactoryAddress: string;
    fltToken: string;
    chainId: number;
};

export const DEAL_CONFIG: Record<ContractsENV, () => Promise<ChainConfig>> = {
    kras: async (): Promise<ChainConfig> => {
        const globalConfig = await import("../deployments/kras/GlobalConfig.json");
        const factory = await import("../deployments/kras/Factory.json");
        const flt = await import("../deployments/kras/FLT.json");

        return {
            globalConfig: globalConfig.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 137,
        };
    },
    testnet: async (): Promise<ChainConfig> => {
        const globalConfig = await import("../deployments/testnet/GlobalConfig.json");
        const factory = await import("../deployments/testnet/Factory.json");
        const flt = await import("../deployments/testnet/FLT.json");

        return {
            globalConfig: globalConfig.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 314159,
        };
    },
    stage: async (): Promise<ChainConfig> => {
        const globalConfig = await import("../deployments/stage/GlobalConfig.json");
        const factory = await import("../deployments/stage/Factory.json");
        const flt = await import("../deployments/stage/FLT.json");

        return {
            globalConfig: globalConfig.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 80001,
        };
    },
    local: async (): Promise<ChainConfig> => {
        const globalConfig = await import("../deployments/localnet/GlobalConfig.json");
        const factory = await import("../deployments/localnet/Factory.json");
        const flt = await import("../deployments/localnet/FLT.json");

        return {
            globalConfig: globalConfig.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 31337,
        };
    },
};
