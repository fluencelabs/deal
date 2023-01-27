import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export type PromiseResultStruct = {
    status: PromiseOrValue<BigNumberish>;
    output: PromiseOrValue<BytesLike>;
};
export type PromiseResultStructOutput = [number, string] & {
    status: number;
    output: string;
};
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
export declare namespace Borsh {
    type DataStruct = {
        ptr: PromiseOrValue<BigNumberish>;
        end: PromiseOrValue<BigNumberish>;
    };
    type DataStructOutput = [BigNumber, BigNumber] & {
        ptr: BigNumber;
        end: BigNumber;
    };
}
export interface CodecInterface extends utils.Interface {
    functions: {
        "decodePromiseResult((uint256,uint256))": FunctionFragment;
        "encode(bytes)": FunctionFragment;
        "encode((string,string,bytes,uint128,uint64))": FunctionFragment;
        "encode(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)))": FunctionFragment;
        "encodeCrossContractCallArgs(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)),uint8)": FunctionFragment;
        "encodeCrossContractCallArgs((string,string,bytes,uint128,uint64),uint8)": FunctionFragment;
        "encodeEM(uint8)": FunctionFragment;
        "encodePromise(uint8)": FunctionFragment;
        "encodeU128(uint128)": FunctionFragment;
        "encodeU32(uint32)": FunctionFragment;
        "encodeU64(uint64)": FunctionFragment;
        "skipPromiseResult((uint256,uint256))": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "decodePromiseResult" | "encode(bytes)" | "encode((string,string,bytes,uint128,uint64))" | "encode(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)))" | "encodeCrossContractCallArgs(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)),uint8)" | "encodeCrossContractCallArgs((string,string,bytes,uint128,uint64),uint8)" | "encodeEM" | "encodePromise" | "encodeU128" | "encodeU32" | "encodeU64" | "skipPromiseResult"): FunctionFragment;
    encodeFunctionData(functionFragment: "decodePromiseResult", values: [Borsh.DataStruct]): string;
    encodeFunctionData(functionFragment: "encode(bytes)", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "encode((string,string,bytes,uint128,uint64))", values: [PromiseCreateArgsStruct]): string;
    encodeFunctionData(functionFragment: "encode(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)))", values: [PromiseWithCallbackStruct]): string;
    encodeFunctionData(functionFragment: "encodeCrossContractCallArgs(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)),uint8)", values: [PromiseWithCallbackStruct, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "encodeCrossContractCallArgs((string,string,bytes,uint128,uint64),uint8)", values: [PromiseCreateArgsStruct, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "encodeEM", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "encodePromise", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "encodeU128", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "encodeU32", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "encodeU64", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "skipPromiseResult", values: [Borsh.DataStruct]): string;
    decodeFunctionResult(functionFragment: "decodePromiseResult", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "encode(bytes)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "encode((string,string,bytes,uint128,uint64))", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "encode(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)))", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "encodeCrossContractCallArgs(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)),uint8)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "encodeCrossContractCallArgs((string,string,bytes,uint128,uint64),uint8)", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "encodeEM", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "encodePromise", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "encodeU128", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "encodeU32", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "encodeU64", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "skipPromiseResult", data: BytesLike): Result;
    events: {};
}
export interface Codec extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: CodecInterface;
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
        decodePromiseResult(data: Borsh.DataStruct, overrides?: CallOverrides): Promise<[
            PromiseResultStructOutput
        ] & {
            result: PromiseResultStructOutput;
        }>;
        "encode(bytes)"(value: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        "encode((string,string,bytes,uint128,uint64))"(nearPromise: PromiseCreateArgsStruct, overrides?: CallOverrides): Promise<[string]>;
        "encode(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)))"(nearPromise: PromiseWithCallbackStruct, overrides?: CallOverrides): Promise<[string]>;
        "encodeCrossContractCallArgs(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)),uint8)"(nearPromise: PromiseWithCallbackStruct, mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        "encodeCrossContractCallArgs((string,string,bytes,uint128,uint64),uint8)"(nearPromise: PromiseCreateArgsStruct, mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        encodeEM(mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        encodePromise(mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        encodeU128(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        encodeU32(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        encodeU64(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        skipPromiseResult(data: Borsh.DataStruct, overrides?: CallOverrides): Promise<[void]>;
    };
    decodePromiseResult(data: Borsh.DataStruct, overrides?: CallOverrides): Promise<PromiseResultStructOutput>;
    "encode(bytes)"(value: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    "encode((string,string,bytes,uint128,uint64))"(nearPromise: PromiseCreateArgsStruct, overrides?: CallOverrides): Promise<string>;
    "encode(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)))"(nearPromise: PromiseWithCallbackStruct, overrides?: CallOverrides): Promise<string>;
    "encodeCrossContractCallArgs(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)),uint8)"(nearPromise: PromiseWithCallbackStruct, mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    "encodeCrossContractCallArgs((string,string,bytes,uint128,uint64),uint8)"(nearPromise: PromiseCreateArgsStruct, mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    encodeEM(mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    encodePromise(mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    encodeU128(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    encodeU32(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    encodeU64(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    skipPromiseResult(data: Borsh.DataStruct, overrides?: CallOverrides): Promise<void>;
    callStatic: {
        decodePromiseResult(data: Borsh.DataStruct, overrides?: CallOverrides): Promise<PromiseResultStructOutput>;
        "encode(bytes)"(value: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        "encode((string,string,bytes,uint128,uint64))"(nearPromise: PromiseCreateArgsStruct, overrides?: CallOverrides): Promise<string>;
        "encode(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)))"(nearPromise: PromiseWithCallbackStruct, overrides?: CallOverrides): Promise<string>;
        "encodeCrossContractCallArgs(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)),uint8)"(nearPromise: PromiseWithCallbackStruct, mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        "encodeCrossContractCallArgs((string,string,bytes,uint128,uint64),uint8)"(nearPromise: PromiseCreateArgsStruct, mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        encodeEM(mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        encodePromise(mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        encodeU128(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        encodeU32(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        encodeU64(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        skipPromiseResult(data: Borsh.DataStruct, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        decodePromiseResult(data: Borsh.DataStruct, overrides?: CallOverrides): Promise<BigNumber>;
        "encode(bytes)"(value: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        "encode((string,string,bytes,uint128,uint64))"(nearPromise: PromiseCreateArgsStruct, overrides?: CallOverrides): Promise<BigNumber>;
        "encode(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)))"(nearPromise: PromiseWithCallbackStruct, overrides?: CallOverrides): Promise<BigNumber>;
        "encodeCrossContractCallArgs(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)),uint8)"(nearPromise: PromiseWithCallbackStruct, mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        "encodeCrossContractCallArgs((string,string,bytes,uint128,uint64),uint8)"(nearPromise: PromiseCreateArgsStruct, mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        encodeEM(mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        encodePromise(mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        encodeU128(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        encodeU32(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        encodeU64(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        skipPromiseResult(data: Borsh.DataStruct, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        decodePromiseResult(data: Borsh.DataStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "encode(bytes)"(value: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "encode((string,string,bytes,uint128,uint64))"(nearPromise: PromiseCreateArgsStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "encode(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)))"(nearPromise: PromiseWithCallbackStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "encodeCrossContractCallArgs(((string,string,bytes,uint128,uint64),(string,string,bytes,uint128,uint64)),uint8)"(nearPromise: PromiseWithCallbackStruct, mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        "encodeCrossContractCallArgs((string,string,bytes,uint128,uint64),uint8)"(nearPromise: PromiseCreateArgsStruct, mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        encodeEM(mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        encodePromise(mode: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        encodeU128(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        encodeU32(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        encodeU64(v: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        skipPromiseResult(data: Borsh.DataStruct, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
