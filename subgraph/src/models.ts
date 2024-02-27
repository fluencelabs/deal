import {
  Effector,
  OfferToEffector,
  Token,
  DealToEffector,
  GraphNetwork,
  DealToPeer,
  DealToJoinedOfferPeer,
  Provider,
  DealToProvidersAccess,
  CapacityCommitmentToComputeUnit,
  CapacityCommitmentStatsPerEpoch,
  ComputeUnitPerEpochStat,
} from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {getTokenDecimals, getTokenSymbol} from "./contracts";

export const ZERO_BIG_INT = BigInt.fromI32(0);
export const UNO_BIG_INT = BigInt.fromI32(1);
export const MAX_UINT_256 = BigInt.fromString("115792089237316195423570985008687907853269984665640564039457584007913129639935");

export const UNKNOWN_EFFECTOR_DESCRIPTION = "Unknown";
export const UNREGISTERED_PROVIDER_NAME = "Unregistered";

// In contracts flow to register provider exists, but on e.g. deal
//  creation some unregistered providers could be used.
// @notice Those unregistered providers does not count in total providers.
export function createOrLoadUnregisteredProvider(providerAddress: string): Provider {
  let entity = Provider.load(providerAddress);

  if (entity == null) {
    entity = new Provider(providerAddress);
    entity.registered = false;
    entity.name = UNREGISTERED_PROVIDER_NAME;
    entity.approved = false;
    entity.createdAt = ZERO_BIG_INT;
    entity.computeUnitsAvailable = 0;
    entity.computeUnitsTotal = 0;
    entity.peerCount = 0;
    entity.save();
  }
  return entity as Provider;
}

export function createOrLoadToken(tokenAddress: string): Token {
  let entity = Token.load(tokenAddress);

  if (entity == null) {
    entity = new Token(tokenAddress);
    const tokenAddressBytes = Bytes.fromHexString(tokenAddress);
    entity.symbol = getTokenSymbol(tokenAddressBytes);
    entity.decimals = getTokenDecimals(tokenAddressBytes);
    entity.save();

    let graphNetwork = createOrLoadGraphNetwork();
    graphNetwork.tokensTotal = graphNetwork.tokensTotal.plus(UNO_BIG_INT);
    graphNetwork.save()
  }
  return entity as Token;
}

export function createOrLoadEffector(cid: string): Effector {
  let entity = Effector.load(cid);

  if (entity == null) {
    entity = new Effector(cid);
    entity.description = UNKNOWN_EFFECTOR_DESCRIPTION;
    entity.save();

    let graphNetwork = createOrLoadGraphNetwork();
    graphNetwork.effectorsTotal = graphNetwork.effectorsTotal.plus(UNO_BIG_INT);
    graphNetwork.save()
  }
  return entity as Effector;
}

// Subgprah compiler does not support return mapping/dict,
//  thus, class is presented.
class createOrLoadOfferEffectorReturn {
  public created: boolean;
  public entity: OfferToEffector;
  constructor(entity: OfferToEffector, created: boolean) {
    this.created = created;
    this.entity = entity;
  }
}

// Returns number of created entities.
export function createOrLoadOfferEffector(
  offerId: string,
  effectorId: string,
): createOrLoadOfferEffectorReturn {
  const concattedIds = offerId.concat(effectorId);

  let entity = OfferToEffector.load(concattedIds);
  let created = false;

  if (entity == null) {
    entity = new OfferToEffector(concattedIds);
    entity.offer = offerId;
    entity.effector = effectorId;
    entity.save();
    created = true;
  }
  return new createOrLoadOfferEffectorReturn(entity, created);
}

export function createOrLoadDealEffector(
  dealId: string,
  effectorId: string,
): DealToEffector {
  const concattedIds = dealId.concat(effectorId);
  let entity = DealToEffector.load(concattedIds);

  if (entity == null) {
    entity = new DealToEffector(concattedIds);
    entity.deal = dealId;
    entity.effector = effectorId;
    entity.save();
  }
  return entity as DealToEffector;
}

export function createOrLoadDealToPeer(
  dealId: string,
  peerId: string,
): DealToPeer {
  const concattedIds = dealId.concat(peerId);
  let entity = DealToPeer.load(concattedIds);

  if (entity == null) {
    entity = new DealToPeer(concattedIds);
    entity.deal = dealId;
    entity.peer = peerId;
    entity.save();
  }
  return entity as DealToPeer;
}

