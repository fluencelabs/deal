import type { ethers } from "ethers";
import { GlobalContracts } from "./global";
import { Deal } from "./deal";
import type { ContractsENV } from "./config";

export class DealClient {
    private globalContracts: GlobalContracts;

    constructor(private signer: ethers.Signer, private env: ContractsENV) {
        this.globalContracts = new GlobalContracts(this.signer, this.env);
    }

    getDeal(address: string): Deal {
        return new Deal(address, this.signer);
    }

    getGlobalContracts(): GlobalContracts {
        return this.globalContracts;
    }
}
