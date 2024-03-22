// To store serializers, e.g. from indexer fields/fragments to DealExplorerClient schemes.
import type { ProviderOfProvidersQueryFragment } from "../indexerClient/queries/providers-query.generated.js";
import type {
  CapacityCommitmentDetail,
  CapacityCommitmentShort,
  CapacityCommitmentStatus,
  ComputeUnit,
  ComputeUnitsWithCCStatus,
  DealShort,
  DealStatus,
  OfferShort,
  Peer,
  ProviderBase,
  ProviderShort
} from "../types/schemes.js";
import type {
  BasicOfferFragment,
  BasicPeerFragment,
} from "../indexerClient/queries/offers-query.generated.js";
import {
  serializeCUStatus,
  serializeProviderName,
  serializeRewards,
} from "./logics.js";
import {
  calculateTimestamp,
} from "../utils.js";
import type {
  BasicDealFragment,
  ComputeUnitBasicFragment,
} from "../indexerClient/queries/deals-query.generated.js";
import type { CapacityCommitmentBasicFragment } from "../indexerClient/queries/capacity-commitments-query.generated.js";
import { FLTToken } from "../constants.js";
import type {
  ComputeUnitWithCcDataBasicFragment
} from "../indexerClient/queries/peers-query.generated.js";
import {
  type SerializationSettings,
  tokenValueToRounded
} from "../../utils/serializers.js";
import {
  serializeEffectors,
  serializeContractRateToPercentage
} from "../../utils/indexerClient/serializers.js";

export function serializeOfferShort(offer: BasicOfferFragment, serializationSettings: SerializationSettings,): OfferShort {
  return {
    id: offer.id,
    createdAt: Number(offer.createdAt),
    totalComputeUnits: Number(offer.computeUnitsTotal ?? 0),
    freeComputeUnits: Number(offer.computeUnitsAvailable ?? 0),
    paymentToken: {
      address: offer.paymentToken.id,
      symbol: offer.paymentToken.symbol,
      decimals: offer.paymentToken.decimals.toString(),
    },
    // USDC.
    pricePerEpoch: tokenValueToRounded(
      offer.pricePerEpoch,
      serializationSettings.parseTokenToFixedDefault,
      offer.paymentToken.decimals,
    ),
    effectors: serializeEffectors(offer.effectors),
    providerId: offer.provider.id,
    peersCount: offer.peers?.length ?? 0,
  };
}

export function serializeProviderBase(
  provider: ProviderOfProvidersQueryFragment,
): ProviderBase {
  return {
    id: provider.id,
    createdAt: Number(provider.createdAt),
    totalComputeUnits: provider.computeUnitsTotal,
    freeComputeUnits: provider.computeUnitsAvailable,
    name: serializeProviderName(provider.name, provider.id, provider.approved),
    isApproved: provider.approved,
  } as ProviderBase;
}

export function serializeProviderShort(
  provider: ProviderOfProvidersQueryFragment,
  serializationSettings: SerializationSettings,
): ProviderShort {
  const providerBase = serializeProviderBase(provider);
  const composedOffers = [];
  if (provider.offers) {
    for (const offer of provider.offers) {
      composedOffers.push(serializeOfferShort(offer as BasicOfferFragment, serializationSettings));
    }
  }
  return {
    ...providerBase,
    offers: composedOffers,
  } as ProviderShort;
}

export function serializeComputeUnits(
  fetchedComputeUnits: Array<ComputeUnitBasicFragment>,
): Array<ComputeUnit> {
  const res: Array<ComputeUnit> = [];
  for (const fetched of fetchedComputeUnits) {
    res.push({
      id: fetched.id,
      workerId: fetched.workerId ?? undefined,
    });
  }
  return res;
}

export function serializeComputeUnitsWithStatus(
  computeUnitsWithCcDataBasicFragment: Array<ComputeUnitWithCcDataBasicFragment>
): Array<ComputeUnitsWithCCStatus> {
  let res: Array<ComputeUnitsWithCCStatus> = [];
  for (const computeUnit of computeUnitsWithCcDataBasicFragment) {
    const { status } =
      serializeCUStatus(
        computeUnit,
      );

    res.push({
      id: computeUnit.id,
      workerId: computeUnit.workerId ?? undefined,
      status,
      successProofs: computeUnit.submittedProofsCount,
    });
  }
  return res
}

export function serializePeers(peers: Array<BasicPeerFragment>): Array<Peer> {
  const peersComposed: Array<Peer> = [];
  if (peers) {
    for (const peer of peers) {
      peersComposed.push({
        id: peer.id,
        offerId: peer.offer.id,
        computeUnits: peer.computeUnits
          ? serializeComputeUnits(
              peer.computeUnits as Array<ComputeUnitBasicFragment>,
            )
          : [],
      });
    }
  }
  return peersComposed;
}

