import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PayableOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export interface WorkersInterface extends utils.Interface {
    functions: {
        "createPAT(address,address)": FunctionFragment;
        "getNextWorkerIndex()": FunctionFragment;
        "getPATIndex(bytes32)": FunctionFragment;
        "getPATOwner(bytes32)": FunctionFragment;
        "getUnlockedAmountBy(address,uint256)": FunctionFragment;
        "proxiableUUID()": FunctionFragment;
        "removePAT(bytes32)": FunctionFragment;
        "upgradeTo(address)": FunctionFragment;
        "upgradeToAndCall(address,bytes)": FunctionFragment;
        "withdraw(address)": FunctionFragment;
        "workersCount()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "createPAT" | "getNextWorkerIndex" | "getPATIndex" | "getPATOwner" | "getUnlockedAmountBy" | "proxiableUUID" | "removePAT" | "upgradeTo" | "upgradeToAndCall" | "withdraw" | "workersCount"): FunctionFragment;
    encodeFunctionData(functionFragment: "createPAT", values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getNextWorkerIndex", values?: undefined): string;
    encodeFunctionData(functionFragment: "getPATIndex", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getPATOwner", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getUnlockedAmountBy", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "proxiableUUID", values?: undefined): string;
    encodeFunctionData(functionFragment: "removePAT", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "upgradeTo", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "upgradeToAndCall", values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "withdraw", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "workersCount", values?: undefined): string;
    decodeFunctionResult(functionFragment: "createPAT", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getNextWorkerIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPATIndex", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPATOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getUnlockedAmountBy", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "proxiableUUID", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removePAT", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgradeToAndCall", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "workersCount", data: BytesLike): Result;
    events: {
        "AdminChanged(address,address)": EventFragment;
        "BeaconUpgraded(address)": EventFragment;
        "PATCreated(bytes32,address)": EventFragment;
        "Upgraded(address)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "PATCreated"): EventFragment;
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
export interface PATCreatedEventObject {
    id: string;
    owner: string;
}
export type PATCreatedEvent = TypedEvent<[
    string,
    string
], PATCreatedEventObject>;
export type PATCreatedEventFilter = TypedEventFilter<PATCreatedEvent>;
export interface UpgradedEventObject {
    implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;
export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;
export interface Workers extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: WorkersInterface;
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
        createPAT(owner: PromiseOrValue<string>, payer: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getNextWorkerIndex(overrides?: CallOverrides): Promise<[BigNumber]>;
        getPATIndex(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        getUnlockedAmountBy(owner: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        proxiableUUID(overrides?: CallOverrides): Promise<[string]>;
        removePAT(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdraw(owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        workersCount(overrides?: CallOverrides): Promise<[BigNumber]>;
    };
    createPAT(owner: PromiseOrValue<string>, payer: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getNextWorkerIndex(overrides?: CallOverrides): Promise<BigNumber>;
    getPATIndex(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    getUnlockedAmountBy(owner: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    proxiableUUID(overrides?: CallOverrides): Promise<string>;
    removePAT(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdraw(owner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    workersCount(overrides?: CallOverrides): Promise<BigNumber>;
    callStatic: {
        createPAT(owner: PromiseOrValue<string>, payer: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        getNextWorkerIndex(overrides?: CallOverrides): Promise<BigNumber>;
        getPATIndex(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        getUnlockedAmountBy(owner: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        proxiableUUID(overrides?: CallOverrides): Promise<string>;
        removePAT(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        withdraw(owner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        workersCount(overrides?: CallOverrides): Promise<BigNumber>;
    };
    filters: {
        "AdminChanged(address,address)"(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        AdminChanged(previousAdmin?: null, newAdmin?: null): AdminChangedEventFilter;
        "BeaconUpgraded(address)"(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        BeaconUpgraded(beacon?: PromiseOrValue<string> | null): BeaconUpgradedEventFilter;
        "PATCreated(bytes32,address)"(id?: null, owner?: null): PATCreatedEventFilter;
        PATCreated(id?: null, owner?: null): PATCreatedEventFilter;
        "Upgraded(address)"(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
        Upgraded(implementation?: PromiseOrValue<string> | null): UpgradedEventFilter;
    };
    estimateGas: {
        createPAT(owner: PromiseOrValue<string>, payer: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getNextWorkerIndex(overrides?: CallOverrides): Promise<BigNumber>;
        getPATIndex(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getUnlockedAmountBy(owner: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;
        removePAT(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdraw(owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        workersCount(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        createPAT(owner: PromiseOrValue<string>, payer: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getNextWorkerIndex(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPATIndex(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getUnlockedAmountBy(owner: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        removePAT(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgradeTo(newImplementation: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgradeToAndCall(newImplementation: PromiseOrValue<string>, data: PromiseOrValue<BytesLike>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdraw(owner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        workersCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
