import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../common";
export interface DealInterface extends utils.Interface {
    functions: {
        "PAYMENT_DURATION_IN_EPOCHS()": FunctionFragment;
        "createProviderToken(bytes32)": FunctionFragment;
        "deposit(uint256)": FunctionFragment;
        "getBalance()": FunctionFragment;
        "getPATOwner(bytes32)": FunctionFragment;
        "getRole(address)": FunctionFragment;
        "getUnlockedCollateralBy(address,uint256)": FunctionFragment;
        "owner()": FunctionFragment;
        "register()": FunctionFragment;
        "removeProviderToken(bytes32)": FunctionFragment;
        "renounceOwnership()": FunctionFragment;
        "requiredStake()": FunctionFragment;
        "subnetId()": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
        "withdraw(address)": FunctionFragment;
        "withdrawPaymentBalance(address,uint256)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "PAYMENT_DURATION_IN_EPOCHS" | "createProviderToken" | "deposit" | "getBalance" | "getPATOwner" | "getRole" | "getUnlockedCollateralBy" | "owner" | "register" | "removeProviderToken" | "renounceOwnership" | "requiredStake" | "subnetId" | "transferOwnership" | "withdraw" | "withdrawPaymentBalance"): FunctionFragment;
    encodeFunctionData(functionFragment: "PAYMENT_DURATION_IN_EPOCHS", values?: undefined): string;
    encodeFunctionData(functionFragment: "createProviderToken", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "deposit", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "getBalance", values?: undefined): string;
    encodeFunctionData(functionFragment: "getPATOwner", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "getRole", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "getUnlockedCollateralBy", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "register", values?: undefined): string;
    encodeFunctionData(functionFragment: "removeProviderToken", values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "requiredStake", values?: undefined): string;
    encodeFunctionData(functionFragment: "subnetId", values?: undefined): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "withdraw", values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: "withdrawPaymentBalance", values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    decodeFunctionResult(functionFragment: "PAYMENT_DURATION_IN_EPOCHS", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "createProviderToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getPATOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRole", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getUnlockedCollateralBy", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeProviderToken", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "requiredStake", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "subnetId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdrawPaymentBalance", data: BytesLike): Result;
    events: {
        "AddProviderToken(address,bytes32)": EventFragment;
        "OwnershipTransferred(address,address)": EventFragment;
        "RemoveProviderToken(bytes32)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "AddProviderToken"): EventFragment;
    getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
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
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface RemoveProviderTokenEventObject {
    id: string;
}
export type RemoveProviderTokenEvent = TypedEvent<[
    string
], RemoveProviderTokenEventObject>;
export type RemoveProviderTokenEventFilter = TypedEventFilter<RemoveProviderTokenEvent>;
export interface Deal extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: DealInterface;
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
        PAYMENT_DURATION_IN_EPOCHS(overrides?: CallOverrides): Promise<[BigNumber]>;
        createProviderToken(salt: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        deposit(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getBalance(overrides?: CallOverrides): Promise<[BigNumber]>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        getRole(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[number]>;
        getUnlockedCollateralBy(owner: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        register(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        removeProviderToken(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        requiredStake(overrides?: CallOverrides): Promise<[BigNumber]>;
        subnetId(overrides?: CallOverrides): Promise<[string]>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdraw(token: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        withdrawPaymentBalance(token: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    PAYMENT_DURATION_IN_EPOCHS(overrides?: CallOverrides): Promise<BigNumber>;
    createProviderToken(salt: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    deposit(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getBalance(overrides?: CallOverrides): Promise<BigNumber>;
    getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    getRole(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
    getUnlockedCollateralBy(owner: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    owner(overrides?: CallOverrides): Promise<string>;
    register(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    removeProviderToken(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    requiredStake(overrides?: CallOverrides): Promise<BigNumber>;
    subnetId(overrides?: CallOverrides): Promise<string>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdraw(token: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    withdrawPaymentBalance(token: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        PAYMENT_DURATION_IN_EPOCHS(overrides?: CallOverrides): Promise<BigNumber>;
        createProviderToken(salt: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        deposit(amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        getBalance(overrides?: CallOverrides): Promise<BigNumber>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        getRole(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<number>;
        getUnlockedCollateralBy(owner: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<string>;
        register(overrides?: CallOverrides): Promise<void>;
        removeProviderToken(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        requiredStake(overrides?: CallOverrides): Promise<BigNumber>;
        subnetId(overrides?: CallOverrides): Promise<string>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        withdraw(token: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        withdrawPaymentBalance(token: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "AddProviderToken(address,bytes32)"(owner?: PromiseOrValue<string> | null, id?: null): AddProviderTokenEventFilter;
        AddProviderToken(owner?: PromiseOrValue<string> | null, id?: null): AddProviderTokenEventFilter;
        "OwnershipTransferred(address,address)"(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        "RemoveProviderToken(bytes32)"(id?: null): RemoveProviderTokenEventFilter;
        RemoveProviderToken(id?: null): RemoveProviderTokenEventFilter;
    };
    estimateGas: {
        PAYMENT_DURATION_IN_EPOCHS(overrides?: CallOverrides): Promise<BigNumber>;
        createProviderToken(salt: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        deposit(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getBalance(overrides?: CallOverrides): Promise<BigNumber>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        getRole(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        getUnlockedCollateralBy(owner: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        register(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        removeProviderToken(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        requiredStake(overrides?: CallOverrides): Promise<BigNumber>;
        subnetId(overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdraw(token: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        withdrawPaymentBalance(token: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        PAYMENT_DURATION_IN_EPOCHS(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        createProviderToken(salt: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        deposit(amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getPATOwner(id: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getRole(addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        getUnlockedCollateralBy(owner: PromiseOrValue<string>, timestamp: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        register(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        removeProviderToken(id: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        requiredStake(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        subnetId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdraw(token: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        withdrawPaymentBalance(token: PromiseOrValue<string>, amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
