import type {Result} from "ethers";
import type {CapacityCommitmentStatus, DealStatus} from "../types/schemes.js";

export function serializeTxDealStatus(result: Result | null): DealStatus {
  // Values are:
  // ENDED
  // INACTIVE
  // ACTIVE and undefined
  if (!result) {
    return "undefined";
  }
  let status: DealStatus;
  const converted = Number(result);
  switch (converted) {
    case 0: {
      status = "inactive";
      break;
    }
    case 1: {
      status = "active";
      break;
    }
    case 2: {
      status = "ended";
      break;
    }
    default: {
      status = "undefined";
      break;
    }
  }
  return status;
}

export function serializeTxCapacityCommitmentStatus(result: Result | null): CapacityCommitmentStatus {
  // Values are:
  // active
  // waitDelegation
  // waitStart
  // inactive
  // failed
  // removed
  // undefined
  if (!result) {
    return "undefined";
  }
  let status: CapacityCommitmentStatus;
  const converted = Number(result);
  switch (converted) {
    case 0: {
      status = "active";
      break;
    }
    case 1: {
      status = "waitDelegation";
      break;
    }
    case 2: {
      status = "waitStart";
      break;
    }
    case 3: {
      status = "inactive";
      break;
    }
    case 4: {
      status = "failed";
      break;
    }
    case 5: {
      status = "removed";
      break;
    }
    default: {
      status = "undefined";
      break;
    }
  }
  return status;
}