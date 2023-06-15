import type { ethers } from "ethers";
import { DEAL_CONFIG, type ChainNetwork } from "./config";
import {
  GlobalConfig__factory,
  type DealFactory,
  DealFactory__factory,
  type ERC20,
  ERC20__factory,
  type GlobalConfig,
  type Matcher,
  Matcher__factory,
} from "@fluencelabs/deal-contracts";

export class GlobalContracts {
  constructor(private signer: ethers.Signer, private network: ChainNetwork) {}

  getGlobalConfig(): GlobalConfig {
    return GlobalConfig__factory.connect(
      DEAL_CONFIG[this.network].globalConfig,
      this.signer
    );
  }

  getFactory(): DealFactory {
    return DealFactory__factory.connect(
      DEAL_CONFIG[this.network].dealFactoryAddress,
      this.signer
    );
  }

  async getMatcher(): Promise<Matcher> {
    const config = this.getGlobalConfig();
    return Matcher__factory.connect(await config.matcher(), this.signer);
  }

  async getTUSD(): Promise<ERC20> {
    return ERC20__factory.connect(
      DEAL_CONFIG[this.network].testUSDToken,
      this.signer
    );
  }

  async getFLT(): Promise<ERC20> {
    return ERC20__factory.connect(
      DEAL_CONFIG[this.network].fltToken,
      this.signer
    );
  }
}
