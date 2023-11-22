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
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export type CIDV1Struct = { prefixes: BytesLike; hash: BytesLike };

export type CIDV1StructOutput = [prefixes: string, hash: string] & {
  prefixes: string;
  hash: string;
};

export interface IDealFactoryInterface extends Interface {
  getFunction(nameOrSignature: "deployDeal" | "hasDeal"): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "DealCreated"): EventFragment;

  encodeFunctionData(
    functionFragment: "deployDeal",
    values: [
      CIDV1Struct,
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      CIDV1Struct[],
      BigNumberish,
      AddressLike[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "hasDeal",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(functionFragment: "deployDeal", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasDeal", data: BytesLike): Result;
}

export namespace DealCreatedEvent {
  export type InputTuple = [
    owner: AddressLike,
    deal: AddressLike,
    createdAtEpoch: BigNumberish
  ];
  export type OutputTuple = [
    owner: string,
    deal: string,
    createdAtEpoch: bigint
  ];
  export interface OutputObject {
    owner: string;
    deal: string;
    createdAtEpoch: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IDealFactory extends BaseContract {
  connect(runner?: ContractRunner | null): IDealFactory;
  waitForDeployment(): Promise<this>;

  interface: IDealFactoryInterface;

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

  deployDeal: TypedContractMethod<
    [
      appCID_: CIDV1Struct,
      paymentToken_: AddressLike,
      collateralPerWorker_: BigNumberish,
      minWorkers_: BigNumberish,
      targetWorkers_: BigNumberish,
      maxWorkersPerProvider_: BigNumberish,
      pricePerWorkerEpoch_: BigNumberish,
      effectors_: CIDV1Struct[],
      accessType_: BigNumberish,
      accessList_: AddressLike[]
    ],
    [string],
    "nonpayable"
  >;

  hasDeal: TypedContractMethod<[deal: AddressLike], [boolean], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "deployDeal"
  ): TypedContractMethod<
    [
      appCID_: CIDV1Struct,
      paymentToken_: AddressLike,
      collateralPerWorker_: BigNumberish,
      minWorkers_: BigNumberish,
      targetWorkers_: BigNumberish,
      maxWorkersPerProvider_: BigNumberish,
      pricePerWorkerEpoch_: BigNumberish,
      effectors_: CIDV1Struct[],
      accessType_: BigNumberish,
      accessList_: AddressLike[]
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "hasDeal"
  ): TypedContractMethod<[deal: AddressLike], [boolean], "view">;

  getEvent(
    key: "DealCreated"
  ): TypedContractEvent<
    DealCreatedEvent.InputTuple,
    DealCreatedEvent.OutputTuple,
    DealCreatedEvent.OutputObject
  >;

  filters: {
    "DealCreated(address,address,uint256)": TypedContractEvent<
      DealCreatedEvent.InputTuple,
      DealCreatedEvent.OutputTuple,
      DealCreatedEvent.OutputObject
    >;
    DealCreated: TypedContractEvent<
      DealCreatedEvent.InputTuple,
      DealCreatedEvent.OutputTuple,
      DealCreatedEvent.OutputObject
    >;
  };
}
