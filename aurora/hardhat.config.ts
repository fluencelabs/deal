import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      forking: {
        url: "https://testnet.aurora.dev",
      },
    },
    localhost: {
      url: "http://localhost:8545",
    },
    aurora: {
      url: "https://testnet.aurora.dev",
      accounts: [
        process.env.AURORA_PRIVATE_KEY ??
          "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
    },
  },
};

export default config;
