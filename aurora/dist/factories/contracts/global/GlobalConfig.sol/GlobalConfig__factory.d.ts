import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type { GlobalConfig, GlobalConfigInterface } from "../../../../contracts/global/GlobalConfig.sol/GlobalConfig";
type GlobalConfigConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class GlobalConfig__factory extends ContractFactory {
    constructor(...args: GlobalConfigConstructorParams);
    deploy(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<GlobalConfig>;
    getDeployTransaction(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): GlobalConfig;
    connect(signer: Signer): GlobalConfig__factory;
    static readonly bytecode = "0x60a06040523073ffffffffffffffffffffffffffffffffffffffff1660809073ffffffffffffffffffffffffffffffffffffffff168152503480156200004457600080fd5b50620000556200005b60201b60201c565b62000206565b600060019054906101000a900460ff1615620000ae576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000a590620001a9565b60405180910390fd5b60ff801660008054906101000a900460ff1660ff161015620001205760ff6000806101000a81548160ff021916908360ff1602179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249860ff604051620001179190620001e9565b60405180910390a15b565b600082825260208201905092915050565b7f496e697469616c697a61626c653a20636f6e747261637420697320696e69746960008201527f616c697a696e6700000000000000000000000000000000000000000000000000602082015250565b60006200019160278362000122565b91506200019e8262000133565b604082019050919050565b60006020820190508181036000830152620001c48162000182565b9050919050565b600060ff82169050919050565b620001e381620001cb565b82525050565b6000602082019050620002006000830184620001d8565b92915050565b6080516120ca6200023e600039600081816103ad0152818161043b01528181610535015281816105c3015261067301526120ca6000f3fe6080604052600436106100fe5760003560e01c80638da5cb5b11610095578063c350a1b511610064578063c350a1b5146102da578063c45a015514610303578063d4d59edb1461032e578063e2d2bfe314610357578063f2fde38b14610382576100fe565b80638da5cb5b14610230578063963ddbe91461025b5780639c15d1a214610284578063ac027f97146102af576100fe565b80635bb47808116100d15780635bb478081461019c578063715018a6146101c557806372941460146101dc5780637e7e66b214610205576100fe565b80633659cfe6146101035780634f1ef2861461012c57806352d1902d1461014857806353d6e10014610173575b600080fd5b34801561010f57600080fd5b5061012a600480360381019061012591906112ab565b6103ab565b005b6101466004803603810190610141919061141e565b610533565b005b34801561015457600080fd5b5061015d61066f565b60405161016a9190611493565b60405180910390f35b34801561017f57600080fd5b5061019a600480360381019061019591906114ec565b610728565b005b3480156101a857600080fd5b506101c360048036038101906101be9190611557565b610774565b005b3480156101d157600080fd5b506101da6107c0565b005b3480156101e857600080fd5b5061020360048036038101906101fe91906115ba565b6107d4565b005b34801561021157600080fd5b5061021a6107e6565b6040516102279190611646565b60405180910390f35b34801561023c57600080fd5b5061024561080c565b6040516102529190611670565b60405180910390f35b34801561026757600080fd5b50610282600480360381019061027d91906116c9565b61081b565b005b34801561029057600080fd5b50610299610867565b6040516102a69190611705565b60405180910390f35b3480156102bb57600080fd5b506102c461086d565b6040516102d19190611741565b60405180910390f35b3480156102e657600080fd5b5061030160048036038101906102fc919061179a565b610893565b005b34801561030f57600080fd5b50610318610a5d565b604051610325919061180e565b60405180910390f35b34801561033a57600080fd5b5061035560048036038101906103509190611829565b610a83565b005b34801561036357600080fd5b5061036c610acf565b6040516103799190611877565b60405180910390f35b34801561038e57600080fd5b506103a960048036038101906103a491906112ab565b610af5565b005b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1603610439576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161043090611915565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16610478610b78565b73ffffffffffffffffffffffffffffffffffffffff16146104ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c5906119a7565b60405180910390fd5b6104d781610bcf565b61053081600067ffffffffffffffff8111156104f6576104f56112f3565b5b6040519080825280601f01601f1916602001820160405280156105285781602001600182028036833780820191505090505b506000610bda565b50565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16036105c1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105b890611915565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16610600610b78565b73ffffffffffffffffffffffffffffffffffffffff1614610656576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161064d906119a7565b60405180910390fd5b61065f82610bcf565b61066b82826001610bda565b5050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16146106ff576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106f690611a39565b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b905090565b610730610d48565b80606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61077c610d48565b80606960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6107c8610d48565b6107d26000610dc6565b565b6107dc610d48565b8060668190555050565b606860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000610816610e8c565b905090565b610823610d48565b80606860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60665481565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060019054906101000a900460ff161590508080156108c45750600160008054906101000a900460ff1660ff16105b806108f157506108d330610eb6565b1580156108f05750600160008054906101000a900460ff1660ff16145b5b610930576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161092790611acb565b60405180910390fd5b60016000806101000a81548160ff021916908360ff160217905550801561096d576001600060016101000a81548160ff0219169083151502179055505b83606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260668190555081606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506109fe610ed9565b8015610a575760008060016101000a81548160ff0219169083151502179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024986001604051610a4e9190611b33565b60405180910390a15b50505050565b606960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610a8b610d48565b80606760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b606760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610afd610d48565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610b6c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b6390611bc0565b60405180910390fd5b610b7581610dc6565b50565b6000610ba67f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b610f32565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b610bd7610d48565b50565b610c067f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd914360001b610f3c565b60000160009054906101000a900460ff1615610c2a57610c2583610f46565b610d43565b8273ffffffffffffffffffffffffffffffffffffffff166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610c9257506040513d601f19601f82011682018060405250810190610c8f9190611c0c565b60015b610cd1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cc890611cab565b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b8114610d36576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d2d90611d3d565b60405180910390fd5b50610d42838383610fff565b5b505050565b610d5061102b565b73ffffffffffffffffffffffffffffffffffffffff16610d6e61080c565b73ffffffffffffffffffffffffffffffffffffffff1614610dc4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dbb90611da9565b60405180910390fd5b565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600060019054906101000a900460ff16610f28576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f1f90611e3b565b60405180910390fd5b610f30611033565b565b6000819050919050565b6000819050919050565b610f4f81610eb6565b610f8e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8590611ecd565b60405180910390fd5b80610fbb7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b610f32565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61100883611094565b6000825111806110155750805b156110265761102483836110e3565b505b505050565b600033905090565b600060019054906101000a900460ff16611082576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161107990611e3b565b60405180910390fd5b61109261108d61102b565b610dc6565b565b61109d81610f46565b8073ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a250565b60606110ee83610eb6565b61112d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161112490611f5f565b60405180910390fd5b6000808473ffffffffffffffffffffffffffffffffffffffff16846040516111559190611ff0565b600060405180830381855af49150503d8060008114611190576040519150601f19603f3d011682016040523d82523d6000602084013e611195565b606091505b50915091506111bd828260405180606001604052806027815260200161206e602791396111c7565b9250505092915050565b606083156111d7578290506111e2565b6111e183836111e9565b5b9392505050565b6000825111156111fc5781518083602001fd5b806040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611230919061204b565b60405180910390fd5b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006112788261124d565b9050919050565b6112888161126d565b811461129357600080fd5b50565b6000813590506112a58161127f565b92915050565b6000602082840312156112c1576112c0611243565b5b60006112cf84828501611296565b91505092915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61132b826112e2565b810181811067ffffffffffffffff8211171561134a576113496112f3565b5b80604052505050565b600061135d611239565b90506113698282611322565b919050565b600067ffffffffffffffff821115611389576113886112f3565b5b611392826112e2565b9050602081019050919050565b82818337600083830152505050565b60006113c16113bc8461136e565b611353565b9050828152602081018484840111156113dd576113dc6112dd565b5b6113e884828561139f565b509392505050565b600082601f830112611405576114046112d8565b5b81356114158482602086016113ae565b91505092915050565b6000806040838503121561143557611434611243565b5b600061144385828601611296565b925050602083013567ffffffffffffffff81111561146457611463611248565b5b611470858286016113f0565b9150509250929050565b6000819050919050565b61148d8161147a565b82525050565b60006020820190506114a86000830184611484565b92915050565b60006114b98261126d565b9050919050565b6114c9816114ae565b81146114d457600080fd5b50565b6000813590506114e6816114c0565b92915050565b60006020828403121561150257611501611243565b5b6000611510848285016114d7565b91505092915050565b60006115248261126d565b9050919050565b61153481611519565b811461153f57600080fd5b50565b6000813590506115518161152b565b92915050565b60006020828403121561156d5761156c611243565b5b600061157b84828501611542565b91505092915050565b6000819050919050565b61159781611584565b81146115a257600080fd5b50565b6000813590506115b48161158e565b92915050565b6000602082840312156115d0576115cf611243565b5b60006115de848285016115a5565b91505092915050565b6000819050919050565b600061160c6116076116028461124d565b6115e7565b61124d565b9050919050565b600061161e826115f1565b9050919050565b600061163082611613565b9050919050565b61164081611625565b82525050565b600060208201905061165b6000830184611637565b92915050565b61166a8161126d565b82525050565b60006020820190506116856000830184611661565b92915050565b60006116968261126d565b9050919050565b6116a68161168b565b81146116b157600080fd5b50565b6000813590506116c38161169d565b92915050565b6000602082840312156116df576116de611243565b5b60006116ed848285016116b4565b91505092915050565b6116ff81611584565b82525050565b600060208201905061171a60008301846116f6565b92915050565b600061172b82611613565b9050919050565b61173b81611720565b82525050565b60006020820190506117566000830184611732565b92915050565b60006117678261126d565b9050919050565b6117778161175c565b811461178257600080fd5b50565b6000813590506117948161176e565b92915050565b6000806000606084860312156117b3576117b2611243565b5b60006117c1868287016114d7565b93505060206117d2868287016115a5565b92505060406117e386828701611785565b9150509250925092565b60006117f882611613565b9050919050565b611808816117ed565b82525050565b600060208201905061182360008301846117ff565b92915050565b60006020828403121561183f5761183e611243565b5b600061184d84828501611785565b91505092915050565b600061186182611613565b9050919050565b61187181611856565b82525050565b600060208201905061188c6000830184611868565b92915050565b600082825260208201905092915050565b7f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060008201527f64656c656761746563616c6c0000000000000000000000000000000000000000602082015250565b60006118ff602c83611892565b915061190a826118a3565b604082019050919050565b6000602082019050818103600083015261192e816118f2565b9050919050565b7f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060008201527f6163746976652070726f78790000000000000000000000000000000000000000602082015250565b6000611991602c83611892565b915061199c82611935565b604082019050919050565b600060208201905081810360008301526119c081611984565b9050919050565b7f555550535570677261646561626c653a206d757374206e6f742062652063616c60008201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000602082015250565b6000611a23603883611892565b9150611a2e826119c7565b604082019050919050565b60006020820190508181036000830152611a5281611a16565b9050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b6000611ab5602e83611892565b9150611ac082611a59565b604082019050919050565b60006020820190508181036000830152611ae481611aa8565b9050919050565b6000819050919050565b600060ff82169050919050565b6000611b1d611b18611b1384611aeb565b6115e7565b611af5565b9050919050565b611b2d81611b02565b82525050565b6000602082019050611b486000830184611b24565b92915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611baa602683611892565b9150611bb582611b4e565b604082019050919050565b60006020820190508181036000830152611bd981611b9d565b9050919050565b611be98161147a565b8114611bf457600080fd5b50565b600081519050611c0681611be0565b92915050565b600060208284031215611c2257611c21611243565b5b6000611c3084828501611bf7565b91505092915050565b7f45524331393637557067726164653a206e657720696d706c656d656e7461746960008201527f6f6e206973206e6f742055555053000000000000000000000000000000000000602082015250565b6000611c95602e83611892565b9150611ca082611c39565b604082019050919050565b60006020820190508181036000830152611cc481611c88565b9050919050565b7f45524331393637557067726164653a20756e737570706f727465642070726f7860008201527f6961626c65555549440000000000000000000000000000000000000000000000602082015250565b6000611d27602983611892565b9150611d3282611ccb565b604082019050919050565b60006020820190508181036000830152611d5681611d1a565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000611d93602083611892565b9150611d9e82611d5d565b602082019050919050565b60006020820190508181036000830152611dc281611d86565b9050919050565b7f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960008201527f6e697469616c697a696e67000000000000000000000000000000000000000000602082015250565b6000611e25602b83611892565b9150611e3082611dc9565b604082019050919050565b60006020820190508181036000830152611e5481611e18565b9050919050565b7f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60008201527f6f74206120636f6e747261637400000000000000000000000000000000000000602082015250565b6000611eb7602d83611892565b9150611ec282611e5b565b604082019050919050565b60006020820190508181036000830152611ee681611eaa565b9050919050565b7f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f60008201527f6e74726163740000000000000000000000000000000000000000000000000000602082015250565b6000611f49602683611892565b9150611f5482611eed565b604082019050919050565b60006020820190508181036000830152611f7881611f3c565b9050919050565b600081519050919050565b600081905092915050565b60005b83811015611fb3578082015181840152602081019050611f98565b60008484015250505050565b6000611fca82611f7f565b611fd48185611f8a565b9350611fe4818560208601611f95565b80840191505092915050565b6000611ffc8284611fbf565b915081905092915050565b600081519050919050565b600061201d82612007565b6120278185611892565b9350612037818560208601611f95565b612040816112e2565b840191505092915050565b600060208201905081810360008301526120658184612012565b90509291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212207ebcb85484b005a11a339917a56663c5d4f172254dfb66e8fb9123d1fb55426364736f6c63430008110033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
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
            readonly indexed: false;
            readonly internalType: "uint8";
            readonly name: "version";
            readonly type: "uint8";
        }];
        readonly name: "Initialized";
        readonly type: "event";
    }, {
        readonly anonymous: false;
        readonly inputs: readonly [{
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "previousOwner";
            readonly type: "address";
        }, {
            readonly indexed: true;
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "OwnershipTransferred";
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
    }, {
        readonly inputs: readonly [];
        readonly name: "epochManager";
        readonly outputs: readonly [{
            readonly internalType: "contract IEpochManager";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "factory";
        readonly outputs: readonly [{
            readonly internalType: "contract IFactory";
            readonly name: "";
            readonly type: "address";
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
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "fluenceToken_";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "withdrawTimeout_";
            readonly type: "uint256";
        }, {
            readonly internalType: "contract IEpochManager";
            readonly name: "epochManager_";
            readonly type: "address";
        }];
        readonly name: "initialize";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "matcher";
        readonly outputs: readonly [{
            readonly internalType: "contract IMatcher";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "proxiableUUID";
        readonly outputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "renounceOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IEpochManager";
            readonly name: "epochManager_";
            readonly type: "address";
        }];
        readonly name: "setEpochManager";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IFactory";
            readonly name: "factory_";
            readonly type: "address";
        }];
        readonly name: "setFactory";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IERC20";
            readonly name: "fluenceToken_";
            readonly type: "address";
        }];
        readonly name: "setFluenceToken";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "contract IMatcher";
            readonly name: "matcher_";
            readonly type: "address";
        }];
        readonly name: "setMatcher";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "withdrawTimeout_";
            readonly type: "uint256";
        }];
        readonly name: "setWithdrawTimeout";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newOwner";
            readonly type: "address";
        }];
        readonly name: "transferOwnership";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newImplementation";
            readonly type: "address";
        }];
        readonly name: "upgradeTo";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newImplementation";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "data";
            readonly type: "bytes";
        }];
        readonly name: "upgradeToAndCall";
        readonly outputs: readonly [];
        readonly stateMutability: "payable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "withdrawTimeout";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): GlobalConfigInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): GlobalConfig;
}
export {};
