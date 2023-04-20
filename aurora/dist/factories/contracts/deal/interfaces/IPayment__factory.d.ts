import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IPayment, IPaymentInterface } from "../../../../contracts/deal/interfaces/IPayment";
export declare class IPayment__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly name: "balance";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "air";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "prevData";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "params";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "callResults";
                readonly type: "string";
            }];
            readonly internalType: "struct Particle";
            readonly name: "particle";
            readonly type: "tuple";
        }];
        readonly name: "commitParticle";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "depositToPaymentBalance";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "particleHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "PATId";
            readonly name: "patId";
            readonly type: "bytes32";
        }];
        readonly name: "getReward";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "PATId";
            readonly name: "patId";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32[]";
            readonly name: "particlesHashes";
            readonly type: "bytes32[]";
        }];
        readonly name: "withdrawForWorker";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount";
            readonly type: "uint256";
        }];
        readonly name: "withdrawFromPaymentBalance";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IPaymentInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IPayment;
}
