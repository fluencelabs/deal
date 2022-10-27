import { Command, Flags } from "@oclif/core";
import { CONFIG } from "../../config/config";
import { DealFactory__factory } from "../../typechain-types";
import { readFileSync } from "fs";
import { ethers } from "ethers";
import {
  getFactoryContract,
  getUSDContract,
  getWallet,
} from "../../provider/provider";

export default class Create extends Command {
  static flags = {
    privKey: Flags.string({
      char: "p",
      description: "Your private key",
      required: true,
    }),
  };

  static args = [
    {
      name: "aquaScriptPath",
      description: "Path for aqua script",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Create);

    const privKey = flags.privKey;
    const aquaScriptPath = args.aquaScriptPath;

    let aquaScript = readFileSync(aquaScriptPath, "utf8");
    let hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(aquaScript));

    this.log("Aqua script hash: ", hash);

    const wallet = getWallet(privKey);
    const factory = await getFactoryContract(wallet);
    const tx = await factory.createDeal(
      (
        await getUSDContract(wallet)
      ).address,
      hash
    );
    const res = await tx.wait();

    const dealAddress = factory.interface.parseLog(
      res.logs.find((x) => factory.interface.parseLog(x).name === "CreateDeal")!
    ).args.addr;

    this.log(`Your deal contract: ${dealAddress}`);
  }
}
