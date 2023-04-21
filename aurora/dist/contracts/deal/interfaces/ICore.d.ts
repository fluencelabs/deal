import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface ICoreInterface extends utils.Interface {
    functions: {
        "getConfig()": FunctionFragment;
        "getController()": FunctionFragment;
        "getPayment()": FunctionFragment;
        "getStatusController()": FunctionFragment;
        "getWorkers()": FunctionFragment;
        "initialize(address,address,address,address,address)": FunctionFragment;
        "moduleByAddress(address)": FunctionFragment;
        "modules(uint8)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getConfig" | "getController" | "getPayment" | "getStatusController" | "getWorkers" | "initialize" | "moduleByAddress" | "modules"): FunctionFragment;
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
    decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPayment", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getStatusController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getWorkers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "moduleByAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "modules", data: BytesLike): Result;
    events: {};
}
export interface ICore extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ICoreInterface;
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
        moduleByAddress(module: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number]>;
        modules(module: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
    };
    getConfig(overrides?: CallOverrides): Promise<string>;
    getController(overrides?: CallOverrides): Promise<string>;
    getPayment(overrides?: CallOverrides): Promise<string>;
    getStatusController(overrides?: CallOverrides): Promise<string>;
    getWorkers(overrides?: CallOverrides): Promise<string>;
    initialize(config_: PromiseOrValue<string>, controller_: PromiseOrValue<string>, payment_: PromiseOrValue<string>, statusController_: PromiseOrValue<string>, workers_: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    moduleByAddress(module: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
    modules(module: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    callStatic: {
        getConfig(overrides?: CallOverrides): Promise<string>;
        getController(overrides?: CallOverrides): Promise<string>;
        getPayment(overrides?: CallOverrides): Promise<string>;
        getStatusController(overrides?: CallOverrides): Promise<string>;
        getWorkers(overrides?: CallOverrides): Promise<string>;
        initialize(config_: PromiseOrValue<string>, controller_: PromiseOrValue<string>, payment_: PromiseOrValue<string>, statusController_: PromiseOrValue<string>, workers_: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        moduleByAddress(module: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
        modules(module: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        getConfig(overrides?: CallOverrides): Promise<BigNumber>;
        getController(overrides?: CallOverrides): Promise<BigNumber>;
        getPayment(overrides?: CallOverrides): Promise<BigNumber>;
        getStatusController(overrides?: CallOverrides): Promise<BigNumber>;
        getWorkers(overrides?: CallOverrides): Promise<BigNumber>;
        initialize(config_: PromiseOrValue<string>, controller_: PromiseOrValue<string>, payment_: PromiseOrValue<string>, statusController_: PromiseOrValue<string>, workers_: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        moduleByAddress(module: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        modules(module: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
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
        moduleByAddress(module: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        modules(module: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
