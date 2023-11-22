import type { ethers } from "ethers";
import { DEAL_CONFIG, ContractsENV, ChainConfig } from "./config";
import {
    GlobalCore__factory,
    type DealFactory,
    DealFactory__factory,
    type ERC20,
    ERC20__factory,
    type GlobalCore,
    type Matcher,
    Matcher__factory,
} from "../typechain-types";

export class GlobalContracts {
    private chainConfig: Promise<ChainConfig>;

    constructor(
        private provider: ethers.ContractRunner,
        private env: ContractsENV,
    ) {
        this.chainConfig = DEAL_CONFIG[this.env]();
    }

    async getGlobalCore(): Promise<GlobalCore> {
        return GlobalCore__factory.connect((await this.chainConfig).globalCoreAddress, this.provider);
    }

    async getFactory(): Promise<DealFactory> {
        return DealFactory__factory.connect((await this.chainConfig).dealFactoryAddress, this.provider);
    }

    async getMatcher(): Promise<Matcher> {
        const config = await this.getGlobalCore();
        return Matcher__factory.connect(await config.matcher(), this.provider);
    }

    async getFLT(): Promise<ERC20> {
        return ERC20__factory.connect((await this.chainConfig).fltTokenAddress, this.provider);
    }
}
