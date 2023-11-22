import path from "path";

const HARDHAT_DEPLOYMENTS_DIR = "../deployments"


// TODO: what is local?
export declare const CONTRACTS_ENV: readonly ["kras", "testnet", "stage", "local", "localhost"];
export type ContractsENV = (typeof CONTRACTS_ENV)[number];

export type ChainConfig = {
    coreImplAbi: any;
    globalCoreAddress: string;
    dealFactoryAddress: string;
    fltTokenAddress: string;
    chainId: number;
};

type HardhatDeployment = {
    address: string,
    abi: any,
}

async function _tryImportDeployment(jsonPath: string): Promise<HardhatDeployment> {
    try {
        return await import(jsonPath);
    } catch(e: any) {
        console.warn('Could not import deployment: %s, return nullable deployment and pass.', jsonPath)
        return {
            abi: [],
            address: '',
        }
    }
}

async function _getConfig(networkName: ContractsENV) {
    const coreImplDeployment = await _tryImportDeployment(path.join(HARDHAT_DEPLOYMENTS_DIR, networkName, "CoreImpl.json"));
    // TODO: deprecate the below one...
    const globalCoreDeployment = await _tryImportDeployment(path.join(HARDHAT_DEPLOYMENTS_DIR, networkName, "GlobalCore.json"));
    const factoryDeployment = await _tryImportDeployment(path.join(HARDHAT_DEPLOYMENTS_DIR, networkName, "DealFactory.json"));
    const fltDeployment = await _tryImportDeployment(path.join(HARDHAT_DEPLOYMENTS_DIR, networkName, "FLT.json"));
    return {
        coreImplAbi: coreImplDeployment.abi,
        globalCoreAddress: globalCoreDeployment.address,
        dealFactoryAddress: factoryDeployment.address,
        fltTokenAddress: fltDeployment.address,
        chainId: 314159,
    };
}

export const DEAL_CONFIG: Record<ContractsENV, () => Promise<ChainConfig>> = {
    kras: async (): Promise<ChainConfig> => {
        return await _getConfig('kras')
    },
    testnet: async (): Promise<ChainConfig> => {
        return await _getConfig('testnet')
    },
    stage: async (): Promise<ChainConfig> => {
        return await _getConfig('stage')
    },
    local: async (): Promise<ChainConfig> => {
        return await _getConfig('local')
    },
    localhost: async (): Promise<ChainConfig> => {
        return await _getConfig('localhost')
    },
};
