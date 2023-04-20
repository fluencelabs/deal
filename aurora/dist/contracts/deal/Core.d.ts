import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export interface CoreInterface extends utils.Interface {
    functions: {
        "getConfig()": FunctionFragment;
        "getController()": FunctionFragment;
        "getPayment()": FunctionFragment;
        "getStatusController()": FunctionFragment;
        "getWorkers()": FunctionFragment;
        "initialize(address,address,address,address,address)": FunctionFragment;
        "moduleByAddress(address)": FunctionFragment;
        "modules(uint8)": FunctionFragment;
        "proxiableUUID()": FunctionFragment;
        "upgradeTo(address)": FunctionFragment;
        "upgradeToAndCall(address,bytes)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getConfig" | "getController" | "getPayment" | "getStatusController" | "getWorkers" | "initialize" | "moduleByAddress" | "modules" | "proxiableUUID" | "upgradeTo" | "upgradeToAndCall"): FunctionFragment;
    encodeFunctionData(functionFragment: "getConfig", values?: undefined): string;
    encodeFunctionData(functionFragment: "getController", values?: undefined): string;
    encodeFunctionData(functionFragment: "getPayment", values?: undefined): string;
    encodeFunctionData(functionFragment: "getStatusController", values?: undefined): string;
    encodeFunctionData(functionFragment: "getWorkers", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: "moduleByAddress", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "modules", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "proxiableUUID", values?: undefined): string;
    encodeFunctionData(functionFragment: "upgradeTo", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "upgradeToAndCall", values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPayment", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStatusController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWorkers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "moduleByAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "modules", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proxiableUUID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeToAndCall", data: BytesLike): Result;
    events: {
        "AdminChanged(address,address)": EventFragment;
        "BeaconUpgraded(address)": EventFragment;
        "Initialized(uint8)": EventFragment;
        "Upgraded(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
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
export interface Core extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: CoreInterface;
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
        getConfig(overrides?: CallOverrides): Promise<[string]>;
        getController(overrides?: CallOverrides): Promise<[string]>;
        getPayment(overrides?: CallOverrides): Promise<[string]>;
        getStatusController(overrides?: CallOverrides): Promise<[string]>;
        getWorkers(overrides?: CallOverrides): Promise<[string]>;
        initialize(config_: PromiseOrValue<string>, controller_: PromiseOrValue<string>, payment_: PromiseOrValue<string>, statusController_: PromiseOrValue<string>, workers_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        moduleByAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number]>;
        modules(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        proxiableUUID(overrides?: CallOverrides): Promise<[string]>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    getConfig(overrides?: CallOverrides): Promise<string>;
    getController(overrides?: CallOverrides): Promise<string>;
    getPayment(overrides?: CallOverrides): Promise<string>;
    getStatusController(overrides?: CallOverrides): Promise<string>;
    getWorkers(overrides?: CallOverrides): Promise<string>;
    initialize(config_: PromiseOrValue<string>, controller_: PromiseOrValue<string>, payment_: PromiseOrValue<string>, statusController_: PromiseOrValue<string>, workers_: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    moduleByAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
    modules(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    proxiableUUID(overrides?: CallOverrides): Promise<string>;
    upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        getConfig(overrides?: CallOverrides): Promise<string>;
        getController(overrides?: CallOverrides): Promise<string>;
        getPayment(overrides?: CallOverrides): Promise<string>;
        getStatusController(overrides?: CallOverrides): Promise<string>;
        getWorkers(overrides?: CallOverrides): Promise<string>;
        initialize(config_: PromiseOrValue<string>, controller_: PromiseOrValue<string>, payment_: PromiseOrValue<string>, statusController_: PromiseOrValue<string>, workers_: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        moduleByAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
        modules(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        proxiableUUID(overrides?: CallOverrides): Promise<string>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AdminChanged(address,address)"(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        "BeaconUpgraded(address)"(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        BeaconUpgraded(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        "Initialized(uint8)"(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;
        "Upgraded(address)"(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
        Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
    };
    estimateGas: {
        getConfig(overrides?: CallOverrides): Promise<BigNumber>;
        getController(overrides?: CallOverrides): Promise<BigNumber>;
        getPayment(overrides?: CallOverrides): Promise<BigNumber>;
        getStatusController(overrides?: CallOverrides): Promise<BigNumber>;
        getWorkers(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(config_: PromiseOrValue<string>, controller_: PromiseOrValue<string>, payment_: PromiseOrValue<string>, statusController_: PromiseOrValue<string>, workers_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        moduleByAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        modules(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        getConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPayment(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getStatusController(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getWorkers(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(config_: PromiseOrValue<string>, controller_: PromiseOrValue<string>, payment_: PromiseOrValue<string>, statusController_: PromiseOrValue<string>, workers_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        moduleByAddress(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        modules(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
