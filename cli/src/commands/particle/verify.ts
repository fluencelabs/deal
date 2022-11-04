import { Command, Flags } from "@oclif/core";
import { CONFIG } from "../../config/config";
import { DealFactory__factory } from "../../typechain-types";
import { readFileSync } from "fs";
import { BigNumber, ethers } from "ethers";
import {
  getAquaProxy,
  getDealContract,
  getFactoryContract,
  getFLTContract,
  getUSDContract,
  getWallet,
} from "../../provider/provider";

export default class Stake extends Command {
  static flags = {
    privKey: Flags.string({
      char: "p",
      description: "Your private key",
      required: true,
    }),
  };

  static args = [
    {
      name: "particle",
      description: "Fluence particle",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Stake);

    const particle = JSON.parse(args.particle);
    const privKey = flags.privKey;

    const wallet = getWallet(privKey);
    const dealFacroty = getFactoryContract(wallet);
    const aquaProxyAddress = await dealFacroty.aquaProxy();

    const aquaProxy = getAquaProxy(aquaProxyAddress, wallet);

    const tx = await aquaProxy.verifyParticle(particle);

    await tx.wait();
    console.log("AquaProxy address: " + aquaProxyAddress);
    console.log("Tx hash: " + tx.hash);
  }
}
