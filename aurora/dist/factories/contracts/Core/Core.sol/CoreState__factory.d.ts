import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { CoreState, CoreStateInterface } from "../../../../contracts/Core/Core.sol/CoreState";
type CoreStateConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class CoreState__factory extends ContractFactory {
    constructor(...args: CoreStateConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<CoreState>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): CoreState;
    connect(signer: Signer): CoreState__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b50610387806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063ac027f971161005b578063ac027f9714610105578063b8b3654714610123578063bc4dba0214610141578063e2d2bfe31461015f57610088565b8063590909101461008d57806373b517fc146100ab57806385079cd7146100c95780639c15d1a2146100e7575b600080fd5b61009561017d565b6040516100a29190610224565b60405180910390f35b6100b3610183565b6040516100c09190610224565b60405180910390f35b6100d1610189565b6040516100de91906102be565b60405180910390f35b6100ef6101af565b6040516100fc9190610224565b60405180910390f35b61010d6101b5565b60405161011a91906102fa565b60405180910390f35b61012b6101d9565b6040516101389190610224565b60405180910390f35b6101496101df565b6040516101569190610224565b60405180910390f35b6101676101e5565b6040516101749190610336565b60405180910390f35b60065481565b60035481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60025481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b60055481565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000819050919050565b61021e8161020b565b82525050565b60006020820190506102396000830184610215565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600061028461027f61027a8461023f565b61025f565b61023f565b9050919050565b600061029682610269565b9050919050565b60006102a88261028b565b9050919050565b6102b88161029d565b82525050565b60006020820190506102d360008301846102af565b92915050565b60006102e48261028b565b9050919050565b6102f4816102d9565b82525050565b600060208201905061030f60008301846102eb565b92915050565b60006103208261028b565b9050919050565b61033081610315565b82525050565b600060208201905061034b6000830184610327565b9291505056fea2646970667358221220450245fc205b4e2567e7c6abdfca3d7d7a0e85f3fc5c0e0703494eb7499fee7f64736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "aquaProxy";
        readonly outputs: readonly [{
            readonly internalType: "contract AquaProxy";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "epochDelayForReward";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "epochManager";
        readonly outputs: readonly [{
            readonly internalType: "contract EpochManager";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "fluenceToken";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "minAmountOfEpochsForReward";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "slashFactor";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "updateSettingsTimeout";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "withdrawTimeout";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): CoreStateInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): CoreState;
}
export {};
