/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type { IMarket, IMarketInterface } from "../IMarket.js";

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

export class IMarket__factory {
  static readonly abi = _abi;
  static createInterface(): IMarketInterface {
    return new Interface(_abi) as IMarketInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IMarket {
    return new Contract(address, _abi, runner) as unknown as IMarket;
  }
}
