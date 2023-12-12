import type { ethers } from "ethers";

import {
  Core__factory,
  Deal__factory,
  ERC20__factory,
} from "../typechain-types/index.js";
import { getDeployment } from "./config.js";

import type { Core, Deal, ERC20 } from "../typechain-types/index.js";
import type { Deployment, ContractsENV } from "./config.js";

export class DealClient {
  private deployment: Promise<Deployment>;

  constructor(
    private signerOrProvider: ethers.Signer | ethers.Provider,
    env: ContractsENV,
  ) {
    this.deployment = getDeployment(env);
  }

  getDeal(address: string): Deal {
    return Deal__factory.connect(address, this.signerOrProvider);
  }

  async getCore(): Promise<Core> {
    return Core__factory.connect(
      (await this.deployment).core,
      this.signerOrProvider,
    );
  }

  async getFLT(): Promise<ERC20> {
    return ERC20__factory.connect(
      (await this.deployment).flt,
      this.signerOrProvider,
    );
  }

  async getUSDC(): Promise<ERC20> {
    return ERC20__factory.connect(
      (await this.deployment).usdc,
      this.signerOrProvider,
    );
  }
}
