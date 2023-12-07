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
import type { NonPayableOverrides } from "../common.js";
import type {
  WorkerManager,
  WorkerManagerInterface,
} from "../WorkerManager.js";

const _abi = [
  {
    type: "function",
    name: "accessType",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "enum IConfig.AccessType",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "appCID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct CIDV1",
        components: [
          {
            name: "prefixes",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "hash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "changeAccessType",
    inputs: [
      {
        name: "accessType_",
        type: "uint8",
        internalType: "enum IConfig.AccessType",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "creationBlock",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "effectors",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct CIDV1[]",
        components: [
          {
            name: "prefixes",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "hash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAccessList",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address[]",
        internalType: "address[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getComputeUnit",
    inputs: [
      {
        name: "id",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IWorkerManager.ComputeUnit",
        components: [
          {
            name: "id",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "workerId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "peerId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "provider",
            type: "address",
            internalType: "address",
          },
          {
            name: "joinedEpoch",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getComputeUnitCount",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getComputeUnits",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IWorkerManager.ComputeUnit[]",
        components: [
          {
            name: "id",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "workerId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "peerId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "provider",
            type: "address",
            internalType: "address",
          },
          {
            name: "joinedEpoch",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getWorkerCount",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isInAccessList",
    inputs: [
      {
        name: "addr",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maxWorkersPerProvider",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minWorkers",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "paymentToken",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pricePerWorkerEpoch",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeFromAccessList",
    inputs: [
      {
        name: "addr",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAppCID",
    inputs: [
      {
        name: "appCID_",
        type: "tuple",
        internalType: "struct CIDV1",
        components: [
          {
            name: "prefixes",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "hash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "targetWorkers",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AppCIDChanged",
    inputs: [
      {
        name: "newAppCID",
        type: "tuple",
        indexed: false,
        internalType: "struct CIDV1",
        components: [
          {
            name: "prefixes",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "hash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ComputeUnitJoined",
    inputs: [
      {
        name: "unitId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ComputeUnitRemoved",
    inputs: [
      {
        name: "unitId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WorkerIdUpdated",
    inputs: [
      {
        name: "computeUnitId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "workerId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as const;

const _bytecode =
  "0x6080806040523461001657611577908161001c8239f35b600080fdfe60406080815260048036101561001457600080fd5b600060e0918135831c908163055236f4146111f4578163108d2f521461119857816314d3b76714610f585781631763451414610efc578163176474cf14610df15781632943dcab14610d955781632db3119314610d395781633013ce2914610cc75781634b66a30914610aa25781634d7599f114610a465781636cd13448146109ea578163715018a61461092c578163745e920b146108325781637878e81b1461079f5781638a0c725b146107435781638d5ddbb31461058b5781638da5cb5b146105195781639bc6686814610428578163b55ec18a1461038f578163f2fde38b14610280575063fc1e5e2a1461010a57600080fd5b3461027d57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261027d5782907f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0e90815461016f61016a8261136f565b61132b565b9080825260209586830190819585527f41d22fcf61f8b32ca910e56247176ffedb9dcd2ae76207e235d37179490c642c9085925b848410610225575050505050835194859481860192828752518093528086019493905b8382106101d35786860387f35b9184965082866102156001949698849851602080917fffffffff0000000000000000000000000000000000000000000000000000000081511684520151910152565b01960192018695949293916101c6565b60028a6001926102399c99989a9b9c6112bc565b7fffffffff000000000000000000000000000000000000000000000000000000008754871b16815284870154838201528152019301930192919897969495986101a3565b80fd5b9050833461038b5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261038b5781359173ffffffffffffffffffffffffffffffffffffffff91828416809403610387576102dd6114d1565b83156103585750507fb13d3e7783d509d8d65d3e1e62ec0b103a07e0cbfa1ee74ae19127f297dddfcc805490837fffffffffffffffffffffffff00000000000000000000000000000000000000008316179055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08380a380f35b908460249251917f1e4fbdf7000000000000000000000000000000000000000000000000000000008352820152fd5b8480fd5b8280fd5b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104245760ff7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0f541690519160038210156103f857602083838152f35b806021857f4e487b71000000000000000000000000000000000000000000000000000000006024945252fd5b5080fd5b50503461027d57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261027d5760206104626112bc565b82815201527fffffffff000000000000000000000000000000000000000000000000000000006104906112bc565b917f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0654901b1681527f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0754602082015261051782518092602080917fffffffff0000000000000000000000000000000000000000000000000000000081511684520151910152565bf35b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104245760209073ffffffffffffffffffffffffffffffffffffffff7fb13d3e7783d509d8d65d3e1e62ec0b103a07e0cbfa1ee74ae19127f297dddfcc54169051908152f35b84833461027d57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261027d577f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d12546105e961016a8261136f565b928184527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0806106188461136f565b019260209336858801377f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d105485905b8282106106fc5750505084519261066c61066361016a8661136f565b9480865261136f565b8482019201368337845b86518110156106a6578061068d6106a192896113e3565b5160601c61069b82886113e3565b52611387565b610676565b509190848483519485948186019282875251809352850193925b8281106106cf57505050500390f35b835173ffffffffffffffffffffffffffffffffffffffff16855286955093810193928101926001016106c0565b80610707838a6113e3565b5286527f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d13855261073d6001858820015491611387565b90610647565b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610424576020907f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0c549051908152f35b9050346104245760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261042457356003811015610424576107e26114d1565b7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0f9060ff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00835416911617905580f35b9050833461038b5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261038b57806105179160a094610874611426565b50843581527fec986952a0671e4b2e5ec4461085fb880bc7a7b88668240f8d55173039155d2360205220926108a761130b565b93805485526001810154602086015260028101548386015273ffffffffffffffffffffffffffffffffffffffff6003820154166060860152015460808401525180926080809180518452602081015160208501526040810151604085015273ffffffffffffffffffffffffffffffffffffffff60608201511660608501520151910152565b823461027d57807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261027d576109636114d1565b8073ffffffffffffffffffffffffffffffffffffffff7fb13d3e7783d509d8d65d3e1e62ec0b103a07e0cbfa1ee74ae19127f297dddfcc8054907fffffffffffffffffffffffff000000000000000000000000000000000000000082169055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610424576020907f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0d549051908152f35b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610424576020907fec986952a0671e4b2e5ec4461085fb880bc7a7b88668240f8d55173039155d21549051908152f35b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610424577fec986952a0671e4b2e5ec4461085fb880bc7a7b88668240f8d55173039155d2054927fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0610b2e610b2561016a8761136f565b9580875261136f565b01835b818110610cb05750507fec986952a0671e4b2e5ec4461085fb880bc7a7b88668240f8d55173039155d245483815b610bed575050508281519160208080850192818652845180945285019301945b828110610b8c5784840385f35b9091928260a082610bde6001948a516080809180518452602081015160208501526040810151604085015273ffffffffffffffffffffffffffffffffffffffff60608201511660608501520151910152565b01960191019492919094610b7f565b8185527fec986952a0671e4b2e5ec4461085fb880bc7a7b88668240f8d55173039155d2760207fec986952a0671e4b2e5ec4461085fb880bc7a7b88668240f8d55173039155d238152610ca086882093610c4561130b565b8554815287600196878101548684015260028101548b84015273ffffffffffffffffffffffffffffffffffffffff600382015416606084015201546080820152610c8f828c6113e3565b52610c9a818b6113e3565b50611387565b9387525283852001549081610b5f565b602090610cbb611426565b82828901015201610b31565b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126104245760209073ffffffffffffffffffffffffffffffffffffffff7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0854169051908152f35b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610424576020907f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0a549051908152f35b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610424576020907f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0b549051908152f35b8385849234610ef857817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610ef857610e2b6114d1565b35917fffffffff00000000000000000000000000000000000000000000000000000000831690818403610387577fc820a66d3bdd50a45cf12cda6dc8ec9e94fb5123edd7da736eea18316f8523a0937f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d06911c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000825416179055602435807f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d075582519182526020820152a180f35b8380fd5b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610424576020907f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d05549051908152f35b9050833461038b576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610ef857823573ffffffffffffffffffffffffffffffffffffffff81168103610387577fffffffffffffffffffffffffffffffffffffffff00000000000000000000000090610fd46114d1565b60601b16908185527f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d1391828252838620600161100e6112bc565b918054835201548382019081526110258383611451565b1561113c5791816001959389979593518015600014611129575080517f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d10555b51806111185750517f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d11555b855252822082815501557f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d129081549081156110ec57507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01905580f35b8360116024927f4e487b7100000000000000000000000000000000000000000000000000000000835252fd5b90519087528383528487205561108f565b815190895285855287878a200155611064565b606487858851917f08c379a0000000000000000000000000000000000000000000000000000000008352820152601260248201527f4b657920646f6573206e6f7420657869737400000000000000000000000000006044820152fd5b82853461042457817ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610424576020907fec986952a0671e4b2e5ec4461085fb880bc7a7b88668240f8d55173039155d20549051908152f35b8491503461038b5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261038b573573ffffffffffffffffffffffffffffffffffffffff8116810361038b57602092827fffffffffffffffffffffffffffffffffffffffff0000000000000000000000006112b39360601b16918281527f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d1386522060016112a36112bc565b9180548352015485820152611451565b90519015158152f35b604051906040820182811067ffffffffffffffff8211176112dc57604052565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519060a0820182811067ffffffffffffffff8211176112dc57604052565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f604051930116820182811067ffffffffffffffff8211176112dc57604052565b67ffffffffffffffff81116112dc5760051b60200190565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146113b45760010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b80518210156113f75760209160051b010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b61142e61130b565b906000825260006020830152600060408301526000606083015260006080830152565b90815115918215926114c3575b508115611498575b8115611470575090565b90507f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d11541490565b7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d105481149150611466565b60200151151591503861145e565b73ffffffffffffffffffffffffffffffffffffffff7fb13d3e7783d509d8d65d3e1e62ec0b103a07e0cbfa1ee74ae19127f297dddfcc5416330361151157565b60246040517f118cdaa7000000000000000000000000000000000000000000000000000000008152336004820152fdfea264697066735822122000af5282f0025726f271a0897cefb13b3cd9fbd69aa73f83b6e271a83108afb064736f6c63430008130033";

type WorkerManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: WorkerManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class WorkerManager__factory extends ContractFactory {
  constructor(...args: WorkerManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "WorkerManager";
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      WorkerManager & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): WorkerManager__factory {
    return super.connect(runner) as WorkerManager__factory;
  }
  static readonly contractName: "WorkerManager";

  public readonly contractName: "WorkerManager";

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): WorkerManagerInterface {
    return new Interface(_abi) as WorkerManagerInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): WorkerManager {
    return new Contract(address, _abi, runner) as unknown as WorkerManager;
  }
}