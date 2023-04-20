import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
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
export interface IPaymentInterface extends utils.Interface {
    functions: {
        "balance()": FunctionFragment;
        "commitParticle((string,string,string,string))": FunctionFragment;
        "depositToPaymentBalance(uint256)": FunctionFragment;
        "getReward(bytes32,bytes32)": FunctionFragment;
        "withdrawForWorker(bytes32,bytes32[])": FunctionFragment;
        "withdrawFromPaymentBalance(uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "balance" | "commitParticle" | "depositToPaymentBalance" | "getReward" | "withdrawForWorker" | "withdrawFromPaymentBalance"): FunctionFragment;
    encodeFunctionData(functionFragment: "balance", values?: undefined): string;
    encodeFunctionData(functionFragment: "commitParticle", values: [ParticleStruct]): string;
    encodeFunctionData(functionFragment: "depositToPaymentBalance", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getReward", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "withdrawForWorker", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>[]]): string;
    encodeFunctionData(functionFragment: "withdrawFromPaymentBalance", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "balance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "commitParticle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "depositToPaymentBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawForWorker", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawFromPaymentBalance", data: BytesLike): Result;
    events: {};
}
export interface IPayment extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IPaymentInterface;
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
        balance(overrides?: CallOverrides): Promise<[BigNumber]>;
        commitParticle(particle: ParticleStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        depositToPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getReward(particleHash: PromiseOrValue<BytesLike>, patId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        withdrawForWorker(patId: PromiseOrValue<BytesLike>, particlesHashes: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdrawFromPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    balance(overrides?: CallOverrides): Promise<BigNumber>;
    commitParticle(particle: ParticleStruct, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    depositToPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getReward(particleHash: PromiseOrValue<BytesLike>, patId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    withdrawForWorker(patId: PromiseOrValue<BytesLike>, particlesHashes: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawFromPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        balance(overrides?: CallOverrides): Promise<BigNumber>;
        commitParticle(particle: ParticleStruct, overrides?: CallOverrides): Promise<void>;
        depositToPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        getReward(particleHash: PromiseOrValue<BytesLike>, patId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        withdrawForWorker(patId: PromiseOrValue<BytesLike>, particlesHashes: PromiseOrValue<BytesLike>[], overrides?: CallOverrides): Promise<void>;
        withdrawFromPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        balance(overrides?: CallOverrides): Promise<BigNumber>;
        commitParticle(particle: ParticleStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        depositToPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getReward(particleHash: PromiseOrValue<BytesLike>, patId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        withdrawForWorker(patId: PromiseOrValue<BytesLike>, particlesHashes: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdrawFromPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        balance(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        commitParticle(particle: ParticleStruct, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        depositToPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getReward(particleHash: PromiseOrValue<BytesLike>, patId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        withdrawForWorker(patId: PromiseOrValue<BytesLike>, particlesHashes: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawFromPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
