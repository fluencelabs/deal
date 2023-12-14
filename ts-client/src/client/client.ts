import type { ethers } from "ethers";

import {
  Core__factory,
  Deal__factory,
  ERC20__factory,
  Market__factory,
  Capacity__factory,
} from "../typechain-types/index.js";
import { getDeployment } from "./config.js";

import type {
  Capacity,
  Core,
  Deal,
  ERC20,
  Market,
} from "../typechain-types/index.js";
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

  async getMarket(): Promise<Market> {
    return Market__factory.connect(
      await (await this.getCore()).market(),
      this.signerOrProvider,
    );
  }

  async getCapacity(): Promise<Capacity> {
    return Capacity__factory.connect(
      await (await this.getCore()).market(),
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
