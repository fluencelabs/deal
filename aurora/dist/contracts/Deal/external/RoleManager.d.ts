import type { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface RoleManagerInterface extends utils.Interface {
    functions: {
        "getRole(address)": FunctionFragment;
        "register()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getRole" | "register"): FunctionFragment;
    encodeFunctionData(functionFragment: "getRole", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "register", values?: undefined): string;
    decodeFunctionResult(functionFragment: "getRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
    events: {};
}
export interface RoleManager extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: RoleManagerInterface;
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
        getRole(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number]>;
        register(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    getRole(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
    register(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        getRole(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
        register(overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        getRole(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        register(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        getRole(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        register(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
