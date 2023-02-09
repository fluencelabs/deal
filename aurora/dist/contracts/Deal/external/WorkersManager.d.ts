import type { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface WorkersManagerInterface extends utils.Interface {
    functions: {
        "createProviderToken(bytes32)": FunctionFragment;
        "getPATOwner(bytes32)": FunctionFragment;
        "removeProviderToken(bytes32)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "createProviderToken" | "getPATOwner" | "removeProviderToken"): FunctionFragment;
    encodeFunctionData(functionFragment: "createProviderToken", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getPATOwner", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "removeProviderToken", values: [PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: "createProviderToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPATOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeProviderToken", data: BytesLike): Result;
    events: {
        "AddProviderToken(address,bytes32)": EventFragment;
        "RemoveProviderToken(bytes32)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AddProviderToken"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "RemoveProviderToken"): EventFragment;
}
export interface AddProviderTokenEventObject {
    owner: string;
    id: string;
}
export type AddProviderTokenEvent = TypedEvent<[
    string,
    string
], AddProviderTokenEventObject>;
export type AddProviderTokenEventFilter = TypedEventFilter<AddProviderTokenEvent>;
export interface RemoveProviderTokenEventObject {
    id: string;
}
export type RemoveProviderTokenEvent = TypedEvent<[
    string
], RemoveProviderTokenEventObject>;
export type RemoveProviderTokenEventFilter = TypedEventFilter<RemoveProviderTokenEvent>;
export interface WorkersManager extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: WorkersManagerInterface;
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
        createProviderToken(salt: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        removeProviderToken(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    createProviderToken(salt: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    removeProviderToken(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        createProviderToken(salt: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        removeProviderToken(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AddProviderToken(address,bytes32)"(owner?: PromiseOrValue<string> | null, id?: null): AddProviderTokenEventFilter;
        AddProviderToken(owner?: PromiseOrValue<string> | null, id?: null): AddProviderTokenEventFilter;
        "RemoveProviderToken(bytes32)"(id?: null): RemoveProviderTokenEventFilter;
        RemoveProviderToken(id?: null): RemoveProviderTokenEventFilter;
    };
    estimateGas: {
        createProviderToken(salt: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        removeProviderToken(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        createProviderToken(salt: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        removeProviderToken(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
