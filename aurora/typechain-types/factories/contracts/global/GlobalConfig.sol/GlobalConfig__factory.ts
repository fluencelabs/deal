/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  GlobalConfig,
  GlobalConfigInterface,
} from "../../../../contracts/global/GlobalConfig.sol/GlobalConfig";

const _abi = [
  {
    inputs: [],
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
    name: "epochManager",
    outputs: [
      {
        internalType: "contract IEpochManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "contract IFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
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
        internalType: "contract IERC20",
        name: "fluenceToken_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "withdrawTimeout_",
        type: "uint256",
      },
      {
        internalType: "contract IEpochManager",
        name: "epochManager_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "matcher",
    outputs: [
      {
        internalType: "contract IMatcher",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IEpochManager",
        name: "epochManager_",
        type: "address",
      },
    ],
    name: "setEpochManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IFactory",
        name: "factory_",
        type: "address",
      },
    ],
    name: "setFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "fluenceToken_",
        type: "address",
      },
    ],
    name: "setFluenceToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IMatcher",
        name: "matcher_",
        type: "address",
      },
    ],
    name: "setMatcher",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "withdrawTimeout_",
        type: "uint256",
      },
    ],
    name: "setWithdrawTimeout",
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
    inputs: [],
    name: "withdrawTimeout",
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
  "0x60a06040523073ffffffffffffffffffffffffffffffffffffffff1660809073ffffffffffffffffffffffffffffffffffffffff168152503480156200004457600080fd5b50620000556200005b60201b60201c565b62000205565b600060019054906101000a900460ff1615620000ae576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000a590620001a8565b60405180910390fd5b60ff801660008054906101000a900460ff1660ff16146200011f5760ff6000806101000a81548160ff021916908360ff1602179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249860ff604051620001169190620001e8565b60405180910390a15b565b600082825260208201905092915050565b7f496e697469616c697a61626c653a20636f6e747261637420697320696e69746960008201527f616c697a696e6700000000000000000000000000000000000000000000000000602082015250565b60006200019060278362000121565b91506200019d8262000132565b604082019050919050565b60006020820190508181036000830152620001c38162000181565b9050919050565b600060ff82169050919050565b620001e281620001ca565b82525050565b6000602082019050620001ff6000830184620001d7565b92915050565b6080516120c66200023d600039600081816103ad0152818161043b01528181610535015281816105c3015261067301526120c66000f3fe6080604052600436106100fe5760003560e01c80638da5cb5b11610095578063c350a1b511610064578063c350a1b5146102da578063c45a015514610303578063d4d59edb1461032e578063e2d2bfe314610357578063f2fde38b14610382576100fe565b80638da5cb5b14610230578063963ddbe91461025b5780639c15d1a214610284578063ac027f97146102af576100fe565b80635bb47808116100d15780635bb478081461019c578063715018a6146101c557806372941460146101dc5780637e7e66b214610205576100fe565b80633659cfe6146101035780634f1ef2861461012c57806352d1902d1461014857806353d6e10014610173575b600080fd5b34801561010f57600080fd5b5061012a600480360381019061012591906112cd565b6103ab565b005b61014660048036038101906101419190611440565b610533565b005b34801561015457600080fd5b5061015d61066f565b60405161016a91906114b5565b60405180910390f35b34801561017f57600080fd5b5061019a6004803603810190610195919061150e565b610728565b005b3480156101a857600080fd5b506101c360048036038101906101be9190611579565b610774565b005b3480156101d157600080fd5b506101da6107c0565b005b3480156101e857600080fd5b5061020360048036038101906101fe91906115dc565b6107d4565b005b34801561021157600080fd5b5061021a6107e6565b6040516102279190611668565b60405180910390f35b34801561023c57600080fd5b5061024561080c565b6040516102529190611692565b60405180910390f35b34801561026757600080fd5b50610282600480360381019061027d91906116eb565b61081b565b005b34801561029057600080fd5b50610299610867565b6040516102a69190611727565b60405180910390f35b3480156102bb57600080fd5b506102c461086d565b6040516102d19190611763565b60405180910390f35b3480156102e657600080fd5b5061030160048036038101906102fc91906117bc565b610893565b005b34801561030f57600080fd5b50610318610a5d565b6040516103259190611830565b60405180910390f35b34801561033a57600080fd5b506103556004803603810190610350919061184b565b610a83565b005b34801561036357600080fd5b5061036c610acf565b6040516103799190611899565b60405180910390f35b34801561038e57600080fd5b506103a960048036038101906103a491906112cd565b610af5565b005b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1603610439576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161043090611937565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16610478610b78565b73ffffffffffffffffffffffffffffffffffffffff16146104ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c5906119c9565b60405180910390fd5b6104d781610bcf565b61053081600067ffffffffffffffff8111156104f6576104f5611315565b5b6040519080825280601f01601f1916602001820160405280156105285781602001600182028036833780820191505090505b506000610bda565b50565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16036105c1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105b890611937565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16610600610b78565b73ffffffffffffffffffffffffffffffffffffffff1614610656576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161064d906119c9565b60405180910390fd5b61065f82610bcf565b61066b82826001610bda565b5050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16146106ff576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106f690611a5b565b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b905090565b610730610d48565b80606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61077c610d48565b80606960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6107c8610d48565b6107d26000610dc6565b565b6107dc610d48565b8060668190555050565b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000610816610e8c565b905090565b610823610d48565b80606860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60665481565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060019054906101000a900460ff161590508080156108c45750600160008054906101000a900460ff1660ff16105b806108f157506108d330610eb6565b1580156108f05750600160008054906101000a900460ff1660ff16145b5b610930576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161092790611aed565b60405180910390fd5b60016000806101000a81548160ff021916908360ff160217905550801561096d576001600060016101000a81548160ff0219169083151502179055505b83606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260668190555081606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506109fe610ed9565b8015610a575760008060016101000a81548160ff0219169083151502179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024986001604051610a4e9190611b55565b60405180910390a15b50505050565b606960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610a8b610d48565b80606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610afd610d48565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610b6c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b6390611be2565b60405180910390fd5b610b7581610dc6565b50565b6000610ba67f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b610f32565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b610bd7610d48565b50565b610c067f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd914360001b610f3c565b60000160009054906101000a900460ff1615610c2a57610c2583610f46565b610d43565b8273ffffffffffffffffffffffffffffffffffffffff166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610c9257506040513d601f19601f82011682018060405250810190610c8f9190611c2e565b60015b610cd1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cc890611ccd565b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b8114610d36576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d2d90611d5f565b60405180910390fd5b50610d42838383610fff565b5b505050565b610d5061102b565b73ffffffffffffffffffffffffffffffffffffffff16610d6e61080c565b73ffffffffffffffffffffffffffffffffffffffff1614610dc4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dbb90611dcb565b60405180910390fd5b565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600060019054906101000a900460ff16610f28576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f1f90611e5d565b60405180910390fd5b610f30611033565b565b6000819050919050565b6000819050919050565b610f4f81610eb6565b610f8e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8590611eef565b60405180910390fd5b80610fbb7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b610f32565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61100883611094565b6000825111806110155750805b156110265761102483836110e3565b505b505050565b600033905090565b600060019054906101000a900460ff16611082576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161107990611e5d565b60405180910390fd5b61109261108d61102b565b610dc6565b565b61109d81610f46565b8073ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a250565b6060611108838360405180606001604052806027815260200161206a60279139611110565b905092915050565b60606000808573ffffffffffffffffffffffffffffffffffffffff168560405161113a9190611f80565b600060405180830381855af49150503d8060008114611175576040519150601f19603f3d011682016040523d82523d6000602084013e61117a565b606091505b509150915061118b86838387611196565b925050509392505050565b606083156111f85760008351036111f0576111b085610eb6565b6111ef576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111e690611fe3565b60405180910390fd5b5b829050611203565b611202838361120b565b5b949350505050565b60008251111561121e5781518083602001fd5b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112529190612047565b60405180910390fd5b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061129a8261126f565b9050919050565b6112aa8161128f565b81146112b557600080fd5b50565b6000813590506112c7816112a1565b92915050565b6000602082840312156112e3576112e2611265565b5b60006112f1848285016112b8565b91505092915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61134d82611304565b810181811067ffffffffffffffff8211171561136c5761136b611315565b5b80604052505050565b600061137f61125b565b905061138b8282611344565b919050565b600067ffffffffffffffff8211156113ab576113aa611315565b5b6113b482611304565b9050602081019050919050565b82818337600083830152505050565b60006113e36113de84611390565b611375565b9050828152602081018484840111156113ff576113fe6112ff565b5b61140a8482856113c1565b509392505050565b600082601f830112611427576114266112fa565b5b81356114378482602086016113d0565b91505092915050565b6000806040838503121561145757611456611265565b5b6000611465858286016112b8565b925050602083013567ffffffffffffffff8111156114865761148561126a565b5b61149285828601611412565b9150509250929050565b6000819050919050565b6114af8161149c565b82525050565b60006020820190506114ca60008301846114a6565b92915050565b60006114db8261128f565b9050919050565b6114eb816114d0565b81146114f657600080fd5b50565b600081359050611508816114e2565b92915050565b60006020828403121561152457611523611265565b5b6000611532848285016114f9565b91505092915050565b60006115468261128f565b9050919050565b6115568161153b565b811461156157600080fd5b50565b6000813590506115738161154d565b92915050565b60006020828403121561158f5761158e611265565b5b600061159d84828501611564565b91505092915050565b6000819050919050565b6115b9816115a6565b81146115c457600080fd5b50565b6000813590506115d6816115b0565b92915050565b6000602082840312156115f2576115f1611265565b5b6000611600848285016115c7565b91505092915050565b6000819050919050565b600061162e6116296116248461126f565b611609565b61126f565b9050919050565b600061164082611613565b9050919050565b600061165282611635565b9050919050565b61166281611647565b82525050565b600060208201905061167d6000830184611659565b92915050565b61168c8161128f565b82525050565b60006020820190506116a76000830184611683565b92915050565b60006116b88261128f565b9050919050565b6116c8816116ad565b81146116d357600080fd5b50565b6000813590506116e5816116bf565b92915050565b60006020828403121561170157611700611265565b5b600061170f848285016116d6565b91505092915050565b611721816115a6565b82525050565b600060208201905061173c6000830184611718565b92915050565b600061174d82611635565b9050919050565b61175d81611742565b82525050565b60006020820190506117786000830184611754565b92915050565b60006117898261128f565b9050919050565b6117998161177e565b81146117a457600080fd5b50565b6000813590506117b681611790565b92915050565b6000806000606084860312156117d5576117d4611265565b5b60006117e3868287016114f9565b93505060206117f4868287016115c7565b9250506040611805868287016117a7565b9150509250925092565b600061181a82611635565b9050919050565b61182a8161180f565b82525050565b60006020820190506118456000830184611821565b92915050565b60006020828403121561186157611860611265565b5b600061186f848285016117a7565b91505092915050565b600061188382611635565b9050919050565b61189381611878565b82525050565b60006020820190506118ae600083018461188a565b92915050565b600082825260208201905092915050565b7f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060008201527f64656c656761746563616c6c0000000000000000000000000000000000000000602082015250565b6000611921602c836118b4565b915061192c826118c5565b604082019050919050565b6000602082019050818103600083015261195081611914565b9050919050565b7f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060008201527f6163746976652070726f78790000000000000000000000000000000000000000602082015250565b60006119b3602c836118b4565b91506119be82611957565b604082019050919050565b600060208201905081810360008301526119e2816119a6565b9050919050565b7f555550535570677261646561626c653a206d757374206e6f742062652063616c60008201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000602082015250565b6000611a456038836118b4565b9150611a50826119e9565b604082019050919050565b60006020820190508181036000830152611a7481611a38565b9050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b6000611ad7602e836118b4565b9150611ae282611a7b565b604082019050919050565b60006020820190508181036000830152611b0681611aca565b9050919050565b6000819050919050565b600060ff82169050919050565b6000611b3f611b3a611b3584611b0d565b611609565b611b17565b9050919050565b611b4f81611b24565b82525050565b6000602082019050611b6a6000830184611b46565b92915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611bcc6026836118b4565b9150611bd782611b70565b604082019050919050565b60006020820190508181036000830152611bfb81611bbf565b9050919050565b611c0b8161149c565b8114611c1657600080fd5b50565b600081519050611c2881611c02565b92915050565b600060208284031215611c4457611c43611265565b5b6000611c5284828501611c19565b91505092915050565b7f45524331393637557067726164653a206e657720696d706c656d656e7461746960008201527f6f6e206973206e6f742055555053000000000000000000000000000000000000602082015250565b6000611cb7602e836118b4565b9150611cc282611c5b565b604082019050919050565b60006020820190508181036000830152611ce681611caa565b9050919050565b7f45524331393637557067726164653a20756e737570706f727465642070726f7860008201527f6961626c65555549440000000000000000000000000000000000000000000000602082015250565b6000611d496029836118b4565b9150611d5482611ced565b604082019050919050565b60006020820190508181036000830152611d7881611d3c565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000611db56020836118b4565b9150611dc082611d7f565b602082019050919050565b60006020820190508181036000830152611de481611da8565b9050919050565b7f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960008201527f6e697469616c697a696e67000000000000000000000000000000000000000000602082015250565b6000611e47602b836118b4565b9150611e5282611deb565b604082019050919050565b60006020820190508181036000830152611e7681611e3a565b9050919050565b7f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60008201527f6f74206120636f6e747261637400000000000000000000000000000000000000602082015250565b6000611ed9602d836118b4565b9150611ee482611e7d565b604082019050919050565b60006020820190508181036000830152611f0881611ecc565b9050919050565b600081519050919050565b600081905092915050565b60005b83811015611f43578082015181840152602081019050611f28565b60008484015250505050565b6000611f5a82611f0f565b611f648185611f1a565b9350611f74818560208601611f25565b80840191505092915050565b6000611f8c8284611f4f565b915081905092915050565b7f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000600082015250565b6000611fcd601d836118b4565b9150611fd882611f97565b602082019050919050565b60006020820190508181036000830152611ffc81611fc0565b9050919050565b600081519050919050565b600061201982612003565b61202381856118b4565b9350612033818560208601611f25565b61203c81611304565b840191505092915050565b60006020820190508181036000830152612061818461200e565b90509291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212204a7b5734dc3b3b7fa075105fdfd9c6820ec004197b55c2c22bb6b1c8522ec48764736f6c63430008110033";

type GlobalConfigConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GlobalConfigConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GlobalConfig__factory extends ContractFactory {
  constructor(...args: GlobalConfigConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<GlobalConfig> {
    return super.deploy(overrides || {}) as Promise<GlobalConfig>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): GlobalConfig {
    return super.attach(address) as GlobalConfig;
  }
  override connect(signer: Signer): GlobalConfig__factory {
    return super.connect(signer) as GlobalConfig__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GlobalConfigInterface {
    return new utils.Interface(_abi) as GlobalConfigInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GlobalConfig {
    return new Contract(address, _abi, signerOrProvider) as GlobalConfig;
  }
}
