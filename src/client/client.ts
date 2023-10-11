import type { ethers } from "ethers";
import { GlobalContracts } from "./global";
import type { ContractsENV } from "./config";
import { Deal, Deal__factory } from "../typechain-types";

export class DealClient {
    private globalContracts: GlobalContracts;

    constructor(
        private signer: ethers.Signer,
        private env: ContractsENV,
    ) {
        this.globalContracts = new GlobalContracts(this.signer, this.env);
    }

    getDeal(address: string): Deal {
        return Deal__factory.connect(address, this.signer);
    }

    getGlobalContracts(): GlobalContracts {
        return this.globalContracts;
    }
}
