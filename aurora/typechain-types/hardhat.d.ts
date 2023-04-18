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
      name: "IERC1822ProxiableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1822ProxiableUpgradeable__factory>;
    getContractFactory(
      name: "IBeaconUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBeaconUpgradeable__factory>;
    getContractFactory(
      name: "ERC1967UpgradeUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967UpgradeUpgradeable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "UUPSUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UUPSUpgradeable__factory>;
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
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
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
      name: "ModuleBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ModuleBase__factory>;
    getContractFactory(
      name: "ModuleProxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ModuleProxy__factory>;
    getContractFactory(
      name: "Config",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Config__factory>;
    getContractFactory(
      name: "ConfigState",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ConfigState__factory>;
    getContractFactory(
      name: "Controller",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Controller__factory>;
    getContractFactory(
      name: "Core",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Core__factory>;
    getContractFactory(
      name: "IConfig",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IConfig__factory>;
    getContractFactory(
      name: "IController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IController__factory>;
    getContractFactory(
      name: "IControllerInitializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IControllerInitializable__factory>;
    getContractFactory(
      name: "ICore",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICore__factory>;
    getContractFactory(
      name: "ICoreInitializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICoreInitializable__factory>;
    getContractFactory(
      name: "IPayment",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPayment__factory>;
    getContractFactory(
      name: "IStatusController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IStatusController__factory>;
    getContractFactory(
      name: "IWorkers",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWorkers__factory>;
    getContractFactory(
      name: "Payment",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Payment__factory>;
    getContractFactory(
      name: "StatusController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StatusController__factory>;
    getContractFactory(
      name: "Workers",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Workers__factory>;
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
      name: "AquaProxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AquaProxy__factory>;
    getContractFactory(
      name: "DealFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DealFactory__factory>;
    getContractFactory(
      name: "DealFactoryState",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DealFactoryState__factory>;
    getContractFactory(
      name: "EpochManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EpochManager__factory>;
    getContractFactory(
      name: "GlobalConfig",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GlobalConfig__factory>;
    getContractFactory(
      name: "GlobalConfigState",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GlobalConfigState__factory>;
    getContractFactory(
      name: "IEpochManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IEpochManager__factory>;
    getContractFactory(
      name: "IFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IFactory__factory>;
    getContractFactory(
      name: "IGlobalConfig",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IGlobalConfig__factory>;
    getContractFactory(
      name: "IMatcher",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IMatcher__factory>;
    getContractFactory(
      name: "IParticleVerifyer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IParticleVerifyer__factory>;
    getContractFactory(
      name: "Matcher",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Matcher__factory>;
    getContractFactory(
      name: "MatcherState",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MatcherState__factory>;
    getContractFactory(
      name: "AVLMock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AVLMock__factory>;
    getContractFactory(
      name: "MockParticleVerifyer",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.MockParticleVerifyer__factory>;

    getContractAt(
      name: "OwnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableUpgradeable>;
    getContractAt(
      name: "IERC1822ProxiableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1822ProxiableUpgradeable>;
    getContractAt(
      name: "IBeaconUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeaconUpgradeable>;
    getContractAt(
      name: "ERC1967UpgradeUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967UpgradeUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "UUPSUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.UUPSUpgradeable>;
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
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
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
      name: "ModuleBase",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ModuleBase>;
    getContractAt(
      name: "ModuleProxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ModuleProxy>;
    getContractAt(
      name: "Config",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Config>;
    getContractAt(
      name: "ConfigState",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ConfigState>;
    getContractAt(
      name: "Controller",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Controller>;
    getContractAt(
      name: "Core",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Core>;
    getContractAt(
      name: "IConfig",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IConfig>;
    getContractAt(
      name: "IController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IController>;
    getContractAt(
      name: "IControllerInitializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IControllerInitializable>;
    getContractAt(
      name: "ICore",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICore>;
    getContractAt(
      name: "ICoreInitializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICoreInitializable>;
    getContractAt(
      name: "IPayment",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IPayment>;
    getContractAt(
      name: "IStatusController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IStatusController>;
    getContractAt(
      name: "IWorkers",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IWorkers>;
    getContractAt(
      name: "Payment",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Payment>;
    getContractAt(
      name: "StatusController",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.StatusController>;
    getContractAt(
      name: "Workers",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Workers>;
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
      name: "AquaProxy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AquaProxy>;
    getContractAt(
      name: "DealFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DealFactory>;
    getContractAt(
      name: "DealFactoryState",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DealFactoryState>;
    getContractAt(
      name: "EpochManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.EpochManager>;
    getContractAt(
      name: "GlobalConfig",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.GlobalConfig>;
    getContractAt(
      name: "GlobalConfigState",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.GlobalConfigState>;
    getContractAt(
      name: "IEpochManager",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IEpochManager>;
    getContractAt(
      name: "IFactory",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IFactory>;
    getContractAt(
      name: "IGlobalConfig",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IGlobalConfig>;
    getContractAt(
      name: "IMatcher",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IMatcher>;
    getContractAt(
      name: "IParticleVerifyer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IParticleVerifyer>;
    getContractAt(
      name: "Matcher",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Matcher>;
    getContractAt(
      name: "MatcherState",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MatcherState>;
    getContractAt(
      name: "AVLMock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AVLMock>;
    getContractAt(
      name: "MockParticleVerifyer",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.MockParticleVerifyer>;

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
