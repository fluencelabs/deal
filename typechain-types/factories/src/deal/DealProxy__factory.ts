/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BytesLike,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  DealProxy,
  DealProxyInterface,
} from "../../../src/deal/DealProxy";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract ICore",
        name: "core_",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60a0604090808252346101e5576104ef803803809161001e82856101ea565b8339810182828203126101e55781516001600160a01b039283821691908282036101e5576020928382015160018060401b03928382116101e557019285601f850112156101e5578351936100718561020d565b9461007e8a5196876101ea565b808652868601978782840101116101e557878761009b9301610228565b60805282516100c1575b86516101f090816102ff82396080518181816024015260df0152f35b8360049188519283809263d6a5a04b60e01b82525afa9081156101da5760009161019d575b5090865194606086019186831090831117610187576101729660009384938a52602788527f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c87890152660819985a5b195960ca1b8a89015216935190845af4903d1561017e573d6101568161020d565b90610163885192836101ea565b8152600081943d92013e61024b565b503880808080806100a5565b6060925061024b565b634e487b7160e01b600052604160045260246000fd5b8481813d83116101d3575b6101b281836101ea565b810103126101cf57519086821682036101cc5750386100e6565b80fd5b5080fd5b503d6101a8565b87513d6000823e3d90fd5b600080fd5b601f909101601f19168101906001600160401b0382119082101761018757604052565b6001600160401b03811161018757601f01601f191660200190565b60005b83811061023b5750506000910152565b818101518382015260200161022b565b919290156102ad575081511561025f575090565b3b156102685790565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b8251909150156102c05750805190602001fd5b6044604051809262461bcd60e51b8252602060048301526102f08151809281602486015260208686019101610228565b601f01601f19168101030190fdfe608080604052366100c25763d6a5a04b60e01b81526001600160a01b036020826004817f000000000000000000000000000000000000000000000000000000000000000085165afa9182156100b65760009261005d575b5016610155565b6020903d82116100ae575b601f8201601f191681016001600160401b0381118282101761009a5761009393945060405201610174565b9038610056565b634e487b7160e01b85526041600452602485fd5b3d9150610068565b6040513d6000823e3d90fd5b60405163d6a5a04b60e01b81526001600160a01b036020826004817f000000000000000000000000000000000000000000000000000000000000000085165afa9182156100b657600092610117575016610155565b60203d811161014e575b601f8101601f191682016001600160401b0381118382101761009a5761009393945060405281019061019b565b503d610121565b6000808092368280378136915af43d82803e15610170573d90f35b3d90fd5b602090607f190112610196576080516001600160a01b03811681036101965790565b600080fd5b9081602091031261019657516001600160a01b0381168103610196579056fea26469706673582212208ee63d0f27e7d0e3f40f2c4b7a6302beabb8d0089329562632a1ccdc81b5158b64736f6c63430008130033";

type DealProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DealProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DealProxy__factory extends ContractFactory {
  constructor(...args: DealProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    core_: AddressLike,
    data_: BytesLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(core_, data_, overrides || {});
  }
  override deploy(
    core_: AddressLike,
    data_: BytesLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(core_, data_, overrides || {}) as Promise<
      DealProxy & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): DealProxy__factory {
    return super.connect(runner) as DealProxy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DealProxyInterface {
    return new Interface(_abi) as DealProxyInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): DealProxy {
    return new Contract(address, _abi, runner) as unknown as DealProxy;
  }
}