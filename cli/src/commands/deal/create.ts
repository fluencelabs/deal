import { Command, Flags } from "@oclif/core";
import { readFileSync } from "fs";
import { BigNumber, ethers, utils } from "ethers";
import {
  getFactoryContract,
  getUSDContract,
  getWallet,
} from "../../provider/provider";
import console = require("console");

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
      name: "subnetId",
      description: "Subnet ID for deal",
      required: true,
    },
    {
      name: "pricePerEpoch",
      description: "price per epoch",
      required: true,
    },
    {
      name: "requiredStake",
      description: "required stake for a peer",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Create);

    const wallet = getWallet(flags.privKey);
    const factory = await getFactoryContract(wallet);
    const tx = await factory.createDeal(
      utils.keccak256(utils.toUtf8Bytes(args.subnetId)), //TODO: base64?
      {
        paymentToken: (await getUSDContract(wallet)).address,
        pricePerEpoch: BigNumber.from(args.pricePerEpoch).mul(
          BigNumber.from(10).pow(18)
        ),
        requiredStake: BigNumber.from(args.requiredStake).mul(
          BigNumber.from(10).pow(18)
        ),
      }
    );
    const res = await tx.wait();

    const dealAddress = factory.interface.parseLog(
      res.logs.find((x) => {
        return x.topics[0] == factory.interface.getEventTopic("CreateDeal");
      })!
    ).args.deal;

    this.log(`Your deal contract: ${dealAddress}`);
  }
}
