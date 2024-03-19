import type { Result } from "ethers";
import type { CapacityCommitmentStatus, DealStatus } from "../types/schemes.js";

export function serializeTxDealStatus(result: Result | null): DealStatus {
  if (!result) {
    return "undefined";
  }
  let status: DealStatus;
  const converted = Number(result);
  switch (converted) {
    case 0: {
      status = "insufficientFunds";
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
    case 3: {
      status = "notEnoughWorkers";
      break;
    }
    case 4: {
      status = "smallBalance";
      break;
    }
    default: {
      status = "undefined";
      break;
    }
  }
  return status;
}

export function serializeTxCapacityCommitmentStatus(
  result: Result | null,
): CapacityCommitmentStatus {
  // Values are:
  // inactive
  // active
  // waitDelegation
  // waitStart
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
      status = "inactive";
      break;
    }
    case 1: {
      status = "active";
      break;
    }
    case 2: {
      status = "waitDelegation";
      break;
    }
    case 3: {
      status = "waitStart";
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

export function serializeTxToBigInt(result: Result | null): bigint | null {
  if (!result) {
    return null;
  }
  return BigInt(result.toString());
}
