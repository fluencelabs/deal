/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  EpochController,
  EpochControllerInterface,
} from "../../../src/core/EpochController";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    inputs: [],
    name: "currentEpoch",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "epochDuration",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60808060405234610016576101a7908161001c8239f35b600080fdfe608080604052600436101561001357600080fd5b600090813560e01c9081634ff0876a14610104575080637358c57a146100d95763766718081461004257600080fd5b346100d657806003193601126100d6576000805160206101528339815191525442034281116100c257600080516020610132833981519152549081156100ae5704600101908160011161009a57602082604051908152f35b634e487b7160e01b81526011600452602490fd5b634e487b7160e01b83526012600452602483fd5b634e487b7160e01b82526011600452602482fd5b80fd5b50346100d657806003193601126100d657602060008051602061015283398151915254604051908152f35b90503461012d578160031936011261012d57602090600080516020610132833981519152548152f35b5080fdfe7d4f8ec43464738265ced6b7ed5f90007e9b7c34318bdd82d9249328b50bd3587d4f8ec43464738265ced6b7ed5f90007e9b7c34318bdd82d9249328b50bd357a264697066735822122056c3d657e833ab2e3a5e0e843c948ee566a743107e86d8ff1d0db0c1138a7e6564736f6c63430008130033";

type EpochControllerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EpochControllerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EpochController__factory extends ContractFactory {
  constructor(...args: EpochControllerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      EpochController & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EpochController__factory {
    return super.connect(runner) as EpochController__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EpochControllerInterface {
    return new Interface(_abi) as EpochControllerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): EpochController {
    return new Contract(address, _abi, runner) as unknown as EpochController;
  }
}