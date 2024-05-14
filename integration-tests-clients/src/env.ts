import { ethers } from "ethers";
import { type ContractsENV, DealClient } from "@fluencelabs/deal-ts-clients";
import { config } from "dotenv";

config({ path: [".env", ".env.local"] });

const TEST_NETWORK: ContractsENV = "local";

export const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
