export const CONTRACTS_ENV = ["testnet", "local"] as const;

export type ContractsENV = (typeof CONTRACTS_ENV)[number];

export type ChainConfig = {
    globalCore: string;
    dealFactoryAddress: string;
    fltToken: string;
    chainId: number;
};

export const DEAL_CONFIG: Record<ContractsENV, () => Promise<ChainConfig>> = {
    testnet: async (): Promise<ChainConfig> => {
        const globalCore = await import("../deployments/testnet/GlobalCore.json");
        const factory = await import("../deployments/testnet/Factory.json");
        const flt = await import("../deployments/testnet/FLT.json");

        return {
            globalCore: globalCore.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 80001,
        };
    },
    local: async (): Promise<ChainConfig> => {
        const globalCore = await import("../deployments/localnet/GlobalCore.json");
        const factory = await import("../deployments/localnet/Factory.json");
        const flt = await import("../deployments/localnet/FLT.json");

        return {
            globalCore: globalCore.address,
            dealFactoryAddress: factory.address,
            fltToken: flt.address,
            chainId: 31337,
        };
    },
};
