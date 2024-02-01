import type { ethers } from "ethers";

import {
  Core__factory,
  Deal__factory,
  ERC20__factory,
  Market__factory,
  Capacity__factory,
  Multicall3__factory,
} from "../typechain-types/index.js";
import { getDeployment } from "./config.js";

import type {
  Deal,
  ICapacity,
  ICore,
  IERC20,
  IMarket,
  Multicall3,
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

  async getCore(): Promise<ICore> {
    return Core__factory.connect(
      (await this.deployment).core,
      this.signerOrProvider,
    );
  }

  async getMarket(): Promise<IMarket> {
    return Market__factory.connect(
      await (await this.getCore()).market(),
      this.signerOrProvider,
    );
  }

  async getCapacity(): Promise<ICapacity> {
    return Capacity__factory.connect(
      await (await this.getCore()).capacity(),
      this.signerOrProvider,
    );
  }

  async getUSDC(): Promise<IERC20> {
    return ERC20__factory.connect(
      (await this.deployment).usdc,
      this.signerOrProvider,
    );
  }

  async getMulticall3(): Promise<Multicall3> {
    return Multicall3__factory.connect(
      (await this.deployment).multicall3,
      this.signerOrProvider,
    );
  }
}
