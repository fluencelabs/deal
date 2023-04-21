import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { Multicall, MulticallInterface } from "../../../../@openzeppelin/contracts/utils/Multicall";
export declare class Multicall__factory {
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "bytes[]";
            readonly name: "data";
            readonly type: "bytes[]";
        }];
        readonly name: "multicall";
        readonly outputs: readonly [{
            readonly internalType: "bytes[]";
            readonly name: "results";
            readonly type: "bytes[]";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): MulticallInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Multicall;
}
