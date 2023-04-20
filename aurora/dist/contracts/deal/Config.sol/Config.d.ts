import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface ConfigInterface extends utils.Interface {
    functions: {
        "appCID()": FunctionFragment;
        "effectorWasmsCids(uint256)": FunctionFragment;
        "fluenceToken()": FunctionFragment;
        "globalConfig()": FunctionFragment;
        "initialize(address,uint256,uint256,string,uint256,uint256,uint256,string[])": FunctionFragment;
        "maxWorkersPerProvider()": FunctionFragment;
        "minWorkers()": FunctionFragment;
        "particleVerifyer()": FunctionFragment;
        "paymentToken()": FunctionFragment;
        "pricePerEpoch()": FunctionFragment;
        "proxiableUUID()": FunctionFragment;
        "requiredStake()": FunctionFragment;
        "setAppCID(string)": FunctionFragment;
        "setPricePerEpoch(uint256)": FunctionFragment;
        "setRequiredStake(uint256)": FunctionFragment;
        "targetWorkers()": FunctionFragment;
        "upgradeTo(address)": FunctionFragment;
        "upgradeToAndCall(address,bytes)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "appCID" | "effectorWasmsCids" | "fluenceToken" | "globalConfig" | "initialize" | "maxWorkersPerProvider" | "minWorkers" | "particleVerifyer" | "paymentToken" | "pricePerEpoch" | "proxiableUUID" | "requiredStake" | "setAppCID" | "setPricePerEpoch" | "setRequiredStake" | "targetWorkers" | "upgradeTo" | "upgradeToAndCall"): FunctionFragment;
    encodeFunctionData(functionFragment: "appCID", values?: undefined): string;
    encodeFunctionData(functionFragment: "effectorWasmsCids", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "fluenceToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "globalConfig", values?: undefined): string;
    encodeFunctionData(functionFragment: "initialize", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>[]
    ]): string;
    encodeFunctionData(functionFragment: "maxWorkersPerProvider", values?: undefined): string;
    encodeFunctionData(functionFragment: "minWorkers", values?: undefined): string;
    encodeFunctionData(functionFragment: "particleVerifyer", values?: undefined): string;
    encodeFunctionData(functionFragment: "paymentToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "pricePerEpoch", values?: undefined): string;
    encodeFunctionData(functionFragment: "proxiableUUID", values?: undefined): string;
    encodeFunctionData(functionFragment: "requiredStake", values?: undefined): string;
    encodeFunctionData(functionFragment: "setAppCID", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "setPricePerEpoch", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setRequiredStake", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "targetWorkers", values?: undefined): string;
    encodeFunctionData(functionFragment: "upgradeTo", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "upgradeToAndCall", values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: "appCID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "effectorWasmsCids", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fluenceToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "globalConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxWorkersPerProvider", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minWorkers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "particleVerifyer", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "paymentToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pricePerEpoch", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proxiableUUID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "requiredStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setAppCID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPricePerEpoch", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setRequiredStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "targetWorkers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeToAndCall", data: BytesLike): Result;
    events: {
        "AdminChanged(address,address)": EventFragment;
        "AppCIDChanged(string)": EventFragment;
        "BeaconUpgraded(address)": EventFragment;
        "Initialized(uint8)": EventFragment;
        "Upgraded(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "AppCIDChanged"): EventFragment;
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
export interface AppCIDChangedEventObject {
    newAppCID: string;
}
export type AppCIDChangedEvent = TypedEvent<[string], AppCIDChangedEventObject>;
export type AppCIDChangedEventFilter = TypedEventFilter<AppCIDChangedEvent>;
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
export interface Config extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ConfigInterface;
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
        appCID(overrides?: CallOverrides): Promise<[string]>;
        effectorWasmsCids(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        fluenceToken(overrides?: CallOverrides): Promise<[string]>;
        globalConfig(overrides?: CallOverrides): Promise<[string]>;
        initialize(paymentToken_: PromiseOrValue<string>, pricePerEpoch_: PromiseOrValue<BigNumberish>, requiredStake_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, minWorkers_: PromiseOrValue<BigNumberish>, maxWorkersPerProvider_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, effectorWasmsCids_: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        maxWorkersPerProvider(overrides?: CallOverrides): Promise<[BigNumber]>;
        minWorkers(overrides?: CallOverrides): Promise<[BigNumber]>;
        particleVerifyer(overrides?: CallOverrides): Promise<[string]>;
        paymentToken(overrides?: CallOverrides): Promise<[string]>;
        pricePerEpoch(overrides?: CallOverrides): Promise<[BigNumber]>;
        proxiableUUID(overrides?: CallOverrides): Promise<[string]>;
        requiredStake(overrides?: CallOverrides): Promise<[BigNumber]>;
        setAppCID(appCID_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPricePerEpoch(pricePerEpoch_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setRequiredStake(requiredStake_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        targetWorkers(overrides?: CallOverrides): Promise<[BigNumber]>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    appCID(overrides?: CallOverrides): Promise<string>;
    effectorWasmsCids(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    fluenceToken(overrides?: CallOverrides): Promise<string>;
    globalConfig(overrides?: CallOverrides): Promise<string>;
    initialize(paymentToken_: PromiseOrValue<string>, pricePerEpoch_: PromiseOrValue<BigNumberish>, requiredStake_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, minWorkers_: PromiseOrValue<BigNumberish>, maxWorkersPerProvider_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, effectorWasmsCids_: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    maxWorkersPerProvider(overrides?: CallOverrides): Promise<BigNumber>;
    minWorkers(overrides?: CallOverrides): Promise<BigNumber>;
    particleVerifyer(overrides?: CallOverrides): Promise<string>;
    paymentToken(overrides?: CallOverrides): Promise<string>;
    pricePerEpoch(overrides?: CallOverrides): Promise<BigNumber>;
    proxiableUUID(overrides?: CallOverrides): Promise<string>;
    requiredStake(overrides?: CallOverrides): Promise<BigNumber>;
    setAppCID(appCID_: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPricePerEpoch(pricePerEpoch_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setRequiredStake(requiredStake_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    targetWorkers(overrides?: CallOverrides): Promise<BigNumber>;
    upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        appCID(overrides?: CallOverrides): Promise<string>;
        effectorWasmsCids(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        fluenceToken(overrides?: CallOverrides): Promise<string>;
        globalConfig(overrides?: CallOverrides): Promise<string>;
        initialize(paymentToken_: PromiseOrValue<string>, pricePerEpoch_: PromiseOrValue<BigNumberish>, requiredStake_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, minWorkers_: PromiseOrValue<BigNumberish>, maxWorkersPerProvider_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, effectorWasmsCids_: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        maxWorkersPerProvider(overrides?: CallOverrides): Promise<BigNumber>;
        minWorkers(overrides?: CallOverrides): Promise<BigNumber>;
        particleVerifyer(overrides?: CallOverrides): Promise<string>;
        paymentToken(overrides?: CallOverrides): Promise<string>;
        pricePerEpoch(overrides?: CallOverrides): Promise<BigNumber>;
        proxiableUUID(overrides?: CallOverrides): Promise<string>;
        requiredStake(overrides?: CallOverrides): Promise<BigNumber>;
        setAppCID(appCID_: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPricePerEpoch(pricePerEpoch_: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setRequiredStake(requiredStake_: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        targetWorkers(overrides?: CallOverrides): Promise<BigNumber>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AdminChanged(address,address)"(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        "AppCIDChanged(string)"(newAppCID?: null): AppCIDChangedEventFilter;
        AppCIDChanged(newAppCID?: null): AppCIDChangedEventFilter;
        "BeaconUpgraded(address)"(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        BeaconUpgraded(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        "Initialized(uint8)"(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;
        "Upgraded(address)"(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
        Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
    };
    estimateGas: {
        appCID(overrides?: CallOverrides): Promise<BigNumber>;
        effectorWasmsCids(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        fluenceToken(overrides?: CallOverrides): Promise<BigNumber>;
        globalConfig(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(paymentToken_: PromiseOrValue<string>, pricePerEpoch_: PromiseOrValue<BigNumberish>, requiredStake_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, minWorkers_: PromiseOrValue<BigNumberish>, maxWorkersPerProvider_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, effectorWasmsCids_: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        maxWorkersPerProvider(overrides?: CallOverrides): Promise<BigNumber>;
        minWorkers(overrides?: CallOverrides): Promise<BigNumber>;
        particleVerifyer(overrides?: CallOverrides): Promise<BigNumber>;
        paymentToken(overrides?: CallOverrides): Promise<BigNumber>;
        pricePerEpoch(overrides?: CallOverrides): Promise<BigNumber>;
        proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;
        requiredStake(overrides?: CallOverrides): Promise<BigNumber>;
        setAppCID(appCID_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPricePerEpoch(pricePerEpoch_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setRequiredStake(requiredStake_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        targetWorkers(overrides?: CallOverrides): Promise<BigNumber>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        appCID(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        effectorWasmsCids(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        fluenceToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        globalConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        initialize(paymentToken_: PromiseOrValue<string>, pricePerEpoch_: PromiseOrValue<BigNumberish>, requiredStake_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, minWorkers_: PromiseOrValue<BigNumberish>, maxWorkersPerProvider_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, effectorWasmsCids_: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        maxWorkersPerProvider(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minWorkers(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        particleVerifyer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        paymentToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pricePerEpoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        requiredStake(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setAppCID(appCID_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPricePerEpoch(pricePerEpoch_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setRequiredStake(requiredStake_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        targetWorkers(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
