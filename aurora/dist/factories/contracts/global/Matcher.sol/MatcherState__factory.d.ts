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
    static readonly bytecode = "0x60a060405234801561001057600080fd5b506040516104a13803806104a1833981810160405281019061003291906100e1565b8073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250505061010e565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061009c82610071565b9050919050565b60006100ae82610091565b9050919050565b6100be816100a3565b81146100c957600080fd5b50565b6000815190506100db816100b5565b92915050565b6000602082840312156100f7576100f661006c565b5b6000610105848285016100cc565b91505092915050565b608051610378610129600039600061013c01526103786000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80638ae86750146100515780639b19251a14610083578063a7c1abe0146100b3578063b5ebe33d146100d1575b600080fd5b61006b600480360381019061006691906101d3565b6100f0565b60405161007a93929190610219565b60405180910390f35b61009d600480360381019061009891906101d3565b61011a565b6040516100aa919061026b565b60405180910390f35b6100bb61013a565b6040516100c891906102e5565b60405180910390f35b6100d961015e565b6040516100e7929190610319565b60405180910390f35b60036020528060005260406000206000915090508060000154908060010154908060020154905083565b60046020528060005260406000206000915054906101000a900460ff1681565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008060000154908060010154905082565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101a082610175565b9050919050565b6101b081610195565b81146101bb57600080fd5b50565b6000813590506101cd816101a7565b92915050565b6000602082840312156101e9576101e8610170565b5b60006101f7848285016101be565b91505092915050565b6000819050919050565b61021381610200565b82525050565b600060608201905061022e600083018661020a565b61023b602083018561020a565b610248604083018461020a565b949350505050565b60008115159050919050565b61026581610250565b82525050565b6000602082019050610280600083018461025c565b92915050565b6000819050919050565b60006102ab6102a66102a184610175565b610286565b610175565b9050919050565b60006102bd82610290565b9050919050565b60006102cf826102b2565b9050919050565b6102df816102c4565b82525050565b60006020820190506102fa60008301846102d6565b92915050565b6000819050919050565b61031381610300565b82525050565b600060408201905061032e600083018561030a565b61033b602083018461030a565b939250505056fea2646970667358221220ea8b38673b972233935c82da68b879983703a6acae873dfa37a9130bddc803ef64736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [{
            readonly internalType: "contract IGlobalConfig";
            readonly name: "globalConfig_";
            readonly type: "address";
        }];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
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
        readonly inputs: readonly [];
        readonly name: "resourceConfigIds";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "_first";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "_last";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "resourceConfigs";
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
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "whitelist";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): MatcherStateInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MatcherState;
}
export {};
