/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IERC1822ProxiableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1822ProxiableUpgradeable__factory>;
    getContractFactory(
      name: "IERC1967Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1967Upgradeable__factory>;
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
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC1822Proxiable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1822Proxiable__factory>;
    getContractFactory(
      name: "IERC1967",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1967__factory>;
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
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "Multicall",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Multicall__factory>;
    getContractFactory(
      name: "CapacityCommitment",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.CapacityCommitment__factory>;
    getContractFactory(
      name: "Core",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Core__factory>;
    getContractFactory(
      name: "DealFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DealFactory__factory>;
    getContractFactory(
      name: "EpochController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EpochController__factory>;
    getContractFactory(
      name: "GlobalConst",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GlobalConst__factory>;
    getContractFactory(
      name: "ICore",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICore__factory>;
    getContractFactory(
      name: "IDealFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDealFactory__factory>;
    getContractFactory(
      name: "IEpochController",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IEpochController__factory>;
    getContractFactory(
      name: "IGlobalConst",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IGlobalConst__factory>;
    getContractFactory(
      name: "IMatcher",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IMatcher__factory>;
    getContractFactory(
      name: "Market",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Market__factory>;
    getContractFactory(
      name: "Matcher",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Matcher__factory>;
    getContractFactory(
      name: "Config",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Config__factory>;
    getContractFactory(
      name: "Deal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Deal__factory>;
    getContractFactory(
      name: "IConfig",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IConfig__factory>;
    getContractFactory(
      name: "IDeal",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IDeal__factory>;
    getContractFactory(
      name: "IWorkerManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IWorkerManager__factory>;
    getContractFactory(
      name: "WorkerManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.WorkerManager__factory>;
    getContractFactory(
      name: "OwnableFaucet",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableFaucet__factory>;
    getContractFactory(
      name: "TestERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestERC20__factory>;
    getContractFactory(
      name: "OwnableUpgradableDiamond",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableUpgradableDiamond__factory>;

    getContractAt(
      name: "IERC1822ProxiableUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1822ProxiableUpgradeable>;
    getContractAt(
      name: "IERC1967Upgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1967Upgradeable>;
    getContractAt(
      name: "IBeaconUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeaconUpgradeable>;
    getContractAt(
      name: "ERC1967UpgradeUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967UpgradeUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "UUPSUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.UUPSUpgradeable>;
    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC1822Proxiable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1822Proxiable>;
    getContractAt(
      name: "IERC1967",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1967>;
    getContractAt(
      name: "IBeacon",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeacon>;
    getContractAt(
      name: "ERC1967Proxy",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967Proxy>;
    getContractAt(
      name: "ERC1967Upgrade",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967Upgrade>;
    getContractAt(
      name: "Proxy",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Proxy>;
    getContractAt(
      name: "Initializable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "UUPSUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.UUPSUpgradeable>;
    getContractAt(
      name: "ERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20Permit",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "Multicall",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Multicall>;
    getContractAt(
      name: "CapacityCommitment",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.CapacityCommitment>;
    getContractAt(
      name: "Core",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Core>;
    getContractAt(
      name: "DealFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.DealFactory>;
    getContractAt(
      name: "EpochController",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.EpochController>;
    getContractAt(
      name: "GlobalConst",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.GlobalConst>;
    getContractAt(
      name: "ICore",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ICore>;
    getContractAt(
      name: "IDealFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IDealFactory>;
    getContractAt(
      name: "IEpochController",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IEpochController>;
    getContractAt(
      name: "IGlobalConst",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IGlobalConst>;
    getContractAt(
      name: "IMatcher",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IMatcher>;
    getContractAt(
      name: "Market",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Market>;
    getContractAt(
      name: "Matcher",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Matcher>;
    getContractAt(
      name: "Config",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Config>;
    getContractAt(
      name: "Deal",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Deal>;
    getContractAt(
      name: "IConfig",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IConfig>;
    getContractAt(
      name: "IDeal",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IDeal>;
    getContractAt(
      name: "IWorkerManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IWorkerManager>;
    getContractAt(
      name: "WorkerManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.WorkerManager>;
    getContractAt(
      name: "OwnableFaucet",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableFaucet>;
    getContractAt(
      name: "TestERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TestERC20>;
    getContractAt(
      name: "OwnableUpgradableDiamond",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableUpgradableDiamond>;

    deployContract(
      name: "IERC1822ProxiableUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1822ProxiableUpgradeable>;
    deployContract(
      name: "IERC1967Upgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1967Upgradeable>;
    deployContract(
      name: "IBeaconUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBeaconUpgradeable>;
    deployContract(
      name: "ERC1967UpgradeUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967UpgradeUpgradeable>;
    deployContract(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Initializable>;
    deployContract(
      name: "UUPSUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UUPSUpgradeable>;
    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC1822Proxiable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1822Proxiable>;
    deployContract(
      name: "IERC1967",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1967>;
    deployContract(
      name: "IBeacon",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBeacon>;
    deployContract(
      name: "ERC1967Proxy",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967Proxy>;
    deployContract(
      name: "ERC1967Upgrade",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967Upgrade>;
    deployContract(
      name: "Proxy",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Proxy>;
    deployContract(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Initializable>;
    deployContract(
      name: "UUPSUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UUPSUpgradeable>;
    deployContract(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Permit>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "Multicall",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Multicall>;
    deployContract(
      name: "CapacityCommitment",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CapacityCommitment>;
    deployContract(
      name: "Core",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Core>;
    deployContract(
      name: "DealFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DealFactory>;
    deployContract(
      name: "EpochController",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.EpochController>;
    deployContract(
      name: "GlobalConst",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GlobalConst>;
    deployContract(
      name: "ICore",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ICore>;
    deployContract(
      name: "IDealFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDealFactory>;
    deployContract(
      name: "IEpochController",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IEpochController>;
    deployContract(
      name: "IGlobalConst",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IGlobalConst>;
    deployContract(
      name: "IMatcher",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IMatcher>;
    deployContract(
      name: "Market",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Market>;
    deployContract(
      name: "Matcher",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Matcher>;
    deployContract(
      name: "Config",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Config>;
    deployContract(
      name: "Deal",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Deal>;
    deployContract(
      name: "IConfig",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IConfig>;
    deployContract(
      name: "IDeal",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDeal>;
    deployContract(
      name: "IWorkerManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IWorkerManager>;
    deployContract(
      name: "WorkerManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.WorkerManager>;
    deployContract(
      name: "OwnableFaucet",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OwnableFaucet>;
    deployContract(
      name: "TestERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TestERC20>;
    deployContract(
      name: "OwnableUpgradableDiamond",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OwnableUpgradableDiamond>;

    deployContract(
      name: "IERC1822ProxiableUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1822ProxiableUpgradeable>;
    deployContract(
      name: "IERC1967Upgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1967Upgradeable>;
    deployContract(
      name: "IBeaconUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBeaconUpgradeable>;
    deployContract(
      name: "ERC1967UpgradeUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967UpgradeUpgradeable>;
    deployContract(
      name: "Initializable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Initializable>;
    deployContract(
      name: "UUPSUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UUPSUpgradeable>;
    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC1822Proxiable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1822Proxiable>;
    deployContract(
      name: "IERC1967",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1967>;
    deployContract(
      name: "IBeacon",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBeacon>;
    deployContract(
      name: "ERC1967Proxy",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967Proxy>;
    deployContract(
      name: "ERC1967Upgrade",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967Upgrade>;
    deployContract(
      name: "Proxy",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Proxy>;
    deployContract(
      name: "Initializable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Initializable>;
    deployContract(
      name: "UUPSUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UUPSUpgradeable>;
    deployContract(
      name: "ERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "IERC20Metadata",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "IERC20Permit",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Permit>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "Multicall",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Multicall>;
    deployContract(
      name: "CapacityCommitment",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.CapacityCommitment>;
    deployContract(
      name: "Core",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Core>;
    deployContract(
      name: "DealFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.DealFactory>;
    deployContract(
      name: "EpochController",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.EpochController>;
    deployContract(
      name: "GlobalConst",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.GlobalConst>;
    deployContract(
      name: "ICore",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ICore>;
    deployContract(
      name: "IDealFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDealFactory>;
    deployContract(
      name: "IEpochController",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IEpochController>;
    deployContract(
      name: "IGlobalConst",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IGlobalConst>;
    deployContract(
      name: "IMatcher",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IMatcher>;
    deployContract(
      name: "Market",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Market>;
    deployContract(
      name: "Matcher",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Matcher>;
    deployContract(
      name: "Config",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Config>;
    deployContract(
      name: "Deal",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Deal>;
    deployContract(
      name: "IConfig",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IConfig>;
    deployContract(
      name: "IDeal",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IDeal>;
    deployContract(
      name: "IWorkerManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IWorkerManager>;
    deployContract(
      name: "WorkerManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.WorkerManager>;
    deployContract(
      name: "OwnableFaucet",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OwnableFaucet>;
    deployContract(
      name: "TestERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TestERC20>;
    deployContract(
      name: "OwnableUpgradableDiamond",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OwnableUpgradableDiamond>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