export function createOrLoadDealToJoinedOfferPeer(
  dealId: string,
  offerId: string,
  peerId: string,
): DealToJoinedOfferPeer {
  // // deal.id.concat(offer.id.concat(peer.id)).
  const concattedIds = dealId.concat(offerId.concat(peerId));
  let entity = DealToJoinedOfferPeer.load(concattedIds);

  if (entity == null) {
    entity = new DealToJoinedOfferPeer(concattedIds);
    entity.deal = dealId;
    entity.peer = peerId;
    entity.offer = offerId;
    entity.save();
  }
  return entity as DealToJoinedOfferPeer;
}

export function createOrLoadGraphNetwork(): GraphNetwork {
  let graphNetwork = GraphNetwork.load('1')
  if (graphNetwork == null) {
    graphNetwork = new GraphNetwork('1')
    graphNetwork.dealsTotal = ZERO_BIG_INT;
    graphNetwork.providersTotal = ZERO_BIG_INT;
    graphNetwork.offersTotal = ZERO_BIG_INT;
    graphNetwork.tokensTotal = ZERO_BIG_INT;
    graphNetwork.effectorsTotal = ZERO_BIG_INT;
    graphNetwork.capacityCommitmentsTotal = ZERO_BIG_INT;
    graphNetwork.proofsTotal = ZERO_BIG_INT;
    graphNetwork.save()
  }
  return graphNetwork as GraphNetwork
}

export function createOrLoadDealToProvidersAccess(
  dealId: string,
  providerId: string,
): DealToProvidersAccess {
  const concattedIds = dealId.concat(providerId);
  let entity = DealToProvidersAccess.load(concattedIds);

  if (entity == null) {
    entity = new DealToProvidersAccess(concattedIds)
    entity.deal = dealId
    entity.provider = providerId
    entity.save()
  }
  return entity as DealToProvidersAccess
}

// Statuses that could be saved in Subgraph.
// Some of the statues should be calculated regard to current epoch and can not be stored in the subgraph.
// We have to mirror enums according to
//  https://ethereum.stackexchange.com/questions/139078/how-to-use-subgraph-enums-in-the-mapping.
export class CapacityCommitmentStatus {
  static Active: string = "Active"; // Should not be stored!
  static WaitDelegation: string = "WaitDelegation";
  // Status is WaitStart - means collateral deposited.
  static WaitStart: string = "WaitStart";
  static Inactive: string = "Inactive";  // Should not be stored!
  // It is stored when subgraph could be certain that Failed
  //  (when CommitmentStatsUpdated event emitted), but before this transaction
  //  if Failed should be checked in another way (not by relaying on this status).
  static Failed: string = "Failed";
  static Removed: string = "Removed";
}

export function createOrLoadCapacityCommitmentToComputeUnit(
  capacityCommitmentId: string,
  computeUnitId: string,
): CapacityCommitmentToComputeUnit {
  const concattedIds = capacityCommitmentId.concat(computeUnitId);
  let entity = CapacityCommitmentToComputeUnit.load(concattedIds);

  if (entity == null) {
    entity = new CapacityCommitmentToComputeUnit(concattedIds)
    entity.capacityCommitment = capacityCommitmentId
    entity.computeUnit = computeUnitId
    entity.save()
  }
  return entity as CapacityCommitmentToComputeUnit
}

export function createOrLoadCapacityCommitmentStatsPerEpoch(capacityCommitmentId: string, epoch: string): CapacityCommitmentStatsPerEpoch {
  const concattedIds = capacityCommitmentId.concat(epoch);
  let entity = CapacityCommitmentStatsPerEpoch.load(concattedIds);

  if (entity == null) {
    entity = new CapacityCommitmentStatsPerEpoch(concattedIds)
    entity.capacityCommitment = capacityCommitmentId
    entity.epoch = BigInt.fromString(epoch)
    entity.totalCUFailCount = 0
    entity.exitedUnitCount = 0
    entity.activeUnitCount = 0
    entity.nextAdditionalActiveUnitCount = 0
    entity.currentCCNextCCFailedEpoch = ZERO_BIG_INT
    entity.submittedProofsCount = 0
    entity.blockNumberStart = ZERO_BIG_INT
    entity.blockNumberEnd = ZERO_BIG_INT
    entity.computeUnitsWithMinRequiredProofsSubmittedCounter = 0
    entity.save()
  }
  return entity as CapacityCommitmentStatsPerEpoch
}

export function createOrLoadComputeUnitPerEpochStat(computeUnitId: string, epoch: string): ComputeUnitPerEpochStat {
  const concattedIds = computeUnitId.concat(epoch);
  let entity = ComputeUnitPerEpochStat.load(concattedIds);

  if (entity == null) {
    entity = new ComputeUnitPerEpochStat(concattedIds)
    entity.submittedProofsCount = 0;
    entity.save()
  }
  return entity as ComputeUnitPerEpochStat
}
