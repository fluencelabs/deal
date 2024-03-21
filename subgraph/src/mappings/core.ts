import {
  createOrLoadGraphNetwork,
  createOrLoadProvider
} from "../models";
import {
  Initialized,
  WhitelistAccessGranted,
  WhitelistAccessRevoked,
} from "../../generated/Core/Core";
import {
  getCapacityMaxFailedRatio,
  getEpochDuration,
  getInitTimestamp,
  getMinRequiredProofsPerEpoch,
  getPrecision,
} from "../contracts";
import { Provider } from "../../generated/schema";
import { formatAddress } from "./utils";
import { log } from "@graphprotocol/graph-ts/index";

export function handleInitialized(event: Initialized): void {
  let graphNetwork = createOrLoadGraphNetwork();
  graphNetwork.coreEpochDuration = getEpochDuration(event.address);
  graphNetwork.coreContractAddress = formatAddress(event.address);
  graphNetwork.initTimestamp = getInitTimestamp(event.address);
  graphNetwork.capacityMaxFailedRatio = getCapacityMaxFailedRatio(
    event.address,
  ).toI32();
  graphNetwork.corePrecision = getPrecision(event.address).toI32();
  graphNetwork.minRequiredProofsPerEpoch = getMinRequiredProofsPerEpoch(
    event.address,
  ).toI32();

  graphNetwork.save();
}

export function handleWhitelistAccessGranted(
  event: WhitelistAccessGranted,
): void {
  log.info('TODO DEBUG {}', [formatAddress(event.params.account)])
  let provider = createOrLoadProvider(formatAddress(event.params.account), event.block.timestamp);
  provider.approved = true;
  provider.save();
}

export function handleWhitelistAccessRevoked(
  event: WhitelistAccessRevoked,
): void {
  let provider = createOrLoadProvider(formatAddress(event.params.account), event.block.timestamp);
  provider.approved = false;
  provider.save();
}
