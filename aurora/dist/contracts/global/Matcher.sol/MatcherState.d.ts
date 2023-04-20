import type { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface MatcherStateInterface extends utils.Interface {
    functions: {
        "collateral(address)": FunctionFragment;
        "globalConfig()": FunctionFragment;
        "resourceOwners(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "collateral" | "globalConfig" | "resourceOwners"): FunctionFragment;
    encodeFunctionData(functionFragment: "collateral", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "globalConfig", values?: undefined): string;
    encodeFunctionData(functionFragment: "resourceOwners", values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: "collateral", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "globalConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "resourceOwners", data: BytesLike): Result;
    events: {};
}
export interface MatcherState extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MatcherStateInterface;
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
        collateral(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[BigNumber]>;
        globalConfig(overrides?: CallOverrides): Promise<[string]>;
        resourceOwners(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            minPriceByEpoch: BigNumber;
            maxCollateral: BigNumber;
            workersCount: BigNumber;
        }>;
    };
    collateral(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    globalConfig(overrides?: CallOverrides): Promise<string>;
    resourceOwners(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        minPriceByEpoch: BigNumber;
        maxCollateral: BigNumber;
        workersCount: BigNumber;
    }>;
    callStatic: {
        collateral(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        globalConfig(overrides?: CallOverrides): Promise<string>;
        resourceOwners(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            minPriceByEpoch: BigNumber;
            maxCollateral: BigNumber;
            workersCount: BigNumber;
        }>;
    };
    filters: {};
    estimateGas: {
        collateral(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        globalConfig(overrides?: CallOverrides): Promise<BigNumber>;
        resourceOwners(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        collateral(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        globalConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        resourceOwners(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
