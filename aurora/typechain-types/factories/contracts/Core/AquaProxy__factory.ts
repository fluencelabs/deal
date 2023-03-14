/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  AquaProxy,
  AquaProxyInterface,
} from "../../../contracts/Core/AquaProxy";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "aquaVMAddress_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "aquaVMAddress",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "aquaVMImplicitAddress",
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
    name: "near",
    outputs: [
      {
        internalType: "bool",
        name: "initialized",
        type: "bool",
      },
      {
        internalType: "contract IERC20",
        name: "wNEAR",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "selfReprsentativeImplicitAddress",
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
        internalType: "struct AquaProxy.Particle",
        name: "particle",
        type: "tuple",
      },
    ],
    name: "verifyParticle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60c06040523480156200001157600080fd5b5060405162001ba338038062001ba383398181016040528101906200003791906200043f565b8060019081620000489190620006db565b5073__$969127cfe997f540c2b678dc09d7fb430b$__63cb4500e760016040518263ffffffff1660e01b815260040162000083919062000863565b602060405180830381865af4158015620000a1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620000c79190620008ec565b73ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff168152505073__$969127cfe997f540c2b678dc09d7fb430b$__6336a80dbc734861825e75ab14553e5af711ebbe6873d369d1466040518263ffffffff1660e01b81526004016200014791906200097f565b6040805180830381865af415801562000164573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200018a919062000a7c565b6000808201518160000160006101000a81548160ff02191690831515021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555090505073__$969127cfe997f540c2b678dc09d7fb430b$__63a33598bf306040518263ffffffff1660e01b81526004016200022e919062000abf565b602060405180830381865af41580156200024c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002729190620008ec565b73ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250505062000adc565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200031582620002ca565b810181811067ffffffffffffffff82111715620003375762000336620002db565b5b80604052505050565b60006200034c620002ac565b90506200035a82826200030a565b919050565b600067ffffffffffffffff8211156200037d576200037c620002db565b5b6200038882620002ca565b9050602081019050919050565b60005b83811015620003b557808201518184015260208101905062000398565b60008484015250505050565b6000620003d8620003d2846200035f565b62000340565b905082815260208101848484011115620003f757620003f6620002c5565b5b6200040484828562000395565b509392505050565b600082601f830112620004245762000423620002c0565b5b815162000436848260208601620003c1565b91505092915050565b600060208284031215620004585762000457620002b6565b5b600082015167ffffffffffffffff811115620004795762000478620002bb565b5b62000487848285016200040c565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620004e357607f821691505b602082108103620004f957620004f86200049b565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620005637fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000524565b6200056f868362000524565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620005bc620005b6620005b08462000587565b62000591565b62000587565b9050919050565b6000819050919050565b620005d8836200059b565b620005f0620005e782620005c3565b84845462000531565b825550505050565b600090565b62000607620005f8565b62000614818484620005cd565b505050565b5b818110156200063c5762000630600082620005fd565b6001810190506200061a565b5050565b601f8211156200068b576200065581620004ff565b620006608462000514565b8101602085101562000670578190505b620006886200067f8562000514565b83018262000619565b50505b505050565b600082821c905092915050565b6000620006b06000198460080262000690565b1980831691505092915050565b6000620006cb83836200069d565b9150826002028217905092915050565b620006e68262000490565b67ffffffffffffffff811115620007025762000701620002db565b5b6200070e8254620004ca565b6200071b82828562000640565b600060209050601f8311600181146200075357600084156200073e578287015190505b6200074a8582620006bd565b865550620007ba565b601f1984166200076386620004ff565b60005b828110156200078d5784890151825560018201915060208501945060208101905062000766565b86831015620007ad5784890151620007a9601f8916826200069d565b8355505b6001600288020188555050505b505050505050565b600082825260208201905092915050565b60008154620007e281620004ca565b620007ee8186620007c2565b945060018216600081146200080c576001811462000823576200085a565b60ff1983168652811515602002860193506200085a565b6200082e85620004ff565b60005b83811015620008525781548189015260018201915060208101905062000831565b808801955050505b50505092915050565b600060208201905081810360008301526200087f8184620007d3565b905092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620008b48262000887565b9050919050565b620008c681620008a7565b8114620008d257600080fd5b50565b600081519050620008e681620008bb565b92915050565b600060208284031215620009055762000904620002b6565b5b60006200091584828501620008d5565b91505092915050565b60006200093f62000939620009338462000887565b62000591565b62000887565b9050919050565b600062000953826200091e565b9050919050565b6000620009678262000946565b9050919050565b62000979816200095a565b82525050565b60006020820190506200099660008301846200096e565b92915050565b600080fd5b60008115159050919050565b620009b881620009a1565b8114620009c457600080fd5b50565b600081519050620009d881620009ad565b92915050565b6000620009eb82620008a7565b9050919050565b620009fd81620009de565b811462000a0957600080fd5b50565b60008151905062000a1d81620009f2565b92915050565b60006040828403121562000a3c5762000a3b6200099c565b5b62000a48604062000340565b9050600062000a5a84828501620009c7565b600083015250602062000a708482850162000a0c565b60208301525092915050565b60006040828403121562000a955762000a94620002b6565b5b600062000aa58482850162000a23565b91505092915050565b62000ab981620008a7565b82525050565b600060208201905062000ad6600083018462000aae565b92915050565b60805160a0516110a262000b01600039600060f30152600061011701526110a26000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80634261bab71461005c5780637b4dc7a71461007a57806390e7962114610098578063a689408c146100b6578063e602af76146100d2575b600080fd5b6100646100f1565b604051610071919061059c565b60405180910390f35b610082610115565b60405161008f919061059c565b60405180910390f35b6100a0610139565b6040516100ad9190610647565b60405180910390f35b6100d060048036038101906100cb91906106a1565b6101c7565b005b6100da61051c565b6040516100e8929190610764565b60405180910390f35b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b60018054610146906107bc565b80601f0160208091040260200160405190810160405280929190818152602001828054610172906107bc565b80156101bf5780601f10610194576101008083540402835291602001916101bf565b820191906000526020600020905b8154815290600101906020018083116101a257829003601f168201915b505050505081565b60008073__$969127cfe997f540c2b678dc09d7fb430b$__63925be54d9091600173__$dec30c625f67ca4e7cd9f2692f2aa1ddd0$__6312496a1b87806000019061021291906107fc565b6040518363ffffffff1660e01b815260040161022f9291906108ac565b600060405180830381865af415801561024c573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061027591906109f6565b73__$dec30c625f67ca4e7cd9f2692f2aa1ddd0$__6312496a1b88806020019061029f91906107fc565b6040518363ffffffff1660e01b81526004016102bc9291906108ac565b600060405180830381865af41580156102d9573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061030291906109f6565b73__$dec30c625f67ca4e7cd9f2692f2aa1ddd0$__6312496a1b89806040019061032c91906107fc565b6040518363ffffffff1660e01b81526004016103499291906108ac565b600060405180830381865af4158015610366573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061038f91906109f6565b73__$dec30c625f67ca4e7cd9f2692f2aa1ddd0$__6312496a1b8a80606001906103b991906107fc565b6040518363ffffffff1660e01b81526004016103d69291906108ac565b600060405180830381865af41580156103f3573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061041c91906109f6565b60405160200161042f9493929190610a86565b6040516020818303038152906040526000651b48eb57e0006040518663ffffffff1660e01b8152600401610467959493929190610c74565b600060405180830381865af4158015610484573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906104ad9190610ecb565b90508073__$969127cfe997f540c2b678dc09d7fb430b$__63f930d03790916040518263ffffffff1660e01b81526004016104e8919061104a565b60006040518083038186803b15801561050057600080fd5b505af4158015610514573d6000803e3d6000fd5b505050505050565b60008060000160009054906101000a900460ff16908060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905082565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006105868261055b565b9050919050565b6105968161057b565b82525050565b60006020820190506105b1600083018461058d565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156105f15780820151818401526020810190506105d6565b60008484015250505050565b6000601f19601f8301169050919050565b6000610619826105b7565b61062381856105c2565b93506106338185602086016105d3565b61063c816105fd565b840191505092915050565b60006020820190508181036000830152610661818461060e565b905092915050565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000608082840312156106985761069761067d565b5b81905092915050565b6000602082840312156106b7576106b6610673565b5b600082013567ffffffffffffffff8111156106d5576106d4610678565b5b6106e184828501610682565b91505092915050565b60008115159050919050565b6106ff816106ea565b82525050565b6000819050919050565b600061072a6107256107208461055b565b610705565b61055b565b9050919050565b600061073c8261070f565b9050919050565b600061074e82610731565b9050919050565b61075e81610743565b82525050565b600060408201905061077960008301856106f6565b6107866020830184610755565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806107d457607f821691505b6020821081036107e7576107e661078d565b5b50919050565b600080fd5b600080fd5b600080fd5b60008083356001602003843603038112610819576108186107ed565b5b80840192508235915067ffffffffffffffff82111561083b5761083a6107f2565b5b602083019250600182023603831315610857576108566107f7565b5b509250929050565b600082825260208201905092915050565b82818337600083830152505050565b600061088b838561085f565b9350610898838584610870565b6108a1836105fd565b840190509392505050565b600060208201905081810360008301526108c781848661087f565b90509392505050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610912826105fd565b810181811067ffffffffffffffff82111715610931576109306108da565b5b80604052505050565b6000610944610669565b90506109508282610909565b919050565b600067ffffffffffffffff8211156109705761096f6108da565b5b610979826105fd565b9050602081019050919050565b600061099961099484610955565b61093a565b9050828152602081018484840111156109b5576109b46108d5565b5b6109c08482856105d3565b509392505050565b600082601f8301126109dd576109dc6108d0565b5b81516109ed848260208601610986565b91505092915050565b600060208284031215610a0c57610a0b610673565b5b600082015167ffffffffffffffff811115610a2a57610a29610678565b5b610a36848285016109c8565b91505092915050565b600081519050919050565b600081905092915050565b6000610a6082610a3f565b610a6a8185610a4a565b9350610a7a8185602086016105d3565b80840191505092915050565b6000610a928287610a55565b9150610a9e8286610a55565b9150610aaa8285610a55565b9150610ab68284610a55565b915081905095945050505050565b8082525050565b600082825260208201905092915050565b60008190508160005260206000209050919050565b60008154610afe816107bc565b610b088186610acb565b94506001821660008114610b235760018114610b3957610b6c565b60ff198316865281151560200286019350610b6c565b610b4285610adc565b60005b83811015610b6457815481890152600182019150602081019050610b45565b808801955050505b50505092915050565b7f7665726966795f73637269707400000000000000000000000000000000000000600082015250565b6000610bab600d83610acb565b9150610bb682610b75565b602082019050919050565b6000610bcc82610a3f565b610bd6818561085f565b9350610be68185602086016105d3565b610bef816105fd565b840191505092915050565b6000819050919050565b60006fffffffffffffffffffffffffffffffff82169050919050565b6000610c3b610c36610c3184610bfa565b610705565b610c04565b9050919050565b610c4b81610c20565b82525050565b600067ffffffffffffffff82169050919050565b610c6e81610c51565b82525050565b600060c082019050610c896000830188610ac4565b8181036020830152610c9b8187610af1565b90508181036040830152610cae81610b9e565b90508181036060830152610cc28186610bc1565b9050610cd16080830185610c42565b610cde60a0830184610c65565b9695505050505050565b600080fd5b600080fd5b600067ffffffffffffffff821115610d0d57610d0c6108da565b5b610d16826105fd565b9050602081019050919050565b6000610d36610d3184610cf2565b61093a565b905082815260208101848484011115610d5257610d516108d5565b5b610d5d8482856105d3565b509392505050565b600082601f830112610d7a57610d796108d0565b5b8151610d8a848260208601610d23565b91505092915050565b610d9c81610c04565b8114610da757600080fd5b50565b600081519050610db981610d93565b92915050565b610dc881610c51565b8114610dd357600080fd5b50565b600081519050610de581610dbf565b92915050565b600060a08284031215610e0157610e00610ce8565b5b610e0b60a061093a565b9050600082015167ffffffffffffffff811115610e2b57610e2a610ced565b5b610e3784828501610d65565b600083015250602082015167ffffffffffffffff811115610e5b57610e5a610ced565b5b610e6784828501610d65565b602083015250604082015167ffffffffffffffff811115610e8b57610e8a610ced565b5b610e97848285016109c8565b6040830152506060610eab84828501610daa565b6060830152506080610ebf84828501610dd6565b60808301525092915050565b600060208284031215610ee157610ee0610673565b5b600082015167ffffffffffffffff811115610eff57610efe610678565b5b610f0b84828501610deb565b91505092915050565b600082825260208201905092915050565b6000610f30826105b7565b610f3a8185610f14565b9350610f4a8185602086016105d3565b610f53816105fd565b840191505092915050565b600082825260208201905092915050565b6000610f7a82610a3f565b610f848185610f5e565b9350610f948185602086016105d3565b610f9d816105fd565b840191505092915050565b610fb181610c04565b82525050565b610fc081610c51565b82525050565b600060a0830160008301518482036000860152610fe38282610f25565b91505060208301518482036020860152610ffd8282610f25565b915050604083015184820360408601526110178282610f6f565b915050606083015161102c6060860182610fa8565b50608083015161103f6080860182610fb7565b508091505092915050565b600060208201905081810360008301526110648184610fc6565b90509291505056fea264697066735822122096284ded5b4b77b9065f49842bbb0437560b76f64acc051ca4d037fed55dfcbf64736f6c63430008110033";

