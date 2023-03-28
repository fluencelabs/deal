/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "OwnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableUpgradeable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContextUpgradeable__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC1822Proxiable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1822Proxiable__factory>;
    getContractFactory(
      name: "IBeacon",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBeacon__factory>;
    getContractFactory(
      name: "ERC1967Proxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967Proxy__factory>;
    getContractFactory(
      name: "ERC1967Upgrade",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967Upgrade__factory>;
    getContractFactory(
      name: "Proxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Proxy__factory>;
    getContractFactory(
      name: "UUPSUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UUPSUpgradeable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "Multicall",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Multicall__factory>;
    getContractFactory(
      name: "AuroraSdk",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AuroraSdk__factory>;
    getContractFactory(
      name: "Codec",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Codec__factory>;
    getContractFactory(
      name: "Utils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Utils__factory>;
    getContractFactory(
      name: "AquaProxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AquaProxy__factory>;
    getContractFactory(
      name: "Core",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Core__factory>;
    getContractFactory(
      name: "CoreState",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CoreState__factory>;
    getContractFactory(
      name: "EpochManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EpochManager__factory>;
    getContractFactory(
      name: "Deal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Deal__factory>;
    getContractFactory(
      name: "DealConfig",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DealConfig__factory>;
    getContractFactory(
      name: "IDealConfig",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDealConfig__factory>;
    getContractFactory(
      name: "IPaymentManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPaymentManager__factory>;
    getContractFactory(
      name: "IWithdrawManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWithdrawManager__factory>;
    getContractFactory(
      name: "IWorkersManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWorkersManager__factory>;
    getContractFactory(
      name: "Payment",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Payment__factory>;
    getContractFactory(
      name: "WithdrawManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WithdrawManager__factory>;
    getContractFactory(
      name: "WorkersManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WorkersManager__factory>;
    getContractFactory(
      name: "DealConfigInternal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DealConfigInternal__factory>;
    getContractFactory(
      name: "PaymentInternal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PaymentInternal__factory>;
    getContractFactory(
      name: "StatusControllerInternal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StatusControllerInternal__factory>;
    getContractFactory(
      name: "WorkersManagerInternal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WorkersManagerInternal__factory>;
    getContractFactory(
      name: "DeveloperFaucet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DeveloperFaucet__factory>;
    getContractFactory(
      name: "OwnableFaucet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableFaucet__factory>;
    getContractFactory(
      name: "TestERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestERC20__factory>;
    getContractFactory(
      name: "DealFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DealFactory__factory>;
    getContractFactory(
      name: "MockParticleVerifyer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockParticleVerifyer__factory>;
    getContractFactory(
      name: "IParticleVerifyer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IParticleVerifyer__factory>;

    getContractAt(
      name: "OwnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC1822Proxiable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1822Proxiable>;
    getContractAt(
      name: "IBeacon",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeacon>;
    getContractAt(
      name: "ERC1967Proxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967Proxy>;
    getContractAt(
      name: "ERC1967Upgrade",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967Upgrade>;
    getContractAt(
      name: "Proxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Proxy>;
    getContractAt(
      name: "UUPSUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UUPSUpgradeable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Permit",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "Multicall",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Multicall>;
    getContractAt(
      name: "AuroraSdk",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AuroraSdk>;
    getContractAt(
      name: "Codec",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Codec>;
    getContractAt(
      name: "Utils",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Utils>;
    getContractAt(
      name: "AquaProxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AquaProxy>;
    getContractAt(
      name: "Core",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Core>;
    getContractAt(
      name: "CoreState",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.CoreState>;
    getContractAt(
      name: "EpochManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.EpochManager>;
    getContractAt(
      name: "Deal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Deal>;
    getContractAt(
      name: "DealConfig",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DealConfig>;
    getContractAt(
      name: "IDealConfig",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IDealConfig>;
    getContractAt(
      name: "IPaymentManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPaymentManager>;
    getContractAt(
      name: "IWithdrawManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWithdrawManager>;
    getContractAt(
      name: "IWorkersManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWorkersManager>;
    getContractAt(
      name: "Payment",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Payment>;
    getContractAt(
      name: "WithdrawManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WithdrawManager>;
    getContractAt(
      name: "WorkersManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WorkersManager>;
    getContractAt(
      name: "DealConfigInternal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DealConfigInternal>;
    getContractAt(
      name: "PaymentInternal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.PaymentInternal>;
    getContractAt(
      name: "StatusControllerInternal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.StatusControllerInternal>;
    getContractAt(
      name: "WorkersManagerInternal",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.WorkersManagerInternal>;
    getContractAt(
      name: "DeveloperFaucet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DeveloperFaucet>;
    getContractAt(
      name: "OwnableFaucet",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableFaucet>;
    getContractAt(
      name: "TestERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TestERC20>;
    getContractAt(
      name: "DealFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DealFactory>;
    getContractAt(
      name: "MockParticleVerifyer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockParticleVerifyer>;
    getContractAt(
      name: "IParticleVerifyer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IParticleVerifyer>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
