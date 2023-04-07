/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  MockParticleVerifyer,
  MockParticleVerifyerInterface,
} from "../../../contracts/Mock/MockParticleVerifyer";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "particlePATIds",
    outputs: [
      {
        internalType: "PATId",
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
      {
        internalType: "PATId[]",
        name: "patIds",
        type: "bytes32[]",
      },
    ],
    name: "setPATIds",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "verifyParticle",
    outputs: [
      {
        internalType: "PATId[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610849806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806311898d5f14610046578063a689408c14610076578063d94b854e146100a6575b600080fd5b610060600480360381019061005b9190610356565b6100c2565b60405161006d91906103b7565b60405180910390f35b610090600480360381019061008b91906103f6565b6100f3565b60405161009d91906104fd565b60405180910390f35b6100c060048036038101906100bb91906106a4565b6101cf565b005b600060205281600052604060002081815481106100de57600080fd5b90600052602060002001600091509150505481565b60606000828060000190610107919061072b565b848060200190610117919061072b565b868060400190610127919061072b565b888060600190610137919061072b565b60405160200161014e9897969594939291906107cd565b6040516020818303038152906040528051906020012090506000808281526020019081526020016000208054806020026020016040519081016040528092919081815260200182805480156101c257602002820191906000526020600020905b8154815260200190600101908083116101ae575b5050505050915050919050565b60008280600001906101e1919061072b565b8480602001906101f1919061072b565b868060400190610201919061072b565b888060600190610211919061072b565b6040516020016102289897969594939291906107cd565b60405160208183030381529060405280519060200120905081600080838152602001908152602001600020908051906020019061026692919061026c565b50505050565b8280548282559060005260206000209081019282156102a8579160200282015b828111156102a757825182559160200191906001019061028c565b5b5090506102b591906102b9565b5090565b5b808211156102d25760008160009055506001016102ba565b5090565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b6102fd816102ea565b811461030857600080fd5b50565b60008135905061031a816102f4565b92915050565b6000819050919050565b61033381610320565b811461033e57600080fd5b50565b6000813590506103508161032a565b92915050565b6000806040838503121561036d5761036c6102e0565b5b600061037b8582860161030b565b925050602061038c85828601610341565b9150509250929050565b60006103a1826102ea565b9050919050565b6103b181610396565b82525050565b60006020820190506103cc60008301846103a8565b92915050565b600080fd5b6000608082840312156103ed576103ec6103d2565b5b81905092915050565b60006020828403121561040c5761040b6102e0565b5b600082013567ffffffffffffffff81111561042a576104296102e5565b5b610436848285016103d7565b91505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b61047481610396565b82525050565b6000610486838361046b565b60208301905092915050565b6000602082019050919050565b60006104aa8261043f565b6104b4818561044a565b93506104bf8361045b565b8060005b838110156104f05781516104d7888261047a565b97506104e283610492565b9250506001810190506104c3565b5085935050505092915050565b60006020820190508181036000830152610517818461049f565b905092915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61056d82610524565b810181811067ffffffffffffffff8211171561058c5761058b610535565b5b80604052505050565b600061059f6102d6565b90506105ab8282610564565b919050565b600067ffffffffffffffff8211156105cb576105ca610535565b5b602082029050602081019050919050565b600080fd5b6105ea816102ea565b81146105f557600080fd5b50565b600081359050610607816105e1565b92915050565b600061062061061b846105b0565b610595565b90508083825260208201905060208402830185811115610643576106426105dc565b5b835b8181101561066c578061065888826105f8565b845260208401935050602081019050610645565b5050509392505050565b600082601f83011261068b5761068a61051f565b5b813561069b84826020860161060d565b91505092915050565b600080604083850312156106bb576106ba6102e0565b5b600083013567ffffffffffffffff8111156106d9576106d86102e5565b5b6106e5858286016103d7565b925050602083013567ffffffffffffffff811115610706576107056102e5565b5b61071285828601610676565b9150509250929050565b600080fd5b600080fd5b600080fd5b600080833560016020038436030381126107485761074761071c565b5b80840192508235915067ffffffffffffffff82111561076a57610769610721565b5b60208301925060018202360383131561078657610785610726565b5b509250929050565b600081905092915050565b82818337600083830152505050565b60006107b4838561078e565b93506107c1838584610799565b82840190509392505050565b60006107da828a8c6107a8565b91506107e782888a6107a8565b91506107f48286886107a8565b91506108018284866107a8565b9150819050999850505050505050505056fea26469706673582212205535575a02b1ede08d732e6a49cac8616f21c8b1736ce863d4083e695b2409b964736f6c63430008110033";

type MockParticleVerifyerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockParticleVerifyerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockParticleVerifyer__factory extends ContractFactory {
  constructor(...args: MockParticleVerifyerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockParticleVerifyer> {
    return super.deploy(overrides || {}) as Promise<MockParticleVerifyer>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockParticleVerifyer {
    return super.attach(address) as MockParticleVerifyer;
  }
  override connect(signer: Signer): MockParticleVerifyer__factory {
    return super.connect(signer) as MockParticleVerifyer__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockParticleVerifyerInterface {
    return new utils.Interface(_abi) as MockParticleVerifyerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockParticleVerifyer {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MockParticleVerifyer;
  }
}
