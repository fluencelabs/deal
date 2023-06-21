import { ConfigModule, ConfigModule__factory, Core, Core__factory, WorkersModule, WorkersModule__factory } from "./types";
import { ethers } from "ethers";

export class Deal {
    private core: Core;

    constructor(dealAddress: string, private signer: ethers.ContractRunner) {
        this.core = Core__factory.connect(dealAddress, this.signer);
    }

    async getWorkersModule(): Promise<WorkersModule> {
        const workersAddress = await this.core.workersModule();
        return WorkersModule__factory.connect(workersAddress, this.signer);
    }

    async getConfigModule(): Promise<ConfigModule> {
        const configAddress = await this.core.configModule();
        return ConfigModule__factory.connect(configAddress, this.signer);
    }
}
