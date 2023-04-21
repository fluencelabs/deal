import type { BaseContract, BigNumber, BigNumberish, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "../../../common";
export interface IMatcherInterface extends utils.Interface {
    functions: {
        "matchWithDeal(address,address[],uint256[])": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "matchWithDeal"): FunctionFragment;
    encodeFunctionData(functionFragment: "matchWithDeal", values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>[],
        PromiseOrValue<BigNumberish>[]
    ]): string;
    decodeFunctionResult(functionFragment: "matchWithDeal", data: BytesLike): Result;
    events: {};
}
export interface IMatcher extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: IMatcherInterface;
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
        matchWithDeal(deal: PromiseOrValue<string>, resources: PromiseOrValue<string>[], workersCount_: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    matchWithDeal(deal: PromiseOrValue<string>, resources: PromiseOrValue<string>[], workersCount_: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        matchWithDeal(deal: PromiseOrValue<string>, resources: PromiseOrValue<string>[], workersCount_: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<void>;
    };
    filters: {};
    estimateGas: {
        matchWithDeal(deal: PromiseOrValue<string>, resources: PromiseOrValue<string>[], workersCount_: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        matchWithDeal(deal: PromiseOrValue<string>, resources: PromiseOrValue<string>[], workersCount_: PromiseOrValue<BigNumberish>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
