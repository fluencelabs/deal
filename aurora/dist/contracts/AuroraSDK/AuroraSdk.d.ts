import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export type PromiseCreateArgsStruct = {
    targetAccountId: PromiseOrValue<string>;
    method: PromiseOrValue<string>;
    args: PromiseOrValue<BytesLike>;
    nearBalance: PromiseOrValue<BigNumberish>;
    nearGas: PromiseOrValue<BigNumberish>;
};
export type PromiseCreateArgsStructOutput = [
    string,
    string,
    string,
    BigNumber,
    BigNumber
] & {
    targetAccountId: string;
    method: string;
    args: string;
    nearBalance: BigNumber;
    nearGas: BigNumber;
};
export type PromiseWithCallbackStruct = {
    base: PromiseCreateArgsStruct;
    callback: PromiseCreateArgsStruct;
};
export type PromiseWithCallbackStructOutput = [
    PromiseCreateArgsStructOutput,
    PromiseCreateArgsStructOutput
] & {
    base: PromiseCreateArgsStructOutput;
    callback: PromiseCreateArgsStructOutput;
};
export interface AuroraSdkInterface extends utils.Interface {
    functions: {
        "addressSubAccount(address,string)": FunctionFragment;
        "implicitAuroraAddress(string)": FunctionFragment;
        "then((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64))": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "addressSubAccount" | "implicitAuroraAddress" | "then"): FunctionFragment;
    encodeFunctionData(functionFragment: "addressSubAccount", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "implicitAuroraAddress", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "then", values: [PromiseCreateArgsStruct, PromiseCreateArgsStruct]): string;
    decodeFunctionResult(functionFragment: "addressSubAccount", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "implicitAuroraAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "then", data: BytesLike): Result;
    events: {};
}
export interface AuroraSdk extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: AuroraSdkInterface;
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
        addressSubAccount(account: PromiseOrValue<string>, accountId: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        implicitAuroraAddress(accountId: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        then(base: PromiseCreateArgsStruct, callback: PromiseCreateArgsStruct, overrides?: CallOverrides): Promise<[PromiseWithCallbackStructOutput]>;
    };
    addressSubAccount(account: PromiseOrValue<string>, accountId: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    implicitAuroraAddress(accountId: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    then(base: PromiseCreateArgsStruct, callback: PromiseCreateArgsStruct, overrides?: CallOverrides): Promise<PromiseWithCallbackStructOutput>;
    callStatic: {
        addressSubAccount(account: PromiseOrValue<string>, accountId: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        implicitAuroraAddress(accountId: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        then(base: PromiseCreateArgsStruct, callback: PromiseCreateArgsStruct, overrides?: CallOverrides): Promise<PromiseWithCallbackStructOutput>;
    };
    filters: {};
    estimateGas: {
        addressSubAccount(account: PromiseOrValue<string>, accountId: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        implicitAuroraAddress(accountId: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        then(base: PromiseCreateArgsStruct, callback: PromiseCreateArgsStruct, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        addressSubAccount(account: PromiseOrValue<string>, accountId: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        implicitAuroraAddress(accountId: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        then(base: PromiseCreateArgsStruct, callback: PromiseCreateArgsStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
