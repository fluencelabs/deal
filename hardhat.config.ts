import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ganache";
import * as dotenv from "dotenv";

dotenv.config();

const accounts = [
    process.env["PRIVATE_KEY"] ?? "0x0000000000000000000000000000000000000000000000000000000000000000",
]

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.19",
        settings: {
            viaIR: true,
            optimizer: {
                enabled: true,
                runs: 10000,
            },
        },
    },
    mocha: {
        parallel: false,
        asyncOnly: true,
        bail: true,
        timeout: 100000,
    },
    networks: {
        hardhat: {
            mining: {
                auto: true,
                interval: 1000,
            },
            accounts: {
                passphrase: "test test test test claim trade stairs crew inspire obey veteran budget",
            },
        },
        stage: {
            url: "https://rpc.ankr.com/polygon_mumbai",
            accounts: accounts,
        },
        testnet: {
            url: "https://rpc.ankr.com/polygon_mumbai",
            accounts: accounts,
        },
        kras: {
            url: "https://rpc.ankr.com/polygon_mumbai",
            accounts: accounts,
        },
        mumbai: {
            url: "https://rpc.ankr.com/polygon_mumbai",
            accounts: accounts,
        },
        ipcsubnet: {
            url: 'http://139.162.187.214:8545',
            accounts: accounts,
            chainId: 1404213532111849,
        },
        calibration: {  // Currently this network is use only for debugging.
            url: 'https://api.calibration.node.glif.io/rpc/v1',
            accounts: accounts,
            chainId: 314159,
            timeout: 1000000,  // recommended by IPC team.
        }

    },
    etherscan: {
        apiKey: {
            polygonMumbai: process.env["ETHERSCAN_API_KEY"] ?? "",
        },
    },
    gasReporter: {
        enabled: true,
    },
    paths: {
        deployments: "src/deployments",
    },
    typechain: {
        outDir: "src/typechain-types",
    },
};

export default config;
