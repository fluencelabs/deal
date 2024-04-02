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
} from "../../../../../common";

export declare namespace ICapacity {
  export type CommitmentViewStruct = {
    status: BigNumberish;
    peerId: BytesLike;
    collateralPerUnit: BigNumberish;
    unitCount: BigNumberish;
    startEpoch: BigNumberish;
    endEpoch: BigNumberish;
    rewardDelegatorRate: BigNumberish;
    delegator: AddressLike;
    totalFailCount: BigNumberish;
    failedEpoch: BigNumberish;
    exitedUnitCount: BigNumberish;
  };

  export type CommitmentViewStructOutput = [
    status: bigint,
    peerId: string,
    collateralPerUnit: bigint,
    unitCount: bigint,
    startEpoch: bigint,
    endEpoch: bigint,
    rewardDelegatorRate: bigint,
    delegator: string,
    totalFailCount: bigint,
    failedEpoch: bigint,
    exitedUnitCount: bigint
  ] & {
    status: bigint;
    peerId: string;
    collateralPerUnit: bigint;
    unitCount: bigint;
    startEpoch: bigint;
    endEpoch: bigint;
    rewardDelegatorRate: bigint;
    delegator: string;
    totalFailCount: bigint;
    failedEpoch: bigint;
    exitedUnitCount: bigint;
  };
}

export interface ICapacityInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "createCommitment"
      | "depositCollateral"
      | "finishCommitment"
      | "getCommitment"
      | "getGlobalNonce"
      | "getStatus"
      | "initialize"
      | "onUnitMovedToDeal"
      | "onUnitReturnedFromDeal"
      | "removeCUFromCC"
      | "removeCommitment"
      | "submitProof"
      | "totalRewards"
      | "unlockedRewards"
      | "withdrawReward"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "CollateralDeposited"
      | "CommitmentActivated"
      | "CommitmentCreated"
      | "CommitmentFailed"
      | "CommitmentFinished"
      | "CommitmentRemoved"
      | "CommitmentStatsUpdated"
      | "ProofSubmitted"
      | "RewardWithdrawn"
      | "UnitActivated"
      | "UnitDeactivated"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "createCommitment",
    values: [BytesLike, BigNumberish, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositCollateral",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "finishCommitment",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getCommitment",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getGlobalNonce",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getStatus",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onUnitMovedToDeal",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onUnitReturnedFromDeal",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeCUFromCC",
    values: [BytesLike, BytesLike[]]
  ): string;
  encodeFunctionData(
    functionFragment: "removeCommitment",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "submitProof",
    values: [BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "totalRewards",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unlockedRewards",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawReward",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "createCommitment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "depositCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "finishCommitment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCommitment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getGlobalNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getStatus", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "onUnitMovedToDeal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onUnitReturnedFromDeal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeCUFromCC",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeCommitment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "submitProof",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockedRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawReward",
    data: BytesLike
  ): Result;
}

