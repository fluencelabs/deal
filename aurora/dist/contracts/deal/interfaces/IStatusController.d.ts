import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface IStatusControllerInterface extends utils.Interface {
    functions: {
        "changeStatus(uint8)": FunctionFragment;
        "startWorkingEpoch()": FunctionFragment;
        "status()": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "changeStatus" | "startWorkingEpoch" | "status"): FunctionFragment;
    encodeFunctionData(functionFragment: "changeStatus", values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: "startWorkingEpoch", values?: undefined): string;
    encodeFunctionData(functionFragment: "status", values?: undefined): string;
    decodeFunctionResult(functionFragment: "changeStatus", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "startWorkingEpoch", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "status", data: BytesLike): Result;
    events: {
        "StatusChanged(uint8)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "StatusChanged"): EventFragment;
}
export interface StatusChangedEventObject {
    newStatus: number;
}
export type StatusChangedEvent = TypedEvent<[number], StatusChangedEventObject>;
export type StatusChangedEventFilter = TypedEventFilter<StatusChangedEvent>;
export interface IStatusController extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IStatusControllerInterface;
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
        changeStatus(status_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        startWorkingEpoch(overrides?: CallOverrides): Promise<[BigNumber]>;
        status(overrides?: CallOverrides): Promise<[number]>;
    };
    changeStatus(status_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    startWorkingEpoch(overrides?: CallOverrides): Promise<BigNumber>;
    status(overrides?: CallOverrides): Promise<number>;
    callStatic: {
        changeStatus(status_: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        startWorkingEpoch(overrides?: CallOverrides): Promise<BigNumber>;
        status(overrides?: CallOverrides): Promise<number>;
    };
    filters: {
        "StatusChanged(uint8)"(newStatus?: null): StatusChangedEventFilter;
        StatusChanged(newStatus?: null): StatusChangedEventFilter;
    };
    estimateGas: {
        changeStatus(status_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        startWorkingEpoch(overrides?: CallOverrides): Promise<BigNumber>;
        status(overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        changeStatus(status_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        startWorkingEpoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        status(overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
