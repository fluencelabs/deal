import type { ethers } from "ethers";
import { GlobalContracts } from "./global";
import { Deal } from "./deal";
import type { ChainNetwork } from "./config";

export class DealClient {
  private globalContracts: GlobalContracts;

  constructor(private signer: ethers.Signer, private network: ChainNetwork) {
    this.globalContracts = new GlobalContracts(this.signer, this.network);
  }

  getDeal(address: string): Deal {
    return new Deal(address, this.signer);
  }

  getGlobalContracts(): GlobalContracts {
    return this.globalContracts;
  }
}
