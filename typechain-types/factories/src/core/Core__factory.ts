/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type { Core, CoreInterface } from "../../../src/core/Core";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
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
        internalType: "enum ICapacityConst.CapacityConstantType",
        name: "constantType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
    ],
    name: "CapacityConstantUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum IGlobalConst.ConstantType",
        name: "constantType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
    ],
    name: "ConstantUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IDeal",
        name: "dealImpl",
        type: "address",
      },
    ],
    name: "DealImplSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "difficulty",
        type: "bytes32",
      },
    ],
    name: "DifficultyUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newValue",
        type: "uint256",
      },
    ],
    name: "FLTPriceUpdated",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "WhitelistAccessGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "WhitelistAccessRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "activeUnitCount",
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
    name: "calculateRewardPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "capacity",
    outputs: [
      {
        internalType: "contract ICapacity",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentEpoch",
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
    name: "dealFactory",
    outputs: [
      {
        internalType: "contract IDealFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dealImpl",
    outputs: [
      {
        internalType: "contract IDeal",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "difficulty",
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
    name: "epochDuration",
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
    name: "fltCollateralPerUnit",
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
    name: "fltPrice",
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
        internalType: "uint256",
        name: "epoch",
        type: "uint256",
      },
    ],
    name: "getRewardPool",
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
        name: "account",
        type: "address",
      },
    ],
    name: "grantAccess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initTimestamp",
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
        internalType: "uint256",
        name: "epochDuration_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minDepositedEpochs_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minRematchingEpochs_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minProtocolVersion_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxProtocolVersion_",
        type: "uint256",
      },
      {
        internalType: "contract IDeal",
        name: "dealImpl_",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isWhitelistEnabled_",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "fltPrice_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "usdCollateralPerUnit_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "usdTargetRevenuePerEpoch_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minDuration_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minRewardPerEpoch_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxRewardPerEpoch_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "vestingPeriodDuration_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "vestingPeriodCount_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "slashingRate_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minProofsPerEpoch_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxProofsPerEpoch_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawEpochsAfterFailed_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxFailedRatio_",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "difficulty_",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "initRewardPool_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "randomXProxy_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ICapacity",
        name: "capacity_",
        type: "address",
      },
      {
        internalType: "contract IMarket",
        name: "market_",
        type: "address",
      },
      {
        internalType: "contract IDealFactory",
        name: "dealFactory_",
        type: "address",
      },
    ],
    name: "initializeModules",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isApproved",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "market",
    outputs: [
      {
        internalType: "contract IMarket",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxFailedRatio",
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
    name: "maxProofsPerEpoch",
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
    name: "maxProtocolVersion",
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
    name: "maxRewardPerEpoch",
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
    name: "minDealDepositedEpochs",
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
    name: "minDealRematchingEpochs",
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
    name: "minDuration",
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
    name: "minProofsPerEpoch",
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
    name: "minProtocolVersion",
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
    name: "minRewardPerEpoch",
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
    name: "precision",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
    name: "randomXProxy",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeAccess",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "activeUnitCount_",
        type: "uint256",
      },
    ],
    name: "setActiveUnitCount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ICapacityConst.CapacityConstantType",
        name: "constantType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "v",
        type: "uint256",
      },
    ],
    name: "setCapacityConstant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IGlobalConst.ConstantType",
        name: "constantType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "v",
        type: "uint256",
      },
    ],
    name: "setConstant",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IDeal",
        name: "dealImpl_",
        type: "address",
      },
    ],
    name: "setDealImpl",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "difficulty_",
        type: "bytes32",
      },
    ],
    name: "setDifficulty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fltPrice_",
        type: "uint256",
      },
    ],
    name: "setFLTPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "slashingRate",
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
    name: "usdCollateralPerUnit",
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
    name: "usdTargetRevenuePerEpoch",
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
    name: "vestingPeriodCount",
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
    name: "vestingPeriodDuration",
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
    name: "withdrawEpochsAfterFailed",
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
] as const;

