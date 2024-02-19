import dns from "node:dns/promises";
import { type ContractsENV, DealClient } from "@fluencelabs/deal-ts-clients";
import { ethers, JsonRpcProvider, JsonRpcSigner } from "ethers";
import { describe, test } from "vitest";
import { DEFAULT_CONFIRMATIONS } from "./constants.js";
import { registerMarketOffer } from "./helpers.js";
import { randomCID } from "./fixtures.js";

const ip = await dns.lookup("akim-dev.dev.fluence.dev");
const TEST_NETWORK: ContractsENV = "local";
const TEST_RPC_URL = `http://${ip.address}:8545`;
const DEFAULT_TEST_TIMEOUT = 180000;

let provider: JsonRpcProvider;
let signer: JsonRpcSigner;
let contractsClient: DealClient;

describe(
  "Deal tests",
  () => {
    test("Deal creation", async () => {
      const marketContract = await contractsClient.getMarket();
      const capacityContract = await contractsClient.getCapacity();
      const dealContract = await contractsClient.getDeal("a");
      const paymentToken = await contractsClient.getUSDC();
      const paymentTokenAddress = await paymentToken.getAddress();

      const signerAddress = await signer.getAddress();

      const registeredOffer = await registerMarketOffer(
        marketContract,
        signerAddress,
        paymentTokenAddress,
      );

      await (
        await marketContract.deployDeal(
          randomCID(),
          registeredOffer.paymentToken,
          minWorkersDeal,
          targetWorkersDeal,
          maxWorkerPerProviderDeal,
          pricePerWorkerEpochDeal,
          registeredOffer.effectors,
          0,
          [],
        )
      ).wait(DEFAULT_CONFIRMATIONS);

      dealContract.deposit;
      dealContract.withdraw;
      dealContract.targetWorkers;
    });
  },
  DEFAULT_TEST_TIMEOUT,
);
