import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { MatcherState, MatcherStateInterface } from "../../../../contracts/global/Matcher.sol/MatcherState";
type MatcherStateConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class MatcherState__factory extends ContractFactory {
    constructor(...args: MatcherStateConstructorParams);
    deploy(globalConfig_: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<MatcherState>;
    getDeployTransaction(globalConfig_: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): MatcherState;
    connect(signer: Signer): MatcherState__factory;
    static readonly bytecode = "0x60a060405234801561001057600080fd5b50604051610400380380610400833981810160405281019061003291906100e1565b8073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250505061010e565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061009c82610071565b9050919050565b60006100ae82610091565b9050919050565b6100be816100a3565b81146100c957600080fd5b50565b6000815190506100db816100b5565b92915050565b6000602082840312156100f7576100f661006c565b5b6000610105848285016100cc565b91505092915050565b6080516102d7610129600039600061010a01526102d76000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063438ad7a214610046578063a5fdc5de14610078578063a7c1abe0146100a8575b600080fd5b610060600480360381019061005b919061018f565b6100c6565b60405161006f939291906101d5565b60405180910390f35b610092600480360381019061008d919061018f565b6100f0565b60405161009f919061020c565b60405180910390f35b6100b0610108565b6040516100bd9190610286565b60405180910390f35b60006020528060005260406000206000915090508060000154908060010154908060020154905083565b60016020528060005260406000206000915090505481565b7f000000000000000000000000000000000000000000000000000000000000000081565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061015c82610131565b9050919050565b61016c81610151565b811461017757600080fd5b50565b60008135905061018981610163565b92915050565b6000602082840312156101a5576101a461012c565b5b60006101b38482850161017a565b91505092915050565b6000819050919050565b6101cf816101bc565b82525050565b60006060820190506101ea60008301866101c6565b6101f760208301856101c6565b61020460408301846101c6565b949350505050565b600060208201905061022160008301846101c6565b92915050565b6000819050919050565b600061024c61024761024284610131565b610227565b610131565b9050919050565b600061025e82610231565b9050919050565b600061027082610253565b9050919050565b61028081610265565b82525050565b600060208201905061029b6000830184610277565b9291505056fea2646970667358221220efbffb060dcb14bd7b26f45cad572e2140d91562360f732136e469f9fb69ae1764736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IGlobalConfig";
            readonly name: "globalConfig_";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "collateral";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
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
        readonly name: "resourceOwners";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "minPriceByEpoch";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "maxCollateral";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "workersCount";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): MatcherStateInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MatcherState;
}
export {};
