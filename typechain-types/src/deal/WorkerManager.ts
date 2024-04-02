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
} from "../../common";

export type CIDV1Struct = { prefixes: BytesLike; hash: BytesLike };

export type CIDV1StructOutput = [prefixes: string, hash: string] & {
  prefixes: string;
  hash: string;
};

export declare namespace IWorkerManager {
  export type ComputeUnitStruct = {
    id: BytesLike;
    workerId: BytesLike;
    peerId: BytesLike;
    provider: AddressLike;
    joinedEpoch: BigNumberish;
  };

  export type ComputeUnitStructOutput = [
    id: string,
    workerId: string,
    peerId: string,
    provider: string,
    joinedEpoch: bigint
  ] & {
    id: string;
    workerId: string;
    peerId: string;
    provider: string;
    joinedEpoch: bigint;
  };
}

export interface WorkerManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addProviderToAccessList"
      | "appCID"
      | "changeProvidersAccessType"
      | "creationBlock"
      | "effectors"
      | "getComputeUnit"
      | "getComputeUnitCount()"
      | "getComputeUnitCount(address)"
      | "getComputeUnits"
      | "getWorkerCount"
      | "isComputePeerExist"
      | "isProviderAllowed"
      | "maxWorkersPerProvider"
      | "minWorkers"
      | "owner"
      | "paymentToken"
      | "pricePerWorkerEpoch"
      | "providersAccessType"
      | "removeProviderFromAccessList"
      | "renounceOwnership"
      | "setAppCID"
      | "targetWorkers"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AppCIDChanged"
      | "ComputeUnitJoined"
      | "ComputeUnitRemoved"
      | "Initialized"
      | "OwnershipTransferred"
      | "ProviderAddedToAccessList"
      | "ProviderRemovedFromAccessList"
      | "ProvidersAccessTypeChanged"
      | "WorkerIdUpdated"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addProviderToAccessList",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "appCID", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "changeProvidersAccessType",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "creationBlock",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "effectors", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getComputeUnit",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getComputeUnitCount()",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getComputeUnitCount(address)",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getComputeUnits",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getWorkerCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isComputePeerExist",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isProviderAllowed",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "maxWorkersPerProvider",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minWorkers",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "paymentToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pricePerWorkerEpoch",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "providersAccessType",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeProviderFromAccessList",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAppCID",
    values: [CIDV1Struct]
  ): string;
  encodeFunctionData(
    functionFragment: "targetWorkers",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "addProviderToAccessList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "appCID", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "changeProvidersAccessType",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "creationBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "effectors", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getComputeUnit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComputeUnitCount()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComputeUnitCount(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComputeUnits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWorkerCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isComputePeerExist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isProviderAllowed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxWorkersPerProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "minWorkers", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "paymentToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pricePerWorkerEpoch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "providersAccessType",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeProviderFromAccessList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setAppCID", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "targetWorkers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
}

export namespace AppCIDChangedEvent {
  export type InputTuple = [newAppCID: CIDV1Struct];
  export type OutputTuple = [newAppCID: CIDV1StructOutput];
  export interface OutputObject {
    newAppCID: CIDV1StructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ComputeUnitJoinedEvent {
  export type InputTuple = [peerId: BytesLike, unitId: BytesLike];
  export type OutputTuple = [peerId: string, unitId: string];
  export interface OutputObject {
    peerId: string;
    unitId: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ComputeUnitRemovedEvent {
  export type InputTuple = [peerId: BytesLike, unitId: BytesLike];
  export type OutputTuple = [peerId: string, unitId: string];
  export interface OutputObject {
    peerId: string;
    unitId: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ProviderAddedToAccessListEvent {
  export type InputTuple = [provider: AddressLike];
  export type OutputTuple = [provider: string];
  export interface OutputObject {
    provider: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ProviderRemovedFromAccessListEvent {
  export type InputTuple = [provider: AddressLike];
  export type OutputTuple = [provider: string];
  export interface OutputObject {
    provider: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ProvidersAccessTypeChangedEvent {
  export type InputTuple = [newAccessType: BigNumberish];
  export type OutputTuple = [newAccessType: bigint];
  export interface OutputObject {
    newAccessType: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WorkerIdUpdatedEvent {
  export type InputTuple = [computeUnitId: BytesLike, workerId: BytesLike];
  export type OutputTuple = [computeUnitId: string, workerId: string];
  export interface OutputObject {
    computeUnitId: string;
    workerId: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface WorkerManager extends BaseContract {
  connect(runner?: ContractRunner | null): WorkerManager;
  waitForDeployment(): Promise<this>;

  interface: WorkerManagerInterface;

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

  addProviderToAccessList: TypedContractMethod<
    [provider: AddressLike],
    [void],
    "nonpayable"
  >;

  appCID: TypedContractMethod<[], [CIDV1StructOutput], "view">;

  changeProvidersAccessType: TypedContractMethod<
    [accessType: BigNumberish],
    [void],
    "nonpayable"
  >;

  creationBlock: TypedContractMethod<[], [bigint], "view">;

  effectors: TypedContractMethod<[], [CIDV1StructOutput[]], "view">;

  getComputeUnit: TypedContractMethod<
    [id: BytesLike],
    [IWorkerManager.ComputeUnitStructOutput],
    "view"
  >;

  "getComputeUnitCount()": TypedContractMethod<[], [bigint], "view">;

  "getComputeUnitCount(address)": TypedContractMethod<
    [provider: AddressLike],
    [bigint],
    "view"
  >;

  getComputeUnits: TypedContractMethod<
    [],
    [IWorkerManager.ComputeUnitStructOutput[]],
    "view"
  >;

  getWorkerCount: TypedContractMethod<[], [bigint], "view">;

  isComputePeerExist: TypedContractMethod<
    [peerId: BytesLike],
    [boolean],
    "view"
  >;

  isProviderAllowed: TypedContractMethod<
    [account: AddressLike],
    [boolean],
    "view"
  >;

  maxWorkersPerProvider: TypedContractMethod<[], [bigint], "view">;

  minWorkers: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  paymentToken: TypedContractMethod<[], [string], "view">;

  pricePerWorkerEpoch: TypedContractMethod<[], [bigint], "view">;

  providersAccessType: TypedContractMethod<[], [bigint], "view">;

  removeProviderFromAccessList: TypedContractMethod<
    [provider: AddressLike],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  setAppCID: TypedContractMethod<[appCID_: CIDV1Struct], [void], "nonpayable">;

  targetWorkers: TypedContractMethod<[], [bigint], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addProviderToAccessList"
  ): TypedContractMethod<[provider: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "appCID"
  ): TypedContractMethod<[], [CIDV1StructOutput], "view">;
  getFunction(
    nameOrSignature: "changeProvidersAccessType"
  ): TypedContractMethod<[accessType: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "creationBlock"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "effectors"
  ): TypedContractMethod<[], [CIDV1StructOutput[]], "view">;
  getFunction(
    nameOrSignature: "getComputeUnit"
  ): TypedContractMethod<
    [id: BytesLike],
    [IWorkerManager.ComputeUnitStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getComputeUnitCount()"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getComputeUnitCount(address)"
  ): TypedContractMethod<[provider: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getComputeUnits"
  ): TypedContractMethod<
    [],
    [IWorkerManager.ComputeUnitStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getWorkerCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "isComputePeerExist"
  ): TypedContractMethod<[peerId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isProviderAllowed"
  ): TypedContractMethod<[account: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "maxWorkersPerProvider"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "minWorkers"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "paymentToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "pricePerWorkerEpoch"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "providersAccessType"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "removeProviderFromAccessList"
  ): TypedContractMethod<[provider: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setAppCID"
  ): TypedContractMethod<[appCID_: CIDV1Struct], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "targetWorkers"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "AppCIDChanged"
  ): TypedContractEvent<
    AppCIDChangedEvent.InputTuple,
    AppCIDChangedEvent.OutputTuple,
    AppCIDChangedEvent.OutputObject
  >;
  getEvent(
    key: "ComputeUnitJoined"
  ): TypedContractEvent<
    ComputeUnitJoinedEvent.InputTuple,
    ComputeUnitJoinedEvent.OutputTuple,
    ComputeUnitJoinedEvent.OutputObject
  >;
  getEvent(
    key: "ComputeUnitRemoved"
  ): TypedContractEvent<
    ComputeUnitRemovedEvent.InputTuple,
    ComputeUnitRemovedEvent.OutputTuple,
    ComputeUnitRemovedEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "ProviderAddedToAccessList"
  ): TypedContractEvent<
    ProviderAddedToAccessListEvent.InputTuple,
    ProviderAddedToAccessListEvent.OutputTuple,
    ProviderAddedToAccessListEvent.OutputObject
  >;
  getEvent(
    key: "ProviderRemovedFromAccessList"
  ): TypedContractEvent<
    ProviderRemovedFromAccessListEvent.InputTuple,
    ProviderRemovedFromAccessListEvent.OutputTuple,
    ProviderRemovedFromAccessListEvent.OutputObject
  >;
  getEvent(
    key: "ProvidersAccessTypeChanged"
  ): TypedContractEvent<
    ProvidersAccessTypeChangedEvent.InputTuple,
    ProvidersAccessTypeChangedEvent.OutputTuple,
    ProvidersAccessTypeChangedEvent.OutputObject
  >;
  getEvent(
    key: "WorkerIdUpdated"
  ): TypedContractEvent<
    WorkerIdUpdatedEvent.InputTuple,
    WorkerIdUpdatedEvent.OutputTuple,
    WorkerIdUpdatedEvent.OutputObject
  >;

  filters: {
    "AppCIDChanged(tuple)": TypedContractEvent<
      AppCIDChangedEvent.InputTuple,
      AppCIDChangedEvent.OutputTuple,
      AppCIDChangedEvent.OutputObject
    >;
    AppCIDChanged: TypedContractEvent<
      AppCIDChangedEvent.InputTuple,
      AppCIDChangedEvent.OutputTuple,
      AppCIDChangedEvent.OutputObject
    >;

    "ComputeUnitJoined(bytes32,bytes32)": TypedContractEvent<
      ComputeUnitJoinedEvent.InputTuple,
      ComputeUnitJoinedEvent.OutputTuple,
      ComputeUnitJoinedEvent.OutputObject
    >;
    ComputeUnitJoined: TypedContractEvent<
      ComputeUnitJoinedEvent.InputTuple,
      ComputeUnitJoinedEvent.OutputTuple,
      ComputeUnitJoinedEvent.OutputObject
    >;

    "ComputeUnitRemoved(bytes32,bytes32)": TypedContractEvent<
      ComputeUnitRemovedEvent.InputTuple,
      ComputeUnitRemovedEvent.OutputTuple,
      ComputeUnitRemovedEvent.OutputObject
    >;
    ComputeUnitRemoved: TypedContractEvent<
      ComputeUnitRemovedEvent.InputTuple,
      ComputeUnitRemovedEvent.OutputTuple,
      ComputeUnitRemovedEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "ProviderAddedToAccessList(address)": TypedContractEvent<
      ProviderAddedToAccessListEvent.InputTuple,
      ProviderAddedToAccessListEvent.OutputTuple,
      ProviderAddedToAccessListEvent.OutputObject
    >;
    ProviderAddedToAccessList: TypedContractEvent<
      ProviderAddedToAccessListEvent.InputTuple,
      ProviderAddedToAccessListEvent.OutputTuple,
      ProviderAddedToAccessListEvent.OutputObject
    >;

    "ProviderRemovedFromAccessList(address)": TypedContractEvent<
      ProviderRemovedFromAccessListEvent.InputTuple,
      ProviderRemovedFromAccessListEvent.OutputTuple,
      ProviderRemovedFromAccessListEvent.OutputObject
    >;
    ProviderRemovedFromAccessList: TypedContractEvent<
      ProviderRemovedFromAccessListEvent.InputTuple,
      ProviderRemovedFromAccessListEvent.OutputTuple,
      ProviderRemovedFromAccessListEvent.OutputObject
    >;

    "ProvidersAccessTypeChanged(uint8)": TypedContractEvent<
      ProvidersAccessTypeChangedEvent.InputTuple,
      ProvidersAccessTypeChangedEvent.OutputTuple,
      ProvidersAccessTypeChangedEvent.OutputObject
    >;
    ProvidersAccessTypeChanged: TypedContractEvent<
      ProvidersAccessTypeChangedEvent.InputTuple,
      ProvidersAccessTypeChangedEvent.OutputTuple,
      ProvidersAccessTypeChangedEvent.OutputObject
    >;

    "WorkerIdUpdated(bytes32,bytes32)": TypedContractEvent<
      WorkerIdUpdatedEvent.InputTuple,
      WorkerIdUpdatedEvent.OutputTuple,
      WorkerIdUpdatedEvent.OutputObject
    >;
    WorkerIdUpdated: TypedContractEvent<
      WorkerIdUpdatedEvent.InputTuple,
      WorkerIdUpdatedEvent.OutputTuple,
      WorkerIdUpdatedEvent.OutputObject
    >;
  };
}