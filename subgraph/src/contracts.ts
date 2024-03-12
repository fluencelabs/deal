import {
  Market,
  Market__getComputeUnitResultValue0Struct,
  Market__getOfferResultValue0Struct,
} from "../generated/Market/Market";
import { Deal } from "../generated/Market/Deal";
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/Market/ERC20";
import { Core } from "../generated/Core/Core";
import { Capacity } from "../generated/Capacity/Capacity";
import { MAX_UINT_256, UNO_BIG_INT, ZERO_BIG_INT } from "./models";
import { log } from "@graphprotocol/graph-ts/index";

// TODO: optimise through multicall contract (currently 2 calls only per token).

// if ERC20 does not support symbol().
const ERC20_UNKNOWN_SYMBOL = "ERC20_UNKNOWN";
const ERC20_UNKNOWN_DECIMALS = 1;

export function getTokenSymbol(address: Bytes): string {
  log.info("getTokenSymbol for address: {}...", [address.toHexString()]);
  let contract = ERC20.bind(Address.fromBytes(address));
  let symbolValue = ERC20_UNKNOWN_SYMBOL;
  let symbolResult = contract.try_symbol();

  if (!symbolResult.reverted) {
    symbolValue = symbolResult.value;
  }
  return symbolValue;
}

export function getTokenDecimals(address: Bytes): i32 {
  log.info("getTokenDecimals for address: {}...", [address.toHexString()]);
  let contract = ERC20.bind(Address.fromBytes(address));
  let value = ERC20_UNKNOWN_DECIMALS; // if ERC20 does not support decimals().
  let result = contract.try_decimals();

  if (!result.reverted) {
    value = result.value;
  }
  return value;
}

// @deprecated.
export function getOfferInfo(
  contractAddress: Address,
  offerId: string,
): Market__getOfferResultValue0Struct {
  const contract = Market.bind(contractAddress);
  return contract.getOffer(Bytes.fromHexString(offerId));
}

// @deprecated.
export function getComputeUnit(
  contractAddress: Address,
  unitId: Bytes,
): Market__getComputeUnitResultValue0Struct {
  const contract = Market.bind(contractAddress);
  return contract.getComputeUnit(unitId);
}

// @deprecated.
export function getDealContract(contractAddress: Address): Deal {
  return Deal.bind(contractAddress);
}

export function getEpochDuration(contractAddress: Address): i32 {
  return Core.bind(contractAddress).epochDuration().toI32();
}

export function getInitTimestamp(contractAddress: Address): i32 {
  return Core.bind(contractAddress).initTimestamp().toI32();
}

export function getCapacityMaxFailedRatio(contractAddress: Address): BigInt {
  return Capacity.bind(contractAddress).maxFailedRatio();
}

export function getMinRequiredProofsPerEpoch(contractAddress: Address): BigInt {
  return Capacity.bind(contractAddress).minRequierdProofsPerEpoch();
}

// It mirrors _failedEpoch internal method in Capacity.sol.
export function calculateNextFailedCCEpoch(
  maxFailedRatio: BigInt,
  unitCount: BigInt,
  activeUnitCount: BigInt,
  nextAdditionalActiveUnitCount: BigInt,
  totalFailCount: BigInt,
  lastSnapshotEpoch: BigInt,
): BigInt {
  if (activeUnitCount == ZERO_BIG_INT) {
    return MAX_UINT_256;
  }

  const maxFails = maxFailedRatio * unitCount;
  let remainingFails = ZERO_BIG_INT;
  if (totalFailCount < maxFails) {
    remainingFails = maxFails - totalFailCount;
  }

  let failedEpoch = ZERO_BIG_INT;

  if (activeUnitCount > remainingFails) {
    failedEpoch = lastSnapshotEpoch + UNO_BIG_INT;
  } else {
    remainingFails = remainingFails - activeUnitCount;
    failedEpoch = lastSnapshotEpoch + UNO_BIG_INT;

    let newActiveUnitCount = activeUnitCount + nextAdditionalActiveUnitCount;
    let numberOfFillFailedEpoch = remainingFails / newActiveUnitCount;
    let remainingFailedUnitsInLastEpoch = remainingFails % newActiveUnitCount;

    if (remainingFailedUnitsInLastEpoch != ZERO_BIG_INT) {
      numberOfFillFailedEpoch += UNO_BIG_INT;
    }

    failedEpoch += numberOfFillFailedEpoch;
  }

  // CUrrently it is not used. Artifact from contract side.
  // const remainingFailsForLastEpoch = remainingFails % activeUnitCount;
  return failedEpoch;
}

// It mirrors core.currentEpoch in EpochController.sol.
export function calculateEpoch(
  timestamp: BigInt,
  epochControllerStorageInitTimestamp: BigInt,
  epochControllerStorageEpochDuration: BigInt,
): BigInt {
  return (
    UNO_BIG_INT +
    (timestamp - epochControllerStorageInitTimestamp) /
      epochControllerStorageEpochDuration
  );
}
