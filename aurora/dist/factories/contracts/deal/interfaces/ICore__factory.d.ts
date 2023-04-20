import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { ICore, ICoreInterface } from "../../../../contracts/deal/interfaces/ICore";
export declare class ICore__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "getConfig";
        readonly outputs: readonly [{
            readonly internalType: "contract IConfig";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getController";
        readonly outputs: readonly [{
            readonly internalType: "contract IController";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getPayment";
        readonly outputs: readonly [{
            readonly internalType: "contract IPayment";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getStatusController";
        readonly outputs: readonly [{
            readonly internalType: "contract IStatusController";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getWorkers";
        readonly outputs: readonly [{
            readonly internalType: "contract IWorkers";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IConfig";
            readonly name: "config_";
            readonly type: "address";
        }, {
            readonly internalType: "contract IController";
            readonly name: "controller_";
            readonly type: "address";
        }, {
            readonly internalType: "contract IPayment";
            readonly name: "payment_";
            readonly type: "address";
        }, {
            readonly internalType: "contract IStatusController";
            readonly name: "statusController_";
            readonly type: "address";
        }, {
            readonly internalType: "contract IWorkers";
            readonly name: "workers_";
            readonly type: "address";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "module";
            readonly type: "address";
        }];
        readonly name: "moduleByAddress";
        readonly outputs: readonly [{
            readonly internalType: "enum Module";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "enum Module";
            readonly name: "module";
            readonly type: "uint8";
        }];
        readonly name: "modules";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): ICoreInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ICore;
}
