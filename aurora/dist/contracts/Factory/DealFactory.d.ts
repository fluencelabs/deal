import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export interface DealFactoryInterface extends utils.Interface {
    functions: {
        "core()": FunctionFragment;
        "createDeal(bytes32,address,uint256,uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "core" | "createDeal"): FunctionFragment;
    encodeFunctionData(functionFragment: "core", values?: undefined): string;
    encodeFunctionData(functionFragment: "createDeal", values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    decodeFunctionResult(functionFragment: "core", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createDeal", data: BytesLike): Result;
    events: {
        "CreateDeal(address,bytes32,address,uint256,uint256)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "CreateDeal"): EventFragment;
}
export interface CreateDealEventObject {
    deal: string;
    subnetId: string;
    paymentToken: string;
    pricePerEpoch: BigNumber;
    requiredStake: BigNumber;
}
export type CreateDealEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber,
    BigNumber
], CreateDealEventObject>;
export type CreateDealEventFilter = TypedEventFilter<CreateDealEvent>;
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
        createDeal(subnetId: PromiseOrValue<BytesLike>, paymentToken: PromiseOrValue<string>, pricePerEpoch: PromiseOrValue<BigNumberish>, requiredStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    core(overrides?: CallOverrides): Promise<string>;
    createDeal(subnetId: PromiseOrValue<BytesLike>, paymentToken: PromiseOrValue<string>, pricePerEpoch: PromiseOrValue<BigNumberish>, requiredStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        core(overrides?: CallOverrides): Promise<string>;
        createDeal(subnetId: PromiseOrValue<BytesLike>, paymentToken: PromiseOrValue<string>, pricePerEpoch: PromiseOrValue<BigNumberish>, requiredStake: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "CreateDeal(address,bytes32,address,uint256,uint256)"(deal?: null, subnetId?: null, paymentToken?: null, pricePerEpoch?: null, requiredStake?: null): CreateDealEventFilter;
        CreateDeal(deal?: null, subnetId?: null, paymentToken?: null, pricePerEpoch?: null, requiredStake?: null): CreateDealEventFilter;
    };
    estimateGas: {
        core(overrides?: CallOverrides): Promise<BigNumber>;
        createDeal(subnetId: PromiseOrValue<BytesLike>, paymentToken: PromiseOrValue<string>, pricePerEpoch: PromiseOrValue<BigNumberish>, requiredStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        core(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        createDeal(subnetId: PromiseOrValue<BytesLike>, paymentToken: PromiseOrValue<string>, pricePerEpoch: PromiseOrValue<BigNumberish>, requiredStake: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
