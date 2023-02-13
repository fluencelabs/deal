import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IWithdrawManager, IWithdrawManagerInterface } from "../../../../../contracts/Deal/external/interfaces/IWithdrawManager";
export declare class IWithdrawManager__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "timestamp";
            readonly type: "uint256";
        }];
        readonly name: "getUnlockedCollateralBy";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "token";
            readonly type: "address";
        }];
        readonly name: "withdraw";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IWithdrawManagerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IWithdrawManager;
}
