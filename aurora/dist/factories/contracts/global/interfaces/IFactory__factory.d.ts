import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IFactory, IFactoryInterface } from "../../../../contracts/global/interfaces/IFactory";
export declare class IFactory__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "minWorkers_";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "targetWorkers_";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "appCID_";
            readonly type: "string";
        }];
        readonly name: "createDeal";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "isDeal";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IFactoryInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IFactory;
}
