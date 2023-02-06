import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export interface DealFactoryInterface extends utils.Interface {
    functions: {
        "core()": FunctionFragment;
        "createDeal(address,uint256,uint256,uint256,uint256,uint256,bytes32,bytes32[])": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "core" | "createDeal"): FunctionFragment;
    encodeFunctionData(functionFragment: "core", values?: undefined): string;
    encodeFunctionData(functionFragment: "createDeal", values: [
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>[]
    ]): string;
    decodeFunctionResult(functionFragment: "core", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createDeal", data: BytesLike): Result;
    events: {
        "DealCreated(address,address,uint256,uint256,uint256,uint256,uint256,bytes32,bytes32[])": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "DealCreated"): EventFragment;
}
export interface DealCreatedEventObject {
    deal: string;
    paymentToken: string;
    pricePerEpoch: BigNumber;
    requiredStake: BigNumber;
    minWorkers: BigNumber;
    maxWorkers: BigNumber;
    targetWorkers: BigNumber;
    appCID: string;
    effectorWasmsCids: string[];
}
export type DealCreatedEvent = TypedEvent<[
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    string[]
], DealCreatedEventObject>;
export type DealCreatedEventFilter = TypedEventFilter<DealCreatedEvent>;
export interface DealFactory extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: DealFactoryInterface;
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
        core(overrides?: CallOverrides): Promise<[string]>;
        createDeal(paymentToken_: PromiseOrValue<string>, pricePerEpoch_: PromiseOrValue<BigNumberish>, requiredStake_: PromiseOrValue<BigNumberish>, minWorkers_: PromiseOrValue<BigNumberish>, maxWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<BytesLike>, effectorWasmsCids_: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    core(overrides?: CallOverrides): Promise<string>;
    createDeal(paymentToken_: PromiseOrValue<string>, pricePerEpoch_: PromiseOrValue<BigNumberish>, requiredStake_: PromiseOrValue<BigNumberish>, minWorkers_: PromiseOrValue<BigNumberish>, maxWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<BytesLike>, effectorWasmsCids_: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        core(overrides?: CallOverrides): Promise<string>;
        createDeal(paymentToken_: PromiseOrValue<string>, pricePerEpoch_: PromiseOrValue<BigNumberish>, requiredStake_: PromiseOrValue<BigNumberish>, minWorkers_: PromiseOrValue<BigNumberish>, maxWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<BytesLike>, effectorWasmsCids_: PromiseOrValue<BytesLike>[], overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "DealCreated(address,address,uint256,uint256,uint256,uint256,uint256,bytes32,bytes32[])"(deal?: null, paymentToken?: null, pricePerEpoch?: null, requiredStake?: null, minWorkers?: null, maxWorkers?: null, targetWorkers?: null, appCID?: null, effectorWasmsCids?: null): DealCreatedEventFilter;
        DealCreated(deal?: null, paymentToken?: null, pricePerEpoch?: null, requiredStake?: null, minWorkers?: null, maxWorkers?: null, targetWorkers?: null, appCID?: null, effectorWasmsCids?: null): DealCreatedEventFilter;
    };
    estimateGas: {
        core(overrides?: CallOverrides): Promise<BigNumber>;
        createDeal(paymentToken_: PromiseOrValue<string>, pricePerEpoch_: PromiseOrValue<BigNumberish>, requiredStake_: PromiseOrValue<BigNumberish>, minWorkers_: PromiseOrValue<BigNumberish>, maxWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<BytesLike>, effectorWasmsCids_: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        core(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        createDeal(paymentToken_: PromiseOrValue<string>, pricePerEpoch_: PromiseOrValue<BigNumberish>, requiredStake_: PromiseOrValue<BigNumberish>, minWorkers_: PromiseOrValue<BigNumberish>, maxWorkers_: PromiseOrValue<BigNumberish>, targetWorkers_: PromiseOrValue<BigNumberish>, appCID_: PromiseOrValue<BytesLike>, effectorWasmsCids_: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
