/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  DeveloperFaucet,
  DeveloperFaucetInterface,
} from "../../../contracts/dev/DeveloperFaucet";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
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
    name: "receiveFLT",
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
    name: "receiveUSD",
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
  "0x60c06040523480156200001157600080fd5b506000808060019003915050806040516200002c90620000fc565b620000389190620001d6565b604051809103906000f08015801562000055573d6000803e3d6000fd5b5073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1681525050806040516200009890620000fc565b620000a49190620002bd565b604051809103906000f080158015620000c1573d6000803e3d6000fd5b5073ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff16815250505062000304565b611adb80620007bf83390190565b600082825260208201905092915050565b7f466c75656e6365205465737420546f6b656e0000000000000000000000000000600082015250565b6000620001536012836200010a565b915062000160826200011b565b602082019050919050565b7f464c540000000000000000000000000000000000000000000000000000000000600082015250565b6000620001a36003836200010a565b9150620001b0826200016b565b602082019050919050565b6000819050919050565b620001d081620001bb565b82525050565b60006060820190508181036000830152620001f18162000144565b90508181036020830152620002068162000194565b9050620002176040830184620001c5565b92915050565b7f555344205465737420546f6b656e000000000000000000000000000000000000600082015250565b600062000255600e836200010a565b915062000262826200021d565b602082019050919050565b7f7455534443000000000000000000000000000000000000000000000000000000600082015250565b6000620002a56005836200010a565b9150620002b2826200026d565b602082019050919050565b60006060820190508181036000830152620002d88162000246565b90508181036020830152620002ed8162000296565b9050620002fe6040830184620001c5565b92915050565b60805160a051610488620003376000396000818161018e015261023101526000818160c7015261016a01526104886000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80636321f58b14610051578063ac027f971461006d578063bb4a69691461008b578063f897a22b146100a7575b600080fd5b61006b600480360381019061006691906102ec565b6100c5565b005b610075610168565b604051610082919061038b565b60405180910390f35b6100a560048036038101906100a091906102ec565b61018c565b005b6100af61022f565b6040516100bc919061038b565b60405180910390f35b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff1660e01b81526004016101209291906103c4565b6020604051808303816000875af115801561013f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101639190610425565b505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff1660e01b81526004016101e79291906103c4565b6020604051808303816000875af1158015610206573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061022a9190610425565b505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061028382610258565b9050919050565b61029381610278565b811461029e57600080fd5b50565b6000813590506102b08161028a565b92915050565b6000819050919050565b6102c9816102b6565b81146102d457600080fd5b50565b6000813590506102e6816102c0565b92915050565b6000806040838503121561030357610302610253565b5b6000610311858286016102a1565b9250506020610322858286016102d7565b9150509250929050565b6000819050919050565b600061035161034c61034784610258565b61032c565b610258565b9050919050565b600061036382610336565b9050919050565b600061037582610358565b9050919050565b6103858161036a565b82525050565b60006020820190506103a0600083018461037c565b92915050565b6103af81610278565b82525050565b6103be816102b6565b82525050565b60006040820190506103d960008301856103a6565b6103e660208301846103b5565b9392505050565b60008115159050919050565b610402816103ed565b811461040d57600080fd5b50565b60008151905061041f816103f9565b92915050565b60006020828403121561043b5761043a610253565b5b600061044984828501610410565b9150509291505056fea264697066735822122065649d66262b045a5089486dd97d299f9b4110349fb378861f02736c07121cb364736f6c6343000811003360806040523480156200001157600080fd5b5060405162001adb38038062001adb8339818101604052810190620000379190620003bf565b828281600390816200004a91906200069a565b5080600490816200005c91906200069a565b5050506200007133826200007a60201b60201c565b5050506200089c565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620000ec576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000e390620007e2565b60405180910390fd5b6200010060008383620001e760201b60201c565b806002600082825462000114919062000833565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620001c791906200087f565b60405180910390a3620001e360008383620001ec60201b60201c565b5050565b505050565b505050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200025a826200020f565b810181811067ffffffffffffffff821117156200027c576200027b62000220565b5b80604052505050565b600062000291620001f1565b90506200029f82826200024f565b919050565b600067ffffffffffffffff821115620002c257620002c162000220565b5b620002cd826200020f565b9050602081019050919050565b60005b83811015620002fa578082015181840152602081019050620002dd565b60008484015250505050565b60006200031d6200031784620002a4565b62000285565b9050828152602081018484840111156200033c576200033b6200020a565b5b62000349848285620002da565b509392505050565b600082601f83011262000369576200036862000205565b5b81516200037b84826020860162000306565b91505092915050565b6000819050919050565b620003998162000384565b8114620003a557600080fd5b50565b600081519050620003b9816200038e565b92915050565b600080600060608486031215620003db57620003da620001fb565b5b600084015167ffffffffffffffff811115620003fc57620003fb62000200565b5b6200040a8682870162000351565b935050602084015167ffffffffffffffff8111156200042e576200042d62000200565b5b6200043c8682870162000351565b92505060406200044f86828701620003a8565b9150509250925092565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620004ac57607f821691505b602082108103620004c257620004c162000464565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200052c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620004ed565b620005388683620004ed565b95508019841693508086168417925050509392505050565b6000819050919050565b60006200057b620005756200056f8462000384565b62000550565b62000384565b9050919050565b6000819050919050565b62000597836200055a565b620005af620005a68262000582565b848454620004fa565b825550505050565b600090565b620005c6620005b7565b620005d38184846200058c565b505050565b5b81811015620005fb57620005ef600082620005bc565b600181019050620005d9565b5050565b601f8211156200064a576200061481620004c8565b6200061f84620004dd565b810160208510156200062f578190505b620006476200063e85620004dd565b830182620005d8565b50505b505050565b600082821c905092915050565b60006200066f600019846008026200064f565b1980831691505092915050565b60006200068a83836200065c565b9150826002028217905092915050565b620006a58262000459565b67ffffffffffffffff811115620006c157620006c062000220565b5b620006cd825462000493565b620006da828285620005ff565b600060209050601f831160018114620007125760008415620006fd578287015190505b6200070985826200067c565b86555062000779565b601f1984166200072286620004c8565b60005b828110156200074c5784890151825560018201915060208501945060208101905062000725565b868310156200076c578489015162000768601f8916826200065c565b8355505b6001600288020188555050505b505050505050565b600082825260208201905092915050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b6000620007ca601f8362000781565b9150620007d78262000792565b602082019050919050565b60006020820190508181036000830152620007fd81620007bb565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000620008408262000384565b91506200084d8362000384565b925082820190508082111562000868576200086762000804565b5b92915050565b620008798162000384565b82525050565b60006020820190506200089660008301846200086e565b92915050565b61122f80620008ac6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461016857806370a082311461019857806395d89b41146101c8578063a457c2d7146101e6578063a9059cbb14610216578063dd62ed3e14610246576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610276565b6040516100c39190610b0c565b60405180910390f35b6100e660048036038101906100e19190610bc7565b610308565b6040516100f39190610c22565b60405180910390f35b61010461032b565b6040516101119190610c4c565b60405180910390f35b610134600480360381019061012f9190610c67565b610335565b6040516101419190610c22565b60405180910390f35b610152610364565b60405161015f9190610cd6565b60405180910390f35b610182600480360381019061017d9190610bc7565b61036d565b60405161018f9190610c22565b60405180910390f35b6101b260048036038101906101ad9190610cf1565b6103a4565b6040516101bf9190610c4c565b60405180910390f35b6101d06103ec565b6040516101dd9190610b0c565b60405180910390f35b61020060048036038101906101fb9190610bc7565b61047e565b60405161020d9190610c22565b60405180910390f35b610230600480360381019061022b9190610bc7565b6104f5565b60405161023d9190610c22565b60405180910390f35b610260600480360381019061025b9190610d1e565b610518565b60405161026d9190610c4c565b60405180910390f35b60606003805461028590610d8d565b80601f01602080910402602001604051908101604052809291908181526020018280546102b190610d8d565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b5050505050905090565b60008061031361059f565b90506103208185856105a7565b600191505092915050565b6000600254905090565b60008061034061059f565b905061034d858285610770565b6103588585856107fc565b60019150509392505050565b60006012905090565b60008061037861059f565b905061039981858561038a8589610518565b6103949190610ded565b6105a7565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546103fb90610d8d565b80601f016020809104026020016040519081016040528092919081815260200182805461042790610d8d565b80156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b5050505050905090565b60008061048961059f565b905060006104978286610518565b9050838110156104dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d390610e93565b60405180910390fd5b6104e982868684036105a7565b60019250505092915050565b60008061050061059f565b905061050d8185856107fc565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610616576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060d90610f25565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610685576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067c90610fb7565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516107639190610c4c565b60405180910390a3505050565b600061077c8484610518565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146107f657818110156107e8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107df90611023565b60405180910390fd5b6107f584848484036105a7565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361086b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610862906110b5565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036108da576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d190611147565b60405180910390fd5b6108e5838383610a72565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561096b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610962906111d9565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a599190610c4c565b60405180910390a3610a6c848484610a77565b50505050565b505050565b505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610ab6578082015181840152602081019050610a9b565b60008484015250505050565b6000601f19601f8301169050919050565b6000610ade82610a7c565b610ae88185610a87565b9350610af8818560208601610a98565b610b0181610ac2565b840191505092915050565b60006020820190508181036000830152610b268184610ad3565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610b5e82610b33565b9050919050565b610b6e81610b53565b8114610b7957600080fd5b50565b600081359050610b8b81610b65565b92915050565b6000819050919050565b610ba481610b91565b8114610baf57600080fd5b50565b600081359050610bc181610b9b565b92915050565b60008060408385031215610bde57610bdd610b2e565b5b6000610bec85828601610b7c565b9250506020610bfd85828601610bb2565b9150509250929050565b60008115159050919050565b610c1c81610c07565b82525050565b6000602082019050610c376000830184610c13565b92915050565b610c4681610b91565b82525050565b6000602082019050610c616000830184610c3d565b92915050565b600080600060608486031215610c8057610c7f610b2e565b5b6000610c8e86828701610b7c565b9350506020610c9f86828701610b7c565b9250506040610cb086828701610bb2565b9150509250925092565b600060ff82169050919050565b610cd081610cba565b82525050565b6000602082019050610ceb6000830184610cc7565b92915050565b600060208284031215610d0757610d06610b2e565b5b6000610d1584828501610b7c565b91505092915050565b60008060408385031215610d3557610d34610b2e565b5b6000610d4385828601610b7c565b9250506020610d5485828601610b7c565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610da557607f821691505b602082108103610db857610db7610d5e565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610df882610b91565b9150610e0383610b91565b9250828201905080821115610e1b57610e1a610dbe565b5b92915050565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b6000610e7d602583610a87565b9150610e8882610e21565b604082019050919050565b60006020820190508181036000830152610eac81610e70565b9050919050565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000610f0f602483610a87565b9150610f1a82610eb3565b604082019050919050565b60006020820190508181036000830152610f3e81610f02565b9050919050565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b6000610fa1602283610a87565b9150610fac82610f45565b604082019050919050565b60006020820190508181036000830152610fd081610f94565b9050919050565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b600061100d601d83610a87565b915061101882610fd7565b602082019050919050565b6000602082019050818103600083015261103c81611000565b9050919050565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b600061109f602583610a87565b91506110aa82611043565b604082019050919050565b600060208201905081810360008301526110ce81611092565b9050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b6000611131602383610a87565b915061113c826110d5565b604082019050919050565b6000602082019050818103600083015261116081611124565b9050919050565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b60006111c3602683610a87565b91506111ce82611167565b604082019050919050565b600060208201905081810360008301526111f2816111b6565b905091905056fea264697066735822122011067e9dcea64889f22dde971c4cf8d2ffdd32026165c6e621a9f7f0c62f5f9164736f6c63430008110033";

type DeveloperFaucetConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DeveloperFaucetConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DeveloperFaucet__factory extends ContractFactory {
  constructor(...args: DeveloperFaucetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DeveloperFaucet> {
    return super.deploy(overrides || {}) as Promise<DeveloperFaucet>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DeveloperFaucet {
    return super.attach(address) as DeveloperFaucet;
  }
  override connect(signer: Signer): DeveloperFaucet__factory {
    return super.connect(signer) as DeveloperFaucet__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DeveloperFaucetInterface {
    return new utils.Interface(_abi) as DeveloperFaucetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DeveloperFaucet {
    return new Contract(address, _abi, signerOrProvider) as DeveloperFaucet;
  }
}