export function serializeDealsShort(
  deal: BasicDealFragment,
  fromRpcForDealShort: {
    dealStatus: DealStatus | undefined;
    freeBalance: bigint | null | undefined;
  },
  serializationSettings: SerializationSettings,
): DealShort {
  const freeBalance = fromRpcForDealShort.freeBalance
    ? fromRpcForDealShort.freeBalance
    : BigInt(0);
  const totalEarnings =
    BigInt(deal.depositedSum) - BigInt(deal.withdrawalSum) - freeBalance;

  return {
    id: deal.id,
    createdAt: Number(deal.createdAt),
    client: deal.owner,
    minWorkers: deal.minWorkers,
    targetWorkers: deal.targetWorkers,
    paymentToken: {
      address: deal.paymentToken.id,
      symbol: deal.paymentToken.symbol,
      decimals: deal.paymentToken.decimals.toString(),
    },
    // USDC.
    balance: tokenValueToRounded(
      freeBalance,
      serializationSettings.parseTokenToFixedDefault,
      deal.paymentToken.decimals,
    ),
    status: fromRpcForDealShort.dealStatus
      ? fromRpcForDealShort.dealStatus
      : "active",
    // USDC.
    totalEarnings: tokenValueToRounded(
      totalEarnings,
      serializationSettings.parseTokenToFixedDefault,
      deal.paymentToken.decimals,
    ),
    registeredWorkers: deal.registeredWorkersCurrentCount,
    matchedWorkers: deal.matchedWorkersCurrentCount,
  };
}

export function serializeCapacityCommitmentShort(
  capacityCommitmentFromIndexer: CapacityCommitmentBasicFragment,
  statusFromRpc: CapacityCommitmentStatus,
  coreInitTimestamp: number,
  coreEpochDuration: number,
  precision: number,
): CapacityCommitmentShort {
  let expiredAt = null;
  let startedAt = null;
  if (
    capacityCommitmentFromIndexer.endEpoch != 0 &&
    capacityCommitmentFromIndexer.startEpoch != 0
  ) {
    expiredAt = calculateTimestamp(
      Number(capacityCommitmentFromIndexer.endEpoch),
      coreInitTimestamp,
      coreEpochDuration,
    );
    startedAt = calculateTimestamp(
      Number(capacityCommitmentFromIndexer.startEpoch),
      coreInitTimestamp,
      coreEpochDuration,
    );
  }

  return {
    id: capacityCommitmentFromIndexer.id,
    createdAt: Number(capacityCommitmentFromIndexer.createdAt),
    startedAt,
    expiredAt,
    providerId: capacityCommitmentFromIndexer.peer.provider.id,
    peerId: capacityCommitmentFromIndexer.peer.id,
    computeUnitsCount: Number(capacityCommitmentFromIndexer.computeUnitsCount),
    status: statusFromRpc,
    rewardDelegatorRate: serializeContractRateToPercentage(
      Number(capacityCommitmentFromIndexer.rewardDelegatorRate),
      precision,
    ),
    duration: Number(capacityCommitmentFromIndexer.duration),
  };
}

export function serializeCapacityCommitmentDetail(
  capacityCommitmentFromIndexer: CapacityCommitmentBasicFragment,
  statusFromRpc: CapacityCommitmentStatus,
  coreInitTimestamp: number,
  coreEpochDuration: number,
  totalCollateral: bigint,
  rewardDelegatorRate: number,
  unlockedRewards: bigint | null,
  totalRewards: bigint | null,
  rewardWithdrawn: bigint,
  delegatorAddress: string,
  serializationSettings: SerializationSettings,
  precision: number,
): CapacityCommitmentDetail {
  const _totalRewards = totalRewards ? totalRewards : BigInt(0);
  const _unlockedRewards = unlockedRewards ? unlockedRewards : BigInt(0);
  // First of all convert to [0, 1] with accordance of precision and than to [0, 100] to % format.
  const rewardDelegatorRatePercentage = serializeContractRateToPercentage(rewardDelegatorRate, precision);
  const unclockedRewardsSerialized = serializeRewards(
    _unlockedRewards,
    rewardDelegatorRate,
    precision,
    serializationSettings,
  )
  const notWithdrawnRewardsSerialized = serializeRewards(
    _totalRewards,
    rewardDelegatorRate,
    precision,
    serializationSettings,
  )
  return {
    ...serializeCapacityCommitmentShort(
      capacityCommitmentFromIndexer,
      statusFromRpc,
      coreInitTimestamp,
      coreEpochDuration,
      precision,
    ),
    // FLT.
    totalCollateral: tokenValueToRounded(
      totalCollateral,
      serializationSettings.parseNativeTokenToFixedDefault,
    ),
    collateralToken: FLTToken,
    rewardDelegatorRate: rewardDelegatorRatePercentage,
    // FLT.
    rewardsUnlocked: tokenValueToRounded(
      _unlockedRewards,
      serializationSettings.parseNativeTokenToFixedDefault,
    ),
    rewardsUnlockedDelegator: unclockedRewardsSerialized.delegator,
    rewardsUnlockedProvider: unclockedRewardsSerialized.provider,
    rewardsNotWithdrawn: tokenValueToRounded(
      _totalRewards,
      serializationSettings.parseNativeTokenToFixedDefault,
    ),
    rewardsNotWithdrawnDelegator: notWithdrawnRewardsSerialized.delegator,
    rewardsNotWithdrawnProvider: notWithdrawnRewardsSerialized.provider,
    rewardsTotal: tokenValueToRounded(
      _totalRewards + rewardWithdrawn,
      serializationSettings.parseNativeTokenToFixedDefault,
    ),
    delegatorAddress:
      delegatorAddress == "0x0000000000000000000000000000000000000000"
        ? null
        : delegatorAddress,
  };
}
