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
    owner: AddressLike;
    joinedEpoch: BigNumberish;
  };

  export type ComputeUnitStructOutput = [
    id: string,
    workerId: string,
    owner: string,
    joinedEpoch: bigint
  ] & { id: string; workerId: string; owner: string; joinedEpoch: bigint };
}

export interface WorkerManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "accessType"
      | "appCID"
      | "changeAccessType"
      | "creationBlock"
      | "effectors"
      | "getAccessList"
      | "getComputeUnit"
      | "getComputeUnitCount"
      | "getComputeUnits"
      | "getWorkerCount"
      | "isInAccessList"
      | "maxWorkersPerProvider"
      | "minWorkers"
      | "owner"
      | "paymentToken"
      | "pricePerWorkerEpoch"
      | "removeFromAccessList"
      | "renounceOwnership"
      | "setAppCID"
      | "targetWorkers"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AppCIDChanged"
      | "ComputeUnitExited"
      | "ComputeUnitJoined"
      | "Initialized"
      | "OwnershipTransferred"
      | "WorkerIdUpdated"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "accessType",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "appCID", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "changeAccessType",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "creationBlock",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "effectors", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getAccessList",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getComputeUnit",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getComputeUnitCount",
    values?: undefined
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
    functionFragment: "isInAccessList",
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
    functionFragment: "removeFromAccessList",
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

  decodeFunctionResult(functionFragment: "accessType", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "appCID", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "changeAccessType",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "creationBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "effectors", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAccessList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComputeUnit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComputeUnitCount",
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
    functionFragment: "isInAccessList",
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
    functionFragment: "removeFromAccessList",
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

export namespace ComputeUnitExitedEvent {
  export type InputTuple = [unitId: BytesLike];
  export type OutputTuple = [unitId: string];
  export interface OutputObject {
    unitId: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ComputeUnitJoinedEvent {
  export type InputTuple = [unitId: BytesLike];
  export type OutputTuple = [unitId: string];
  export interface OutputObject {
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

  accessType: TypedContractMethod<[], [bigint], "view">;

  appCID: TypedContractMethod<[], [CIDV1StructOutput], "view">;

  changeAccessType: TypedContractMethod<
    [accessType_: BigNumberish],
    [void],
    "nonpayable"
  >;

  creationBlock: TypedContractMethod<[], [bigint], "view">;

  effectors: TypedContractMethod<[], [CIDV1StructOutput[]], "view">;

  getAccessList: TypedContractMethod<[], [string[]], "view">;

  getComputeUnit: TypedContractMethod<
    [id: BytesLike],
    [IWorkerManager.ComputeUnitStructOutput],
    "view"
  >;

  getComputeUnitCount: TypedContractMethod<[], [bigint], "view">;

  getComputeUnits: TypedContractMethod<
    [],
    [IWorkerManager.ComputeUnitStructOutput[]],
    "view"
  >;

  getWorkerCount: TypedContractMethod<[], [bigint], "view">;

  isInAccessList: TypedContractMethod<[addr: AddressLike], [boolean], "view">;

  maxWorkersPerProvider: TypedContractMethod<[], [bigint], "view">;

  minWorkers: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  paymentToken: TypedContractMethod<[], [string], "view">;

  pricePerWorkerEpoch: TypedContractMethod<[], [bigint], "view">;

  removeFromAccessList: TypedContractMethod<
    [addr: AddressLike],
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
    nameOrSignature: "accessType"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "appCID"
  ): TypedContractMethod<[], [CIDV1StructOutput], "view">;
  getFunction(
    nameOrSignature: "changeAccessType"
  ): TypedContractMethod<[accessType_: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "creationBlock"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "effectors"
  ): TypedContractMethod<[], [CIDV1StructOutput[]], "view">;
  getFunction(
    nameOrSignature: "getAccessList"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "getComputeUnit"
  ): TypedContractMethod<
    [id: BytesLike],
    [IWorkerManager.ComputeUnitStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getComputeUnitCount"
  ): TypedContractMethod<[], [bigint], "view">;
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
    nameOrSignature: "isInAccessList"
  ): TypedContractMethod<[addr: AddressLike], [boolean], "view">;
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
    nameOrSignature: "removeFromAccessList"
  ): TypedContractMethod<[addr: AddressLike], [void], "nonpayable">;
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
    key: "ComputeUnitExited"
  ): TypedContractEvent<
    ComputeUnitExitedEvent.InputTuple,
    ComputeUnitExitedEvent.OutputTuple,
    ComputeUnitExitedEvent.OutputObject
  >;
  getEvent(
    key: "ComputeUnitJoined"
  ): TypedContractEvent<
    ComputeUnitJoinedEvent.InputTuple,
    ComputeUnitJoinedEvent.OutputTuple,
    ComputeUnitJoinedEvent.OutputObject
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

    "ComputeUnitExited(bytes32)": TypedContractEvent<
      ComputeUnitExitedEvent.InputTuple,
      ComputeUnitExitedEvent.OutputTuple,
      ComputeUnitExitedEvent.OutputObject
    >;
    ComputeUnitExited: TypedContractEvent<
      ComputeUnitExitedEvent.InputTuple,
      ComputeUnitExitedEvent.OutputTuple,
      ComputeUnitExitedEvent.OutputObject
    >;

    "ComputeUnitJoined(bytes32)": TypedContractEvent<
      ComputeUnitJoinedEvent.InputTuple,
      ComputeUnitJoinedEvent.OutputTuple,
      ComputeUnitJoinedEvent.OutputObject
    >;
    ComputeUnitJoined: TypedContractEvent<
      ComputeUnitJoinedEvent.InputTuple,
      ComputeUnitJoinedEvent.OutputTuple,
      ComputeUnitJoinedEvent.OutputObject
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