type AquaProxyConstructorParams =
  | [linkLibraryAddresses: AquaProxyLibraryAddresses, signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AquaProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => {
  return (
    typeof xs[0] === "string" ||
    (Array.isArray as (arg: any) => arg is readonly any[])(xs[0]) ||
    "_isInterface" in xs[0]
  );
};

export class AquaProxy__factory extends ContractFactory {
  constructor(...args: AquaProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      const [linkLibraryAddresses, signer] = args;
      super(
        _abi,
        AquaProxy__factory.linkBytecode(linkLibraryAddresses),
        signer
      );
    }
  }

  static linkBytecode(linkLibraryAddresses: AquaProxyLibraryAddresses): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$969127cfe997f540c2b678dc09d7fb430b\\$__", "g"),
      linkLibraryAddresses["contracts/AuroraSDK/AuroraSdk.sol:AuroraSdk"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$dec30c625f67ca4e7cd9f2692f2aa1ddd0\\$__", "g"),
      linkLibraryAddresses["contracts/AuroraSDK/Codec.sol:Codec"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  override deploy(
    aquaVMAddress_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AquaProxy> {
    return super.deploy(aquaVMAddress_, overrides || {}) as Promise<AquaProxy>;
  }
  override getDeployTransaction(
    aquaVMAddress_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(aquaVMAddress_, overrides || {});
  }
  override attach(address: string): AquaProxy {
    return super.attach(address) as AquaProxy;
  }
  override connect(signer: Signer): AquaProxy__factory {
    return super.connect(signer) as AquaProxy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AquaProxyInterface {
    return new utils.Interface(_abi) as AquaProxyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AquaProxy {
    return new Contract(address, _abi, signerOrProvider) as AquaProxy;
  }
}

export interface AquaProxyLibraryAddresses {
  ["contracts/AuroraSDK/AuroraSdk.sol:AuroraSdk"]: string;
  ["contracts/AuroraSDK/Codec.sol:Codec"]: string;
}
