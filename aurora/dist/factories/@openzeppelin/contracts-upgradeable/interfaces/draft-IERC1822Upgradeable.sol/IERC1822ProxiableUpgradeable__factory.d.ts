import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IERC1822ProxiableUpgradeable, IERC1822ProxiableUpgradeableInterface } from "../../../../../@openzeppelin/contracts-upgradeable/interfaces/draft-IERC1822Upgradeable.sol/IERC1822ProxiableUpgradeable";
export declare class IERC1822ProxiableUpgradeable__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "proxiableUUID";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IERC1822ProxiableUpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IERC1822ProxiableUpgradeable;
}
