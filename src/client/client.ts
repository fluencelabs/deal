import type { ethers } from "ethers";
import { GlobalContracts } from "./global";
import type { ContractsENV } from "./config";
import { Deal, Deal__factory } from "../typechain-types";

export class DealClient {
    private globalContracts: GlobalContracts;

    constructor(
        private env: ContractsENV,
        private signerOrProvider: ethers.Signer | ethers.Provider,
    ) {
        this.globalContracts = new GlobalContracts(this.signerOrProvider, this.env);
    }

    getDeal(address: string): Deal {
        return Deal__factory.connect(address, this.signerOrProvider);
    }

    getGlobalContracts(): GlobalContracts {
        return this.globalContracts;
    }
}
