import type { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "../../../common";
export interface IGlobalConfigInterface extends utils.Interface {
    functions: {
        "epochManager()": FunctionFragment;
        "factory()": FunctionFragment;
        "fluenceToken()": FunctionFragment;
        "matcher()": FunctionFragment;
        "owner()": FunctionFragment;
        "withdrawTimeout()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "epochManager" | "factory" | "fluenceToken" | "matcher" | "owner" | "withdrawTimeout"): FunctionFragment;
    encodeFunctionData(functionFragment: "epochManager", values?: undefined): string;
    encodeFunctionData(functionFragment: "factory", values?: undefined): string;
    encodeFunctionData(functionFragment: "fluenceToken", values?: undefined): string;
    encodeFunctionData(functionFragment: "matcher", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "withdrawTimeout", values?: undefined): string;
    decodeFunctionResult(functionFragment: "epochManager", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "fluenceToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "matcher", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawTimeout", data: BytesLike): Result;
    events: {};
}
export interface IGlobalConfig extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IGlobalConfigInterface;
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
        epochManager(overrides?: CallOverrides): Promise<[string]>;
        factory(overrides?: CallOverrides): Promise<[string]>;
        fluenceToken(overrides?: CallOverrides): Promise<[string]>;
        matcher(overrides?: CallOverrides): Promise<[string]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        withdrawTimeout(overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    epochManager(overrides?: CallOverrides): Promise<string>;
    factory(overrides?: CallOverrides): Promise<string>;
    fluenceToken(overrides?: CallOverrides): Promise<string>;
    matcher(overrides?: CallOverrides): Promise<string>;
    owner(overrides?: CallOverrides): Promise<string>;
    withdrawTimeout(overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        epochManager(overrides?: CallOverrides): Promise<string>;
        factory(overrides?: CallOverrides): Promise<string>;
        fluenceToken(overrides?: CallOverrides): Promise<string>;
        matcher(overrides?: CallOverrides): Promise<string>;
        owner(overrides?: CallOverrides): Promise<string>;
        withdrawTimeout(overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        epochManager(overrides?: CallOverrides): Promise<BigNumber>;
        factory(overrides?: CallOverrides): Promise<BigNumber>;
        fluenceToken(overrides?: CallOverrides): Promise<BigNumber>;
        matcher(overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        withdrawTimeout(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        epochManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        fluenceToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        matcher(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        withdrawTimeout(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
