import { Command, Flags } from "@oclif/core";
import { BigNumber } from "ethers";
import { getDeveloperContract, getWallet } from "../../../provider/provider";

export default class FLT extends Command {
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
      description: "Amount of FLT to receive",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(FLT);

    const privKey = flags.privKey;
    const value = args.value;

    const wallet = getWallet(privKey);
    const dev = getDeveloperContract(wallet);

    let v = BigNumber.from(value).mul(BigNumber.from(10).pow(18));
    const tx = await (await dev.receiveFLT(wallet.address, v)).wait();

    this.log(`Tx hash: ${tx.transactionHash}`);
  }
}
