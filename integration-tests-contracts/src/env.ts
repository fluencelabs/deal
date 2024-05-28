import { ethers } from "ethers";
import { type ContractsENV, DealClient } from "@fluencelabs/deal-ts-clients";
import { config } from "dotenv";

config({ path: [".env", ".env.local"] });

const TEST_NETWORK: ContractsENV = "local";

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
export const signer = await provider.getSigner();
export const delegator = await provider.getSigner(1);
export const contractsClient = new DealClient(signer, TEST_NETWORK);
export const marketContract = contractsClient.getMarket();
export const capacityContract = contractsClient.getCapacity();
export const dealFactoryContract = contractsClient.getDealFactory();
export const coreContract = contractsClient.getCore();
export const paymentToken = contractsClient.getUSDC();
export const paymentTokenAddress = await contractsClient.getUSDC().getAddress();
export const signerAddress = await signer.getAddress();
export const delegatorAddress = await delegator.getAddress();
