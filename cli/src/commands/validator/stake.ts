import { Command, Flags } from "@oclif/core";
import { BigNumber } from "ethers";
import {
  getDealContract,
  getFLTContract,
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
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Stake);

    const privKey = flags.privKey;
    const dealAddress = args.dealAddress;
    const stakeAmount = args.amount;

    const wallet = getWallet(privKey);
    const deal = getDealContract(dealAddress, wallet);
    const flt = await getFLTContract(wallet);

    //TODO: check if balance < 0

    let v = BigNumber.from(10).mul(BigNumber.from(10).pow(18));
    await (await flt.approve(dealAddress, v)).wait();
    await (await deal.stake()).wait();
  }
}
