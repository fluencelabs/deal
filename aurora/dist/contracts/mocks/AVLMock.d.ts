import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export declare namespace AVLTree {
    type NodeStruct = {
        balance: PromiseOrValue<BigNumberish>;
        parent: PromiseOrValue<BigNumberish>;
        value: PromiseOrValue<BigNumberish>;
        left: PromiseOrValue<BigNumberish>;
        right: PromiseOrValue<BigNumberish>;
    };
    type NodeStructOutput = [
        number,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        balance: number;
        parent: BigNumber;
        value: BigNumber;
        left: BigNumber;
        right: BigNumber;
    };
}
export interface AVLMockInterface extends utils.Interface {
    functions: {
        "getNode(uint64)": FunctionFragment;
        "getRoot()": FunctionFragment;
        "insert(uint64)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "getNode" | "getRoot" | "insert"): FunctionFragment;
    encodeFunctionData(functionFragment: "getNode", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getRoot", values?: undefined): string;
    encodeFunctionData(functionFragment: "insert", values: [PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "getNode", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRoot", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "insert", data: BytesLike): Result;
    events: {};
}
export interface AVLMock extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: AVLMockInterface;
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
        getNode(value: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[AVLTree.NodeStructOutput]>;
        getRoot(overrides?: CallOverrides): Promise<[BigNumber]>;
        insert(value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    getNode(value: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<AVLTree.NodeStructOutput>;
    getRoot(overrides?: CallOverrides): Promise<BigNumber>;
    insert(value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        getNode(value: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<AVLTree.NodeStructOutput>;
        getRoot(overrides?: CallOverrides): Promise<BigNumber>;
        insert(value: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        getNode(value: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getRoot(overrides?: CallOverrides): Promise<BigNumber>;
        insert(value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        getNode(value: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRoot(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        insert(value: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
