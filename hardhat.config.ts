import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.17",
        settings: {
            viaIR: true,
            optimizer: {
                enabled: true,
                runs: 10000,
            },
        },
    },
    networks: {
        hardhat: {
            accounts: {
                passphrase: "test test test test claim trade stairs crew inspire obey veteran budget",
            },
        },
        testnet: {
            url: "https://testnet.aurora.dev",
            accounts: [process.env["PRIVATE_KEY"] ?? "0x0000000000000000000000000000000000000000000000000000000000000000"],
        },
    },
    etherscan: {
        apiKey: {
            polygonMumbai: process.env["ETHERSCAN_API_KEY"] ?? "",
        },
    },
    gasReporter: {
        enabled: true,
    },
    typechain: {
        outDir: "src/typechain-types",
    },
};

export default config;
