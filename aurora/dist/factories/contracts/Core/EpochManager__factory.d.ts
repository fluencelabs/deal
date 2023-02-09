import { Signer, ContractFactory, BigNumberish, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type { EpochManager, EpochManagerInterface } from "../../../contracts/Core/EpochManager";
type EpochManagerConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class EpochManager__factory extends ContractFactory {
    constructor(...args: EpochManagerConstructorParams);
    deploy(epochDuration_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<EpochManager>;
    getDeployTransaction(epochDuration_: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): EpochManager;
    connect(signer: Signer): EpochManager__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b506040516102113803806102118339818101604052810190610032919061007a565b80600081905550506100a7565b600080fd5b6000819050919050565b61005781610044565b811461006257600080fd5b50565b6000815190506100748161004e565b92915050565b6000602082840312156100905761008f61003f565b5b600061009e84828501610065565b91505092915050565b61015b806100b66000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80634ff0876a1461003b5780637667180814610059575b600080fd5b610043610077565b60405161005091906100aa565b60405180910390f35b61006161007d565b60405161006e91906100aa565b60405180910390f35b60005481565b600080544261008c91906100f4565b905090565b6000819050919050565b6100a481610091565b82525050565b60006020820190506100bf600083018461009b565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b60006100ff82610091565b915061010a83610091565b92508261011a576101196100c5565b5b82820490509291505056fea26469706673582212202c572d4de8e064413b0790ee1ca05b18e0d630b07e9bfddaa105ea8a836761b164736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "epochDuration_";
            readonly type: "uint256";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [];
        readonly name: "currentEpoch";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "epochDuration";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): EpochManagerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): EpochManager;
}
export {};
