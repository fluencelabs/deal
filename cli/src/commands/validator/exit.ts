import { Command, Flags } from "@oclif/core";
import { CONFIG } from "../../config/config";
import { DealFactory__factory } from "../../typechain-types";
import { readFileSync } from "fs";
import { ethers } from "ethers";
import {
  getDealContract,
  getFactoryContract,
  getFLTContract,
  getUSDContract,
  getWallet,
} from "../../provider/provider";

export default class Exit extends Command {
  static flags = {
    privKey: Flags.string({
      char: "p",
      description: "Your private key",
      required: true,
    }),
  };

  static args = [
    {
      name: "dealAddress",
      description: "Deal address",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Exit);

    const privKey = flags.privKey;
    const dealAddress = args.dealAddress;
    const particle = args.particle;

    const wallet = getWallet(privKey);
    const deal = getDealContract(dealAddress, wallet);

    await (await deal.exit(JSON.parse(particle), wallet.address)).wait();
  }
}
