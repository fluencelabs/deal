import {
  createOrLoadEpochStatistic,
  createOrLoadGraphNetwork,
  createOrLoadProvider,
} from "../models";
import {
  Initialized,
  WhitelistAccessGranted,
  WhitelistAccessRevoked,
} from "../../generated/Core/Core";
import {
  calculateEpoch,
  getCapacityMaxFailedRatio,
  getEpochDuration,
  getInitTimestamp, getMinDealRematchingEpochs,
  getMinRequiredProofsPerEpoch,
  getPrecision
} from "../contracts";
import { formatAddress } from "./utils";
import { log, BigInt } from "@graphprotocol/graph-ts/index";
import { ethereum } from "@graphprotocol/graph-ts";

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
  graphNetwork.coreMinDealRematchingEpochs = getMinDealRematchingEpochs(
    event.address,
  ).toI32();

  graphNetwork.save();
}

export function handleWhitelistAccessGranted(
  event: WhitelistAccessGranted,
): void {
  let provider = createOrLoadProvider(
    formatAddress(event.params.account),
    event.block.timestamp,
  );
  provider.approved = true;
  provider.save();
}

export function handleWhitelistAccessRevoked(
  event: WhitelistAccessRevoked,
): void {
  let provider = createOrLoadProvider(
    formatAddress(event.params.account),
    event.block.timestamp,
  );
  provider.approved = false;
  provider.save();
}

// In situ, This handler should be called after core contract inited! Because it relies on core contract data after core is inited.
// If it detects that Core is not inited, it will return.
export function handleNewBlock(block: ethereum.Block): void {
  const graphNetwork = createOrLoadGraphNetwork();
  let initTimestamp = graphNetwork.initTimestamp;
  let coreEpochDuration = graphNetwork.coreEpochDuration;
  const blockNumber = block.number;
  if (!initTimestamp || !coreEpochDuration) {
    log.warning(
      `[handleNewBlock] This handler should be called after core contract inited! Otherwise it will have wrong data. Core is not inited on block number ${blockNumber}, thus, pass.`,
      [],
    );
    return;
  }

  const blockTimestamp = block.timestamp;
  const currentEpoch = calculateEpoch(
    blockTimestamp,
    BigInt.fromI32(initTimestamp),
    BigInt.fromI32(coreEpochDuration),
  );

  let epochStatistic = createOrLoadEpochStatistic(
    blockTimestamp,
    currentEpoch,
    blockNumber,
  );
  if (epochStatistic.endBlock < blockNumber) {
    epochStatistic.endBlock = blockNumber;
    epochStatistic.endTimestamp = blockTimestamp;
    epochStatistic.save();
  }
}
