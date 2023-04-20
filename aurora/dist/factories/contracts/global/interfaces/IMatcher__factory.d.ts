import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IMatcher, IMatcherInterface } from "../../../../contracts/global/interfaces/IMatcher";
export declare class IMatcher__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract ICore";
            readonly name: "deal";
            readonly type: "address";
        }, {
            readonly internalType: "address[]";
            readonly name: "resources";
            readonly type: "address[]";
        }, {
            readonly internalType: "uint256[]";
            readonly name: "workersCount_";
            readonly type: "uint256[]";
        }];
        readonly name: "matchWithDeal";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IMatcherInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IMatcher;
}
