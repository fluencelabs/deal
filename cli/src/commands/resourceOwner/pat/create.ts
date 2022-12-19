import { Command, Flags } from "@oclif/core";
import { BigNumber, ethers } from "ethers";
import {
  getDealContract,
  getFLTContract,
  getWallet,
} from "../../../provider/provider";

export default class CreatePAT extends Command {
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
    const { args, flags } = await this.parse(CreatePAT);

    const privKey = flags.privKey;
    const dealAddress = args.dealAddress;

    const wallet = getWallet(privKey);
    const deal = getDealContract(dealAddress, wallet);
    const flt = await getFLTContract(wallet);

    let v = (await deal.settings()).requiredStake;
    const approveTx = await flt.approve(dealAddress, v);

    if ((await deal.getRole(wallet.address)) == 0) {
      await (await deal.register()).wait();
    }
    await (await deal.deposit(flt.address, v)).wait();
    const res = await (await deal.addProviderToken(approveTx.hash)).wait();

    const patId = deal.interface.parseLog(
      res.logs.find((x) => {
        return x.topics[0] == deal.interface.getEventTopic("AddProviderToken");
      })!
    ).args.id;

    this.log(`PAT ID: ${patId}`);
  }
}
