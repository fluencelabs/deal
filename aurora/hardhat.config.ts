import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      viaIR: false,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
      },
      accounts: {
        passphrase:
          "test test test test claim trade stairs crew inspire obey veteran budget",
      },
    },
    testnet: {
      url: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
      accounts: [
        process.env.AURORA_PRIVATE_KEY ??
          "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
    },
  },
};

export default config;
