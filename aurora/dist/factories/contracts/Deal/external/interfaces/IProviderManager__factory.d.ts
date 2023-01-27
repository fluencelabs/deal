import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IProviderManager, IProviderManagerInterface } from "../../../../../contracts/Deal/external/interfaces/IProviderManager";
export declare class IProviderManager__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "IProviderManager.PATId";
            readonly name: "id";
            readonly type: "bytes32";
        }];
        readonly name: "AddProviderToken";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "IProviderManager.PATId";
            readonly name: "id";
            readonly type: "bytes32";
        }];
        readonly name: "RemoveProviderToken";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "salt";
            readonly type: "bytes32";
        }];
        readonly name: "createProviderToken";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "IProviderManager.PATId";
            readonly name: "id";
            readonly type: "bytes32";
        }];
        readonly name: "getPATOwner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "IProviderManager.PATId";
            readonly name: "id";
            readonly type: "bytes32";
        }];
        readonly name: "removeProviderToken";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IProviderManagerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IProviderManager;
}
