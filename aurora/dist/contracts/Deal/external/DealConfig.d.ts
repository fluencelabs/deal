import type { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface DealConfigInterface extends utils.Interface {
    functions: {
        "appCID()": FunctionFragment;
        "core()": FunctionFragment;
        "effectorWasmsCids()": FunctionFragment;
        "fluenceToken()": FunctionFragment;
        "maxWorkersPerProvider()": FunctionFragment;
        "minWorkers()": FunctionFragment;
        "paymentToken()": FunctionFragment;
        "pricePerEpoch()": FunctionFragment;
        "requiredStake()": FunctionFragment;
        "setAppCID(string)": FunctionFragment;
        "targetWorkers()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "appCID" | "core" | "effectorWasmsCids" | "fluenceToken" | "maxWorkersPerProvider" | "minWorkers" | "paymentToken" | "pricePerEpoch" | "requiredStake" | "setAppCID" | "targetWorkers"): FunctionFragment;
    encodeFunctionData(functionFragment: "appCID", values?: undefined): string;
    encodeFunctionData(functionFragment: "core", values?: undefined): string;
    encodeFunctionData(functionFragment: "effectorWasmsCids", values?: undefined): string;
    encodeFunctionData(functionFragment: "fluenceToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "maxWorkersPerProvider", values?: undefined): string;
    encodeFunctionData(functionFragment: "minWorkers", values?: undefined): string;
    encodeFunctionData(functionFragment: "paymentToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "pricePerEpoch", values?: undefined): string;
    encodeFunctionData(functionFragment: "requiredStake", values?: undefined): string;
    encodeFunctionData(functionFragment: "setAppCID", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "targetWorkers", values?: undefined): string;
    decodeFunctionResult(functionFragment: "appCID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "core", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "effectorWasmsCids", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fluenceToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxWorkersPerProvider", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "minWorkers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "paymentToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pricePerEpoch", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "requiredStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setAppCID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "targetWorkers", data: BytesLike): Result;
    events: {
        "NewAppCID(string)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "NewAppCID"): EventFragment;
}
export interface NewAppCIDEventObject {
    appCID: string;
}
export type NewAppCIDEvent = TypedEvent<[string], NewAppCIDEventObject>;
export type NewAppCIDEventFilter = TypedEventFilter<NewAppCIDEvent>;
export interface DealConfig extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: DealConfigInterface;
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
        core(overrides?: CallOverrides): Promise<[string]>;
        effectorWasmsCids(overrides?: CallOverrides): Promise<[string[]]>;
        fluenceToken(overrides?: CallOverrides): Promise<[string]>;
        maxWorkersPerProvider(overrides?: CallOverrides): Promise<[BigNumber]>;
        minWorkers(overrides?: CallOverrides): Promise<[BigNumber]>;
        paymentToken(overrides?: CallOverrides): Promise<[string]>;
        pricePerEpoch(overrides?: CallOverrides): Promise<[BigNumber]>;
        requiredStake(overrides?: CallOverrides): Promise<[BigNumber]>;
        setAppCID(appCID_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        targetWorkers(overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    appCID(overrides?: CallOverrides): Promise<string>;
    core(overrides?: CallOverrides): Promise<string>;
    effectorWasmsCids(overrides?: CallOverrides): Promise<string[]>;
    fluenceToken(overrides?: CallOverrides): Promise<string>;
    maxWorkersPerProvider(overrides?: CallOverrides): Promise<BigNumber>;
    minWorkers(overrides?: CallOverrides): Promise<BigNumber>;
    paymentToken(overrides?: CallOverrides): Promise<string>;
    pricePerEpoch(overrides?: CallOverrides): Promise<BigNumber>;
    requiredStake(overrides?: CallOverrides): Promise<BigNumber>;
    setAppCID(appCID_: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    targetWorkers(overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        appCID(overrides?: CallOverrides): Promise<string>;
        core(overrides?: CallOverrides): Promise<string>;
        effectorWasmsCids(overrides?: CallOverrides): Promise<string[]>;
        fluenceToken(overrides?: CallOverrides): Promise<string>;
        maxWorkersPerProvider(overrides?: CallOverrides): Promise<BigNumber>;
        minWorkers(overrides?: CallOverrides): Promise<BigNumber>;
        paymentToken(overrides?: CallOverrides): Promise<string>;
        pricePerEpoch(overrides?: CallOverrides): Promise<BigNumber>;
        requiredStake(overrides?: CallOverrides): Promise<BigNumber>;
        setAppCID(appCID_: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        targetWorkers(overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "NewAppCID(string)"(appCID?: null): NewAppCIDEventFilter;
        NewAppCID(appCID?: null): NewAppCIDEventFilter;
    };
    estimateGas: {
        appCID(overrides?: CallOverrides): Promise<BigNumber>;
        core(overrides?: CallOverrides): Promise<BigNumber>;
        effectorWasmsCids(overrides?: CallOverrides): Promise<BigNumber>;
        fluenceToken(overrides?: CallOverrides): Promise<BigNumber>;
        maxWorkersPerProvider(overrides?: CallOverrides): Promise<BigNumber>;
        minWorkers(overrides?: CallOverrides): Promise<BigNumber>;
        paymentToken(overrides?: CallOverrides): Promise<BigNumber>;
        pricePerEpoch(overrides?: CallOverrides): Promise<BigNumber>;
        requiredStake(overrides?: CallOverrides): Promise<BigNumber>;
        setAppCID(appCID_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        targetWorkers(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        appCID(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        core(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        effectorWasmsCids(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        fluenceToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        maxWorkersPerProvider(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        minWorkers(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        paymentToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pricePerEpoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        requiredStake(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setAppCID(appCID_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        targetWorkers(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
