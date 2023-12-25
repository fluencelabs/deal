import { Bytes, ethereum, log } from "@graphprotocol/graph-ts/index";
import { createOrLoadEffector } from "../models";

export class AppCID extends ethereum.Tuple {
  get prefixes(): Bytes {
    return this[0].toBytes();
  }

  get hash(): Bytes {
    return this[1].toBytes();
  }
}

/*
 @dev Use with changetype, e.g.
 >>> changetype<Array<AppCID>>(event.params.effectors)
 */
export function parseEffectors(effectors: Array<AppCID>): Array<string> {
  let effectorEntities: Array<string> = [];
  for (let i = 0; i < effectors.length; i++) {
    const cid = getEffectorCID(effectors[i]);
    const effector = createOrLoadEffector(cid);
    effectorEntities.push(effector.id);
  }
  return effectorEntities;
}

/*
 @dev Use with changetype, e.g.
 >>> changetype<AppCID>(event.params.effector)
 */
export function getEffectorCID(effectorTuple: AppCID): string {
  const cid = effectorTuple.prefixes.toString() + effectorTuple.hash.toString();
  log.info("[getEffectorCID] Extract CID from effector: {}", [cid]);
  return cid;
}
