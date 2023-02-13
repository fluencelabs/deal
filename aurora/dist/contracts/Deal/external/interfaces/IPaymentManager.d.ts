import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../../common";
export interface IPaymentManagerInterface extends utils.Interface {
    functions: {
        "depositToPaymentBalance(uint256)": FunctionFragment;
        "getPaymentBalance()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "depositToPaymentBalance" | "getPaymentBalance"): FunctionFragment;
    encodeFunctionData(functionFragment: "depositToPaymentBalance", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getPaymentBalance", values?: undefined): string;
    decodeFunctionResult(functionFragment: "depositToPaymentBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPaymentBalance", data: BytesLike): Result;
    events: {};
}
export interface IPaymentManager extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IPaymentManagerInterface;
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
        depositToPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getPaymentBalance(overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    depositToPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getPaymentBalance(overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        depositToPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        getPaymentBalance(overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {};
    estimateGas: {
        depositToPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getPaymentBalance(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        depositToPaymentBalance(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getPaymentBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
