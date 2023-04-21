import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export declare namespace MatcherState {
    type ResourceOwnerStruct = {
        minPriceByEpoch: PromiseOrValue<BigNumberish>;
        maxCollateral: PromiseOrValue<BigNumberish>;
        workersCount: PromiseOrValue<BigNumberish>;
    };
    type ResourceOwnerStructOutput = [BigNumber, BigNumber, BigNumber] & {
        minPriceByEpoch: BigNumber;
        maxCollateral: BigNumber;
        workersCount: BigNumber;
    };
}
export interface MatcherInterface extends utils.Interface {
    functions: {
        "collateral(address)": FunctionFragment;
        "globalConfig()": FunctionFragment;
        "matchWithDeal(address,address[],uint256[])": FunctionFragment;
        "proxiableUUID()": FunctionFragment;
        "register(uint256,uint256,uint256)": FunctionFragment;
        "remove()": FunctionFragment;
        "resourceOwners(address)": FunctionFragment;
        "upgradeTo(address)": FunctionFragment;
        "upgradeToAndCall(address,bytes)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "collateral" | "globalConfig" | "matchWithDeal" | "proxiableUUID" | "register" | "remove" | "resourceOwners" | "upgradeTo" | "upgradeToAndCall"): FunctionFragment;
    encodeFunctionData(functionFragment: "collateral", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "globalConfig", values?: undefined): string;
    encodeFunctionData(functionFragment: "matchWithDeal", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>[],
        PromiseOrValue<BigNumberish>[]
    ]): string;
    encodeFunctionData(functionFragment: "proxiableUUID", values?: undefined): string;
    encodeFunctionData(functionFragment: "register", values: [
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: "remove", values?: undefined): string;
    encodeFunctionData(functionFragment: "resourceOwners", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "upgradeTo", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "upgradeToAndCall", values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: "collateral", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "globalConfig", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "matchWithDeal", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proxiableUUID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "remove", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "resourceOwners", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeToAndCall", data: BytesLike): Result;
    events: {
        "AdminChanged(address,address)": EventFragment;
        "BeaconUpgraded(address)": EventFragment;
        "Initialized(uint8)": EventFragment;
        "MatchedWithDeal(address,address[],uint256[])": EventFragment;
        "ResourceOwnerRegistred(address,tuple)": EventFragment;
        "ResourceOwnerRemoved(address)": EventFragment;
        "Upgraded(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "MatchedWithDeal"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ResourceOwnerRegistred"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "ResourceOwnerRemoved"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}
export interface AdminChangedEventObject {
    previousAdmin: string;
    newAdmin: string;
}
export type AdminChangedEvent = TypedEvent<[
    string,
    string
], AdminChangedEventObject>;
export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;
export interface BeaconUpgradedEventObject {
    beacon: string;
}
export type BeaconUpgradedEvent = TypedEvent<[
    string
], BeaconUpgradedEventObject>;
export type BeaconUpgradedEventFilter = TypedEventFilter<BeaconUpgradedEvent>;
export interface InitializedEventObject {
    version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;
export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;
export interface MatchedWithDealEventObject {
    deal: string;
    resources: string[];
    workersCount: BigNumber[];
}
export type MatchedWithDealEvent = TypedEvent<[
    string,
    string[],
    BigNumber[]
], MatchedWithDealEventObject>;
export type MatchedWithDealEventFilter = TypedEventFilter<MatchedWithDealEvent>;
export interface ResourceOwnerRegistredEventObject {
    owner: string;
    info: MatcherState.ResourceOwnerStructOutput;
}
export type ResourceOwnerRegistredEvent = TypedEvent<[
    string,
    MatcherState.ResourceOwnerStructOutput
], ResourceOwnerRegistredEventObject>;
export type ResourceOwnerRegistredEventFilter = TypedEventFilter<ResourceOwnerRegistredEvent>;
export interface ResourceOwnerRemovedEventObject {
    owner: string;
}
export type ResourceOwnerRemovedEvent = TypedEvent<[
    string
], ResourceOwnerRemovedEventObject>;
export type ResourceOwnerRemovedEventFilter = TypedEventFilter<ResourceOwnerRemovedEvent>;
export interface UpgradedEventObject {
    implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;
export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;
export interface Matcher extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: MatcherInterface;
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
        matchWithDeal(deal: PromiseOrValue<string>, resources: PromiseOrValue<string>[], workersCount_: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        proxiableUUID(overrides?: CallOverrides): Promise<[string]>;
        register(minPriceByEpoch: PromiseOrValue<BigNumberish>, maxCollateral: PromiseOrValue<BigNumberish>, workersCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        remove(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        resourceOwners(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            minPriceByEpoch: BigNumber;
            maxCollateral: BigNumber;
            workersCount: BigNumber;
        }>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    collateral(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
    globalConfig(overrides?: CallOverrides): Promise<string>;
    matchWithDeal(deal: PromiseOrValue<string>, resources: PromiseOrValue<string>[], workersCount_: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    proxiableUUID(overrides?: CallOverrides): Promise<string>;
    register(minPriceByEpoch: PromiseOrValue<BigNumberish>, maxCollateral: PromiseOrValue<BigNumberish>, workersCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    remove(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    resourceOwners(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[
        BigNumber,
        BigNumber,
        BigNumber
    ] & {
        minPriceByEpoch: BigNumber;
        maxCollateral: BigNumber;
        workersCount: BigNumber;
    }>;
    upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        collateral(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        globalConfig(overrides?: CallOverrides): Promise<string>;
        matchWithDeal(deal: PromiseOrValue<string>, resources: PromiseOrValue<string>[], workersCount_: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
        proxiableUUID(overrides?: CallOverrides): Promise<string>;
        register(minPriceByEpoch: PromiseOrValue<BigNumberish>, maxCollateral: PromiseOrValue<BigNumberish>, workersCount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        remove(overrides?: CallOverrides): Promise<void>;
        resourceOwners(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[
            BigNumber,
            BigNumber,
            BigNumber
        ] & {
            minPriceByEpoch: BigNumber;
            maxCollateral: BigNumber;
            workersCount: BigNumber;
        }>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AdminChanged(address,address)"(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        "BeaconUpgraded(address)"(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        BeaconUpgraded(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        "Initialized(uint8)"(version?: null): InitializedEventFilter;
        Initialized(version?: null): InitializedEventFilter;
        "MatchedWithDeal(address,address[],uint256[])"(deal?: null, resources?: null, workersCount?: null): MatchedWithDealEventFilter;
        MatchedWithDeal(deal?: null, resources?: null, workersCount?: null): MatchedWithDealEventFilter;
        "ResourceOwnerRegistred(address,tuple)"(owner?: null, info?: null): ResourceOwnerRegistredEventFilter;
        ResourceOwnerRegistred(owner?: null, info?: null): ResourceOwnerRegistredEventFilter;
        "ResourceOwnerRemoved(address)"(owner?: null): ResourceOwnerRemovedEventFilter;
        ResourceOwnerRemoved(owner?: null): ResourceOwnerRemovedEventFilter;
        "Upgraded(address)"(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
        Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
    };
    estimateGas: {
        collateral(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        globalConfig(overrides?: CallOverrides): Promise<BigNumber>;
        matchWithDeal(deal: PromiseOrValue<string>, resources: PromiseOrValue<string>[], workersCount_: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;
        register(minPriceByEpoch: PromiseOrValue<BigNumberish>, maxCollateral: PromiseOrValue<BigNumberish>, workersCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        remove(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        resourceOwners(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        collateral(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        globalConfig(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        matchWithDeal(deal: PromiseOrValue<string>, resources: PromiseOrValue<string>[], workersCount_: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        register(minPriceByEpoch: PromiseOrValue<BigNumberish>, maxCollateral: PromiseOrValue<BigNumberish>, workersCount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        remove(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        resourceOwners(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
