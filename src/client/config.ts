import { address as localGlobalConfigAddress } from "../../deployments/localhost/GlobalConfig.json";
import { address as localDealFactoryAddress } from "../../deployments/localhost/Factory.json";
import { address as localFLTTokenAddress } from "../../deployments/localhost/FLT.json";

import { address as globalConfigAddress } from "../../deployments/testnet/GlobalConfig.json";
import { address as dealFactoryAddress } from "../../deployments/testnet/Factory.json";
import { address as fltTokenAddress } from "../../deployments/testnet/FLT.json";

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
        globalConfig: globalConfigAddress,
        dealFactoryAddress: dealFactoryAddress,
        fltToken: fltTokenAddress,
        chainId: 1313161555,
    },
    local: {
        globalConfig: localGlobalConfigAddress,
        dealFactoryAddress: localDealFactoryAddress,
        fltToken: localFLTTokenAddress,
        chainId: 31337,
    },
};
