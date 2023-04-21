import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { IParticleVerifyer, IParticleVerifyerInterface } from "../../../../contracts/global/interfaces/IParticleVerifyer";
export declare class IParticleVerifyer__factory {
    static readonly abi: readonly [{
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
        readonly name: "verifyParticle";
        readonly outputs: readonly [{
            readonly internalType: "PATId[]";
            readonly name: "";
            readonly type: "bytes32[]";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): IParticleVerifyerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IParticleVerifyer;
}
