/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IMarket,
  IMarketInterface,
} from "../../../../../../src/core/modules/market/interfaces/IMarket";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minWorkers",
        type: "uint256",
      },
    ],
    name: "MinWorkersNotMatched",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "unitId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "contract IDeal",
        name: "deal",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
    ],
    name: "ComputeUnitAddedToDeal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "unitId",
        type: "bytes32",
      },
    ],
    name: "ComputeUnitCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "contract IDeal",
        name: "deal",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "unitId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dealCreationBlock",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        indexed: false,
        internalType: "struct CIDV1",
        name: "appCID",
        type: "tuple",
      },
    ],
    name: "ComputeUnitMatched",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "unitId",
        type: "bytes32",
      },
    ],
    name: "ComputeUnitRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "unitId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "contract IDeal",
        name: "deal",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
    ],
    name: "ComputeUnitRemovedFromDeal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        indexed: false,
        internalType: "struct CIDV1",
        name: "effector",
        type: "tuple",
      },
    ],
    name: "EffectorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        indexed: false,
        internalType: "struct CIDV1",
        name: "id",
        type: "tuple",
      },
    ],
    name: "EffectorInfoRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        indexed: false,
        internalType: "struct CIDV1",
        name: "id",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        indexed: false,
        internalType: "struct CIDV1",
        name: "metadata",
        type: "tuple",
      },
    ],
    name: "EffectorInfoSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        indexed: false,
        internalType: "struct CIDV1",
        name: "effector",
        type: "tuple",
      },
    ],
    name: "EffectorRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minPricePerWorkerEpoch",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        indexed: false,
        internalType: "struct CIDV1[]",
        name: "effectors",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minProtocolVersion",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxProtocolVersion",
        type: "uint256",
      },
    ],
    name: "MarketOfferRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minPricePerWorkerEpoch",
        type: "uint256",
      },
    ],
    name: "MinPricePerEpochUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
    ],
    name: "PaymentTokenUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "PeerCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
    ],
    name: "PeerRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        indexed: false,
        internalType: "struct CIDV1",
        name: "metadata",
        type: "tuple",
      },
    ],
    name: "ProviderInfoUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "peerId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bytes32[]",
            name: "unitIds",
            type: "bytes32[]",
          },
        ],
        internalType: "struct IOffer.RegisterComputePeer[]",
        name: "peers",
        type: "tuple[]",
      },
    ],
    name: "addComputePeers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
      {
        internalType: "bytes32[]",
        name: "unitIds",
        type: "bytes32[]",
      },
    ],
    name: "addComputeUnits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct CIDV1[]",
        name: "newEffectors",
        type: "tuple[]",
      },
    ],
    name: "addEffector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "newMinPricePerWorkerEpoch",
        type: "uint256",
      },
    ],
    name: "changeMinPricePerWorkerEpoch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newPaymentToken",
        type: "address",
      },
    ],
    name: "changePaymentToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
    ],
    name: "getComputePeer",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "offerId",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "commitmentId",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "unitCount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        internalType: "struct IOffer.ComputePeer",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "unitId",
        type: "bytes32",
      },
    ],
    name: "getComputeUnit",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "deal",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "peerId",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "startEpoch",
            type: "uint256",
          },
        ],
        internalType: "struct IOffer.ComputeUnit",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
    ],
    name: "getComputeUnitIds",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
    ],
    name: "getComputeUnits",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "id",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "deal",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "startEpoch",
            type: "uint256",
          },
        ],
        internalType: "struct IOffer.ComputeUnitView[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct CIDV1",
        name: "id",
        type: "tuple",
      },
    ],
    name: "getEffectorInfo",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            components: [
              {
                internalType: "bytes4",
                name: "prefixes",
                type: "bytes4",
              },
              {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32",
              },
            ],
            internalType: "struct CIDV1",
            name: "metadata",
            type: "tuple",
          },
        ],
        internalType: "struct IOffer.EffectorInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
    ],
    name: "getOffer",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "provider",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "minPricePerWorkerEpoch",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "paymentToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "peerCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minProtocolVersion",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxProtocolVersion",
            type: "uint256",
          },
        ],
        internalType: "struct IOffer.Offer",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
    ],
    name: "getProviderInfo",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            components: [
              {
                internalType: "bytes4",
                name: "prefixes",
                type: "bytes4",
              },
              {
                internalType: "bytes32",
                name: "hash",
                type: "bytes32",
              },
            ],
            internalType: "struct CIDV1",
            name: "metadata",
            type: "tuple",
          },
        ],
        internalType: "struct IOffer.ProviderInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IDeal",
        name: "deal",
        type: "address",
      },
      {
        internalType: "bytes32[]",
        name: "offers",
        type: "bytes32[]",
      },
      {
        internalType: "bytes32[][]",
        name: "computeUnits",
        type: "bytes32[][]",
      },
    ],
    name: "matchDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "minPricePerWorkerEpoch",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "paymentToken",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct CIDV1[]",
        name: "effectors",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "peerId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "bytes32[]",
            name: "unitIds",
            type: "bytes32[]",
          },
        ],
        internalType: "struct IOffer.RegisterComputePeer[]",
        name: "peers",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "minProtocolVersion",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxProtocolVersion",
        type: "uint256",
      },
    ],
    name: "registerMarketOffer",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
    ],
    name: "removeComputePeer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "unitId",
        type: "bytes32",
      },
    ],
    name: "removeComputeUnit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct CIDV1[]",
        name: "effectors",
        type: "tuple[]",
      },
    ],
    name: "removeEffector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct CIDV1",
        name: "id",
        type: "tuple",
      },
    ],
    name: "removeEffectorInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "offerId",
        type: "bytes32",
      },
    ],
    name: "removeOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "unitId",
        type: "bytes32",
      },
    ],
    name: "returnComputeUnitFromDeal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "peerId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "commitmentId",
        type: "bytes32",
      },
    ],
    name: "setCommitmentId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct CIDV1",
        name: "id",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct CIDV1",
        name: "metadata",
        type: "tuple",
      },
    ],
    name: "setEffectorInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "prefixes",
            type: "bytes4",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct CIDV1",
        name: "metadata",
        type: "tuple",
      },
    ],
    name: "setProviderInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "unitId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "startEpoch",
        type: "uint256",
      },
    ],
    name: "setStartEpoch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
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