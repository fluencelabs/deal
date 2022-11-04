import { Command, Flags } from "@oclif/core";
import { CONFIG } from "../../config/config";
import { DealFactory__factory } from "../../typechain-types";
import { readFileSync } from "fs";
import { BigNumber, ethers } from "ethers";
import {
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
      name: "dealAddress",
      description: "Deal address",
      required: true,
    },
    {
      name: "particle",
      description: "Fluence particle",
      required: true,
    },
    {
      name: "validator",
      description: "Validator address",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Stake);

    const particle = JSON.parse(args.particle);
    const dealAddress = args.dealAddress;
    const validator = args.validator;

    const privKey = flags.privKey;

    const wallet = getWallet(privKey);
    const dealFacroty = getFactoryContract(wallet);

    const deal = getDealContract(dealAddress, wallet);

    const tx = await deal.slash(particle, validator);

    await tx.wait();
  }
}
