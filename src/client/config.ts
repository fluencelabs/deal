export declare const CONTRACTS_ENV: readonly ["kras", "testnet", "stage", "local"];
export type ContractsENV = (typeof CONTRACTS_ENV)[number];

export type ChainConfig = {
    globalCore: string;
    dealFactoryAddress: string;
    fltToken: string;
    chainId: number;
};

export const DEAL_CONFIG: Record<ContractsENV, () => Promise<ChainConfig>> = {
    kras: async (): Promise<ChainConfig> => {
        const globalCore = await import("../deployments/kras/GlobalCore.json");
        const factory = await import("../deployments/kras/DealFactory.json");
        const flt = await import("../deployments/kras/FLT.json");

        return {
            globalCore: globalCore.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 314159,
        };
    },
    testnet: async (): Promise<ChainConfig> => {
        const globalCore = await import("../deployments/testnet/GlobalCore.json");
        const factory = await import("../deployments/testnet/DealFactory.json");
        const flt = await import("../deployments/testnet/FLT.json");

        return {
            globalCore: globalCore.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 314159,
        };
    },
    stage: async (): Promise<ChainConfig> => {
        const globalCore = await import("../deployments/stage/GlobalCore.json");
        const factory = await import("../deployments/stage/DealFactory.json");
        const flt = await import("../deployments/stage/FLT.json");

        return {
            globalCore: globalCore.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 314159,
        };
    },
    local: async (): Promise<ChainConfig> => {
        const globalCore = await import("../deployments/localnet/GlobalCore.json");
        const factory = await import("../deployments/localnet/DealFactory.json");
        const flt = await import("../deployments/localnet/FLT.json");

        return {
            globalCore: globalCore.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 31337,
        };
    },
};
