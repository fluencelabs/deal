/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ICapacityCommitment,
  ICapacityCommitmentInterface,
} from "../ICapacityCommitment.js";

const _abi = [
  {
    type: "event",
    name: "CapacityCommitmentActivated",
    inputs: [
      {
        name: "commitmentId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CapacityCommitmentCreated",
    inputs: [
      {
        name: "peerId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "commitmentId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "delegator",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "rewardDelegationRate",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "fltCCCollateralPerUnit",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CapacityCommitmentFinished",
    inputs: [
      {
        name: "commitmentId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CapacityCommitmentRemoved",
    inputs: [
      {
        name: "commitmentId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CollateralDeposited",
    inputs: [
      {
        name: "commitmentId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "totalCollateral",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProofSubmitted",
    inputs: [
      {
        name: "commitmentId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "unitId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RewardWithdrawn",
    inputs: [
      {
        name: "commitmentId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
] as const;

export class ICapacityCommitment__factory {
  static readonly abi = _abi;
  static createInterface(): ICapacityCommitmentInterface {
    return new Interface(_abi) as ICapacityCommitmentInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ICapacityCommitment {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ICapacityCommitment;
  }
}
