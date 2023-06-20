import type { ethers } from "ethers";
import { DEAL_CONFIG, type ChainNetwork } from "./config.js";
import {
  GlobalConfig__factory,
  type DealFactory,
  DealFactory__factory,
  type ERC20,
  ERC20__factory,
  type GlobalConfig,
  type Matcher,
  Matcher__factory,
} from "./types";

export class GlobalContracts {
  constructor(
    private provider: ethers.ContractRunner,
    private network: ChainNetwork
  ) {}

  getGlobalConfig(): GlobalConfig {
    return GlobalConfig__factory.connect(
      DEAL_CONFIG[this.network].globalConfig,
      this.provider
    );
  }

  getFactory(): DealFactory {
    return DealFactory__factory.connect(
      DEAL_CONFIG[this.network].dealFactoryAddress,
      this.provider
    );
  }

  async getMatcher(): Promise<Matcher> {
    const config = this.getGlobalConfig();
    return Matcher__factory.connect(await config.matcher(), this.provider);
  }

  async getTUSD(): Promise<ERC20> {
    return ERC20__factory.connect(
      DEAL_CONFIG[this.network].testUSDToken,
      this.provider
    );
  }

  async getFLT(): Promise<ERC20> {
    return ERC20__factory.connect(
      DEAL_CONFIG[this.network].fltToken,
      this.provider
    );
  }
}
