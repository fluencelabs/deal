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
} from "../../../contracts/core/EpochController";

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
  "0x6080806040523461001657610254908161001c8239f35b600080fdfe608080604052600436101561001357600080fd5b600090813560e01c9081634ff0876a146101c1575080637358c57a146101665763766718081461004257600080fd5b3461016357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610163577f7d4f8ec43464738265ced6b7ed5f90007e9b7c34318bdd82d9249328b50bd357544203428111610136577f7d4f8ec43464738265ced6b7ed5f90007e9b7c34318bdd82d9249328b50bd35854908115610109570460010190816001116100dc57602082604051908152f35b807f4e487b7100000000000000000000000000000000000000000000000000000000602492526011600452fd5b6024837f4e487b710000000000000000000000000000000000000000000000000000000081526012600452fd5b6024827f4e487b710000000000000000000000000000000000000000000000000000000081526011600452fd5b80fd5b503461016357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101635760207f7d4f8ec43464738265ced6b7ed5f90007e9b7c34318bdd82d9249328b50bd35754604051908152f35b90503461021a57817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261021a576020907f7d4f8ec43464738265ced6b7ed5f90007e9b7c34318bdd82d9249328b50bd358548152f35b5080fdfea2646970667358221220006a0ebd3a7266043b9e37eab52125d0d2061fe678fc88d5c2f864e050c3cada64736f6c63430008130033";

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
