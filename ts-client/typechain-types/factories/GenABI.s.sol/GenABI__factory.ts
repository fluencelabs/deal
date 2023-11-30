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
import type { GenABI, GenABIInterface } from "../../GenABI.s.sol/GenABI";

const _abi = [
  {
    inputs: [],
    name: "IS_SCRIPT",
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
  {
    inputs: [],
    name: "run",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60808060405234610027576201000162ff00ff19600d541617600d55610666908161002d8239f35b600080fdfe608080604052600436101561001357600080fd5b60003560e01c908163c040622614610060575063f8ccbf471461003557600080fd5b3461005b57600036600319011261005b57602060ff600d5460101c166040519015158152f35b600080fd5b3461005b57600036600319011261005b57636c98507360e11b8152600081600481737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa90811561043b57600091610488575b506040516100b4816104a3565b6040516100c0816104a3565b6004815263436f726560e01b602082015281526040516100df816104a3565b60048152631119585b60e21b6020820152602082015260405190610102826104a3565b60405161010e816104a3565b600e81526d2f74732d636c69656e742f61626960901b60208201528252604051610137816104a3565b600e81526d2f73756267726170682f6162697360901b6020820152602083015260005b6002811015610486576102156101708284610595565b5160006040516101f3602f828a5161018f818d602080860191016104e1565b8101642f6f75742f60d81b6020820152642e736f6c2f60d81b87516025926101bd8285830160208d016104e1565b019182015264173539b7b760d91b8751602a926101e08285830160208d016104e1565b019182015203600f8101845201826104bf565b604051809481926360f9bb1160e01b83526020600484015260248301906105bc565b0381737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa91821561043b5761026f92600091829161046c575b5061024d816105e1565b604080516309389f5960e31b81526004810182905294859260448401906105bc565b632e61626960e01b602084830392600319840160248701526004815201520181737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa91821561043b57600092610447575b506102bf826105e1565b60005b600281106102db575050506102d690610570565b61015a565b8061037e60266102ee610341948a610595565b518a61032e602060405180948261030e81840196878151938492016104e1565b8201610322825180938680850191016104e1565b010380855201836104bf565b60405195869251809260208501906104e1565b8101602f60f81b602082015264173539b7b760d91b875160219261036b8285830160208d016104e1565b01918201520360068101855201836104bf565b737109709ecfa91a80626ff3989d68f67f5b1dd12d3b1561005b5760006103d6926040518094819263e23cd19f60e01b8352604060048401526103c4604484018a6105bc565b838103600319016024850152906105bc565b038183737109709ecfa91a80626ff3989d68f67f5b1dd12d5af1801561043b5761040a575b6104059150610570565b6102c2565b67ffffffffffffffff821161042557610405916040526103fb565b634e487b7160e01b600052604160045260246000fd5b6040513d6000823e3d90fd5b6104659192503d806000833e61045d81836104bf565b810190610504565b90866102b5565b61048091503d8084833e61045d81836104bf565b88610243565b005b61049d91503d806000833e61045d81836104bf565b816100a7565b6040810190811067ffffffffffffffff82111761042557604052565b90601f8019910116810190811067ffffffffffffffff82111761042557604052565b60005b8381106104f45750506000910152565b81810151838201526020016104e4565b60208183031261005b57805167ffffffffffffffff9182821161005b57019082601f8301121561005b578151908111610425576040519261054f601f8301601f1916602001856104bf565b8184526020828401011161005b5761056d91602080850191016104e1565b90565b600019811461057f5760010190565b634e487b7160e01b600052601160045260246000fd5b9060028110156105a65760051b0190565b634e487b7160e01b600052603260045260246000fd5b906020916105d5815180928185528580860191016104e1565b601f01601f1916010190565b6000809160405161061d8161060f602082019463104c13eb60e21b86526020602484015260448301906105bc565b03601f1981018352826104bf565b51906a636f6e736f6c652e6c6f675afa5056fea2646970667358221220d991af1f625d8b8822e63a2c9880847f2d2c8118c030fad6591886c044e8619364736f6c63430008130033";

type GenABIConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GenABIConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GenABI__factory extends ContractFactory {
  constructor(...args: GenABIConstructorParams) {
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
      GenABI & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): GenABI__factory {
    return super.connect(runner) as GenABI__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GenABIInterface {
    return new Interface(_abi) as GenABIInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): GenABI {
    return new Contract(address, _abi, runner) as unknown as GenABI;
  }
}
