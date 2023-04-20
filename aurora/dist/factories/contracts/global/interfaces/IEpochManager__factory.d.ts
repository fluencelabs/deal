import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IEpochManager, IEpochManagerInterface } from "../../../../contracts/global/interfaces/IEpochManager";
export declare class IEpochManager__factory {
    static readonly abi: readonly [{
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
    static createInterface(): IEpochManagerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IEpochManager;
}
