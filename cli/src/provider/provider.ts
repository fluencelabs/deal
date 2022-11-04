import { ethers } from "ethers";
import { CONFIG } from "../config/config";
import {
  AquaProxy,
  AquaProxy__factory,
  Deal,
  DealFactory,
  DealFactory__factory,
  Deal__factory,
  DeveloperFaucet,
  DeveloperFaucet__factory,
  ERC20,
  ERC20__factory,
} from "../typechain-types";

function getWallet(privKey: string): ethers.Wallet {
  return new ethers.Wallet(
    privKey,
    new ethers.providers.JsonRpcProvider("http://localhost:8545")
  );
}

function getFactoryContract(wallet: ethers.Wallet): DealFactory {
  return DealFactory__factory.connect(CONFIG.dealFactoryAddress, wallet);
}

function getAquaProxy(address: string, wallet: ethers.Wallet): AquaProxy {
  return AquaProxy__factory.connect(address, wallet);
}

function getDeveloperContract(wallet: ethers.Wallet): DeveloperFaucet {
  return DeveloperFaucet__factory.connect(
    CONFIG.developerFaucetAddress,
    wallet
  );
}

function getDealContract(dealAddress: string, wallet: ethers.Wallet): Deal {
  return Deal__factory.connect(dealAddress, wallet);
}

async function getUSDContract(wallet: ethers.Wallet): Promise<ERC20> {
  const dev = getDeveloperContract(wallet);
  return ERC20__factory.connect(await dev.usdToken(), wallet);
}

async function getFLTContract(wallet: ethers.Wallet): Promise<ERC20> {
  const dev = getDeveloperContract(wallet);
  return ERC20__factory.connect(await dev.fluenceToken(), wallet);
}

export {
  getWallet,
  getAquaProxy,
  getFactoryContract,
  getDeveloperContract,
  getUSDContract,
  getFLTContract,
  getDealContract,
};
