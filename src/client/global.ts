import type { ethers } from "ethers";
import { DEAL_CONFIG, ContractsENV } from "./config";
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
    constructor(private provider: ethers.ContractRunner, private env: ContractsENV) {}

    getGlobalConfig(): GlobalConfig {
        return GlobalConfig__factory.connect(DEAL_CONFIG[this.env].globalConfig, this.provider);
    }

    getFactory(): DealFactory {
        return DealFactory__factory.connect(DEAL_CONFIG[this.env].dealFactoryAddress, this.provider);
    }

    async getMatcher(): Promise<Matcher> {
        const config = this.getGlobalConfig();
        return Matcher__factory.connect(await config.matcher(), this.provider);
    }

    async getFLT(): Promise<ERC20> {
        return ERC20__factory.connect(DEAL_CONFIG[this.env].fltToken, this.provider);
    }
}
