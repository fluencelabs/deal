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
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../common.js";
import type {
  OwnableFaucet,
  OwnableFaucetInterface,
} from "../OwnableFaucet.js";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "fluenceToken_",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "usdToken_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "fluenceToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "sendFLT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "sendUSD",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60c0346100cc57601f610c9f38819003918201601f19168301916001600160401b038311848410176100d15780849260409485528339810103126100cc57610052602061004b836100e7565b92016100e7565b60008054336001600160a01b0319821681178355604051949290916001600160a01b0316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09080a360805260a052610ba390816100fc82396080518181816105bd0152610849015260a05181818160c4015261078a0152f35b600080fd5b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036100cc5756fe6040608081526004908136101561001557600080fd5b600091823560e01c9081630af76b8f146107f05781633922f542146106d1578163715018a6146106325781638da5cb5b146105e1578163ac027f9714610572578163ac9650d814610227578163f2fde38b146100ec575063f897a22b1461007b57600080fd5b346100e857817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126100e8576020905173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b5080fd5b9050346102235760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102235761012561087b565b9061012e610901565b73ffffffffffffffffffffffffffffffffffffffff8092169283156101a05750508254827fffffffffffffffffffffffff00000000000000000000000000000000000000008216178455167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b90602060849251917f08c379a0000000000000000000000000000000000000000000000000000000008352820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152fd5b8280fd5b8383346100e857602090817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102235783359167ffffffffffffffff9485841161056e573660238501121561056e57838101359386851161056a576024916005973684888b1b85010111610566576102a7879397989695986109f0565b966102b486519889610980565b8388527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe06102e1856109f0565b01875b81811061055757505086907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffbd81360301915b85811061039957505050505050508051938080860192818752855180945283818801981b870101940192955b82871061034f5785850386f35b909192938280610389837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc08a6001960301865288516108a3565b9601920196019592919092610342565b86818d9c999a9c1b83010135838112156105535782018781013585811161054f5760449182810190823603821361054b579082916103e36103da8f95610a08565b94519485610980565b8284528c84019483369201011161054b57818f928d928637830101528a51916060918284018481108982111761051f578f80938f938f857f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c7f206661696c6564000000000000000000000000000000000000000000000000009286976104a49c9b995260278b528a01528801525190305af4903d1561051857508c3d61049461048b82610a08565b92519283610980565b815280928d3d92013e5b30610a85565b6104ae828c610a42565b526104b9818b610a42565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146104ed5760010199979699610316565b868b6011877f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b915061049e565b508a8f60418b7f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b8e80fd5b8c80fd5b8b80fd5b60608a82018c01528a016102e4565b8780fd5b8580fd5b8480fd5b5050346100e857817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126100e8576020905173ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000168152f35b5050346100e857817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126100e85773ffffffffffffffffffffffffffffffffffffffff60209254169051908152f35b83346106ce57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126106ce57610669610901565b8073ffffffffffffffffffffffffffffffffffffffff81547fffffffffffffffffffffffff000000000000000000000000000000000000000081168355167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b9190503461022357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126102235760206107709261071061087b565b610718610901565b835194859283927fa9059cbb0000000000000000000000000000000000000000000000000000000084526024359184016020909392919373ffffffffffffffffffffffffffffffffffffffff60408201951681520152565b03818673ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165af19081156107e757506107bc575080f35b6107dc9060203d81116107e0575b6107d48183610980565b810190610b55565b5080f35b503d6107ca565b513d84823e3d90fd5b9190503461022357807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261022357602061082f9261071061087b565b03818673ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000165af19081156107e757506107bc575080f35b6004359073ffffffffffffffffffffffffffffffffffffffff8216820361089e57565b600080fd5b919082519283825260005b8481106108ed5750507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f8460006020809697860101520116010190565b6020818301810151848301820152016108ae565b73ffffffffffffffffffffffffffffffffffffffff60005416330361092257565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602060248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152fd5b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff8211176109c157604052565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b67ffffffffffffffff81116109c15760051b60200190565b67ffffffffffffffff81116109c157601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b8051821015610a565760209160051b010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b91929015610b005750815115610a99575090565b3b15610aa25790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152fd5b825190915015610b135750805190602001fd5b610b51906040519182917f08c379a00000000000000000000000000000000000000000000000000000000083526020600484015260248301906108a3565b0390fd5b9081602091031261089e5751801515810361089e579056fea2646970667358221220e7cd30c3bb7c88db24e598446cd2dc1a11a4956f5c7162fd105ba4c2e01c3a7464736f6c63430008130033";

type OwnableFaucetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OwnableFaucetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OwnableFaucet__factory extends ContractFactory {
  constructor(...args: OwnableFaucetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "OwnableFaucet";
  }

  override getDeployTransaction(
    fluenceToken_: AddressLike,
    usdToken_: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      fluenceToken_,
      usdToken_,
      overrides || {}
    );
  }
  override deploy(
    fluenceToken_: AddressLike,
    usdToken_: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(fluenceToken_, usdToken_, overrides || {}) as Promise<
      OwnableFaucet & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): OwnableFaucet__factory {
    return super.connect(runner) as OwnableFaucet__factory;
  }
  static readonly contractName: "OwnableFaucet";

  public readonly contractName: "OwnableFaucet";

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OwnableFaucetInterface {
    return new Interface(_abi) as OwnableFaucetInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): OwnableFaucet {
    return new Contract(address, _abi, runner) as unknown as OwnableFaucet;
  }
}