import type { ethers } from "ethers";
import { GlobalContracts } from "./global.js";
import { Deal } from "./deal.js";
import type { ChainNetwork } from "./config.js";
import type * as types from "./types";
export type { types };

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
