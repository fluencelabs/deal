/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  Payment,
  PaymentInterface,
} from "../../../contracts/Deal/Payment";

const _abi = [
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
    name: "balance",
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
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "air",
            type: "string",
          },
          {
            internalType: "string",
            name: "prevData",
            type: "string",
          },
          {
            internalType: "string",
            name: "params",
            type: "string",
          },
          {
            internalType: "string",
            name: "callResults",
            type: "string",
          },
        ],
        internalType: "struct Particle",
        name: "particle",
        type: "tuple",
      },
    ],
    name: "commitParticle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "depositToPaymentBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "particleHash",
        type: "bytes32",
      },
      {
        internalType: "PATId",
        name: "patId",
        type: "bytes32",
      },
    ],
    name: "getReward",
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
        internalType: "PATId",
        name: "patId",
        type: "bytes32",
      },
      {
        internalType: "bytes32[]",
        name: "particlesHashes",
        type: "bytes32[]",
      },
    ],
    name: "withdrawForWorker",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawFromPaymentBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523073ffffffffffffffffffffffffffffffffffffffff1660809073ffffffffffffffffffffffffffffffffffffffff1681525034801561004357600080fd5b5060805161369061007b6000396000818161020901528181610297015281816103910152818161041f01526104cf01526136906000f3fe6080604052600436106100865760003560e01c8063ab088f4f11610059578063ab088f4f14610124578063b69ef8a814610161578063dc79f1591461018c578063e759fdb0146101b5578063ec614b2c146101de57610086565b80633659cfe61461008b5780634f1ef286146100b457806352d1902d146100d05780639ab1ea66146100fb575b600080fd5b34801561009757600080fd5b506100b260048036038101906100ad9190611ee8565b610207565b005b6100ce60048036038101906100c9919061205b565b61038f565b005b3480156100dc57600080fd5b506100e56104cb565b6040516100f291906120d0565b60405180910390f35b34801561010757600080fd5b50610122600480360381019061011d9190612121565b610584565b005b34801561013057600080fd5b5061014b600480360381019061014691906121a6565b6106b6565b60405161015891906121f5565b60405180910390f35b34801561016d57600080fd5b50610176610994565b60405161018391906121f5565b60405180910390f35b34801561019857600080fd5b506101b360048036038101906101ae9190612234565b61099a565b005b3480156101c157600080fd5b506101dc60048036038101906101d791906122dd565b611028565b005b3480156101ea57600080fd5b5061020560048036038101906102009190612121565b6113b4565b005b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1603610295576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161028c906123c0565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166102d4611536565b73ffffffffffffffffffffffffffffffffffffffff161461032a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161032190612452565b60405180910390fd5b6103338161158d565b61038c81600067ffffffffffffffff81111561035257610351611f30565b5b6040519080825280601f01601f1916602001820160405280156103845781602001600182028036833780820191505090505b506000611590565b50565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff160361041d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610414906123c0565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1661045c611536565b73ffffffffffffffffffffffffffffffffffffffff16146104b2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104a990612452565b60405180910390fd5b6104bb8261158d565b6104c782826001611590565b5050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff161461055b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610552906124e4565b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b905090565b600061058e6116fe565b73ffffffffffffffffffffffffffffffffffffffff1663c3f909d46040518163ffffffff1660e01b8152600401602060405180830381865afa1580156105d8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105fc9190612542565b73ffffffffffffffffffffffffffffffffffffffff16633013ce296040518163ffffffff1660e01b8152600401602060405180830381865afa158015610646573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061066a91906125ad565b90506106993330848473ffffffffffffffffffffffffffffffffffffffff16611706909392919063ffffffff16565b81603260008282546106ab9190612609565b925050819055505050565b6000806034600085815260200190815260200160002090508060000160009054906101000a900460ff1661071f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161071690612689565b60405180910390fd5b60006107296116fe565b73ffffffffffffffffffffffffffffffffffffffff1663c3f909d46040518163ffffffff1660e01b8152600401602060405180830381865afa158015610773573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107979190612542565b73ffffffffffffffffffffffffffffffffffffffff1663a7c1abe06040518163ffffffff1660e01b8152600401602060405180830381865afa1580156107e1573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061080591906126e7565b73ffffffffffffffffffffffffffffffffffffffff1663e2d2bfe36040518163ffffffff1660e01b8152600401602060405180830381865afa15801561084f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108739190612752565b73ffffffffffffffffffffffffffffffffffffffff1663766718086040518163ffffffff1660e01b8152600401602060405180830381865afa1580156108bd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108e19190612794565b9050600082600101549050806001836108fa91906127c1565b1161093a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161093190612841565b60405180910390fd5b610944818661178f565b1580610963575061096160018261095b91906127c1565b8661178f565b155b15610974576000935050505061098e565b826002015483600301546109889190612890565b93505050505b92915050565b60325481565b60008180600001906109ac91906128d0565b8380602001906109bc91906128d0565b8580604001906109cc91906128d0565b8780606001906109dc91906128d0565b6040516020016109f3989796959493929190612960565b6040516020818303038152906040528051906020012090506000603460008381526020019081526020016000206001015414610a64576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a5b90612a15565b60405180910390fd5b6000610a6e6116fe565b905060008173ffffffffffffffffffffffffffffffffffffffff1663c3f909d46040518163ffffffff1660e01b8152600401602060405180830381865afa158015610abd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ae19190612542565b905060008273ffffffffffffffffffffffffffffffffffffffff1663c1499f716040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b30573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b549190612a73565b905060008273ffffffffffffffffffffffffffffffffffffffff1663a7c1abe06040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ba3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bc791906126e7565b73ffffffffffffffffffffffffffffffffffffffff1663e2d2bfe36040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c11573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c359190612752565b73ffffffffffffffffffffffffffffffffffffffff1663766718086040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c7f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ca39190612794565b905060008373ffffffffffffffffffffffffffffffffffffffff16631ef7e0a16040518163ffffffff1660e01b8152600401602060405180830381865afa158015610cf2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d169190612ade565b73ffffffffffffffffffffffffffffffffffffffff1663a689408c886040518263ffffffff1660e01b8152600401610d4e9190612c5b565b6000604051808303816000875af1158015610d6d573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250810190610d969190612d55565b905060005b8151811015610e995760008473ffffffffffffffffffffffffffffffffffffffff1663aa5a0bcd848481518110610dd557610dd4612d9e565b5b60200260200101516040518263ffffffff1660e01b8152600401610df99190612dee565b602060405180830381865afa158015610e16573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e3a9190612794565b90506000600882901c9050600060ff83166001901b905080603560008881526020019081526020016000206000848152602001908152602001600020600082825417925050819055505050508080610e9190612e09565b915050610d9b565b5060006033600084815260200190815260200160002054905060008573ffffffffffffffffffffffffffffffffffffffff16635fc8f59c6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610eff573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f239190612794565b90506000600183610f349190612609565b6002610f409190612f84565b82610f4b9190612890565b905060405180608001604052806001151581526020018681526020018551815260200182815250603460008b815260200190815260200160002060008201518160000160006101000a81548160ff021916908315150217905550602082015181600101556040820151816002015560608201518160030155905050600183610fd39190612609565b60336000878152602001908152602001600020819055508060326000828254610ffc91906127c1565b9250508190555080603760008282546110159190612609565b9250508190555050505050505050505050565b60006110326116fe565b905060008173ffffffffffffffffffffffffffffffffffffffff1663c3f909d46040518163ffffffff1660e01b8152600401602060405180830381865afa158015611081573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110a59190612542565b905060008273ffffffffffffffffffffffffffffffffffffffff1663c1499f716040518163ffffffff1660e01b8152600401602060405180830381865afa1580156110f4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111189190612a73565b905060008173ffffffffffffffffffffffffffffffffffffffff1663aa5a0bcd886040518263ffffffff1660e01b81526004016111559190612dee565b602060405180830381865afa158015611172573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111969190612794565b9050600080600090505b8787905081101561127e5760008888838181106111c0576111bf612d9e565b5b9050602002013590506111ee84603660008481526020019081526020016000206118e790919063ffffffff16565b1561122e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016112259061301b565b60405180910390fd5b611238818b6106b6565b836112439190612609565b925061126a846036600084815260200190815260200160002061192390919063ffffffff16565b50808061127690612e09565b9150506111a0565b50806037600082825461129191906127c1565b925050819055506113aa8373ffffffffffffffffffffffffffffffffffffffff1663c79d469d8a6040518263ffffffff1660e01b81526004016112d49190612dee565b602060405180830381865afa1580156112f1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113159190613050565b828673ffffffffffffffffffffffffffffffffffffffff16633013ce296040518163ffffffff1660e01b8152600401602060405180830381865afa158015611361573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061138591906125ad565b73ffffffffffffffffffffffffffffffffffffffff166119619092919063ffffffff16565b5050505050505050565b60006113be6116fe565b73ffffffffffffffffffffffffffffffffffffffff1663c3f909d46040518163ffffffff1660e01b8152600401602060405180830381865afa158015611408573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061142c9190612542565b73ffffffffffffffffffffffffffffffffffffffff16633013ce296040518163ffffffff1660e01b8152600401602060405180830381865afa158015611476573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061149a91906125ad565b9050816037546032546114ad91906127c1565b10156114ee576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114e5906130c9565b60405180910390fd5b816032600082825461150091906127c1565b9250508190555061153233838373ffffffffffffffffffffffffffffffffffffffff166119619092919063ffffffff16565b5050565b60006115647f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b6119e7565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b50565b6115bc7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd914360001b6119f1565b60000160009054906101000a900460ff16156115e0576115db836119fb565b6116f9565b8273ffffffffffffffffffffffffffffffffffffffff166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa92505050801561164857506040513d601f19601f8201168201806040525081019061164591906130fe565b60015b611687576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161167e9061319d565b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b81146116ec576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116e39061322f565b60405180910390fd5b506116f8838383611ab4565b5b505050565b600033905090565b611789846323b872dd60e01b8585856040516024016117279392919061325e565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611ae0565b50505050565b60008061179a6116fe565b73ffffffffffffffffffffffffffffffffffffffff1663c1499f716040518163ffffffff1660e01b8152600401602060405180830381865afa1580156117e4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118089190612a73565b905060008173ffffffffffffffffffffffffffffffffffffffff1663aa5a0bcd856040518263ffffffff1660e01b81526004016118459190612dee565b602060405180830381865afa158015611862573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118869190612794565b90506000600882901c9050600060ff83166001901b9050600081603560008a815260200190815260200160002060008581526020019081526020016000205416036118d85760009450505050506118e1565b60019450505050505b92915050565b600080600883901c9050600060ff84166001901b9050600081866000016000858152602001908152602001600020541614159250505092915050565b6000600882901c9050600060ff83166001901b9050808460000160008481526020019081526020016000206000828254179250508190555050505050565b6119e28363a9059cbb60e01b8484604051602401611980929190613295565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050611ae0565b505050565b6000819050919050565b6000819050919050565b611a0481611ba7565b611a43576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a3a90613330565b60405180910390fd5b80611a707f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b6119e7565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b611abd83611bca565b600082511180611aca5750805b15611adb57611ad98383611c19565b505b505050565b6000611b42826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff16611c469092919063ffffffff16565b9050600081511115611ba25780806020019051810190611b629190613388565b611ba1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b9890613427565b60405180910390fd5b5b505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b611bd3816119fb565b8073ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a250565b6060611c3e838360405180606001604052806027815260200161363460279139611c5e565b905092915050565b6060611c558484600085611ce4565b90509392505050565b60606000808573ffffffffffffffffffffffffffffffffffffffff1685604051611c8891906134b8565b600060405180830381855af49150503d8060008114611cc3576040519150601f19603f3d011682016040523d82523d6000602084013e611cc8565b606091505b5091509150611cd986838387611db1565b925050509392505050565b606082471015611d29576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611d2090613541565b60405180910390fd5b6000808673ffffffffffffffffffffffffffffffffffffffff168587604051611d5291906134b8565b60006040518083038185875af1925050503d8060008114611d8f576040519150601f19603f3d011682016040523d82523d6000602084013e611d94565b606091505b5091509150611da587838387611db1565b92505050949350505050565b60608315611e13576000835103611e0b57611dcb85611ba7565b611e0a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e01906135ad565b60405180910390fd5b5b829050611e1e565b611e1d8383611e26565b5b949350505050565b600082511115611e395781518083602001fd5b806040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e6d9190613611565b60405180910390fd5b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611eb582611e8a565b9050919050565b611ec581611eaa565b8114611ed057600080fd5b50565b600081359050611ee281611ebc565b92915050565b600060208284031215611efe57611efd611e80565b5b6000611f0c84828501611ed3565b91505092915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611f6882611f1f565b810181811067ffffffffffffffff82111715611f8757611f86611f30565b5b80604052505050565b6000611f9a611e76565b9050611fa68282611f5f565b919050565b600067ffffffffffffffff821115611fc657611fc5611f30565b5b611fcf82611f1f565b9050602081019050919050565b82818337600083830152505050565b6000611ffe611ff984611fab565b611f90565b90508281526020810184848401111561201a57612019611f1a565b5b612025848285611fdc565b509392505050565b600082601f83011261204257612041611f15565b5b8135612052848260208601611feb565b91505092915050565b6000806040838503121561207257612071611e80565b5b600061208085828601611ed3565b925050602083013567ffffffffffffffff8111156120a1576120a0611e85565b5b6120ad8582860161202d565b9150509250929050565b6000819050919050565b6120ca816120b7565b82525050565b60006020820190506120e560008301846120c1565b92915050565b6000819050919050565b6120fe816120eb565b811461210957600080fd5b50565b60008135905061211b816120f5565b92915050565b60006020828403121561213757612136611e80565b5b60006121458482850161210c565b91505092915050565b612157816120b7565b811461216257600080fd5b50565b6000813590506121748161214e565b92915050565b612183816120b7565b811461218e57600080fd5b50565b6000813590506121a08161217a565b92915050565b600080604083850312156121bd576121bc611e80565b5b60006121cb85828601612165565b92505060206121dc85828601612191565b9150509250929050565b6121ef816120eb565b82525050565b600060208201905061220a60008301846121e6565b92915050565b600080fd5b60006080828403121561222b5761222a612210565b5b81905092915050565b60006020828403121561224a57612249611e80565b5b600082013567ffffffffffffffff81111561226857612267611e85565b5b61227484828501612215565b91505092915050565b600080fd5b600080fd5b60008083601f84011261229d5761229c611f15565b5b8235905067ffffffffffffffff8111156122ba576122b961227d565b5b6020830191508360208202830111156122d6576122d5612282565b5b9250929050565b6000806000604084860312156122f6576122f5611e80565b5b600061230486828701612191565b935050602084013567ffffffffffffffff81111561232557612324611e85565b5b61233186828701612287565b92509250509250925092565b600082825260208201905092915050565b7f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060008201527f64656c656761746563616c6c0000000000000000000000000000000000000000602082015250565b60006123aa602c8361233d565b91506123b58261234e565b604082019050919050565b600060208201905081810360008301526123d98161239d565b9050919050565b7f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060008201527f6163746976652070726f78790000000000000000000000000000000000000000602082015250565b600061243c602c8361233d565b9150612447826123e0565b604082019050919050565b6000602082019050818103600083015261246b8161242f565b9050919050565b7f555550535570677261646561626c653a206d757374206e6f742062652063616c60008201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000602082015250565b60006124ce60388361233d565b91506124d982612472565b604082019050919050565b600060208201905081810360008301526124fd816124c1565b9050919050565b600061250f82611eaa565b9050919050565b61251f81612504565b811461252a57600080fd5b50565b60008151905061253c81612516565b92915050565b60006020828403121561255857612557611e80565b5b60006125668482850161252d565b91505092915050565b600061257a82611eaa565b9050919050565b61258a8161256f565b811461259557600080fd5b50565b6000815190506125a781612581565b92915050565b6000602082840312156125c3576125c2611e80565b5b60006125d184828501612598565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000612614826120eb565b915061261f836120eb565b9250828201905080821115612637576126366125da565b5b92915050565b7f5061727469636c65206e6f742076616c69640000000000000000000000000000600082015250565b600061267360128361233d565b915061267e8261263d565b602082019050919050565b600060208201905081810360008301526126a281612666565b9050919050565b60006126b482611eaa565b9050919050565b6126c4816126a9565b81146126cf57600080fd5b50565b6000815190506126e1816126bb565b92915050565b6000602082840312156126fd576126fc611e80565b5b600061270b848285016126d2565b91505092915050565b600061271f82611eaa565b9050919050565b61272f81612714565b811461273a57600080fd5b50565b60008151905061274c81612726565b92915050565b60006020828403121561276857612767611e80565b5b60006127768482850161273d565b91505092915050565b60008151905061278e816120f5565b92915050565b6000602082840312156127aa576127a9611e80565b5b60006127b88482850161277f565b91505092915050565b60006127cc826120eb565b91506127d7836120eb565b92508282039050818111156127ef576127ee6125da565b5b92915050565b7f5061727469636c65206e6f7420636f6e6669726d656400000000000000000000600082015250565b600061282b60168361233d565b9150612836826127f5565b602082019050919050565b6000602082019050818103600083015261285a8161281e565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061289b826120eb565b91506128a6836120eb565b9250826128b6576128b5612861565b5b828204905092915050565b600080fd5b600080fd5b600080fd5b600080833560016020038436030381126128ed576128ec6128c1565b5b80840192508235915067ffffffffffffffff82111561290f5761290e6128c6565b5b60208301925060018202360383131561292b5761292a6128cb565b5b509250929050565b600061293f838561233d565b935061294c838584611fdc565b61295583611f1f565b840190509392505050565b6000608082019050818103600083015261297b818a8c612933565b9050818103602083015261299081888a612933565b905081810360408301526129a5818688612933565b905081810360608301526129ba818486612933565b90509998505050505050505050565b7f5061727469636c6520616c726561647920657869737473000000000000000000600082015250565b60006129ff60178361233d565b9150612a0a826129c9565b602082019050919050565b60006020820190508181036000830152612a2e816129f2565b9050919050565b6000612a4082611eaa565b9050919050565b612a5081612a35565b8114612a5b57600080fd5b50565b600081519050612a6d81612a47565b92915050565b600060208284031215612a8957612a88611e80565b5b6000612a9784828501612a5e565b91505092915050565b6000612aab82611eaa565b9050919050565b612abb81612aa0565b8114612ac657600080fd5b50565b600081519050612ad881612ab2565b92915050565b600060208284031215612af457612af3611e80565b5b6000612b0284828501612ac9565b91505092915050565b600080fd5b600080fd5b600080fd5b60008083356001602003843603038112612b3757612b36612b15565b5b83810192508235915060208301925067ffffffffffffffff821115612b5f57612b5e612b0b565b5b600182023603831315612b7557612b74612b10565b5b509250929050565b600082825260208201905092915050565b6000612b9a8385612b7d565b9350612ba7838584611fdc565b612bb083611f1f565b840190509392505050565b600060808301612bce6000840184612b1a565b8583036000870152612be1838284612b8e565b92505050612bf26020840184612b1a565b8583036020870152612c05838284612b8e565b92505050612c166040840184612b1a565b8583036040870152612c29838284612b8e565b92505050612c3a6060840184612b1a565b8583036060870152612c4d838284612b8e565b925050508091505092915050565b60006020820190508181036000830152612c758184612bbb565b905092915050565b600067ffffffffffffffff821115612c9857612c97611f30565b5b602082029050602081019050919050565b600081519050612cb88161217a565b92915050565b6000612cd1612ccc84612c7d565b611f90565b90508083825260208201905060208402830185811115612cf457612cf3612282565b5b835b81811015612d1d5780612d098882612ca9565b845260208401935050602081019050612cf6565b5050509392505050565b600082601f830112612d3c57612d3b611f15565b5b8151612d4c848260208601612cbe565b91505092915050565b600060208284031215612d6b57612d6a611e80565b5b600082015167ffffffffffffffff811115612d8957612d88611e85565b5b612d9584828501612d27565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000612dd8826120b7565b9050919050565b612de881612dcd565b82525050565b6000602082019050612e036000830184612ddf565b92915050565b6000612e14826120eb565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203612e4657612e456125da565b5b600182019050919050565b60008160011c9050919050565b6000808291508390505b6001851115612ea857808604811115612e8457612e836125da565b5b6001851615612e935780820291505b8081029050612ea185612e51565b9450612e68565b94509492505050565b600082612ec15760019050612f7d565b81612ecf5760009050612f7d565b8160018114612ee55760028114612eef57612f1e565b6001915050612f7d565b60ff841115612f0157612f006125da565b5b8360020a915084821115612f1857612f176125da565b5b50612f7d565b5060208310610133831016604e8410600b8410161715612f535782820a905083811115612f4e57612f4d6125da565b5b612f7d565b612f608484846001612e5e565b92509050818404811115612f7757612f766125da565b5b81810290505b9392505050565b6000612f8f826120eb565b9150612f9a836120eb565b9250612fc77fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484612eb1565b905092915050565b7f416c726561647920706169640000000000000000000000000000000000000000600082015250565b6000613005600c8361233d565b915061301082612fcf565b602082019050919050565b6000602082019050818103600083015261303481612ff8565b9050919050565b60008151905061304a81611ebc565b92915050565b60006020828403121561306657613065611e80565b5b60006130748482850161303b565b91505092915050565b7f4e6f7420656e6f75676820667265652062616c616e6365000000000000000000600082015250565b60006130b360178361233d565b91506130be8261307d565b602082019050919050565b600060208201905081810360008301526130e2816130a6565b9050919050565b6000815190506130f88161214e565b92915050565b60006020828403121561311457613113611e80565b5b6000613122848285016130e9565b91505092915050565b7f45524331393637557067726164653a206e657720696d706c656d656e7461746960008201527f6f6e206973206e6f742055555053000000000000000000000000000000000000602082015250565b6000613187602e8361233d565b91506131928261312b565b604082019050919050565b600060208201905081810360008301526131b68161317a565b9050919050565b7f45524331393637557067726164653a20756e737570706f727465642070726f7860008201527f6961626c65555549440000000000000000000000000000000000000000000000602082015250565b600061321960298361233d565b9150613224826131bd565b604082019050919050565b600060208201905081810360008301526132488161320c565b9050919050565b61325881611eaa565b82525050565b6000606082019050613273600083018661324f565b613280602083018561324f565b61328d60408301846121e6565b949350505050565b60006040820190506132aa600083018561324f565b6132b760208301846121e6565b9392505050565b7f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60008201527f6f74206120636f6e747261637400000000000000000000000000000000000000602082015250565b600061331a602d8361233d565b9150613325826132be565b604082019050919050565b600060208201905081810360008301526133498161330d565b9050919050565b60008115159050919050565b61336581613350565b811461337057600080fd5b50565b6000815190506133828161335c565b92915050565b60006020828403121561339e5761339d611e80565b5b60006133ac84828501613373565b91505092915050565b7f5361666545524332303a204552433230206f7065726174696f6e20646964206e60008201527f6f74207375636365656400000000000000000000000000000000000000000000602082015250565b6000613411602a8361233d565b915061341c826133b5565b604082019050919050565b6000602082019050818103600083015261344081613404565b9050919050565b600081519050919050565b600081905092915050565b60005b8381101561347b578082015181840152602081019050613460565b60008484015250505050565b600061349282613447565b61349c8185613452565b93506134ac81856020860161345d565b80840191505092915050565b60006134c48284613487565b915081905092915050565b7f416464726573733a20696e73756666696369656e742062616c616e636520666f60008201527f722063616c6c0000000000000000000000000000000000000000000000000000602082015250565b600061352b60268361233d565b9150613536826134cf565b604082019050919050565b6000602082019050818103600083015261355a8161351e565b9050919050565b7f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000600082015250565b6000613597601d8361233d565b91506135a282613561565b602082019050919050565b600060208201905081810360008301526135c68161358a565b9050919050565b600081519050919050565b60006135e3826135cd565b6135ed818561233d565b93506135fd81856020860161345d565b61360681611f1f565b840191505092915050565b6000602082019050818103600083015261362b81846135d8565b90509291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212206d90893cedc315df7b1ef8300318b279ba4d59ffd57c78e6f95bf8d05f33406764736f6c63430008110033";

type PaymentConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PaymentConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Payment__factory extends ContractFactory {
  constructor(...args: PaymentConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Payment> {
    return super.deploy(overrides || {}) as Promise<Payment>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Payment {
    return super.attach(address) as Payment;
  }
  override connect(signer: Signer): Payment__factory {
    return super.connect(signer) as Payment__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PaymentInterface {
    return new utils.Interface(_abi) as PaymentInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Payment {
    return new Contract(address, _abi, signerOrProvider) as Payment;
  }
}
