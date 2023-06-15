/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface IFactoryInterface extends Interface {
  getFunction(nameOrSignature: "createDeal" | "isDeal"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createDeal",
    values: [BigNumberish, BigNumberish, string, string[]]
  ): string;
  encodeFunctionData(functionFragment: "isDeal", values: [AddressLike]): string;

  decodeFunctionResult(functionFragment: "createDeal", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isDeal", data: BytesLike): Result;
}

export interface IFactory extends BaseContract {
  connect(runner?: ContractRunner | null): IFactory;
  waitForDeployment(): Promise<this>;

  interface: IFactoryInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  createDeal: TypedContractMethod<
    [
      minWorkers_: BigNumberish,
      targetWorkers_: BigNumberish,
      appCID_: string,
      effectors: string[]
    ],
    [string],
    "nonpayable"
  >;

  isDeal: TypedContractMethod<[addr: AddressLike], [boolean], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createDeal"
  ): TypedContractMethod<
    [
      minWorkers_: BigNumberish,
      targetWorkers_: BigNumberish,
      appCID_: string,
      effectors: string[]
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "isDeal"
  ): TypedContractMethod<[addr: AddressLike], [boolean], "view">;

  filters: {};
}
