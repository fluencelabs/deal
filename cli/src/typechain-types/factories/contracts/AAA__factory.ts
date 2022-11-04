/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { AAA, AAAInterface } from "../../contracts/AAA";

const _abi = [
  {
    inputs: [],
    name: "blabla",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x6101c4610053600b82828239805160001a607314610046577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100355760003560e01c8063cb20fe891461003a575b600080fd5b610042610058565b60405161004f919061013d565b60405180910390f35b6060601467ffffffffffffffff8111156100755761007461015f565b5b6040519080825280601f01601f1916602001820160405280156100a75781602001600182028036833780820191505090505b50905090565b600081519050919050565b600082825260208201905092915050565b60005b838110156100e75780820151818401526020810190506100cc565b60008484015250505050565b6000601f19601f8301169050919050565b600061010f826100ad565b61011981856100b8565b93506101298185602086016100c9565b610132816100f3565b840191505092915050565b600060208201905081810360008301526101578184610104565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fdfea26469706673582212204db36b85b330f4e2e95c7a9b61dd5016eedbaf903ed4d5c29e435f6b27845deb64736f6c63430008110033";

type AAAConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AAAConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AAA__factory extends ContractFactory {
  constructor(...args: AAAConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AAA> {
    return super.deploy(overrides || {}) as Promise<AAA>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): AAA {
    return super.attach(address) as AAA;
  }
  override connect(signer: Signer): AAA__factory {
    return super.connect(signer) as AAA__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AAAInterface {
    return new utils.Interface(_abi) as AAAInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): AAA {
    return new Contract(address, _abi, signerOrProvider) as AAA;
  }
}
