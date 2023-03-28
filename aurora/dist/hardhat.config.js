"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
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
                passphrase: "test test test test claim trade stairs crew inspire obey veteran budget",
            },
        },
        polygonMumbai: {
            url: "https://polygon-mumbai.blockpi.network/v1/rpc/public",
            accounts: [process.env["AURORA_PRIVATE_KEY"] ?? "0x0000000000000000000000000000000000000000000000000000000000000000"],
        },
    },
    etherscan: {
        apiKey: {
            polygonMumbai: process.env["ETHERSCAN_API_KEY"] ?? "",
        },
    },
};
exports.default = config;
