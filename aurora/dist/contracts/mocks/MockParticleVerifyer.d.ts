import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export type ParticleStruct = {
    air: PromiseOrValue<string>;
    prevData: PromiseOrValue<string>;
    params: PromiseOrValue<string>;
    callResults: PromiseOrValue<string>;
};
export type ParticleStructOutput = [string, string, string, string] & {
    air: string;
    prevData: string;
    params: string;
    callResults: string;
};
export interface MockParticleVerifyerInterface extends utils.Interface {
    functions: {
        "particlePATIds(bytes32,uint256)": FunctionFragment;
        "setPATIds((string,string,string,string),bytes32[])": FunctionFragment;
        "verifyParticle((string,string,string,string))": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "particlePATIds" | "setPATIds" | "verifyParticle"): FunctionFragment;
    encodeFunctionData(functionFragment: "particlePATIds", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "setPATIds", values: [ParticleStruct, PromiseOrValue<BytesLike>[]]): string;
    encodeFunctionData(functionFragment: "verifyParticle", values: [ParticleStruct]): string;
    decodeFunctionResult(functionFragment: "particlePATIds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setPATIds", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "verifyParticle", data: BytesLike): Result;
    events: {};
}
export interface MockParticleVerifyer extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MockParticleVerifyerInterface;
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
        particlePATIds(arg0: PromiseOrValue<BytesLike>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        setPATIds(particle: ParticleStruct, patIds: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        verifyParticle(particle: ParticleStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    particlePATIds(arg0: PromiseOrValue<BytesLike>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    setPATIds(particle: ParticleStruct, patIds: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    verifyParticle(particle: ParticleStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        particlePATIds(arg0: PromiseOrValue<BytesLike>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        setPATIds(particle: ParticleStruct, patIds: PromiseOrValue<BytesLike>[], overrides?: CallOverrides): Promise<void>;
        verifyParticle(particle: ParticleStruct, overrides?: CallOverrides): Promise<string[]>;
    };
    filters: {};
    estimateGas: {
        particlePATIds(arg0: PromiseOrValue<BytesLike>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        setPATIds(particle: ParticleStruct, patIds: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        verifyParticle(particle: ParticleStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        particlePATIds(arg0: PromiseOrValue<BytesLike>, arg1: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setPATIds(particle: ParticleStruct, patIds: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        verifyParticle(particle: ParticleStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
