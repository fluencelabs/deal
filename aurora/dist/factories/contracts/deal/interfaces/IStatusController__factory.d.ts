import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IStatusController, IStatusControllerInterface } from "../../../../contracts/deal/interfaces/IStatusController";
export declare class IStatusController__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "enum DealStatus";
            readonly name: "newStatus";
            readonly type: "uint8";
        }];
        readonly name: "StatusChanged";
        readonly type: "event";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "enum DealStatus";
            readonly name: "status_";
            readonly type: "uint8";
        }];
        readonly name: "changeStatus";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "startWorkingEpoch";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "status";
        readonly outputs: readonly [{
            readonly internalType: "enum DealStatus";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IStatusControllerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IStatusController;
}