const _bytecode =
  "0x60a080604052346100dc57306080526000549060ff8260081c1661008a575060ff8082160361004f575b60405161277390816100e28239608051818181610ed60152818161104f01526113930152f35b60ff90811916176000557f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498602060405160ff8152a138610029565b62461bcd60e51b815260206004820152602760248201527f496e697469616c697a61626c653a20636f6e747261637420697320696e697469604482015266616c697a696e6760c81b6064820152608490fd5b600080fdfe60806040908082526004918236101561001757600080fd5b600092833560e01c92836303eed73e14611a95575082630640d94114611a69578263069f7a6414611a3d5782630ae5e739146119c257826313baa0691461199657826319cae4621461197957826321f39a531461158457826322cafa3a14611558578263280c5e511461152c5782633659cfe61461136c5782633932dbf5146112c85782634469ac9b1461129c5782634f1ef28614610fd65782634ff0876a14610faa5782634ff3dfd614610f7e57826352d1902d14610ec25782635671576114610e965782635c11f4d414610e6a5782635cfa91f414610e4a5782635cfc1a5114610e145782635ff2449114610de857826366aaf7b914610dbc578263673448dd14610d4a5782636daecfbe14610b0e5782636f16797714610ae2578263715018a614610a8a57826372ea4f2314610a5e5782637358c57a14610a325782637667180814610a0e5782637e815381146109e2578263800fe125146109b657826380f556051461098057826385e685311461090857826389e4a0ba146108455782638b2e44d2146107a15782638da5cb5b1461076b578263919f49f91461073557826392fd22b9146106ff578263a376fb91146106d3578263b49b075814610699578263d039ca44146104b0578263d3b5dc3b14610492578263d6a5a04b1461045c578263d6f563d814610364578263dad0189514610338578263e21750901461029657508163e79c627014610266575063f2fde38b1461023757600080fd5b3461026357602036600319011261026357610260610253611abe565b61025b612204565b6121a2565b80f35b80fd5b90503461029257816003193601126102925760209060008051602061239e833981519152549051908152f35b5080fd5b90915034610334576020366003190112610334577fd1deff9e525a11d14a1263bcc0b80d6863292470cc5c6e5c433dfdeaa7ef0e2d9160209135906102d9612204565b8160008051602061241e8339815191525561030360008051602061231e8339815191525483611f81565b61031c8260008051602061223e83398151915254611eeb565b6000805160206123fe8339815191525551908152a180f35b8280fd5b8382346102925781600319360112610292576020906000805160206126be833981519152549051908152f35b8382346102925780600319360112610292578235838110156103345760243561038b612204565b8391806103ed578160008051602061227e833981519152555b8351926103da577f201e1b27d7e31716378e28dd51ab57b07c4387abf9d578358af3b12737872f0e94955082526020820152a180f35b634e487b7160e01b855260218652602485fd5b8492506001810361040e57816000805160206124be833981519152556103a4565b835162461bcd60e51b8152602081880152602260248201527f476c6f62616c436f6e73743a20756e6b6e6f776e20636f6e7374616e74207479604482015261706560f01b6064820152608490fd5b8382346102925781600319360112610292576000805160206125fe8339815191525490516001600160a01b039091168152602090f35b83823461029257816003193601126102925760209051629896808152f35b90915034610334576060366003190112610334576001600160a01b0391813583811691908290036106955760243591848316809303610691576044359385851680950361068d576104ff612204565b6000805160206122be8339815191529283549687166106405782156105fd5784156105bb57851561056d5750506001600160a01b031994851617905560008051602061233e83398151915280548416909117905560008051602061237e833981519152805490921617905580f35b906020608492519162461bcd60e51b8352820152602260248201527f436f72653a206465616c20666163746f7279206973207a65726f206164647265604482015261737360f01b6064820152fd5b906020606492519162461bcd60e51b8352820152601c60248201527b436f72653a206d61726b6574206973207a65726f206164647265737360201b6044820152fd5b906020606492519162461bcd60e51b8352820152601e60248201527f436f72653a206361706163697479206973207a65726f206164647265737300006044820152fd5b906020608492519162461bcd60e51b8352820152602160248201527f436f72653a206d6f64756c657320616c726561647920696e697469616c697a656044820152601960fa1b6064820152fd5b8680fd5b8580fd5b8480fd5b833461026357806003193601126102635761026060008051602061241e8339815191525460008051602061231e8339815191525490611f81565b8382346102925781600319360112610292576020906000805160206125de833981519152549051908152f35b83823461029257816003193601126102925760008051602061237e8339815191525490516001600160a01b039091168152602090f35b8382346102925781600319360112610292576000805160206123be8339815191525490516001600160a01b039091168152602090f35b8382346102925781600319360112610292576000805160206125be8339815191525490516001600160a01b039091168152602090f35b90915034610334576020366003190112610334576000805160206122be83398151915254813592906001600160a01b031633036108035783610260848060008051602061231e8339815191525560008051602061241e83398151915254611f81565b906020606492519162461bcd60e51b8352820152601c60248201527b436f72653a2063616c6c6572206973206e6f7420636170616369747960201b6044820152fd5b91503461033457602036600319011261033457610860611abe565b610868612204565b6001600160a01b031691823b156108b457506000805160206125fe83398151915280546001600160a01b031916831790555190815260008051602061225e83398151915290602090a180f35b6020608492519162461bcd60e51b8352820152602960248201527f4e6577206465616c20696d706c656d656e746174696f6e206973206e6f7420616044820152680818dbdb9d1c9858dd60ba1b6064820152fd5b8382346102925760203660031901126102925760207fbf16401515c3259ef6fd204d106ff51a2a7185ecd4e3ed51d42612a218fc8c7791610947611abe565b61094f612204565b6001600160a01b031680855260008051602061265e8339815191528352818520805460ff191690559051908152a180f35b83823461029257816003193601126102925760008051602061233e8339815191525490516001600160a01b039091168152602090f35b8382346102925781600319360112610292576020906000805160206122fe833981519152549051908152f35b83823461029257816003193601126102925760209060008051602061231e833981519152549051908152f35b838234610292578160031936011261029257602090610a2b612162565b9051908152f35b8382346102925781600319360112610292576020906000805160206126fe833981519152549051908152f35b83823461029257816003193601126102925760209060008051602061227e833981519152549051908152f35b8334610263578060031936011261026357610aa3612204565b6000805160206125be83398151915280546001600160a01b0319811690915581906001600160a01b031660008051602061255e8339815191528280a380f35b8382346102925781600319360112610292576020906000805160206123de833981519152549051908152f35b8382346102925780600319360112610292578235600a81101561033457602435610b36612204565b839180610b85578160008051602061267e833981519152555b8351926103da577f12ef687a8e3257309ee19f0dd17e311b1e2d18c1d585528c4116af913b0c4af794955082526020820152a180f35b84925060018103610bd0578160008051602061223e83398151915255610bba60008051602061241e8339815191525483611eeb565b6000805160206123fe833981519152555b610b4f565b84925060028103610bf1578160008051602061271e83398151915255610b4f565b84925060038103610c1257816000805160206123de83398151915255610b4f565b849250858103610c3257816000805160206125de83398151915255610b4f565b84925060058103610c77578160008051602061235e83398151915255610bcb60008051602061241e8339815191525460008051602061231e8339815191525490611f81565b84925060068103610c98578160008051602061251e83398151915255610b4f565b84925060078103610cb957816000805160206122fe83398151915255610b4f565b84925060088103610cda578160008051602061239e83398151915255610b4f565b84925060098103610cfb57816000805160206124de83398151915255610b4f565b835162461bcd60e51b81526020818801526024808201527f4361706163697479436f6e73743a20756e6b6e6f776e20636f6e7374616e74206044820152637479706560e01b6064820152608490fd5b8382346102925760203660031901126102925790602091610d69611abe565b9160ff60008051602061259e833981519152541615928315610d90575b5050519015158152f35b6001600160a01b0316815260008051602061265e83398151915284528190205460ff1691508380610d86565b83823461029257816003193601126102925760209060008051602061235e833981519152549051908152f35b83823461029257816003193601126102925760209060008051602061241e833981519152549051908152f35b8382346102925781600319360112610292576000805160206122be8339815191525490516001600160a01b039091168152602090f35b9083346102635760203660031901126102635750610a2b60209235611e0a565b83823461029257816003193601126102925760209060008051602061251e833981519152549051908152f35b83823461029257816003193601126102925760209060008051602061267e833981519152549051908152f35b8334610263578060031936011261026357507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03163003610f1b57602082516000805160206124fe8339815191528152f35b6020608492519162461bcd60e51b8352820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c6044820152771b1959081d1a1c9bdd59da0819195b1959d85d1958d85b1b60421b6064820152fd5b8382346102925781600319360112610292576020906000805160206123fe833981519152549051908152f35b83823461029257816003193601126102925760209060008051602061245e833981519152549051908152f35b91508060031936011261033457610feb611abe565b90602435906001600160401b0382116106955736602383011215610695578184013561101681611b48565b61102283519182611b25565b81815286602094858301933660248284010111610334578060248893018637830101526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169061107d30831415611b63565b61109a6000805160206124fe833981519152928284541614611bb2565b6110a2612204565b60008051602061229e8339815191525460ff16156110ca575050505050506102609150611c01565b869293949596169085516352d1902d60e01b815287818a81865afa8a9181611269575b5061113a57865162461bcd60e51b8152808a01899052602e60248201526000805160206126de83398151915260448201526d6f6e206973206e6f74205555505360901b6064820152608490fd5b979192939695949703611214575061115182611c01565b60008051602061257e8339815191528780a28584511580159061120c575b61117d575b50505050505080f35b806111f69684519661118e88611b0a565b602788527f416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c87890152660819985a5b195960ca1b868901525190845af4913d15611202573d6111e86111df82611b48565b92519283611b25565b81528681943d92013e611c91565b50388080808085611174565b5060609250611c91565b50600161116f565b835162461bcd60e51b8152908101859052602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b6064820152608490fd5b9091508881813d8311611295575b6112818183611b25565b81010312611291575190386110ed565b8a80fd5b503d611277565b83823461029257816003193601126102925760209060008051602061261e833981519152549051908152f35b838234610292576020366003190112610292578235906112e6612204565b8160008051602061243e833981519152805460008051602061253e8339815191525555611311612162565b600181018091116113595760008051602061269e83398151915255519081527f0b5731e9746c6761d5cc9e62a3f59221163bf9ea25d7eb047f33913153f23c9790602090a180f35b634e487b7160e01b845260118552602484fd5b9150346103345760208060031936011261152857611388611abe565b916001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166113c030821415611b63565b6113dd6000805160206124fe833981519152918383541614611bb2565b6113e5612204565b8251848101929091906001600160401b038411838510176115155783855288835260008051602061229e8339815191525460ff161561142e575050505050506102609150611c01565b869293949596169085516352d1902d60e01b815287818a81865afa8a91816114e6575b5061149e57865162461bcd60e51b8152808a01899052602e60248201526000805160206126de83398151915260448201526d6f6e206973206e6f74205555505360901b6064820152608490fd5b97919293969594970361121457506114b582611c01565b60008051602061257e8339815191528780a2858451158015906114df5761117d5750505050505080f35b508061116f565b9091508881813d831161150e575b6114fe8183611b25565b8101031261129157519038611451565b503d6114f4565b634e487b7160e01b895260418852602489fd5b8380fd5b8382346102925781600319360112610292576020906000805160206124de833981519152549051908152f35b83823461029257816003193601126102925760209060008051602061223e833981519152549051908152f35b90915034610334576102e03660031901126103345760a4356001600160a01b03818116918290036106955760c435928315158094036106915760e43590610104359061028435906102c4359485168095036119755788549660ff808960081c16159889809a611969575b8015611953575b156118f95760008051602061225e8339815191529896938a6020999794848f9561187d999661170f9660ff199560018783161783556118e8575b5061164882825460081c1661164381612102565b612102565b611651336121a2565b5460081c169361166085612102565b426000805160206126fe833981519152553560008051602061245e8339815191525561168b84612102565b60243560008051602061227e833981519152556044356000805160206124be8339815191525560643560008051602061261e8339815191525560843560008051602061263e833981519152556116e084612102565b6116e984612102565b6116f284612102565b60008051602061259e833981519152928354169116179055612102565b6101443560008051602061267e8339815191525560008051602061223e8339815191528290556101e43560008051602061271e83398151915255610244356000805160206123de83398151915255610264356000805160206125de833981519152556101243560008051602061235e833981519152556101643560008051602061251e83398151915255610184356000805160206122fe833981519152556101a43560008051602061249e833981519152556101c4356000805160206126be833981519152556102043560008051602061239e83398151915255610224356000805160206124de8339815191525560008051602061253e83398151915281905560008051602061243e833981519152556000805160206123be83398151915280546001600160a01b0319908116909517905561186761184c612162565b8a519061185882611ad9565b81526102a43588820152611f28565b8160008051602061241e83398151915255611eeb565b6000805160206123fe83398151915255816000805160206125fe833981519152918254161790558451908152a16118b2575080f35b60207f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989161ff001984541684555160018152a180f35b61ffff19166101011781553861162f565b8a5162461bcd60e51b8152602081860152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608490fd5b50303b1580156115f557506001828216146115f5565b506001828216106115ee565b8880fd5b838234610292578160031936011261029257602090610a2b611d65565b83823461029257816003193601126102925760209060008051602061271e833981519152549051908152f35b8382346102925760203660031901126102925760207fab9a16269e54e8ae681de331f196f57a4b158e28d53818a27ff5e5698e29174991611a01611abe565b611a09612204565b6001600160a01b031680855260008051602061265e8339815191528352818520805460ff191660011790559051908152a180f35b8382346102925781600319360112610292576020906000805160206124be833981519152549051908152f35b83823461029257816003193601126102925760209060008051602061249e833981519152549051908152f35b84903461029257816003193601126102925760209060008051602061263e833981519152548152f35b600435906001600160a01b0382168203611ad457565b600080fd5b604081019081106001600160401b03821117611af457604052565b634e487b7160e01b600052604160045260246000fd5b606081019081106001600160401b03821117611af457604052565b601f909101601f19168101906001600160401b03821190821017611af457604052565b6001600160401b038111611af457601f01601f191660200190565b15611b6a57565b60405162461bcd60e51b815260206004820152602c602482015260008051602061247e83398151915260448201526b19195b1959d85d1958d85b1b60a21b6064820152608490fd5b15611bb957565b60405162461bcd60e51b815260206004820152602c602482015260008051602061247e83398151915260448201526b6163746976652070726f787960a01b6064820152608490fd5b803b15611c36576000805160206124fe83398151915280546001600160a01b0319166001600160a01b03909216919091179055565b60405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608490fd5b91929015611cf35750815115611ca5575090565b3b15611cae5790565b60405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606490fd5b825190915015611d065750805190602001fd5b6040519062461bcd60e51b82528160208060048301528251908160248401526000935b828510611d4c575050604492506000838284010152601f80199101168101030190fd5b8481018201518686016044015293810193859350611d29565b611d6d612162565b60008051602061269e833981519152541115611d965760008051602061253e8339815191525490565b60008051602061243e8339815191525490565b8115611db3570490565b634e487b7160e01b600052601260045260246000fd5b6000805160206122de8339815191528054821015611df45760005260206000209060011b0190600090565b634e487b7160e01b600052603260045260246000fd5b6000805160206122de833981519152546000801991828101908111611ed75791909182935b81841115611e3e575050505090565b9091929382850194858111611e8557600195861c91611e5c83611dc9565b50918254808611600014611e9b57505050850154948101809111611e8557915b90929192611e2f565b634e487b7160e01b600052601160045260246000fd5b91979095509190841015611ecc57505083810190811115611e7c57634e487b7160e01b600052601160045260246000fd5b015495945050505050565b634e487b7160e01b82526011600452602482fd5b629896809182820291808304841490151715611e8557611f0a91611da9565b670de0b6b3a764000090818102918183041490151715611e85570490565b6000805160206122de8339815191528054600160401b811015611af457611f5491600182019055611dc9565b919091611f6b576020816001925184550151910155565b634e487b7160e01b600052600060045260246000fd5b90611f8a612162565b6000805160206122de8339815191525482156120fc5760001981019260008285116120d45750611fb984611dc9565b5080548414929083156120f05750600281106120e8576001198101908111611e8557611fe6600191611dc9565b500154905b8582029082159683830414871715611e855761200691611da9565b60009060008051602061235e8339815191525410600014612094575060008051602061251e833981519152549462895440808302928304141715611e85576298968090049380851061208c575b505b1561206b5750612066600191611dc9565b500155565b905061208a916040519161207e83611ad9565b82526020820152611f28565b565b935038612053565b6000805160206122fe833981519152549562a7d8c08084029384041417156120d45750629896809004938085116120cc575b50612055565b9350386120c6565b634e487b7160e01b81526011600452602490fd5b505050505050565b60019150015490611feb565b50505050565b1561210957565b60405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608490fd5b6000805160206126fe833981519152544203428111611e855760008051602061245e8339815191525461219491611da9565b60010180600111611e855790565b6001600160a01b039081169081156121eb576000805160206125be83398151915280546001600160a01b0319811684179091551660008051602061255e833981519152600080a3565b604051631e4fbdf760e01b815260006004820152602490fd5b6000805160206125be833981519152546001600160a01b0316330361222557565b60405163118cdaa760e01b8152336004820152602490fdfe8984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fd57af5c74f6888b661f9fb5dd1005c495f8e7d547682930c3dd1697dad117f69fc60ac4d56f7e69877e4b95a6e91f4b3612278b580a93ea7637885a480e01503184910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91432aa6b2026f27b721aa31227fdbd84cf04c442933bec8e7f3be70f27c62fe42a08984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fe48984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fe18984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fd32aa6b2026f27b721aa31227fdbd84cf04c442933bec8e7f3be70f27c62fe42a18984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fdf2aa6b2026f27b721aa31227fdbd84cf04c442933bec8e7f3be70f27c62fe42a38984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fda8984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fd28984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fd88984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fd68984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fd18984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fdd7d4f8ec43464738265ced6b7ed5f90007e9b7c34318bdd82d9249328b50bd35846756e6374696f6e206d7573742062652063616c6c6564207468726f756768208984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fe260ac4d56f7e69877e4b95a6e91f4b3612278b580a93ea7637885a480e01503198984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fdb360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc8984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fe08984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fdc8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0bc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b1f364d5cd815a7922b0808e606a82391642c337151b3addb3f98eaf82cfb172eb13d3e7783d509d8d65d3e1e62ec0b103a07e0cbfa1ee74ae19127f297dddfcc8984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fd92aa6b2026f27b721aa31227fdbd84cf04c442933bec8e7f3be70f27c62fe42a260ac4d56f7e69877e4b95a6e91f4b3612278b580a93ea7637885a480e015031a60ac4d56f7e69877e4b95a6e91f4b3612278b580a93ea7637885a480e015031b1f364d5cd815a7922b0808e606a82391642c337151b3addb3f98eaf82cfb172f8984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fd48984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fde8984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fe345524331393637557067726164653a206e657720696d706c656d656e746174697d4f8ec43464738265ced6b7ed5f90007e9b7c34318bdd82d9249328b50bd3578984d2d0d7a9f2f70f22692c7c8344aa50cbed8c00a03c924457a31793ee8fd7a26469706673582212202d66f3a5feb81b1243e96012ef75e1916892279371e032ecc2f7d2c7f24436da64736f6c63430008130033";

type CoreConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CoreConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Core__factory extends ContractFactory {
  constructor(...args: CoreConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      Core & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Core__factory {
    return super.connect(runner) as Core__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CoreInterface {
    return new Interface(_abi) as CoreInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Core {
    return new Contract(address, _abi, runner) as unknown as Core;
  }
}