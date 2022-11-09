import { Command, Flags } from "@oclif/core";
import { BigNumber, ethers } from "ethers";
import {
  getDealContract,
  getUSDContract,
  getWallet,
} from "../../provider/provider";

export default class Deposit extends Command {
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
      name: "value",
      description: "Amount of USD to deposit",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Deposit);

    const privKey = flags.privKey;
    const dealAddress = args.dealAddress;
    const value = args.value;

    const wallet = getWallet(privKey);
    const deal = getDealContract(dealAddress, wallet);
    const usd = await getUSDContract(wallet);

    let v = BigNumber.from(value).mul(BigNumber.from(10).pow(18));
    await (await usd.approve(dealAddress, v)).wait();
    await (await deal.deposit(v)).wait();
  }
}
