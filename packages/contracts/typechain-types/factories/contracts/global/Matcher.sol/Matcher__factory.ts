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
import type { NonPayableOverrides } from "../../../../common";
import type {
  Matcher,
  MatcherInterface,
} from "../../../../contracts/global/Matcher.sol/Matcher";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IGlobalConfig",
        name: "globalConfig_",
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
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "resourceOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "deal",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "joinedWorkers",
        type: "uint256",
      },
    ],
    name: "Matched",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "globalConfig",
    outputs: [
      {
        internalType: "contract IGlobalConfig",
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
        internalType: "contract ICore",
        name: "deal",
        type: "address",
      },
    ],
    name: "matchWithDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "minPriceByEpoch",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxCollateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "workersCount",
        type: "uint256",
      },
      {
        internalType: "string[]",
        name: "effectors",
        type: "string[]",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "remove",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "resourceConfigIds",
    outputs: [
      {
        internalType: "bytes32",
        name: "_first",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_last",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "resourceConfigs",
    outputs: [
      {
        internalType: "uint256",
        name: "minPriceByEpoch",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxCollateral",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "workersCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bool",
        name: "hasAccess",
        type: "bool",
      },
    ],
    name: "setWhiteList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "whitelist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60c06040523073ffffffffffffffffffffffffffffffffffffffff1660a09073ffffffffffffffffffffffffffffffffffffffff168152503480156200004457600080fd5b5060405162003a2a38038062003a2a83398181016040528101906200006a919062000125565b808073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1681525050505062000157565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620000d982620000ac565b9050919050565b6000620000ed82620000cc565b9050919050565b620000ff81620000e0565b81146200010b57600080fd5b50565b6000815190506200011f81620000f4565b92915050565b6000602082840312156200013e576200013d620000a7565b5b60006200014e848285016200010e565b91505092915050565b60805160a051613860620001ca6000396000818161027801528181610306015281816104000152818161048e015261053e01526000818161061f01528181610796015281816108e101528181610a050152818161129801528181611408015281816119e10152611b9c01526138606000f3fe60806040526004361061009c5760003560e01c80639b19251a116100645780639b19251a14610179578063a7c1abe0146101b6578063a7f43779146101e1578063b5ebe33d146101f8578063c6c44ed114610224578063e61327ca1461024d5761009c565b80633659cfe6146100a15780634f1ef286146100ca57806352d1902d146100e65780638ae86750146101115780638d14e12714610150575b600080fd5b3480156100ad57600080fd5b506100c860048036038101906100c39190612206565b610276565b005b6100e460048036038101906100df9190612379565b6103fe565b005b3480156100f257600080fd5b506100fb61053a565b60405161010891906123ee565b60405180910390f35b34801561011d57600080fd5b5061013860048036038101906101339190612206565b6105f3565b60405161014793929190612422565b60405180910390f35b34801561015c57600080fd5b5061017760048036038101906101729190612491565b61061d565b005b34801561018557600080fd5b506101a0600480360381019061019b9190612206565b610774565b6040516101ad91906124e0565b60405180910390f35b3480156101c257600080fd5b506101cb610794565b6040516101d8919061255a565b60405180910390f35b3480156101ed57600080fd5b506101f66107b8565b005b34801561020457600080fd5b5061020d6109f1565b60405161021b929190612575565b60405180910390f35b34801561023057600080fd5b5061024b600480360381019061024691906125dc565b610a03565b005b34801561025957600080fd5b50610274600480360381019061026f9190612695565b610f86565b005b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1603610304576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102fb906127a0565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166103436113af565b73ffffffffffffffffffffffffffffffffffffffff1614610399576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161039090612832565b60405180910390fd5b6103a281611406565b6103fb81600067ffffffffffffffff8111156103c1576103c061224e565b5b6040519080825280601f01601f1916602001820160405280156103f35781602001600182028036833780820191505090505b506000611505565b50565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff160361048c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610483906127a0565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166104cb6113af565b73ffffffffffffffffffffffffffffffffffffffff1614610521576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161051890612832565b60405180910390fd5b61052a82611406565b61053682826001611505565b5050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16146105ca576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105c1906128c4565b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b905090565b60036020528060005260406000206000915090508060000154908060010154908060020154905083565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16638da5cb5b6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610688573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ac91906128f9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610719576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161071090612998565b60405180910390fd5b80600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505050565b60046020528060005260406000206000915054906101000a900460ff1681565b7f000000000000000000000000000000000000000000000000000000000000000081565b60003390506000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000816002015403610847576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161083e90612a04565b60405180910390fd5b60008160020154826001015461085d9190612a53565b9050600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000808201600090556001820160009055600282016000905550506108df8360601b6bffffffffffffffffffffffff1916600061167390919063ffffffff16565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663ac027f976040518163ffffffff1660e01b8152600401602060405180830381865afa15801561094a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061096e9190612ad3565b73ffffffffffffffffffffffffffffffffffffffff1663a9059cbb84836040518363ffffffff1660e01b81526004016109a8929190612b0f565b6020604051808303816000875af11580156109c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109eb9190612b4d565b50505050565b60008060000154908060010154905082565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663c45a01556040518163ffffffff1660e01b8152600401602060405180830381865afa158015610a6e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a929190612bb8565b73ffffffffffffffffffffffffffffffffffffffff16634db44e64826040518263ffffffff1660e01b8152600401610aca9190612be5565b602060405180830381865afa158015610ae7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b0b9190612b4d565b610b4a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b4190612c4c565b60405180910390fd5b60008173ffffffffffffffffffffffffffffffffffffffff166368f1e99a6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b97573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bbb9190612caa565b905060008173ffffffffffffffffffffffffffffffffffffffff1663b53105a36040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c0a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c2e9190612cec565b905060008273ffffffffffffffffffffffffffffffffffffffff16635fc8f59c6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c7d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ca19190612cec565b905060008373ffffffffffffffffffffffffffffffffffffffff16638a0c725b6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610cf0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d149190612cec565b905060008573ffffffffffffffffffffffffffffffffffffffff16632ed52a776040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d63573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d879190612d57565b905060008173ffffffffffffffffffffffffffffffffffffffff1663be18cf7f6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610dd6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dfa9190612cec565b8673ffffffffffffffffffffffffffffffffffffffff16632943dcab6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610e45573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e699190612cec565b610e739190612d84565b90506000610e8160006117b0565b90505b60008019168114158015610e985750600082115b15610f7c5760008160601c90506000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090506000816001015490508782600001541180610f0257508881105b80610f145750610f128a846117be565b155b15610f3757610f2d8460006118f890919063ffffffff16565b9350505050610e84565b6000610f4d8c88868587600201548f8e8d61191b565b90508086610f5b9190612d84565b9550610f718560006118f890919063ffffffff16565b945050505050610e84565b5050505050505050565b6000339050600460008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16611017576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161100e90612e2a565b60405180910390fd5b6000841161105a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161105190612ebc565b60405180910390fd5b6000851161109d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161109490612f4e565b60405180910390fd5b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206002015414611122576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161111990612fba565b60405180910390fd5b600084866111309190612a53565b90506000604051806060016040528089815260200188815260200187815250905060005b8585905081101561120e576001600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000018787848181106111b6576111b5612fda565b5b90506020028101906111c89190613018565b6040516111d69291906130ab565b908152602001604051809103902060006101000a81548160ff0219169083151502179055508080611206906130c4565b915050611154565b506112358360601b6bffffffffffffffffffffffff19166000611d1590919063ffffffff16565b80600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010155604082015181600201559050507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663ac027f976040518163ffffffff1660e01b8152600401602060405180830381865afa158015611301573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113259190612ad3565b73ffffffffffffffffffffffffffffffffffffffff166323b872dd8430856040518463ffffffff1660e01b81526004016113619392919061310c565b6020604051808303816000875af1158015611380573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113a49190612b4d565b505050505050505050565b60006113dd7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b611e11565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16638da5cb5b6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611471573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061149591906128f9565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611502576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114f990612998565b60405180910390fd5b50565b6115317f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd914360001b611e1b565b60000160009054906101000a900460ff16156115555761155083611e25565b61166e565b8273ffffffffffffffffffffffffffffffffffffffff166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa9250505080156115bd57506040513d601f19601f820116820180604052508101906115ba919061316f565b60015b6115fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115f39061320e565b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b8114611661576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611658906132a0565b60405180910390fd5b5061166d838383611ede565b5b505050565b60008260020160008381526020019081526020016000206040518060400160405290816000820154815260200160018201548152505090506116b6838284611f0a565b6116f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116ec9061330c565b60405180910390fd5b8260020160008381526020019081526020016000206000808201600090556001820160009055505060008019168160000151146117565780602001518360020160008360000151815260200190815260200160002060010181905550611764565b806020015183600001819055505b600080191681602001511461179d57806000015183600201600083602001518152602001908152602001600020600001819055506117ab565b806000015183600101819055505b505050565b600081600001549050919050565b6000808373ffffffffffffffffffffffffffffffffffffffff1663fc1e5e2a6040518163ffffffff1660e01b8152600401600060405180830381865afa15801561180c573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061183591906134d8565b905060005b81518110156118eb57600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000182828151811061189857611897612fda565b5b60200260200101516040516118ad919061355d565b908152602001604051809103902060009054906101000a900460ff166118d8576000925050506118f2565b80806118e3906130c4565b91505061183a565b5060019150505b92915050565b600082600201600083815260200190815260200160002060010154905092915050565b6000808584111561192e57859050611932565b8390505b8281111561193e578290505b6000818761194c9190612d84565b9050600081036119db57600360008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000808201600090556001820160009055600282016000905550506119d68960601b6bffffffffffffffffffffffff1916600061167390919063ffffffff16565b6119df565b8096505b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663ac027f976040518163ffffffff1660e01b8152600401602060405180830381865afa158015611a4a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a6e9190612ad3565b73ffffffffffffffffffffffffffffffffffffffff1663095ea7b38b8489611a969190612a53565b6040518363ffffffff1660e01b8152600401611ab3929190612b0f565b6020604051808303816000875af1158015611ad2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611af69190612b4d565b5060005b82811015611b80578a73ffffffffffffffffffffffffffffffffffffffff1663e5e63b318b6040518263ffffffff1660e01b8152600401611b3b9190612be5565b600060405180830381600087803b158015611b5557600080fd5b505af1158015611b69573d6000803e3d6000fd5b505050508080611b78906130c4565b915050611afa565b5060008689611b8f9190612d84565b90506000811115611cb3577f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663ac027f976040518163ffffffff1660e01b8152600401602060405180830381865afa158015611c05573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611c299190612ad3565b73ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8b8584611c519190612a53565b6040518363ffffffff1660e01b8152600401611c6e929190612b0f565b6020604051808303816000875af1158015611c8d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611cb19190612b4d565b505b8973ffffffffffffffffffffffffffffffffffffffff167fa43e18352491949f87be02f6d0a3bc9be85e85667286696ab07fda602481a9458d85604051611cfb929190612b0f565b60405180910390a282935050505098975050505050505050565b60008260010154905060008019168203611d64576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d5b906135c0565b60405180910390fd5b611d6e8383611f4c565b15611dae576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611da59061362c565b60405180910390fd5b6000801b8103611dc857611dc28383611f94565b50611e0d565b81836001018190555080836002016000848152602001908152602001600020600001819055508183600201600083815260200190815260200160002060010181905550505b5050565b6000819050919050565b6000819050919050565b611e2e81611faa565b611e6d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e64906136be565b60405180910390fd5b80611e9a7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b611e11565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b611ee783611fcd565b600082511180611ef45750805b15611f0557611f03838361201c565b505b505050565b6000808360000151141580611f2757506000801916836020015114155b80611f355750836000015482145b80611f435750836001015482145b90509392505050565b6000611f8c838460020160008581526020019081526020016000206040518060400160405290816000820154815260200160018201548152505084611f0a565b905092915050565b8082600001819055508082600101819055505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b611fd681611e25565b8073ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a250565b6060612041838360405180606001604052806027815260200161380460279139612049565b905092915050565b60606000808573ffffffffffffffffffffffffffffffffffffffff16856040516120739190613725565b600060405180830381855af49150503d80600081146120ae576040519150601f19603f3d011682016040523d82523d6000602084013e6120b3565b606091505b50915091506120c4868383876120cf565b925050509392505050565b60608315612131576000835103612129576120e985611faa565b612128576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161211f90613788565b60405180910390fd5b5b82905061213c565b61213b8383612144565b5b949350505050565b6000825111156121575781518083602001fd5b806040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161218b91906137e1565b60405180910390fd5b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006121d3826121a8565b9050919050565b6121e3816121c8565b81146121ee57600080fd5b50565b600081359050612200816121da565b92915050565b60006020828403121561221c5761221b61219e565b5b600061222a848285016121f1565b91505092915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6122868261223d565b810181811067ffffffffffffffff821117156122a5576122a461224e565b5b80604052505050565b60006122b8612194565b90506122c4828261227d565b919050565b600067ffffffffffffffff8211156122e4576122e361224e565b5b6122ed8261223d565b9050602081019050919050565b82818337600083830152505050565b600061231c612317846122c9565b6122ae565b90508281526020810184848401111561233857612337612238565b5b6123438482856122fa565b509392505050565b600082601f8301126123605761235f612233565b5b8135612370848260208601612309565b91505092915050565b600080604083850312156123905761238f61219e565b5b600061239e858286016121f1565b925050602083013567ffffffffffffffff8111156123bf576123be6121a3565b5b6123cb8582860161234b565b9150509250929050565b6000819050919050565b6123e8816123d5565b82525050565b600060208201905061240360008301846123df565b92915050565b6000819050919050565b61241c81612409565b82525050565b60006060820190506124376000830186612413565b6124446020830185612413565b6124516040830184612413565b949350505050565b60008115159050919050565b61246e81612459565b811461247957600080fd5b50565b60008135905061248b81612465565b92915050565b600080604083850312156124a8576124a761219e565b5b60006124b6858286016121f1565b92505060206124c78582860161247c565b9150509250929050565b6124da81612459565b82525050565b60006020820190506124f560008301846124d1565b92915050565b6000819050919050565b600061252061251b612516846121a8565b6124fb565b6121a8565b9050919050565b600061253282612505565b9050919050565b600061254482612527565b9050919050565b61255481612539565b82525050565b600060208201905061256f600083018461254b565b92915050565b600060408201905061258a60008301856123df565b61259760208301846123df565b9392505050565b60006125a9826121c8565b9050919050565b6125b98161259e565b81146125c457600080fd5b50565b6000813590506125d6816125b0565b92915050565b6000602082840312156125f2576125f161219e565b5b6000612600848285016125c7565b91505092915050565b61261281612409565b811461261d57600080fd5b50565b60008135905061262f81612609565b92915050565b600080fd5b600080fd5b60008083601f84011261265557612654612233565b5b8235905067ffffffffffffffff81111561267257612671612635565b5b60208301915083602082028301111561268e5761268d61263a565b5b9250929050565b6000806000806000608086880312156126b1576126b061219e565b5b60006126bf88828901612620565b95505060206126d088828901612620565b94505060406126e188828901612620565b935050606086013567ffffffffffffffff811115612702576127016121a3565b5b61270e8882890161263f565b92509250509295509295909350565b600082825260208201905092915050565b7f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060008201527f64656c656761746563616c6c0000000000000000000000000000000000000000602082015250565b600061278a602c8361271d565b91506127958261272e565b604082019050919050565b600060208201905081810360008301526127b98161277d565b9050919050565b7f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060008201527f6163746976652070726f78790000000000000000000000000000000000000000602082015250565b600061281c602c8361271d565b9150612827826127c0565b604082019050919050565b6000602082019050818103600083015261284b8161280f565b9050919050565b7f555550535570677261646561626c653a206d757374206e6f742062652063616c60008201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000602082015250565b60006128ae60388361271d565b91506128b982612852565b604082019050919050565b600060208201905081810360008301526128dd816128a1565b9050919050565b6000815190506128f3816121da565b92915050565b60006020828403121561290f5761290e61219e565b5b600061291d848285016128e4565b91505092915050565b7f4f6e6c79206f776e65722063616e2063616c6c20746869732066756e6374696f60008201527f6e00000000000000000000000000000000000000000000000000000000000000602082015250565b600061298260218361271d565b915061298d82612926565b604082019050919050565b600060208201905081810360008301526129b181612975565b9050919050565b7f436f6e66696720646f65736e2774206578697374000000000000000000000000600082015250565b60006129ee60148361271d565b91506129f9826129b8565b602082019050919050565b60006020820190508181036000830152612a1d816129e1565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000612a5e82612409565b9150612a6983612409565b9250828202612a7781612409565b91508282048414831517612a8e57612a8d612a24565b5b5092915050565b6000612aa0826121c8565b9050919050565b612ab081612a95565b8114612abb57600080fd5b50565b600081519050612acd81612aa7565b92915050565b600060208284031215612ae957612ae861219e565b5b6000612af784828501612abe565b91505092915050565b612b09816121c8565b82525050565b6000604082019050612b246000830185612b00565b612b316020830184612413565b9392505050565b600081519050612b4781612465565b92915050565b600060208284031215612b6357612b6261219e565b5b6000612b7184828501612b38565b91505092915050565b6000612b85826121c8565b9050919050565b612b9581612b7a565b8114612ba057600080fd5b50565b600081519050612bb281612b8c565b92915050565b600060208284031215612bce57612bcd61219e565b5b6000612bdc84828501612ba3565b91505092915050565b6000602082019050612bfa6000830184612b00565b92915050565b7f4465616c206973206e6f742066726f6d20666163746f72790000000000000000600082015250565b6000612c3660188361271d565b9150612c4182612c00565b602082019050919050565b60006020820190508181036000830152612c6581612c29565b9050919050565b6000612c77826121c8565b9050919050565b612c8781612c6c565b8114612c9257600080fd5b50565b600081519050612ca481612c7e565b92915050565b600060208284031215612cc057612cbf61219e565b5b6000612cce84828501612c95565b91505092915050565b600081519050612ce681612609565b92915050565b600060208284031215612d0257612d0161219e565b5b6000612d1084828501612cd7565b91505092915050565b6000612d24826121c8565b9050919050565b612d3481612d19565b8114612d3f57600080fd5b50565b600081519050612d5181612d2b565b92915050565b600060208284031215612d6d57612d6c61219e565b5b6000612d7b84828501612d42565b91505092915050565b6000612d8f82612409565b9150612d9a83612409565b9250828203905081811115612db257612db1612a24565b5b92915050565b7f4f6e6c792077686974656c69737465642063616e2063616c6c2074686973206660008201527f756e6374696f6e00000000000000000000000000000000000000000000000000602082015250565b6000612e1460278361271d565b9150612e1f82612db8565b604082019050919050565b60006020820190508181036000830152612e4381612e07565b9050919050565b7f576f726b65727320636f756e742073686f756c6420626520677265617465722060008201527f7468616e20300000000000000000000000000000000000000000000000000000602082015250565b6000612ea660268361271d565b9150612eb182612e4a565b604082019050919050565b60006020820190508181036000830152612ed581612e99565b9050919050565b7f4d617820636f6c6c61746572616c2073686f756c64206265206772656174657260008201527f207468616e203000000000000000000000000000000000000000000000000000602082015250565b6000612f3860278361271d565b9150612f4382612edc565b604082019050919050565b60006020820190508181036000830152612f6781612f2b565b9050919050565b7f436f6e66696720616c7265616479206578697374730000000000000000000000600082015250565b6000612fa460158361271d565b9150612faf82612f6e565b602082019050919050565b60006020820190508181036000830152612fd381612f97565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b600080fd5b600080fd5b6000808335600160200384360303811261303557613034613009565b5b80840192508235915067ffffffffffffffff8211156130575761305661300e565b5b60208301925060018202360383131561307357613072613013565b5b509250929050565b600081905092915050565b6000613092838561307b565b935061309f8385846122fa565b82840190509392505050565b60006130b8828486613086565b91508190509392505050565b60006130cf82612409565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361310157613100612a24565b5b600182019050919050565b60006060820190506131216000830186612b00565b61312e6020830185612b00565b61313b6040830184612413565b949350505050565b61314c816123d5565b811461315757600080fd5b50565b60008151905061316981613143565b92915050565b6000602082840312156131855761318461219e565b5b60006131938482850161315a565b91505092915050565b7f45524331393637557067726164653a206e657720696d706c656d656e7461746960008201527f6f6e206973206e6f742055555053000000000000000000000000000000000000602082015250565b60006131f8602e8361271d565b91506132038261319c565b604082019050919050565b60006020820190508181036000830152613227816131eb565b9050919050565b7f45524331393637557067726164653a20756e737570706f727465642070726f7860008201527f6961626c65555549440000000000000000000000000000000000000000000000602082015250565b600061328a60298361271d565b91506132958261322e565b604082019050919050565b600060208201905081810360008301526132b98161327d565b9050919050565b7f4b657920646f6573206e6f742065786973740000000000000000000000000000600082015250565b60006132f660128361271d565b9150613301826132c0565b602082019050919050565b60006020820190508181036000830152613325816132e9565b9050919050565b600067ffffffffffffffff8211156133475761334661224e565b5b602082029050602081019050919050565b600067ffffffffffffffff8211156133735761337261224e565b5b61337c8261223d565b9050602081019050919050565b60005b838110156133a757808201518184015260208101905061338c565b60008484015250505050565b60006133c66133c184613358565b6122ae565b9050828152602081018484840111156133e2576133e1612238565b5b6133ed848285613389565b509392505050565b600082601f83011261340a57613409612233565b5b815161341a8482602086016133b3565b91505092915050565b60006134366134318461332c565b6122ae565b905080838252602082019050602084028301858111156134595761345861263a565b5b835b818110156134a057805167ffffffffffffffff81111561347e5761347d612233565b5b80860161348b89826133f5565b8552602085019450505060208101905061345b565b5050509392505050565b600082601f8301126134bf576134be612233565b5b81516134cf848260208601613423565b91505092915050565b6000602082840312156134ee576134ed61219e565b5b600082015167ffffffffffffffff81111561350c5761350b6121a3565b5b613518848285016134aa565b91505092915050565b600081519050919050565b600061353782613521565b613541818561307b565b9350613551818560208601613389565b80840191505092915050565b6000613569828461352c565b915081905092915050565b7f4b65792063616e6e6f74206265205a45524f0000000000000000000000000000600082015250565b60006135aa60128361271d565b91506135b582613574565b602082019050919050565b600060208201905081810360008301526135d98161359d565b9050919050565b7f4b657920616c7265616479206578697374730000000000000000000000000000600082015250565b600061361660128361271d565b9150613621826135e0565b602082019050919050565b6000602082019050818103600083015261364581613609565b9050919050565b7f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60008201527f6f74206120636f6e747261637400000000000000000000000000000000000000602082015250565b60006136a8602d8361271d565b91506136b38261364c565b604082019050919050565b600060208201905081810360008301526136d78161369b565b9050919050565b600081519050919050565b600081905092915050565b60006136ff826136de565b61370981856136e9565b9350613719818560208601613389565b80840191505092915050565b600061373182846136f4565b915081905092915050565b7f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000600082015250565b6000613772601d8361271d565b915061377d8261373c565b602082019050919050565b600060208201905081810360008301526137a181613765565b9050919050565b60006137b382613521565b6137bd818561271d565b93506137cd818560208601613389565b6137d68161223d565b840191505092915050565b600060208201905081810360008301526137fb81846137a8565b90509291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220b9a705323bc8f01d8f4dbeceb8ced8a80c8bbe652338c786272a7670462c349664736f6c63430008110033";

type MatcherConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MatcherConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Matcher__factory extends ContractFactory {
  constructor(...args: MatcherConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    globalConfig_: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(globalConfig_, overrides || {});
  }
  override deploy(
    globalConfig_: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(globalConfig_, overrides || {}) as Promise<
      Matcher & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Matcher__factory {
    return super.connect(runner) as Matcher__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MatcherInterface {
    return new Interface(_abi) as MatcherInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Matcher {
    return new Contract(address, _abi, runner) as unknown as Matcher;
  }
}
