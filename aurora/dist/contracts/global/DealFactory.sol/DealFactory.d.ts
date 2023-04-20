import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export declare namespace DealFactory {
    type DealStruct = {
        core: PromiseOrValue<string>;
        config: PromiseOrValue<string>;
        controller: PromiseOrValue<string>;
        payment: PromiseOrValue<string>;
        statusController: PromiseOrValue<string>;
        workers: PromiseOrValue<string>;
    };
    type DealStructOutput = [
        string,
        string,
        string,
        string,
        string,
        string
    ] & {
        core: string;
        config: string;
        controller: string;
        payment: string;
        statusController: string;
        workers: string;
    };
}
export interface DealFactoryInterface extends utils.Interface {
    functions: {
        "MAX_WORKERS_PER_PROVIDER()": FunctionFragment;
        "PRICE_PER_EPOCH()": FunctionFragment;
        "REQUIRED_STAKE()": FunctionFragment;
        "configImpl()": FunctionFragment;
        "controllerImpl()": FunctionFragment;
        "coreImpl()": FunctionFragment;
        "createDeal(uint256,uint256,string)": FunctionFragment;
        "defaultPaymentToken()": FunctionFragment;
        "globalConfig()": FunctionFragment;
        "isDeal(address)": FunctionFragment;
        "paymentImpl()": FunctionFragment;
        "proxiableUUID()": FunctionFragment;
        "statusControllerImpl()": FunctionFragment;
        "upgradeTo(address)": FunctionFragment;
        "upgradeToAndCall(address,bytes)": FunctionFragment;
        "workersImpl()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "MAX_WORKERS_PER_PROVIDER" | "PRICE_PER_EPOCH" | "REQUIRED_STAKE" | "configImpl" | "controllerImpl" | "coreImpl" | "createDeal" | "defaultPaymentToken" | "globalConfig" | "isDeal" | "paymentImpl" | "proxiableUUID" | "statusControllerImpl" | "upgradeTo" | "upgradeToAndCall" | "workersImpl"): FunctionFragment;
    encodeFunctionData(functionFragment: "MAX_WORKERS_PER_PROVIDER", values?: undefined): string;
    encodeFunctionData(functionFragment: "PRICE_PER_EPOCH", values?: undefined): string;
    encodeFunctionData(functionFragment: "REQUIRED_STAKE", values?: undefined): string;
    encodeFunctionData(functionFragment: "configImpl", values?: undefined): string;
    encodeFunctionData(functionFragment: "controllerImpl", values?: undefined): string;
    encodeFunctionData(functionFragment: "coreImpl", values?: undefined): string;
    encodeFunctionData(functionFragment: "createDeal", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "defaultPaymentToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "globalConfig", values?: undefined): string;
    encodeFunctionData(functionFragment: "isDeal", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "paymentImpl", values?: undefined): string;
    encodeFunctionData(functionFragment: "proxiableUUID", values?: undefined): string;
    encodeFunctionData(functionFragment: "statusControllerImpl", values?: undefined): string;
    encodeFunctionData(functionFragment: "upgradeTo", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "upgradeToAndCall", values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "workersImpl", values?: undefined): string;
    decodeFunctionResult(functionFragment: "MAX_WORKERS_PER_PROVIDER", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "PRICE_PER_EPOCH", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "REQUIRED_STAKE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "configImpl", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "controllerImpl", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "coreImpl", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createDeal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "defaultPaymentToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "globalConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isDeal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "paymentImpl", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proxiableUUID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "statusControllerImpl", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeToAndCall", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "workersImpl", data: BytesLike): Result;
    events: {
        "AdminChanged(address,address)": EventFragment;
        "BeaconUpgraded(address)": EventFragment;
        "DealCreated(tuple,address,uint256,uint256,uint256,uint256,uint256,string,string[],uint256)": EventFragment;
        "Initialized(uint8)": EventFragment;
        "Upgraded(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "DealCreated"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}
export interface AdminChangedEventObject {
    previousAdmin: string;
    newAdmin: string;
}
export type AdminChangedEvent = TypedEvent<[
    string,
    string
], AdminChangedEventObject>;
export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;
export interface BeaconUpgradedEventObject {
    beacon: string;
}
export type BeaconUpgradedEvent = TypedEvent<[
    string
], BeaconUpgradedEventObject>;
export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;
export interface DealCreatedEventObject {
    deal: DealFactory.DealStructOutput;
    paymentToken: string;
    pricePerEpoch: BigNumber;
    requiredStake: BigNumber;
    minWorkers: BigNumber;
    maxWorkersPerProvider: BigNumber;
    targetWorkers: BigNumber;
    appCID: string;
    effectorWasmsCids: string[];
    epoch: BigNumber;
}
export type DealCreatedEvent = TypedEvent<[
    DealFactory.DealStructOutput,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    string[],
    BigNumber
], DealCreatedEventObject>;
export type DealCreatedEventFilter = TypedEventFilter<DealCreatedEvent>;
export interface InitializedEventObject {
    version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;
export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;
export interface UpgradedEventObject {
    implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;
export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;
export interface DealFactory extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: DealFactoryInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        MAX_WORKERS_PER_PROVIDER(overrides?: CallOverrides): Promise<[BigNumber]>;
        PRICE_PER_EPOCH(overrides?: CallOverrides): Promise<[BigNumber]>;
        REQUIRED_STAKE(overrides?: CallOverrides): Promise<[BigNumber]>;
        configImpl(overrides?: CallOverrides): Promise<[string]>;
        controllerImpl(overrides?: CallOverrides): Promise<[string]>;
        coreImpl(overrides?: CallOverrides): Promise<[string]>;
        createDeal(minWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        defaultPaymentToken(overrides?: CallOverrides): Promise<[string]>;
        globalConfig(overrides?: CallOverrides): Promise<[string]>;
        isDeal(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        paymentImpl(overrides?: CallOverrides): Promise<[string]>;
        proxiableUUID(overrides?: CallOverrides): Promise<[string]>;
        statusControllerImpl(overrides?: CallOverrides): Promise<[string]>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        workersImpl(overrides?: CallOverrides): Promise<[string]>;
    };
    MAX_WORKERS_PER_PROVIDER(overrides?: CallOverrides): Promise<BigNumber>;
    PRICE_PER_EPOCH(overrides?: CallOverrides): Promise<BigNumber>;
    REQUIRED_STAKE(overrides?: CallOverrides): Promise<BigNumber>;
    configImpl(overrides?: CallOverrides): Promise<string>;
    controllerImpl(overrides?: CallOverrides): Promise<string>;
    coreImpl(overrides?: CallOverrides): Promise<string>;
    createDeal(minWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    defaultPaymentToken(overrides?: CallOverrides): Promise<string>;
    globalConfig(overrides?: CallOverrides): Promise<string>;
    isDeal(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    paymentImpl(overrides?: CallOverrides): Promise<string>;
    proxiableUUID(overrides?: CallOverrides): Promise<string>;
    statusControllerImpl(overrides?: CallOverrides): Promise<string>;
    upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    workersImpl(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        MAX_WORKERS_PER_PROVIDER(overrides?: CallOverrides): Promise<BigNumber>;
        PRICE_PER_EPOCH(overrides?: CallOverrides): Promise<BigNumber>;
        REQUIRED_STAKE(overrides?: CallOverrides): Promise<BigNumber>;
        configImpl(overrides?: CallOverrides): Promise<string>;
        controllerImpl(overrides?: CallOverrides): Promise<string>;
        coreImpl(overrides?: CallOverrides): Promise<string>;
        createDeal(minWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        defaultPaymentToken(overrides?: CallOverrides): Promise<string>;
        globalConfig(overrides?: CallOverrides): Promise<string>;
        isDeal(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        paymentImpl(overrides?: CallOverrides): Promise<string>;
        proxiableUUID(overrides?: CallOverrides): Promise<string>;
        statusControllerImpl(overrides?: CallOverrides): Promise<string>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        workersImpl(overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        "AdminChanged(address,address)"(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        "BeaconUpgraded(address)"(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        BeaconUpgraded(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        "DealCreated(tuple,address,uint256,uint256,uint256,uint256,uint256,string,string[],uint256)"(deal?: null, paymentToken?: null, pricePerEpoch?: null, requiredStake?: null, minWorkers?: null, maxWorkersPerProvider?: null, targetWorkers?: null, appCID?: null, effectorWasmsCids?: null, epoch?: null): DealCreatedEventFilter;
        DealCreated(deal?: null, paymentToken?: null, pricePerEpoch?: null, requiredStake?: null, minWorkers?: null, maxWorkersPerProvider?: null, targetWorkers?: null, appCID?: null, effectorWasmsCids?: null, epoch?: null): DealCreatedEventFilter;
        "Initialized(uint8)"(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;
        "Upgraded(address)"(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
        Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
    };
    estimateGas: {
        MAX_WORKERS_PER_PROVIDER(overrides?: CallOverrides): Promise<BigNumber>;
        PRICE_PER_EPOCH(overrides?: CallOverrides): Promise<BigNumber>;
        REQUIRED_STAKE(overrides?: CallOverrides): Promise<BigNumber>;
        configImpl(overrides?: CallOverrides): Promise<BigNumber>;
        controllerImpl(overrides?: CallOverrides): Promise<BigNumber>;
        coreImpl(overrides?: CallOverrides): Promise<BigNumber>;
        createDeal(minWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        defaultPaymentToken(overrides?: CallOverrides): Promise<BigNumber>;
        globalConfig(overrides?: CallOverrides): Promise<BigNumber>;
        isDeal(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        paymentImpl(overrides?: CallOverrides): Promise<BigNumber>;
        proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;
        statusControllerImpl(overrides?: CallOverrides): Promise<BigNumber>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        workersImpl(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        MAX_WORKERS_PER_PROVIDER(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        PRICE_PER_EPOCH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        REQUIRED_STAKE(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        configImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        controllerImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        coreImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        createDeal(minWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        defaultPaymentToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        globalConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isDeal(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        paymentImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        statusControllerImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        workersImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
