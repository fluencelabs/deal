import type { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "../../common";
export interface EpochManagerInterface extends utils.Interface {
    functions: {
        "epochDuration()": FunctionFragment;
        "getEpoch()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "epochDuration" | "getEpoch"): FunctionFragment;
    encodeFunctionData(functionFragment: "epochDuration", values?: undefined): string;
    encodeFunctionData(functionFragment: "getEpoch", values?: undefined): string;
    decodeFunctionResult(functionFragment: "epochDuration", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getEpoch", data: BytesLike): Result;
    events: {};
}
export interface EpochManager extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: EpochManagerInterface;
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
        epochDuration(overrides?: CallOverrides): Promise<[BigNumber]>;
        getEpoch(overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    epochDuration(overrides?: CallOverrides): Promise<BigNumber>;
    getEpoch(overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        epochDuration(overrides?: CallOverrides): Promise<BigNumber>;
        getEpoch(overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        epochDuration(overrides?: CallOverrides): Promise<BigNumber>;
        getEpoch(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        epochDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getEpoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
