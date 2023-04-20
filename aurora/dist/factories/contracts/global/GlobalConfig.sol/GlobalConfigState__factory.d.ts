import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { GlobalConfigState, GlobalConfigStateInterface } from "../../../../contracts/global/GlobalConfig.sol/GlobalConfigState";
export declare class GlobalConfigState__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "epochManager";
        readonly outputs: readonly [{
            readonly internalType: "contract IEpochManager";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "contract IFactory";
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
        readonly name: "matcher";
        readonly outputs: readonly [{
            readonly internalType: "contract IMatcher";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
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
    static createInterface(): GlobalConfigStateInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): GlobalConfigState;
}
