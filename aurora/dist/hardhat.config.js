"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const config = {
    solidity: {
        version: "0.8.17",
        settings: {
            viaIR: false,
        },
    },
    networks: {
        hardhat: {
            accounts: {
                passphrase: "test test test test claim trade stairs crew inspire obey veteran budget",
            },
        },
        polygonMumbai: {
            url: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
            accounts: [process.env["AURORA_PRIVATE_KEY"] ?? "0x0000000000000000000000000000000000000000000000000000000000000000"],
        },
        auroraTestnet: {
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
};
exports.default = config;
