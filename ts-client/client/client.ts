import type { ethers } from "ethers";
import {
  Core,
  Core__factory,
  Deal,
  Deal__factory,
  ERC20,
  ERC20__factory,
} from "../typechain-types";
import { Deployment, getDeployment, Network } from "./config";

export class DealClient {
  private deployment: Promise<Deployment>;

  constructor(
    private signerOrProvider: ethers.Signer | ethers.Provider,
    private network: Network,
  ) {
    this.deployment = getDeployment(network);
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
