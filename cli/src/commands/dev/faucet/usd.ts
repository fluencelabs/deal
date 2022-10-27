import { Command, Flags } from "@oclif/core";
import { readFileSync } from "fs";
import { BigNumber, ethers } from "ethers";
import { getDeveloperContract, getWallet } from "../../../provider/provider";

export default class USD extends Command {
  static flags = {
    privKey: Flags.string({
      char: "p",
      description: "Your private key",
      required: true,
    }),
  };

  static args = [
    {
      name: "value",
      description: "Amount of USD to receive",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(USD);

    const privKey = flags.privKey;
    const value = args.value;

    const wallet = getWallet(privKey);
    const dev = getDeveloperContract(wallet);

    let v = BigNumber.from(value).mul(BigNumber.from(10).pow(18));
    const tx = await (await dev.receiveUSD(wallet.address, v)).wait();

    this.log(`Tx hash: ${tx.transactionHash}`);
  }
}
