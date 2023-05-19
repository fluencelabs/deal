import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface DealFactoryStateInterface extends utils.Interface {
    functions: {
        "MAX_WORKERS_PER_PROVIDER()": FunctionFragment;
        "PRICE_PER_EPOCH()": FunctionFragment;
        "REQUIRED_STAKE()": FunctionFragment;
        "configImpl()": FunctionFragment;
        "controllerImpl()": FunctionFragment;
        "coreImpl()": FunctionFragment;
        "createDeal(uint256,uint256,string,string[])": FunctionFragment;
        "defaultPaymentToken()": FunctionFragment;
        "globalConfig()": FunctionFragment;
        "isDeal(address)": FunctionFragment;
        "paymentImpl()": FunctionFragment;
        "statusControllerImpl()": FunctionFragment;
        "workersImpl()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "MAX_WORKERS_PER_PROVIDER" | "PRICE_PER_EPOCH" | "REQUIRED_STAKE" | "configImpl" | "controllerImpl" | "coreImpl" | "createDeal" | "defaultPaymentToken" | "globalConfig" | "isDeal" | "paymentImpl" | "statusControllerImpl" | "workersImpl"): FunctionFragment;
    encodeFunctionData(functionFragment: "MAX_WORKERS_PER_PROVIDER", values?: undefined): string;
    encodeFunctionData(functionFragment: "PRICE_PER_EPOCH", values?: undefined): string;
    encodeFunctionData(functionFragment: "REQUIRED_STAKE", values?: undefined): string;
    encodeFunctionData(functionFragment: "configImpl", values?: undefined): string;
    encodeFunctionData(functionFragment: "controllerImpl", values?: undefined): string;
    encodeFunctionData(functionFragment: "coreImpl", values?: undefined): string;
    encodeFunctionData(functionFragment: "createDeal", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<string>[]
    ]): string;
    encodeFunctionData(functionFragment: "defaultPaymentToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "globalConfig", values?: undefined): string;
    encodeFunctionData(functionFragment: "isDeal", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "paymentImpl", values?: undefined): string;
    encodeFunctionData(functionFragment: "statusControllerImpl", values?: undefined): string;
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
    decodeFunctionResult(functionFragment: "statusControllerImpl", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "workersImpl", data: BytesLike): Result;
    events: {};
}
export interface DealFactoryState extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: DealFactoryStateInterface;
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
        createDeal(minWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, effectors: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        defaultPaymentToken(overrides?: CallOverrides): Promise<[string]>;
        globalConfig(overrides?: CallOverrides): Promise<[string]>;
        isDeal(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        paymentImpl(overrides?: CallOverrides): Promise<[string]>;
        statusControllerImpl(overrides?: CallOverrides): Promise<[string]>;
        workersImpl(overrides?: CallOverrides): Promise<[string]>;
    };
    MAX_WORKERS_PER_PROVIDER(overrides?: CallOverrides): Promise<BigNumber>;
    PRICE_PER_EPOCH(overrides?: CallOverrides): Promise<BigNumber>;
    REQUIRED_STAKE(overrides?: CallOverrides): Promise<BigNumber>;
    configImpl(overrides?: CallOverrides): Promise<string>;
    controllerImpl(overrides?: CallOverrides): Promise<string>;
    coreImpl(overrides?: CallOverrides): Promise<string>;
    createDeal(minWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, effectors: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    defaultPaymentToken(overrides?: CallOverrides): Promise<string>;
    globalConfig(overrides?: CallOverrides): Promise<string>;
    isDeal(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    paymentImpl(overrides?: CallOverrides): Promise<string>;
    statusControllerImpl(overrides?: CallOverrides): Promise<string>;
    workersImpl(overrides?: CallOverrides): Promise<string>;
    callStatic: {
        MAX_WORKERS_PER_PROVIDER(overrides?: CallOverrides): Promise<BigNumber>;
        PRICE_PER_EPOCH(overrides?: CallOverrides): Promise<BigNumber>;
        REQUIRED_STAKE(overrides?: CallOverrides): Promise<BigNumber>;
        configImpl(overrides?: CallOverrides): Promise<string>;
        controllerImpl(overrides?: CallOverrides): Promise<string>;
        coreImpl(overrides?: CallOverrides): Promise<string>;
        createDeal(minWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, effectors: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<string>;
        defaultPaymentToken(overrides?: CallOverrides): Promise<string>;
        globalConfig(overrides?: CallOverrides): Promise<string>;
        isDeal(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        paymentImpl(overrides?: CallOverrides): Promise<string>;
        statusControllerImpl(overrides?: CallOverrides): Promise<string>;
        workersImpl(overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        MAX_WORKERS_PER_PROVIDER(overrides?: CallOverrides): Promise<BigNumber>;
        PRICE_PER_EPOCH(overrides?: CallOverrides): Promise<BigNumber>;
        REQUIRED_STAKE(overrides?: CallOverrides): Promise<BigNumber>;
        configImpl(overrides?: CallOverrides): Promise<BigNumber>;
        controllerImpl(overrides?: CallOverrides): Promise<BigNumber>;
        coreImpl(overrides?: CallOverrides): Promise<BigNumber>;
        createDeal(minWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, effectors: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        defaultPaymentToken(overrides?: CallOverrides): Promise<BigNumber>;
        globalConfig(overrides?: CallOverrides): Promise<BigNumber>;
        isDeal(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        paymentImpl(overrides?: CallOverrides): Promise<BigNumber>;
        statusControllerImpl(overrides?: CallOverrides): Promise<BigNumber>;
        workersImpl(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        MAX_WORKERS_PER_PROVIDER(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        PRICE_PER_EPOCH(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        REQUIRED_STAKE(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        configImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        controllerImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        coreImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        createDeal(minWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<string>, effectors: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        defaultPaymentToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        globalConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isDeal(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        paymentImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        statusControllerImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        workersImpl(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
