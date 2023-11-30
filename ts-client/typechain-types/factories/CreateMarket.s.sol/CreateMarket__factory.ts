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
  CreateMarket,
  CreateMarketInterface,
} from "../../CreateMarket.s.sol/CreateMarket";

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
  {
    inputs: [],
    name: "setUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60808060405234610027576201000162ff00ff19600d541617600d55611a11908161002d8239f35b600080fdfe6080604052600436101561001257600080fd5b60003560e01c80630a9254e41461090c578063c0406226146100865763f8ccbf471461003d57600080fd5b346100815760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261008157602060ff600d5460101c166040519015158152f35b600080fd5b346100815760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610081576040516000600e546100c681610d6b565b80845290600181169081156108ca575060011461086a575b50906100ef816100f4930382610c53565b611104565b6040517f436f7265000000000000000000000000000000000000000000000000000000008152602460089182600482015273ffffffffffffffffffffffffffffffffffffffff9182912054169060246040517f74464c540000000000000000000000000000000000000000000000000000000081528460048201522054169060405192610160840184811067ffffffffffffffff82111761071f57604052600a845260005b6101408110610845575060005b600a81106107b45750506040516060810181811067ffffffffffffffff82111761071f5761029391600091604052603b81527f746573742074657374207465737420746573742074657374207465737420746560208201527f73742074657374207465737420746573742074657374206a756e6b00000000006040820152604051809381927fd145736c00000000000000000000000000000000000000000000000000000000835260406004840152600e60448401527f414e56494c5f4d4e454d4f4e49430000000000000000000000000000000000006064840152608060248401526084830190610ff5565b038183737109709ecfa91a80626ff3989d68f67f5b1dd12d5af19081156105ca57600091610791575b5060005b600a63ffffffff8216101561078f576103156040516102de81610c23565b600781527f6f66666572496400000000000000000000000000000000000000000000000000602082015263ffffffff831690611038565b6040517f6229498b00000000000000000000000000000000000000000000000000000000815260406004820152602081806103536044820188610ff5565b63ffffffff871660248301520381737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa9081156105ca5760009161075d575b50737109709ecfa91a80626ff3989d68f67f5b1dd12d3b1561008157604051907fce817d47000000000000000000000000000000000000000000000000000000008252600482015260008160248183737109709ecfa91a80626ff3989d68f67f5b1dd12d5af180156105ca5761074e575b5060405180608081011067ffffffffffffffff60808301111761071f57608081016040526003815260005b606081106106fa575060005b600381106106555750843b1561008157906040519182917fb3f2597500000000000000000000000000000000000000000000000000000000835260a48301906004840152662386f26fc10000602484015287604484015260a06064840152885180915260c483019060208a01906000905b80821061060b575050507ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc838203016084840152602080835192838152019201906000905b8082106105e5575050509080600092038183885af180156105ca576105d6575b50737109709ecfa91a80626ff3989d68f67f5b1dd12d3b15610081576040517f76eadd3600000000000000000000000000000000000000000000000000000000815260008160048183737109709ecfa91a80626ff3989d68f67f5b1dd12d5af180156105ca576105bb575b5063ffffffff8082161461058c5763ffffffff166001016102c0565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6105c490610c3f565b85610570565b6040513d6000823e3d90fd5b6105df90610c3f565b85610505565b9193509160206040600192828751805183520151838201520194019201849392916104e5565b9193945091602060406001928287517fffffffff000000000000000000000000000000000000000000000000000000008151168352015183820152019401920185949392916104a0565b806106c46106f59261066c63ffffffff8816610dd5565b6106bf604051917f706565724964000000000000000000000000000000000000000000000000000060208401528281516106af8160269460208686019101610c94565b8101036006810184520182610c53565b611038565b604051906106d182610c23565b8152600360208201526106e48285610fb2565b526106ef8184610fb2565b50610f85565b61042f565b60209060405161070981610c23565b6000815260008382015282828501015201610423565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61075790610c3f565b866103f8565b90506020813d602011610787575b8161077860209383610c53565b81010312610081575187610387565b3d915061076b565b005b6107ae91503d806000833e6107a68183610c53565b810190610d45565b846102bc565b610840906040516107c481610c23565b8381526107f8826020927f6566666563746f7200000000000000000000000000000000000000000000000084820152611038565b6040519161080583610c23565b7f123456780000000000000000000000000000000000000000000000000000000083528201526108358288610fb2565b526106ef8187610fb2565b6101a6565b60209060405161085481610c23565b6000815282600081830152828801015201610199565b919050600e6000527fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fd916000905b8082106108b0575090915081016020016100ef6100de565b919260018160209254838588010152019101909291610898565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660208086019190915291151560051b840190910191506100ef90506100de565b346100815760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126100815761094446610dd5565b604051602090610999602582846109648183019788815193849201610c94565b81017f2e6a736f6e00000000000000000000000000000000000000000000000000000086820152036005810184520182610c53565b6040517fd930a0e6000000000000000000000000000000000000000000000000000000008152600081600481737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa80156105ca57610a5694610a70938593600093610c06575b50610a64604051610a0481610c23565b60178152858101907f2f74732d636c69656e742f6465706c6f796d656e74732f00000000000000000082526040519986610a478c985180928b808c019101610c94565b87019151809389840190610c94565b019151809386840190610c94565b01038085520183610c53565b81519067ffffffffffffffff821161071f57610a8d600e54610d6b565b601f8111610bad575b5080601f8311600114610af057508192600092610ae5575b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c191617600e55600080f35b015190508280610aae565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0831693600e6000527fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fd926000905b868210610b955750508360019510610b5e575b505050811b01600e55005b01517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88460031b161c19169055828080610b53565b80600185968294968601518155019501930190610b40565b610bf690600e6000527fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fd601f850160051c810191848610610bfc575b601f0160051c0190610dbe565b83610a96565b9091508190610be9565b610c1c9193503d806000833e6107a68183610c53565b91876109f4565b6040810190811067ffffffffffffffff82111761071f57604052565b67ffffffffffffffff811161071f57604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff82111761071f57604052565b60005b838110610ca75750506000910152565b8181015183820152602001610c97565b67ffffffffffffffff811161071f57601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b90929192610cfe81610cb7565b91610d0c6040519384610c53565b829482845282820111610081576020610d26930190610c94565b565b9080601f83011215610081578151610d4292602001610cf1565b90565b9060208282031261008157815167ffffffffffffffff811161008157610d429201610d28565b90600182811c92168015610db4575b6020831014610d8557565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b91607f1691610d7a565b818110610dc9575050565b60008155600101610dbe565b806000917a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000080821015610f77575b506d04ee2d6d415b85acef810000000080831015610f68575b50662386f26fc1000080831015610f59575b506305f5e10080831015610f4a575b5061271080831015610f3b575b506064821015610f2b575b600a80921015610f21575b600190816021818601957fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0610ea8610e9289610cb7565b98610ea06040519a8b610c53565b808a52610cb7565b01366020890137860101905b610ec0575b5050505090565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019083907f30313233343536373839616263646566000000000000000000000000000000008282061a835304918215610f1c57919082610eb4565b610eb9565b9160010191610e5b565b9190606460029104910191610e50565b60049193920491019138610e45565b60089193920491019138610e38565b60109193920491019138610e29565b60209193920491019138610e17565b604093508104915038610dfe565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff811461058c5760010190565b8051821015610fc65760209160051b010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f60209361103181518092818752878088019101610c94565b0116010190565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff43019143831161058c5760606110a291604051938491602083019640875261108c815180926020604087019101610c94565b8201906040820152036040810184520182610c53565b51902090565b6020818303126100815780519067ffffffffffffffff821161008157019080601f83011215610081578151610d4292602001610cf1565b90916110f6610d4293604084526040840190610ff5565b916020818403910152610ff5565b6040517f261a323e00000000000000000000000000000000000000000000000000000000815260206004820152602081806111426024820186610ff5565b03816000737109709ecfa91a80626ff3989d68f67f5b1dd12d5af19081156105ca576000916119a0575b501561199d579060006111b492604051809481927f60f9bb11000000000000000000000000000000000000000000000000000000008352602060048401526024830190610ff5565b0381737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa9182156105ca57600092611980575b506040517f213e419800000000000000000000000000000000000000000000000000000000815260406004820152600081602061121c6044830187610ff5565b83838203917ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc83016024860152520181737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa9081156105ca576000916118d1575b50805168010000000000000000811161071f576007548160075580821061183f575b50602082019060076000527fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688916000905b8282106116ca575050505060005b81518110156116c4576112e68183610fb2565b51906040516060810181811067ffffffffffffffff82111761071f576040526000815260006020820152600060408201526113c860006040517f2e000000000000000000000000000000000000000000000000000000000000006020820152611394602682885161135e816021840160208d01610c94565b81017f2e616464720000000000000000000000000000000000000000000000000000006021820152036006810184520182610c53565b604051809381927f85940ef10000000000000000000000000000000000000000000000000000000083528b600484016110df565b0381737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa9081156105ca576000916116a9575b5060208180518101031261008157602001519273ffffffffffffffffffffffffffffffffffffffff841684036100815773ffffffffffffffffffffffffffffffffffffffff6114ea9416825260006040517f2e0000000000000000000000000000000000000000000000000000000000000060208201526114b6602a828551611480816021840160208a01610c94565b81017f2e636f6465486173680000000000000000000000000000000000000000000000602182015203600a810184520182610c53565b604051809681927f85940ef10000000000000000000000000000000000000000000000000000000083528b600484016110df565b0381737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa9384156105ca5760009461168c575b506020848051810103126100815760206115a7940151602083015260006040517f2e0000000000000000000000000000000000000000000000000000000000000060208201526114b66032828551611571816021840160208a01610c94565b81017f2e6372656174696f6e436f6465486173680000000000000000000000000000006021820152036012810184520182610c53565b0381737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa9384156105ca57600094611667575b506020848051810103126100815760406116046020600293816116629801518487015281845193828580945193849201610c94565b810160088152030190209273ffffffffffffffffffffffffffffffffffffffff8151167fffffffffffffffffffffffff0000000000000000000000000000000000000000855416178455602081015160018501550151910155610f85565b6112d3565b6116859194503d806000833e61167d8183610c53565b8101906110a8565b92386115cf565b6116a29194503d806000833e61167d8183610c53565b9238611512565b6116be91503d806000833e61167d8183610c53565b386113f0565b50509050565b805180519067ffffffffffffffff821161071f576116e88654610d6b565b90601f91828111611805575b50602091831160011461175c579282600194936020938695600092611751575b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82861b9260031b1c19161787555b019401910190926112c5565b015190503880611714565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08316918760005260206000209260005b8181106117ed5750926001959285928796602096106117b6575b505050831b83018755611745565b01517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88460031b161c191690553880806117a8565b9293602060018192878601518155019501930161178e565b61183090886000526020600020600585808801821c83019360208910611836575b01901c0190610dbe565b386116f4565b93508293611826565b6007600052817fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68891820191015b8181106118795750611294565b8061188660019254610d6b565b80611893575b500161186c565b601f9081811184146118ac575050600081555b3861188c565b6118c860009284845260208420920160051c8201858301610dbe565b818355556118a6565b90503d806000833e6118e38183610c53565b810160208282031261008157815167ffffffffffffffff9283821161008157019181601f840112156100815782519281841161071f578360051b6040519461192e6020830187610c53565b8552602080860191830101928484116100815760208301915b84831061195a5750505050505038611272565b82518281116100815760209161197588848094890101610d28565b815201920191611947565b6119969192503d806000833e6107a68183610c53565b90386111dc565b50565b90506020813d6020116119d3575b816119bb60209383610c53565b8101031261008157518015158103610081573861116c565b3d91506119ae56fea26469706673582212201892e15c60c93133bfed5a610b0ba9b8866a65bc6e4062d815f40b00a207430864736f6c63430008130033";

type CreateMarketConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CreateMarketConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CreateMarket__factory extends ContractFactory {
  constructor(...args: CreateMarketConstructorParams) {
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
      CreateMarket & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): CreateMarket__factory {
    return super.connect(runner) as CreateMarket__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CreateMarketInterface {
    return new Interface(_abi) as CreateMarketInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): CreateMarket {
    return new Contract(address, _abi, runner) as unknown as CreateMarket;
  }
}
