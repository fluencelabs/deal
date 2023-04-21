import {
  MatchedWithDeal,
  ResourceOwnerRegistred,
  ResourceOwnerRemoved,
} from "../generated/Matcher/Matcher";
import { BigInt, store } from "@graphprotocol/graph-ts";
import { ResourceOwnerRequest } from "../generated/schema";

export function handleResourceOwnerRegistred(
  event: ResourceOwnerRegistred
): void {
  let entity = new ResourceOwnerRequest(event.params.owner);
  entity.id = event.params.owner;
  entity.minPriceByEpoch = event.params.info.minPriceByEpoch;
  entity.maxCollateral = event.params.info.maxCollateral;
  entity.workersCount = event.params.info.workersCount;

  entity.save();
}

export function handleResourceOwnerRemoved(event: ResourceOwnerRemoved): void {
  store.remove("ResourceOwnerRequest", event.params.owner.toHexString());
}

export function handleMatchedWithDeal(event: MatchedWithDeal): void {
  for (let i = 0; i < event.params.resources.length; i++) {
    const resource = event.params.resources[i];
    const workers = event.params.workersCount[i];

    let entity = new ResourceOwnerRequest(resource);

    if (entity == null) {
      continue;
    }

    entity.workersCount = entity.workersCount.minus(workers);
    entity.save();
  }
}
