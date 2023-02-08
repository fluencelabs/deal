"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Core__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "previousAdmin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "newAdmin",
                type: "address",
            },
        ],
        name: "AdminChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "beacon",
                type: "address",
            },
        ],
        name: "BeaconUpgraded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint8",
                name: "version",
                type: "uint8",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "implementation",
                type: "address",
            },
        ],
        name: "Upgraded",
        type: "event",
    },
    {
        inputs: [],
        name: "aquaProxy",
        outputs: [
            {
                internalType: "contract AquaProxy",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "epochDelayForReward",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "epochManager",
        outputs: [
            {
                internalType: "contract EpochManager",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "fluenceToken",
        outputs: [
            {
                internalType: "contract IERC20",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IERC20",
                name: "fluenceToken_",
                type: "address",
            },
            {
                internalType: "contract AquaProxy",
                name: "aquaProxy_",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "withdrawTimeout_",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "epochDelayForReward_",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "slashFactor_",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "updateSettingsTimeout_",
                type: "uint256",
            },
            {
                internalType: "contract EpochManager",
                name: "epochManager_",
                type: "address",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "minAmountOfEpochsForReward",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "proxiableUUID",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract AquaProxy",
                name: "aquaProxy_",
                type: "address",
            },
        ],
        name: "setAquaProxy",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "epochDelayForReward_",
                type: "uint256",
            },
        ],
        name: "setEpochDelayForReward",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract EpochManager",
                name: "epochManager_",
                type: "address",
            },
        ],
        name: "setEpochManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IERC20",
                name: "fluenceToken_",
                type: "address",
            },
        ],
        name: "setFluenceToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "minAmountOfEpochsForReward_",
                type: "uint256",
            },
        ],
        name: "setMinAmountOfEpochsForReward",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "slashFactor_",
                type: "uint256",
            },
        ],
        name: "setSlashFactor",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "updateSettingsTimeout_",
                type: "uint256",
            },
        ],
        name: "setUpdateSettingsTimeout",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "withdrawTimeout_",
                type: "uint256",
            },
        ],
        name: "setWithdrawTimeout",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "slashFactor",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "updateSettingsTimeout",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newImplementation",
                type: "address",
            },
        ],
        name: "upgradeTo",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newImplementation",
                type: "address",
            },
            {
                internalType: "bytes",
                name: "data",
                type: "bytes",
            },
        ],
        name: "upgradeToAndCall",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "withdrawTimeout",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
