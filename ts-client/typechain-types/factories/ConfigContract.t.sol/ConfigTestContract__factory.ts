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
import type { NonPayableOverrides } from "../../common";
import type {
  ConfigTestContract,
  ConfigTestContractInterface,
} from "../../ConfigContract.t.sol/ConfigTestContract";

const _abi = [
  {
    type: "function",
    name: "Config_init",
    inputs: [
      {
        name: "globalCore_",
        type: "address",
        internalType: "contract ICore",
      },
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
      {
        name: "paymentToken_",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "minWorkers_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "targetWorkers_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxWorkersPerProvider_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "pricePerWorkerEpoch_",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "effectors_",
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
      {
        name: "accessType_",
        type: "uint8",
        internalType: "enum IConfig.AccessType",
      },
      {
        name: "accessList_",
        type: "address[]",
        internalType: "address[]",
      },
      {
        name: "owner_",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
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
    name: "globalCore",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract ICore",
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
  "0x6080806040523461001657611b07908161001c8239f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c8063055236f41461148857806311c3724814610d1457806314d3b76714610aea5780631763451414610a8f578063176474cf146109865780632943dcab1461092b5780632aa74c68146108ba5780632db311931461085f5780633013ce29146107ee5780636cd1344814610793578063715018a6146106d55780637878e81b146106895780638a0c725b1461062e5780638d5ddbb31461046d5780638da5cb5b146103fc5780639bc668681461032f578063b55ec18a14610299578063f2fde38b146102505763fc1e5e2a146100ed57600080fd5b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b577f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0e805461015061014b826115c0565b61157c565b81815260209182820180946000527f41d22fcf61f8b32ca910e56247176ffedb9dcd2ae76207e235d37179490c642c6000915b8383106101fe5760408051878152865181890181905289928201908960005b8281106101af5784840385f35b909192826040826101ef6001948a51602080917fffffffff0000000000000000000000000000000000000000000000000000000081511684520151910152565b019601910194929190946101a2565b60028660019261020c61155c565b7fffffffff00000000000000000000000000000000000000000000000000000000865460e01b1681528486015483820152815201920192019190610183565b600080fd5b3461024b5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b5761029761028a611539565b6102926116f1565b611761565b005b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b5760ff7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0f54166040516003821015610300576020918152f35b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b576000602061036a61155c565b8281520152604061037961155c565b7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d065460e01b7fffffffff00000000000000000000000000000000000000000000000000000000168082527f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0754602092830190815283519182525191810191909152f35b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b57602073ffffffffffffffffffffffffffffffffffffffff7fc43ef91433cf7d0ab2ca98c18785d28d6a5685461d30e867805d7a83cc8deb805416604051908152f35b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b577f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d12546104ca61014b826115c0565b908082527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe090816104fa826115c0565b019060209136838601377f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d10546000905b8282106105e45750505082519061054f61054661014b846115c0565b928084526115c0565b828201930136843760005b845181101561058a57806105716105859287611605565b5160601c61057f8286611605565b526115d8565b61055a565b50925090604051928392818401908285525180915260408401929160005b8281106105b757505050500390f35b835173ffffffffffffffffffffffffffffffffffffffff16855286955093810193928101926001016105a8565b806105ef8388611605565b526000527f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d138352610628600160406000200154916115d8565b9061052a565b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b5760207f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0c54604051908152f35b3461024b5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b57600435600381101561024b57610297906106d06116f1565b611619565b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b5761070c6116f1565b600073ffffffffffffffffffffffffffffffffffffffff7fc43ef91433cf7d0ab2ca98c18785d28d6a5685461d30e867805d7a83cc8deb808054907fffffffffffffffffffffffff000000000000000000000000000000000000000082169055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a3005b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b5760207f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0d54604051908152f35b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b57602073ffffffffffffffffffffffffffffffffffffffff7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d085416604051908152f35b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b5760207f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0a54604051908152f35b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b57602073ffffffffffffffffffffffffffffffffffffffff7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d045416604051908152f35b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b5760207f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0b54604051908152f35b3461024b5760407ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b576109bd6116f1565b6004357fffffffff0000000000000000000000000000000000000000000000000000000081169081810361024b577fc820a66d3bdd50a45cf12cda6dc8ec9e94fb5123edd7da736eea18316f8523a0916040917f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d069060e01c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000825416179055602435807f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d075582519182526020820152a1005b3461024b5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b5760207f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0554604051908152f35b3461024b576020807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b577fffffffffffffffffffffffffffffffffffffffff000000000000000000000000610b43611539565b610b4b6116f1565b60601b1690816000527f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d139182825260406000206001610b8861155c565b91805483520154838201908152610b9f8383611671565b15610cb657815180610c9f575080517f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d10555b5180610c8b5750517f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d11555b60005252600060016040822082815501557f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d1280548015610c5c577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019055005b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b905190600052838352604060002055610bfc565b815190600052858552600160406000200155610bd1565b606484604051907f08c379a00000000000000000000000000000000000000000000000000000000082526004820152601260248201527f4b657920646f6573206e6f7420657869737400000000000000000000000000006044820152fd5b3461024b576101807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b5760043573ffffffffffffffffffffffffffffffffffffffff8116810361024b5760407fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffdc36011261024b5760643573ffffffffffffffffffffffffffffffffffffffff8116810361024b5767ffffffffffffffff80610104351161024b573660236101043501121561024b578061010435600401351161024b57366024610104356004013560061b6101043501011161024b57600361012435101561024b5780610144351161024b573660236101443501121561024b5761014435600401351161024b57366024610144356004013560051b6101443501011161024b5773ffffffffffffffffffffffffffffffffffffffff6101643516610164350361024b576000549160ff8360081c16159283809461147b575b8015611464575b156113e0578360017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008316176000556113b1575b50610ed760ff60005460081c16610ec981611824565b610ed281611824565b611824565b610ee361016435611761565b610ef460ff60005460081c16611824565b437f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d05557fffffffffffffffffffffffff00000000000000000000000000000000000000009073ffffffffffffffffffffffffffffffffffffffff7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0491168282541617905573ffffffffffffffffffffffffffffffffffffffff7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d089216908254161790556084357f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0a5560a4357f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0b5560c4357f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0c5560e4357f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0d5560005b6101043560040135811061120c575061106961012435611619565b60005b610144356004013581106111a657506024357fffffffff0000000000000000000000000000000000000000000000000000000081169081810361024b577fc820a66d3bdd50a45cf12cda6dc8ec9e94fb5123edd7da736eea18316f8523a0916040917f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d069060e01c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000825416179055604435807f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d075582519182526020820152a161115157005b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff600054166000557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160018152a1005b60248160051b610144350101359073ffffffffffffffffffffffffffffffffffffffff8216820361024b576112027fffffffffffffffffffffffffffffffffffffffff0000000000000000000000006112079360601b166118af565b6115d8565b61106c565b7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0e54680100000000000000008110156113825760018101807f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0e55811015611353577f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0e60005260011b90817f41d22fcf61f8b32ca910e56247176ffedb9dcd2ae76207e235d37179490c642c01918160061b61010435019260248401357fffffffff000000000000000000000000000000000000000000000000000000008116810361024b5761134e947f41d22fcf61f8b32ca910e56247176ffedb9dcd2ae76207e235d37179490c642d9260449260e01c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000082541617905501359101556115d8565b61104e565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000166101011760005583610eb3565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a65640000000000000000000000000000000000006064820152fd5b50303b158015610e7f5750600160ff821614610e7f565b50600160ff821610610e78565b3461024b5760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261024b57602061152f7fffffffffffffffffffffffffffffffffffffffff0000000000000000000000006114e5611539565b60601b16806000527f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d1383526040600020600161151f61155c565b9180548352015484820152611671565b6040519015158152f35b6004359073ffffffffffffffffffffffffffffffffffffffff8216820361024b57565b604051906040820182811067ffffffffffffffff82111761138257604052565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f604051930116820182811067ffffffffffffffff82111761138257604052565b67ffffffffffffffff81116113825760051b60200190565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610c5c5760010190565b80518210156113535760209160051b010190565b6003811015610300577f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d0f9060ff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff008354169116179055565b90815115918215926116e3575b5081156116b8575b8115611690575090565b90507f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d11541490565b7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d105481149150611686565b60200151151591503861167e565b73ffffffffffffffffffffffffffffffffffffffff7fc43ef91433cf7d0ab2ca98c18785d28d6a5685461d30e867805d7a83cc8deb805416330361173157565b60246040517f118cdaa7000000000000000000000000000000000000000000000000000000008152336004820152fd5b73ffffffffffffffffffffffffffffffffffffffff8091169081156117f3577fc43ef91433cf7d0ab2ca98c18785d28d6a5685461d30e867805d7a83cc8deb80805490837fffffffffffffffffffffffff00000000000000000000000000000000000000008316179055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3565b60246040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260006004820152fd5b1561182b57565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201527f6e697469616c697a696e670000000000000000000000000000000000000000006064820152fd5b8015611a735760008181527f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d1390816020526020604082206118ee61155c565b6001825492838352015492839101521590811591611a69575b508015611a3f575b8015611a15575b6119b7577f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d11918254907f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d1261196a81546115d8565b905584821561198f579060409392916001955585835260205280838320558152200155565b7f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d105550505055565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4b657920616c72656164792065786973747300000000000000000000000000006044820152fd5b507f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d11548314611916565b507f8953f5482bc1a621075e75537625fa3bd2025e7df7baf6ba1dbfbf2212912d1054831461190f565b9050151538611907565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601260248201527f4b65792063616e6e6f74206265205a45524f00000000000000000000000000006044820152fdfea2646970667358221220936234f7bcf8bae5dfbbf2ed2ef7b23ce98ac1cd85f979584c12103eb40f640664736f6c63430008130033";

type ConfigTestContractConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ConfigTestContractConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ConfigTestContract__factory extends ContractFactory {
  constructor(...args: ConfigTestContractConstructorParams) {
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
      ConfigTestContract & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ConfigTestContract__factory {
    return super.connect(runner) as ConfigTestContract__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ConfigTestContractInterface {
    return new Interface(_abi) as ConfigTestContractInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ConfigTestContract {
    return new Contract(address, _abi, runner) as unknown as ConfigTestContract;
  }
}
