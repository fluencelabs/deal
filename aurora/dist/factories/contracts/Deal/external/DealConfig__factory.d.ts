import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { DealConfig, DealConfigInterface } from "../../../../contracts/Deal/external/DealConfig";
export declare class DealConfig__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "requiredStake";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "subnetId";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): DealConfigInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): DealConfig;
}
