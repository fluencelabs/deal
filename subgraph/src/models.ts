import {
  Effector,
  OfferToEffector,
  Token,
  DealToEffector,
} from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { getTokenSymbol } from "./contracts";

const ZERO_BYTES = Bytes.fromHexString(
  "0x0000000000000000000000000000000000000000",
);
const ZERO_STRING = "";
export const ZERO_BIG_INT = BigInt.fromI32(0);

export function createOrLoadToken(tokenAddress: string): Token {
  let entity = Token.load(tokenAddress);

  if (entity == null) {
    entity = new Token(tokenAddress);
    entity.symbol = getTokenSymbol(Bytes.fromHexString(tokenAddress));
    entity.save();
  }
  return entity as Token;
}

// TODO: add description mapper.
const DEFAULT_EFFECTOR_DESCRIPTION = "DEFAULT_EFFECTOR_DESCRIPTION";

export function createOrLoadEffector(cid: string): Effector {
  let entity = Effector.load(cid);

  if (entity == null) {
    entity = new Effector(cid);
    entity.description = DEFAULT_EFFECTOR_DESCRIPTION;
    entity.save();
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
