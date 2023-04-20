import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IBeaconUpgradeable, IBeaconUpgradeableInterface } from "../../../../../@openzeppelin/contracts-upgradeable/proxy/beacon/IBeaconUpgradeable";
export declare class IBeaconUpgradeable__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "implementation";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): IBeaconUpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IBeaconUpgradeable;
}
