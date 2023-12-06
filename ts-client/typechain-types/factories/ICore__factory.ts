/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type { ICore, ICoreInterface } from "../ICore";

const _abi = [
  {
    type: "function",
    name: "addComputePeers",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "peers",
        type: "tuple[]",
        internalType: "struct IMarket.RegisterComputePeer[]",
        components: [
          {
            name: "peerId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "unitCount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addComputeUnits",
    inputs: [
      {
        name: "peerId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "unitCount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addEffector",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "newEffectors",
        type: "tuple[]",
        internalType: "struct CIDV1[]",
        components: [
          {
            name: "prefixes",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "hash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ccActiveUnitCount",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ccMaxFailedRatio",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ccSlashingRate",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ccVestingDuration",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "ccWithdrawEpochesAfterFailed",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "changeMinPricePerWorkerEpoch",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "newMinPricePerWorkerEpoch",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changePaymentToken",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "newPaymentToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "currentEpoch",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "fltCCCollateralPerUnit",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "fltCCTargetRevenuePerEpoch",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "fltPrice",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "fluenceToken",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCCRewardPool",
    inputs: [
      {
        name: "epoch",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getComputePeer",
    inputs: [
      {
        name: "peerId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IMarket.ComputePeer",
        components: [
          {
            name: "offerId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "commitmentId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "unitCount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getComputeUnit",
    inputs: [
      {
        name: "unitId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IMarket.ComputeUnit",
        components: [
          {
            name: "index",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "deal",
            type: "address",
            internalType: "address",
          },
          {
            name: "peerId",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOffer",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IMarket.Offer",
        components: [
          {
            name: "provider",
            type: "address",
            internalType: "address",
          },
          {
            name: "minPricePerWorkerEpoch",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "paymentToken",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maxCCProofsPerEpoch",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maxCCRewardPerEpoch",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minCCDuration",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minCCRequierdProofsPerEpoch",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minCCRewardPerEpoch",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minDealDepositedEpoches",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minDealRematchingEpoches",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registerMarketOffer",
    inputs: [
      {
        name: "minPricePerWorkerEpoch",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "paymentToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "effectors",
        type: "tuple[]",
        internalType: "struct CIDV1[]",
        components: [
          {
            name: "prefixes",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "hash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
      {
        name: "peers",
        type: "tuple[]",
        internalType: "struct IMarket.RegisterComputePeer[]",
        components: [
          {
            name: "peerId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "unitCount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "owner",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "offerId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeComputeUnit",
    inputs: [
      {
        name: "unitId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "lastUnitId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeEffector",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "effectors",
        type: "tuple[]",
        internalType: "struct CIDV1[]",
        components: [
          {
            name: "prefixes",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "hash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "returnComputeUnitFromDeal",
    inputs: [
      {
        name: "unitId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setCCConstant",
    inputs: [
      {
        name: "constantType",
        type: "uint8",
        internalType: "enum IGlobalConst.CCConstantType",
      },
      {
        name: "v",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setDealConstant",
    inputs: [
      {
        name: "constantType",
        type: "uint8",
        internalType: "enum IGlobalConst.DealConstantType",
      },
      {
        name: "v",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setFLTPrice",
    inputs: [
      {
        name: "fltPrice_",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "usdCCCollateralPerUnit",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "usdCCTargetRevenuePerEpoch",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CCConstantUpdated",
    inputs: [
      {
        name: "constantType",
        type: "uint8",
        indexed: false,
        internalType: "enum IGlobalConst.CCConstantType",
      },
      {
        name: "newValue",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ComputeUnitAddedToDeal",
    inputs: [
      {
        name: "unitId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "deal",
        type: "address",
        indexed: false,
        internalType: "contract IDeal",
      },
      {
        name: "peerId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ComputeUnitCreated",
    inputs: [
      {
        name: "peerId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "unitId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ComputeUnitRemovedFromDeal",
    inputs: [
      {
        name: "unitId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "deal",
        type: "address",
        indexed: false,
        internalType: "contract IDeal",
      },
      {
        name: "peerId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "DealConstantUpdated",
    inputs: [
      {
        name: "constantType",
        type: "uint8",
        indexed: false,
        internalType: "enum IGlobalConst.DealConstantType",
      },
      {
        name: "newValue",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EffectorAdded",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "effector",
        type: "tuple",
        indexed: false,
        internalType: "struct CIDV1",
        components: [
          {
            name: "prefixes",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "hash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EffectorRemoved",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "effector",
        type: "tuple",
        indexed: false,
        internalType: "struct CIDV1",
        components: [
          {
            name: "prefixes",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "hash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FLTPriceUpdated",
    inputs: [
      {
        name: "newPrice",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MarketOfferRegistered",
    inputs: [
      {
        name: "provider",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "offerId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "minPricePerWorkerEpoch",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "paymentToken",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "effectors",
        type: "tuple[]",
        indexed: false,
        internalType: "struct CIDV1[]",
        components: [
          {
            name: "prefixes",
            type: "bytes4",
            internalType: "bytes4",
          },
          {
            name: "hash",
            type: "bytes32",
            internalType: "bytes32",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MinPricePerEpochUpdated",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "minPricePerWorkerEpoch",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PaymentTokenUpdated",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "paymentToken",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PeerCreated",
    inputs: [
      {
        name: "offerId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "peerId",
        type: "bytes32",
        indexed: false,
        internalType: "bytes32",
      },
      {
        name: "owner",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
] as const;

export class ICore__factory {
  static readonly abi = _abi;
  static createInterface(): ICoreInterface {
    return new Interface(_abi) as ICoreInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): ICore {
    return new Contract(address, _abi, runner) as unknown as ICore;
  }
}
