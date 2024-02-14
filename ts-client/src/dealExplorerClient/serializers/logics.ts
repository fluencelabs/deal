// To store business logic serializers.

// If provider does not approved: convert a name.
import type {
  ComputeUnitWithCcDataBasicFragment
} from "../indexerClient/queries/peers-query.generated.js";
import {calculateEpoch} from "../utils.js";
import type {ComputeUnitStatus} from "../types/schemes.js";

export function serializeProviderName(
  name: string,
  providerAddress: string,
  isApproved: boolean,
): string {
  if (isApproved) {
    return name;
  }
  if (providerAddress === "0x0000000000000000000000000000000000000000") {
    return "Provider 0x0000000";
  }
  return "Provider " + providerAddress.slice(0, 8);
}

// TODO: rm when https://github.com/graphprotocol/graph-node/issues/5171 is fixed.
// Currently this method is synced with scripts/CreateMarket.s.sol script data.
// It is used for dev purpose as scripts/CreateMarket.s.sol itself as well.
export function serializeEffectorDescription(
  cid: string,
  descriptionFromIndexer: string,
): string {
  if (cid == "\u00124VxDoge") {
    return "IPFS";
  }
  if (cid == "\u00124VxDogu") {
    return "cURL";
  }
  return descriptionFromIndexer;
}

export function serializeExpectedProofsAndCUStatus(
  computeUnitWithCcDataBasicFragment: ComputeUnitWithCcDataBasicFragment,
  coreInitTimestamp: number,
  coreEpochDuration: number,
) {
  const computeUnit = computeUnitWithCcDataBasicFragment
  const currentPeerCapacityCommitment =
    computeUnit.peer.currentCapacityCommitment;
  let expectedProofsDueNow = 0;
  const startEpoch = currentPeerCapacityCommitment?.startEpoch;
  if (startEpoch && startEpoch != 0) {
    expectedProofsDueNow =
      calculateEpoch(
        Date.now() / 1000,
        coreInitTimestamp,
        coreEpochDuration,
      ) - startEpoch;
  }

  let status: ComputeUnitStatus = "undefined";
  if (computeUnit.deal) {
    status = "deal";
  } else if (currentPeerCapacityCommitment) {
    status = "capacity";
  } else {
    status = "undefined";
  }

  return {
    expectedProofsDueNow,
    status,
  }
}
