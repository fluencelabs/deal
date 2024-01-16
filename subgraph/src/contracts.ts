import {
  Market,
  Market__getComputeUnitResultValue0Struct,
  Market__getOfferResultValue0Struct,
} from "../generated/Market/Market";
import { Deal } from "../generated/Market/Deal";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/Market/ERC20";
import {Core} from "../generated/Core/Core";

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
