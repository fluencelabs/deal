import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { RoleManager, RoleManagerInterface } from "../../../../contracts/Deal/external/RoleManager";
export declare class RoleManager__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "addr";
            readonly type: "address";
        }];
        readonly name: "getRole";
        readonly outputs: readonly [{
            readonly internalType: "enum RMInternalInterface.Role";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "register";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): RoleManagerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): RoleManager;
}