const _bytecode = "0x60a06040523073ffffffffffffffffffffffffffffffffffffffff1660809073ffffffffffffffffffffffffffffffffffffffff1681525034801561004357600080fd5b5060805161220061007b600039600081816104eb01528181610579015281816106730152818161070101526107b101526122006000f3fe6080604052600436106101405760003560e01c806385079cd7116100b6578063ae2598fc1161006f578063ae2598fc146103ed578063b8b3654714610416578063bc4dba0214610441578063d4d59edb1461046c578063e2d2bfe314610495578063f2fde38b146104c057610140565b806385079cd7146102ef5780638a507d871461031a5780638c0fc534146103435780638da5cb5b1461036c5780639c15d1a214610397578063ac027f97146103c257610140565b80635a96fecc116101085780635a96fecc14610209578063715018a614610232578063729414601461024957806372bf0dd31461027257806373b517fc1461029b57806383a5041c146102c657610140565b80633659cfe6146101455780634f1ef2861461016e57806352d1902d1461018a57806353d6e100146101b557806359090910146101de575b600080fd5b34801561015157600080fd5b5061016c6004803603810190610167919061145f565b6104e9565b005b610188600480360381019061018391906115d2565b610671565b005b34801561019657600080fd5b5061019f6107ad565b6040516101ac9190611647565b60405180910390f35b3480156101c157600080fd5b506101dc60048036038101906101d791906116a0565b610866565b005b3480156101ea57600080fd5b506101f36108b2565b60405161020091906116e6565b60405180910390f35b34801561021557600080fd5b50610230600480360381019061022b919061173f565b6108b8565b005b34801561023e57600080fd5b50610247610904565b005b34801561025557600080fd5b50610270600480360381019061026b9190611798565b610918565b005b34801561027e57600080fd5b5061029960048036038101906102949190611798565b61092a565b005b3480156102a757600080fd5b506102b061093c565b6040516102bd91906116e6565b60405180910390f35b3480156102d257600080fd5b506102ed60048036038101906102e89190611803565b610942565b005b3480156102fb57600080fd5b50610304610b66565b6040516103119190611904565b60405180910390f35b34801561032657600080fd5b50610341600480360381019061033c9190611798565b610b8c565b005b34801561034f57600080fd5b5061036a60048036038101906103659190611798565b610b9e565b005b34801561037857600080fd5b50610381610bb0565b60405161038e919061192e565b60405180910390f35b3480156103a357600080fd5b506103ac610bda565b6040516103b991906116e6565b60405180910390f35b3480156103ce57600080fd5b506103d7610be0565b6040516103e4919061196a565b60405180910390f35b3480156103f957600080fd5b50610414600480360381019061040f9190611798565b610c06565b005b34801561042257600080fd5b5061042b610c18565b60405161043891906116e6565b60405180910390f35b34801561044d57600080fd5b50610456610c1e565b60405161046391906116e6565b60405180910390f35b34801561047857600080fd5b50610493600480360381019061048e9190611985565b610c24565b005b3480156104a157600080fd5b506104aa610c70565b6040516104b791906119d3565b60405180910390f35b3480156104cc57600080fd5b506104e760048036038101906104e2919061145f565b610c96565b005b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff1603610577576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161056e90611a71565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166105b6610d19565b73ffffffffffffffffffffffffffffffffffffffff161461060c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060390611b03565b60405180910390fd5b61061581610d70565b61066e81600067ffffffffffffffff811115610634576106336114a7565b5b6040519080825280601f01601f1916602001820160405280156106665781602001600182028036833780820191505090505b506000610d73565b50565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff16036106ff576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106f690611a71565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1661073e610d19565b73ffffffffffffffffffffffffffffffffffffffff1614610794576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078b90611b03565b60405180910390fd5b61079d82610d70565b6107a982826001610d73565b5050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163073ffffffffffffffffffffffffffffffffffffffff161461083d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161083490611b95565b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b905090565b61086e610ee1565b80606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b606b5481565b6108c0610ee1565b80606660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61090c610ee1565b6109166000610f5f565b565b610920610ee1565b8060678190555050565b610932610ee1565b80606b8190555050565b60685481565b60008060019054906101000a900460ff161590508080156109735750600160008054906101000a900460ff1660ff16105b806109a0575061098230611025565b15801561099f5750600160008054906101000a900460ff1660ff16145b5b6109df576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109d690611c27565b60405180910390fd5b60016000806101000a81548160ff021916908360ff1602179055508015610a1c576001600060016101000a81548160ff0219169083151502179055505b87606560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555086606660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550856067819055508460688190555083606a8190555082606b8190555081606c60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610b03611048565b8015610b5c5760008060016101000a81548160ff0219169083151502179055507f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024986001604051610b539190611c8f565b60405180910390a15b5050505050505050565b606660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610b94610ee1565b80606a8190555050565b610ba6610ee1565b8060688190555050565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60675481565b606560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610c0e610ee1565b8060698190555050565b60695481565b606a5481565b610c2c610ee1565b80606c60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b606c60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610c9e610ee1565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610d0d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d0490611d1c565b60405180910390fd5b610d1681610f5f565b50565b6000610d477f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b6110a1565b60000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b50565b610d9f7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd914360001b6110ab565b60000160009054906101000a900460ff1615610dc357610dbe836110b5565b610edc565b8273ffffffffffffffffffffffffffffffffffffffff166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610e2b57506040513d601f19601f82011682018060405250810190610e289190611d68565b60015b610e6a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e6190611e07565b60405180910390fd5b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b8114610ecf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ec690611e99565b60405180910390fd5b50610edb83838361116e565b5b505050565b610ee961119a565b73ffffffffffffffffffffffffffffffffffffffff16610f07610bb0565b73ffffffffffffffffffffffffffffffffffffffff1614610f5d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f5490611f05565b60405180910390fd5b565b6000603360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081603360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600060019054906101000a900460ff16611097576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161108e90611f97565b60405180910390fd5b61109f6111a2565b565b6000819050919050565b6000819050919050565b6110be81611203565b6110fd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110f490612029565b60405180910390fd5b8061112a7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc60001b6110a1565b60000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61117783611226565b6000825111806111845750805b15611195576111938383611275565b505b505050565b600033905090565b600060019054906101000a900460ff166111f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111e890611f97565b60405180910390fd5b6112016111fc61119a565b610f5f565b565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b61122f816110b5565b8073ffffffffffffffffffffffffffffffffffffffff167fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b60405160405180910390a250565b606061129a83836040518060600160405280602781526020016121a4602791396112a2565b905092915050565b60606000808573ffffffffffffffffffffffffffffffffffffffff16856040516112cc91906120ba565b600060405180830381855af49150503d8060008114611307576040519150601f19603f3d011682016040523d82523d6000602084013e61130c565b606091505b509150915061131d86838387611328565b925050509392505050565b6060831561138a5760008351036113825761134285611203565b611381576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113789061211d565b60405180910390fd5b5b829050611395565b611394838361139d565b5b949350505050565b6000825111156113b05781518083602001fd5b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113e49190612181565b60405180910390fd5b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061142c82611401565b9050919050565b61143c81611421565b811461144757600080fd5b50565b60008135905061145981611433565b92915050565b600060208284031215611475576114746113f7565b5b60006114838482850161144a565b91505092915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6114df82611496565b810181811067ffffffffffffffff821117156114fe576114fd6114a7565b5b80604052505050565b60006115116113ed565b905061151d82826114d6565b919050565b600067ffffffffffffffff82111561153d5761153c6114a7565b5b61154682611496565b9050602081019050919050565b82818337600083830152505050565b600061157561157084611522565b611507565b90508281526020810184848401111561159157611590611491565b5b61159c848285611553565b509392505050565b600082601f8301126115b9576115b861148c565b5b81356115c9848260208601611562565b91505092915050565b600080604083850312156115e9576115e86113f7565b5b60006115f78582860161144a565b925050602083013567ffffffffffffffff811115611618576116176113fc565b5b611624858286016115a4565b9150509250929050565b6000819050919050565b6116418161162e565b82525050565b600060208201905061165c6000830184611638565b92915050565b600061166d82611421565b9050919050565b61167d81611662565b811461168857600080fd5b50565b60008135905061169a81611674565b92915050565b6000602082840312156116b6576116b56113f7565b5b60006116c48482850161168b565b91505092915050565b6000819050919050565b6116e0816116cd565b82525050565b60006020820190506116fb60008301846116d7565b92915050565b600061170c82611421565b9050919050565b61171c81611701565b811461172757600080fd5b50565b60008135905061173981611713565b92915050565b600060208284031215611755576117546113f7565b5b60006117638482850161172a565b91505092915050565b611775816116cd565b811461178057600080fd5b50565b6000813590506117928161176c565b92915050565b6000602082840312156117ae576117ad6113f7565b5b60006117bc84828501611783565b91505092915050565b60006117d082611421565b9050919050565b6117e0816117c5565b81146117eb57600080fd5b50565b6000813590506117fd816117d7565b92915050565b600080600080600080600060e0888a031215611822576118216113f7565b5b60006118308a828b0161168b565b97505060206118418a828b0161172a565b96505060406118528a828b01611783565b95505060606118638a828b01611783565b94505060806118748a828b01611783565b93505060a06118858a828b01611783565b92505060c06118968a828b016117ee565b91505092959891949750929550565b6000819050919050565b60006118ca6118c56118c084611401565b6118a5565b611401565b9050919050565b60006118dc826118af565b9050919050565b60006118ee826118d1565b9050919050565b6118fe816118e3565b82525050565b600060208201905061191960008301846118f5565b92915050565b61192881611421565b82525050565b6000602082019050611943600083018461191f565b92915050565b6000611954826118d1565b9050919050565b61196481611949565b82525050565b600060208201905061197f600083018461195b565b92915050565b60006020828403121561199b5761199a6113f7565b5b60006119a9848285016117ee565b91505092915050565b60006119bd826118d1565b9050919050565b6119cd816119b2565b82525050565b60006020820190506119e860008301846119c4565b92915050565b600082825260208201905092915050565b7f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060008201527f64656c656761746563616c6c0000000000000000000000000000000000000000602082015250565b6000611a5b602c836119ee565b9150611a66826119ff565b604082019050919050565b60006020820190508181036000830152611a8a81611a4e565b9050919050565b7f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060008201527f6163746976652070726f78790000000000000000000000000000000000000000602082015250565b6000611aed602c836119ee565b9150611af882611a91565b604082019050919050565b60006020820190508181036000830152611b1c81611ae0565b9050919050565b7f555550535570677261646561626c653a206d757374206e6f742062652063616c60008201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000602082015250565b6000611b7f6038836119ee565b9150611b8a82611b23565b604082019050919050565b60006020820190508181036000830152611bae81611b72565b9050919050565b7f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160008201527f647920696e697469616c697a6564000000000000000000000000000000000000602082015250565b6000611c11602e836119ee565b9150611c1c82611bb5565b604082019050919050565b60006020820190508181036000830152611c4081611c04565b9050919050565b6000819050919050565b600060ff82169050919050565b6000611c79611c74611c6f84611c47565b6118a5565b611c51565b9050919050565b611c8981611c5e565b82525050565b6000602082019050611ca46000830184611c80565b92915050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b6000611d066026836119ee565b9150611d1182611caa565b604082019050919050565b60006020820190508181036000830152611d3581611cf9565b9050919050565b611d458161162e565b8114611d5057600080fd5b50565b600081519050611d6281611d3c565b92915050565b600060208284031215611d7e57611d7d6113f7565b5b6000611d8c84828501611d53565b91505092915050565b7f45524331393637557067726164653a206e657720696d706c656d656e7461746960008201527f6f6e206973206e6f742055555053000000000000000000000000000000000000602082015250565b6000611df1602e836119ee565b9150611dfc82611d95565b604082019050919050565b60006020820190508181036000830152611e2081611de4565b9050919050565b7f45524331393637557067726164653a20756e737570706f727465642070726f7860008201527f6961626c65555549440000000000000000000000000000000000000000000000602082015250565b6000611e836029836119ee565b9150611e8e82611e27565b604082019050919050565b60006020820190508181036000830152611eb281611e76565b9050919050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b6000611eef6020836119ee565b9150611efa82611eb9565b602082019050919050565b60006020820190508181036000830152611f1e81611ee2565b9050919050565b7f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960008201527f6e697469616c697a696e67000000000000000000000000000000000000000000602082015250565b6000611f81602b836119ee565b9150611f8c82611f25565b604082019050919050565b60006020820190508181036000830152611fb081611f74565b9050919050565b7f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60008201527f6f74206120636f6e747261637400000000000000000000000000000000000000602082015250565b6000612013602d836119ee565b915061201e82611fb7565b604082019050919050565b6000602082019050818103600083015261204281612006565b9050919050565b600081519050919050565b600081905092915050565b60005b8381101561207d578082015181840152602081019050612062565b60008484015250505050565b600061209482612049565b61209e8185612054565b93506120ae81856020860161205f565b80840191505092915050565b60006120c68284612089565b915081905092915050565b7f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000600082015250565b6000612107601d836119ee565b9150612112826120d1565b602082019050919050565b60006020820190508181036000830152612136816120fa565b9050919050565b600081519050919050565b60006121538261213d565b61215d81856119ee565b935061216d81856020860161205f565b61217681611496565b840191505092915050565b6000602082019050818103600083015261219b8184612148565b90509291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220ff0cbc85ff306c9059b38dce7bd30ab926f49f9077559155b718195e9bee256264736f6c63430008110033";
const isSuperArgs = (xs) => xs.length > 1;
class Core__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.Core__factory = Core__factory;
Core__factory.bytecode = _bytecode;
Core__factory.abi = _abi;
