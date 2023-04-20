import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { DealFactoryState, DealFactoryStateInterface } from "../../../../contracts/global/DealFactory.sol/DealFactoryState";
export declare class DealFactoryState__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "MAX_WORKERS_PER_PROVIDER";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "PRICE_PER_EPOCH";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "REQUIRED_STAKE";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "configImpl";
        readonly outputs: readonly [{
            readonly internalType: "contract IConfig";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "controllerImpl";
        readonly outputs: readonly [{
            readonly internalType: "contract IController";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "coreImpl";
        readonly outputs: readonly [{
            readonly internalType: "contract ICore";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "minWorkers_";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "targetWorkers_";
            readonly type: "uint256";
        }, {
            readonly internalType: "string";
            readonly name: "appCID_";
            readonly type: "string";
        }];
        readonly name: "createDeal";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "defaultPaymentToken";
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
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "isDeal";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "paymentImpl";
        readonly outputs: readonly [{
            readonly internalType: "contract IPayment";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "statusControllerImpl";
        readonly outputs: readonly [{
            readonly internalType: "contract IStatusController";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "workersImpl";
        readonly outputs: readonly [{
            readonly internalType: "contract IWorkers";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): DealFactoryStateInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): DealFactoryState;
}
