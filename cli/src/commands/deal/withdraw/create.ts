import { Command, Flags } from "@oclif/core";
import { readFileSync } from "fs";
import { ethers } from "ethers";
import { getDealContract, getWallet } from "../../../provider/provider";

export default class CreateWithdraw extends Command {
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
    const { args, flags } = await this.parse(CreateWithdraw);

    const privKey = flags.privKey;
    const dealAddress = args.dealAddress;

    const wallet = getWallet(privKey);
    const deal = getDealContract(dealAddress, wallet);

    await (await deal.createWithdrawRequest()).wait();

    this.log("Your request created.");
  }
}
