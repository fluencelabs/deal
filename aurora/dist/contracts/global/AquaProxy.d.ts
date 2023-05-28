import type { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export declare namespace AquaProxy {
    type ParticleStruct = {
        air: PromiseOrValue<string>;
        prevData: PromiseOrValue<string>;
        params: PromiseOrValue<string>;
        callResults: PromiseOrValue<string>;
    };
    type ParticleStructOutput = [string, string, string, string] & {
        air: string;
        prevData: string;
        params: string;
        callResults: string;
    };
}
export interface AquaProxyInterface extends utils.Interface {
    functions: {
        "aquaVMAddress()": FunctionFragment;
        "aquaVMImplicitAddress()": FunctionFragment;
        "near()": FunctionFragment;
        "selfReprsentativeImplicitAddress()": FunctionFragment;
        "verifyParticle((string,string,string,string))": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "aquaVMAddress" | "aquaVMImplicitAddress" | "near" | "selfReprsentativeImplicitAddress" | "verifyParticle"): FunctionFragment;
    encodeFunctionData(functionFragment: "aquaVMAddress", values?: undefined): string;
    encodeFunctionData(functionFragment: "aquaVMImplicitAddress", values?: undefined): string;
    encodeFunctionData(functionFragment: "near", values?: undefined): string;
    encodeFunctionData(functionFragment: "selfReprsentativeImplicitAddress", values?: undefined): string;
    encodeFunctionData(functionFragment: "verifyParticle", values: [AquaProxy.ParticleStruct]): string;
    decodeFunctionResult(functionFragment: "aquaVMAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "aquaVMImplicitAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "near", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "selfReprsentativeImplicitAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyParticle", data: BytesLike): Result;
    events: {};
}
export interface AquaProxy extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: AquaProxyInterface;
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
        aquaVMAddress(overrides?: CallOverrides): Promise<[string]>;
        aquaVMImplicitAddress(overrides?: CallOverrides): Promise<[string]>;
        near(overrides?: CallOverrides): Promise<[boolean, string] & {
            initialized: boolean;
            wNEAR: string;
        }>;
        selfReprsentativeImplicitAddress(overrides?: CallOverrides): Promise<[string]>;
        verifyParticle(particle: AquaProxy.ParticleStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    aquaVMAddress(overrides?: CallOverrides): Promise<string>;
    aquaVMImplicitAddress(overrides?: CallOverrides): Promise<string>;
    near(overrides?: CallOverrides): Promise<[boolean, string] & {
        initialized: boolean;
        wNEAR: string;
    }>;
    selfReprsentativeImplicitAddress(overrides?: CallOverrides): Promise<string>;
    verifyParticle(particle: AquaProxy.ParticleStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        aquaVMAddress(overrides?: CallOverrides): Promise<string>;
        aquaVMImplicitAddress(overrides?: CallOverrides): Promise<string>;
        near(overrides?: CallOverrides): Promise<[boolean, string] & {
            initialized: boolean;
            wNEAR: string;
        }>;
        selfReprsentativeImplicitAddress(overrides?: CallOverrides): Promise<string>;
        verifyParticle(particle: AquaProxy.ParticleStruct, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        aquaVMAddress(overrides?: CallOverrides): Promise<BigNumber>;
        aquaVMImplicitAddress(overrides?: CallOverrides): Promise<BigNumber>;
        near(overrides?: CallOverrides): Promise<BigNumber>;
        selfReprsentativeImplicitAddress(overrides?: CallOverrides): Promise<BigNumber>;
        verifyParticle(particle: AquaProxy.ParticleStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        aquaVMAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        aquaVMImplicitAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        near(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        selfReprsentativeImplicitAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        verifyParticle(particle: AquaProxy.ParticleStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
