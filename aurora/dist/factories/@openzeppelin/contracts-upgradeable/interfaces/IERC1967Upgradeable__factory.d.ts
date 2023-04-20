import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IERC1967Upgradeable, IERC1967UpgradeableInterface } from "../../../../@openzeppelin/contracts-upgradeable/interfaces/IERC1967Upgradeable";
export declare class IERC1967Upgradeable__factory {
    static readonly abi: readonly [{
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "previousAdmin";
            readonly type: "address";
        }, {
            readonly indexed: false;
            readonly internalType: "address";
            readonly name: "newAdmin";
            readonly type: "address";
        }];
        readonly name: "AdminChanged";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "beacon";
            readonly type: "address";
        }];
        readonly name: "BeaconUpgraded";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "implementation";
            readonly type: "address";
        }];
        readonly name: "Upgraded";
        readonly type: "event";
    }];
    static createInterface(): IERC1967UpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IERC1967Upgradeable;
}
