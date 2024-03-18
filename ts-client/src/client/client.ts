import type { ethers } from "ethers";

import {
  Core__factory,
  Deal__factory,
  DealFactory__factory,
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
  IDealFactory,
  IERC20,
  IMarket,
  Multicall3,
} from "../typechain-types/index.js";
import type { Deployment, ContractsENV } from "./config.js";

export class DealClient {
  private deployment: Deployment;

  static getContractAddresses(env: ContractsENV): Deployment {
    return getDeployment(env);
  }

  constructor(
    private signerOrProvider: ethers.Signer | ethers.Provider,
    env: ContractsENV,
  ) {
    this.deployment = getDeployment(env);
  }

  getDeal(address: string): Deal {
    return Deal__factory.connect(address, this.signerOrProvider);
  }

  getCore(): ICore {
    return Core__factory.connect(this.deployment.core, this.signerOrProvider);
  }

  getMarket(): IMarket {
    return Market__factory.connect(
      this.deployment.market,
      this.signerOrProvider,
    );
  }

  getDealFactory(): IDealFactory {
    return DealFactory__factory.connect(
      this.deployment.dealFactory,
      this.signerOrProvider,
    );
  }

  getCapacity(): ICapacity {
    return Capacity__factory.connect(
      this.deployment.capacity,
      this.signerOrProvider,
    );
  }

  getUSDC(): IERC20 {
    return ERC20__factory.connect(this.deployment.usdc, this.signerOrProvider);
  }

  getMulticall3(): Multicall3 {
    return Multicall3__factory.connect(
      this.deployment.multicall3,
      this.signerOrProvider,
    );
  }
}