export namespace CollateralDepositedEvent {
  export type InputTuple = [
    commitmentId: BytesLike,
    totalCollateral: BigNumberish
  ];
  export type OutputTuple = [commitmentId: string, totalCollateral: bigint];
  export interface OutputObject {
    commitmentId: string;
    totalCollateral: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CommitmentActivatedEvent {
  export type InputTuple = [
    peerId: BytesLike,
    commitmentId: BytesLike,
    startEpoch: BigNumberish,
    endEpoch: BigNumberish,
    unitIds: BytesLike[]
  ];
  export type OutputTuple = [
    peerId: string,
    commitmentId: string,
    startEpoch: bigint,
    endEpoch: bigint,
    unitIds: string[]
  ];
  export interface OutputObject {
    peerId: string;
    commitmentId: string;
    startEpoch: bigint;
    endEpoch: bigint;
    unitIds: string[];
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CommitmentCreatedEvent {
  export type InputTuple = [
    peerId: BytesLike,
    commitmentId: BytesLike,
    duration: BigNumberish,
    delegator: AddressLike,
    rewardDelegationRate: BigNumberish,
    fltCollateralPerUnit: BigNumberish
  ];
  export type OutputTuple = [
    peerId: string,
    commitmentId: string,
    duration: bigint,
    delegator: string,
    rewardDelegationRate: bigint,
    fltCollateralPerUnit: bigint
  ];
  export interface OutputObject {
    peerId: string;
    commitmentId: string;
    duration: bigint;
    delegator: string;
    rewardDelegationRate: bigint;
    fltCollateralPerUnit: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CommitmentFailedEvent {
  export type InputTuple = [commitmentId: BytesLike, failedEpoch: BigNumberish];
  export type OutputTuple = [commitmentId: string, failedEpoch: bigint];
  export interface OutputObject {
    commitmentId: string;
    failedEpoch: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CommitmentFinishedEvent {
  export type InputTuple = [commitmentId: BytesLike];
  export type OutputTuple = [commitmentId: string];
  export interface OutputObject {
    commitmentId: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CommitmentRemovedEvent {
  export type InputTuple = [commitmentId: BytesLike];
  export type OutputTuple = [commitmentId: string];
  export interface OutputObject {
    commitmentId: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CommitmentStatsUpdatedEvent {
  export type InputTuple = [
    commitmentId: BytesLike,
    totalFailCount: BigNumberish,
    exitedUnitCount: BigNumberish,
    activeUnitCount: BigNumberish,
    nextAdditionalActiveUnitCount: BigNumberish,
    changedEpoch: BigNumberish
  ];
  export type OutputTuple = [
    commitmentId: string,
    totalFailCount: bigint,
    exitedUnitCount: bigint,
    activeUnitCount: bigint,
    nextAdditionalActiveUnitCount: bigint,
    changedEpoch: bigint
  ];
  export interface OutputObject {
    commitmentId: string;
    totalFailCount: bigint;
    exitedUnitCount: bigint;
    activeUnitCount: bigint;
    nextAdditionalActiveUnitCount: bigint;
    changedEpoch: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ProofSubmittedEvent {
  export type InputTuple = [
    commitmentId: BytesLike,
    unitId: BytesLike,
    localUnitNonce: BytesLike
  ];
  export type OutputTuple = [
    commitmentId: string,
    unitId: string,
    localUnitNonce: string
  ];
  export interface OutputObject {
    commitmentId: string;
    unitId: string;
    localUnitNonce: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RewardWithdrawnEvent {
  export type InputTuple = [commitmentId: BytesLike, amount: BigNumberish];
  export type OutputTuple = [commitmentId: string, amount: bigint];
  export interface OutputObject {
    commitmentId: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnitActivatedEvent {
  export type InputTuple = [
    commitmentId: BytesLike,
    unitId: BytesLike,
    startEpoch: BigNumberish
  ];
  export type OutputTuple = [
    commitmentId: string,
    unitId: string,
    startEpoch: bigint
  ];
  export interface OutputObject {
    commitmentId: string;
    unitId: string;
    startEpoch: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnitDeactivatedEvent {
  export type InputTuple = [commitmentId: BytesLike, unitId: BytesLike];
  export type OutputTuple = [commitmentId: string, unitId: string];
  export interface OutputObject {
    commitmentId: string;
    unitId: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface ICapacity extends BaseContract {
  connect(runner?: ContractRunner | null): ICapacity;
  waitForDeployment(): Promise<this>;

  interface: ICapacityInterface;

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

  createCommitment: TypedContractMethod<
    [
      peerId: BytesLike,
      duration: BigNumberish,
      delegator: AddressLike,
      rewardDelegationRate: BigNumberish
    ],
    [string],
    "nonpayable"
  >;

  depositCollateral: TypedContractMethod<
    [commitmentIds: BytesLike[]],
    [void],
    "payable"
  >;

  finishCommitment: TypedContractMethod<
    [commitmentId: BytesLike],
    [void],
    "nonpayable"
  >;

  getCommitment: TypedContractMethod<
    [commitmentId: BytesLike],
    [ICapacity.CommitmentViewStructOutput],
    "view"
  >;

  getGlobalNonce: TypedContractMethod<[], [string], "view">;

  getStatus: TypedContractMethod<[commitmentId: BytesLike], [bigint], "view">;

  initialize: TypedContractMethod<
    [initGlobalNonce_: BytesLike],
    [void],
    "nonpayable"
  >;

  onUnitMovedToDeal: TypedContractMethod<
    [commitmentId: BytesLike, unitId: BytesLike],
    [void],
    "nonpayable"
  >;

  onUnitReturnedFromDeal: TypedContractMethod<
    [commitmentId: BytesLike, unitId: BytesLike],
    [void],
    "nonpayable"
  >;

  removeCUFromCC: TypedContractMethod<
    [commitmentId: BytesLike, unitIds: BytesLike[]],
    [void],
    "nonpayable"
  >;

  removeCommitment: TypedContractMethod<
    [commitmentId: BytesLike],
    [void],
    "nonpayable"
  >;

  submitProof: TypedContractMethod<
    [unitId: BytesLike, localUnitNonce: BytesLike, resultHash: BytesLike],
    [void],
    "nonpayable"
  >;

  totalRewards: TypedContractMethod<
    [commitmentId: BytesLike],
    [bigint],
    "view"
  >;

  unlockedRewards: TypedContractMethod<
    [commitmentId: BytesLike],
    [bigint],
    "view"
  >;

  withdrawReward: TypedContractMethod<
    [commitmentId: BytesLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "createCommitment"
  ): TypedContractMethod<
    [
      peerId: BytesLike,
      duration: BigNumberish,
      delegator: AddressLike,
      rewardDelegationRate: BigNumberish
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "depositCollateral"
  ): TypedContractMethod<[commitmentIds: BytesLike[]], [void], "payable">;
  getFunction(
    nameOrSignature: "finishCommitment"
  ): TypedContractMethod<[commitmentId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getCommitment"
  ): TypedContractMethod<
    [commitmentId: BytesLike],
    [ICapacity.CommitmentViewStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getGlobalNonce"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getStatus"
  ): TypedContractMethod<[commitmentId: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "initialize"
  ): TypedContractMethod<[initGlobalNonce_: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "onUnitMovedToDeal"
  ): TypedContractMethod<
    [commitmentId: BytesLike, unitId: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "onUnitReturnedFromDeal"
  ): TypedContractMethod<
    [commitmentId: BytesLike, unitId: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "removeCUFromCC"
  ): TypedContractMethod<
    [commitmentId: BytesLike, unitIds: BytesLike[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "removeCommitment"
  ): TypedContractMethod<[commitmentId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "submitProof"
  ): TypedContractMethod<
    [unitId: BytesLike, localUnitNonce: BytesLike, resultHash: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "totalRewards"
  ): TypedContractMethod<[commitmentId: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "unlockedRewards"
  ): TypedContractMethod<[commitmentId: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "withdrawReward"
  ): TypedContractMethod<[commitmentId: BytesLike], [void], "nonpayable">;

  getEvent(
    key: "CollateralDeposited"
  ): TypedContractEvent<
    CollateralDepositedEvent.InputTuple,
    CollateralDepositedEvent.OutputTuple,
    CollateralDepositedEvent.OutputObject
  >;
  getEvent(
    key: "CommitmentActivated"
  ): TypedContractEvent<
    CommitmentActivatedEvent.InputTuple,
    CommitmentActivatedEvent.OutputTuple,
    CommitmentActivatedEvent.OutputObject
  >;
  getEvent(
    key: "CommitmentCreated"
  ): TypedContractEvent<
    CommitmentCreatedEvent.InputTuple,
    CommitmentCreatedEvent.OutputTuple,
    CommitmentCreatedEvent.OutputObject
  >;
  getEvent(
    key: "CommitmentFailed"
  ): TypedContractEvent<
    CommitmentFailedEvent.InputTuple,
    CommitmentFailedEvent.OutputTuple,
    CommitmentFailedEvent.OutputObject
  >;
  getEvent(
    key: "CommitmentFinished"
  ): TypedContractEvent<
    CommitmentFinishedEvent.InputTuple,
    CommitmentFinishedEvent.OutputTuple,
    CommitmentFinishedEvent.OutputObject
  >;
  getEvent(
    key: "CommitmentRemoved"
  ): TypedContractEvent<
    CommitmentRemovedEvent.InputTuple,
    CommitmentRemovedEvent.OutputTuple,
    CommitmentRemovedEvent.OutputObject
  >;
  getEvent(
    key: "CommitmentStatsUpdated"
  ): TypedContractEvent<
    CommitmentStatsUpdatedEvent.InputTuple,
    CommitmentStatsUpdatedEvent.OutputTuple,
    CommitmentStatsUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "ProofSubmitted"
  ): TypedContractEvent<
    ProofSubmittedEvent.InputTuple,
    ProofSubmittedEvent.OutputTuple,
    ProofSubmittedEvent.OutputObject
  >;
  getEvent(
    key: "RewardWithdrawn"
  ): TypedContractEvent<
    RewardWithdrawnEvent.InputTuple,
    RewardWithdrawnEvent.OutputTuple,
    RewardWithdrawnEvent.OutputObject
  >;
  getEvent(
    key: "UnitActivated"
  ): TypedContractEvent<
    UnitActivatedEvent.InputTuple,
    UnitActivatedEvent.OutputTuple,
    UnitActivatedEvent.OutputObject
  >;
  getEvent(
    key: "UnitDeactivated"
  ): TypedContractEvent<
    UnitDeactivatedEvent.InputTuple,
    UnitDeactivatedEvent.OutputTuple,
    UnitDeactivatedEvent.OutputObject
  >;

  filters: {
    "CollateralDeposited(bytes32,uint256)": TypedContractEvent<
      CollateralDepositedEvent.InputTuple,
      CollateralDepositedEvent.OutputTuple,
      CollateralDepositedEvent.OutputObject
    >;
    CollateralDeposited: TypedContractEvent<
      CollateralDepositedEvent.InputTuple,
      CollateralDepositedEvent.OutputTuple,
      CollateralDepositedEvent.OutputObject
    >;

    "CommitmentActivated(bytes32,bytes32,uint256,uint256,bytes32[])": TypedContractEvent<
      CommitmentActivatedEvent.InputTuple,
      CommitmentActivatedEvent.OutputTuple,
      CommitmentActivatedEvent.OutputObject
    >;
    CommitmentActivated: TypedContractEvent<
      CommitmentActivatedEvent.InputTuple,
      CommitmentActivatedEvent.OutputTuple,
      CommitmentActivatedEvent.OutputObject
    >;

    "CommitmentCreated(bytes32,bytes32,uint256,address,uint256,uint256)": TypedContractEvent<
      CommitmentCreatedEvent.InputTuple,
      CommitmentCreatedEvent.OutputTuple,
      CommitmentCreatedEvent.OutputObject
    >;
    CommitmentCreated: TypedContractEvent<
      CommitmentCreatedEvent.InputTuple,
      CommitmentCreatedEvent.OutputTuple,
      CommitmentCreatedEvent.OutputObject
    >;

    "CommitmentFailed(bytes32,uint256)": TypedContractEvent<
      CommitmentFailedEvent.InputTuple,
      CommitmentFailedEvent.OutputTuple,
      CommitmentFailedEvent.OutputObject
    >;
    CommitmentFailed: TypedContractEvent<
      CommitmentFailedEvent.InputTuple,
      CommitmentFailedEvent.OutputTuple,
      CommitmentFailedEvent.OutputObject
    >;

    "CommitmentFinished(bytes32)": TypedContractEvent<
      CommitmentFinishedEvent.InputTuple,
      CommitmentFinishedEvent.OutputTuple,
      CommitmentFinishedEvent.OutputObject
    >;
    CommitmentFinished: TypedContractEvent<
      CommitmentFinishedEvent.InputTuple,
      CommitmentFinishedEvent.OutputTuple,
      CommitmentFinishedEvent.OutputObject
    >;

    "CommitmentRemoved(bytes32)": TypedContractEvent<
      CommitmentRemovedEvent.InputTuple,
      CommitmentRemovedEvent.OutputTuple,
      CommitmentRemovedEvent.OutputObject
    >;
    CommitmentRemoved: TypedContractEvent<
      CommitmentRemovedEvent.InputTuple,
      CommitmentRemovedEvent.OutputTuple,
      CommitmentRemovedEvent.OutputObject
    >;

    "CommitmentStatsUpdated(bytes32,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<
      CommitmentStatsUpdatedEvent.InputTuple,
      CommitmentStatsUpdatedEvent.OutputTuple,
      CommitmentStatsUpdatedEvent.OutputObject
    >;
    CommitmentStatsUpdated: TypedContractEvent<
      CommitmentStatsUpdatedEvent.InputTuple,
      CommitmentStatsUpdatedEvent.OutputTuple,
      CommitmentStatsUpdatedEvent.OutputObject
    >;

    "ProofSubmitted(bytes32,bytes32,bytes32)": TypedContractEvent<
      ProofSubmittedEvent.InputTuple,
      ProofSubmittedEvent.OutputTuple,
      ProofSubmittedEvent.OutputObject
    >;
    ProofSubmitted: TypedContractEvent<
      ProofSubmittedEvent.InputTuple,
      ProofSubmittedEvent.OutputTuple,
      ProofSubmittedEvent.OutputObject
    >;

    "RewardWithdrawn(bytes32,uint256)": TypedContractEvent<
      RewardWithdrawnEvent.InputTuple,
      RewardWithdrawnEvent.OutputTuple,
      RewardWithdrawnEvent.OutputObject
    >;
    RewardWithdrawn: TypedContractEvent<
      RewardWithdrawnEvent.InputTuple,
      RewardWithdrawnEvent.OutputTuple,
      RewardWithdrawnEvent.OutputObject
    >;

    "UnitActivated(bytes32,bytes32,uint256)": TypedContractEvent<
      UnitActivatedEvent.InputTuple,
      UnitActivatedEvent.OutputTuple,
      UnitActivatedEvent.OutputObject
    >;
    UnitActivated: TypedContractEvent<
      UnitActivatedEvent.InputTuple,
      UnitActivatedEvent.OutputTuple,
      UnitActivatedEvent.OutputObject
    >;

    "UnitDeactivated(bytes32,bytes32)": TypedContractEvent<
      UnitDeactivatedEvent.InputTuple,
      UnitDeactivatedEvent.OutputTuple,
      UnitDeactivatedEvent.OutputObject
    >;
    UnitDeactivated: TypedContractEvent<
      UnitDeactivatedEvent.InputTuple,
      UnitDeactivatedEvent.OutputTuple,
      UnitDeactivatedEvent.OutputObject
    >;
  };
}