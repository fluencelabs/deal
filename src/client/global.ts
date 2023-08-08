import type { ethers } from "ethers";
import { DEAL_CONFIG, ContractsENV, ChainConfig } from "./config";
import {
    GlobalConfig__factory,
    type DealFactory,
    DealFactory__factory,
    type ERC20,
    ERC20__factory,
    type GlobalConfig,
    type Matcher,
    Matcher__factory,
} from "../typechain-types";

export class GlobalContracts {
    private chainConfig: Promise<ChainConfig>;

    constructor(private provider: ethers.ContractRunner, private env: ContractsENV) {
        this.chainConfig = DEAL_CONFIG[this.env]();
    }

    async getGlobalConfig(): Promise<GlobalConfig> {
        return GlobalConfig__factory.connect((await this.chainConfig).globalConfig, this.provider);
    }

    async getFactory(): Promise<DealFactory> {
        return DealFactory__factory.connect((await this.chainConfig).dealFactoryAddress, this.provider);
    }

    async getMatcher(): Promise<Matcher> {
        const config = await this.getGlobalConfig();
        return Matcher__factory.connect(await config.matcher(), this.provider);
    }

    async getFLT(): Promise<ERC20> {
        return ERC20__factory.connect((await this.chainConfig).fltToken, this.provider);
    }
}
