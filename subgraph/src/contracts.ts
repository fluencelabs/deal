import {
  Market,
  Market__getComputeUnitResultValue0Struct,
  Market__getOfferResultValue0Struct,
} from "../generated/Market/Market";
import { Deal } from "../generated/Market/Deal";
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/Market/ERC20";
import {Core} from "../generated/Core/Core";
import {Capacity} from "../generated/Capacity/Capacity";
import {UNO_BIG_INT, ZERO_BIG_INT} from "./models";

// TODO: optimise through multicall contract (currently 2 calls only per token).
export function getTokenSymbol(address: Bytes): string {
  let contract = ERC20.bind(Address.fromBytes(address));
  let symbolValue = "unknown"; // if ERC20 does not support symbol().
  let symbolResult = contract.try_symbol();

  if (!symbolResult.reverted) {
    symbolValue = symbolResult.value;
  }
  return symbolValue;
}

export function getTokenDecimals(address: Bytes): i32 {
  let contract = ERC20.bind(Address.fromBytes(address));
  let value = 1; // if ERC20 does not support decimals().
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

// It mirrors _failedEpoch in Capacity.sol.
export function calculateNextFailedCCEpoch(
    maxFailedRatio: BigInt,
    unitCount: BigInt,
    activeUnitCount: BigInt,
    nextAdditionalActiveUnitCount: BigInt,
    totalCUFailCount: BigInt,
    lastSnapshotEpoch: BigInt,
  ): BigInt {
        const maxFails= maxFailedRatio * unitCount;
        let remainingFails = ZERO_BIG_INT;
        if (totalCUFailCount < maxFails) {
            remainingFails = maxFails - totalCUFailCount;
        }

        let failedEpoch = ZERO_BIG_INT;
        if (activeUnitCount > remainingFails) {
            failedEpoch = lastSnapshotEpoch + UNO_BIG_INT;
        } else {
            remainingFails = remainingFails - activeUnitCount;
            activeUnitCount += nextAdditionalActiveUnitCount;

            failedEpoch = UNO_BIG_INT + lastSnapshotEpoch + (remainingFails / activeUnitCount);
        }

        // currently not used.
        const remainingFailsForLastEpoch = remainingFails % activeUnitCount;
        return failedEpoch;
    }

export function calculateEpoch(
    timestamp: BigInt,
    epochControllerStorageInitTimestamp: BigInt,
    epochControllerStorageEpochDuration: BigInt,
  ): BigInt {
  return UNO_BIG_INT + (timestamp - epochControllerStorageInitTimestamp) / epochControllerStorageEpochDuration
  }
