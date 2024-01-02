import {
  Effector,
  OfferToEffector,
  Token,
  DealToEffector,
  GraphNetwork, Provider,
} from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { getTokenDecimals, getTokenSymbol } from "./contracts";
import {getProviderName} from "./networkConstants";

export const ZERO_BIG_INT = BigInt.fromI32(0);
export const UNO_BIG_INT = BigInt.fromI32(1);

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

// TODO: add description mapper.
const DEFAULT_EFFECTOR_DESCRIPTION = "DEFAULT";

export function createOrLoadProvider(providerAddress: string, timestamp: BigInt): Provider {
  let entity = Provider.load(providerAddress);

  if (entity == null) {
    entity = new Provider(providerAddress);
    entity.name = getProviderName(providerAddress);
    entity.createdAt = timestamp;
    entity.computeUnitsAvailable = 0;
    entity.computeUnitsTotal = 0;
    entity.peerCount = 0;
    entity.effectorCount = 0;
    entity.save();

    let graphNetwork = createOrLoadGraphNetwork();
    graphNetwork.providersTotal = graphNetwork.providersTotal.plus(UNO_BIG_INT);
    graphNetwork.save()
  }
  return entity as Provider;
}

export function createOrLoadEffector(cid: string): Effector {
  let entity = Effector.load(cid);

  if (entity == null) {
    entity = new Effector(cid);
    entity.description = DEFAULT_EFFECTOR_DESCRIPTION;
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

export function createOrLoadGraphNetwork(): GraphNetwork {
  let graphNetwork = GraphNetwork.load('1')
  if (graphNetwork == null) {
    graphNetwork = new GraphNetwork('1')
    graphNetwork.dealsTotal = ZERO_BIG_INT;
    graphNetwork.providersTotal = ZERO_BIG_INT;
    graphNetwork.offersTotal = ZERO_BIG_INT;
    graphNetwork.tokensTotal = ZERO_BIG_INT;
    graphNetwork.effectorsTotal = ZERO_BIG_INT;
    graphNetwork.save()
  }
  return graphNetwork as GraphNetwork
}
