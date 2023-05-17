import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { ConfigState, ConfigStateInterface } from "../../../../contracts/deal/Config.sol/ConfigState";
export declare class ConfigState__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "appCID";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "";
            readonly type: "string";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "effectors";
        readonly outputs: readonly [{
            readonly internalType: "string[]";
            readonly name: "";
            readonly type: "string[]";
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
        readonly name: "globalConfig";
        readonly outputs: readonly [{
            readonly internalType: "contract IGlobalConfig";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "paymentToken_";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "pricePerEpoch_";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "requiredStake_";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "appCID_";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "minWorkers_";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "maxWorkersPerProvider_";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "targetWorkers_";
            readonly type: "uint256";
        }, {
            readonly internalType: "string[]";
            readonly name: "effectorWasmsCids_";
            readonly type: "string[]";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "maxWorkersPerProvider";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "minWorkers";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "particleVerifyer";
        readonly outputs: readonly [{
            readonly internalType: "contract IParticleVerifyer";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "paymentToken";
        readonly outputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "pricePerEpoch";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
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
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "appCID_";
            readonly type: "string";
        }];
        readonly name: "setAppCID";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "pricePerEpoch_";
            readonly type: "uint256";
        }];
        readonly name: "setPricePerEpoch";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "requiredStake_";
            readonly type: "uint256";
        }];
        readonly name: "setRequiredStake";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "targetWorkers";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): ConfigStateInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ConfigState;
}
