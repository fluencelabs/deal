import {
  Core,
  Core__getComputeUnitResultValue0Struct,
  Core__getOfferResultValue0Struct,
} from "../generated/Core/Core";
import { Deal } from "../generated/Core/Deal";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/Core/ERC20";

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
  offerId: string
): Core__getOfferResultValue0Struct {
  const contract = Core.bind(contractAddress);
  return contract.getOffer(Bytes.fromHexString(offerId));
}

// @deprecated.
export function getComputeUnit(
  contractAddress: Address,
  unitId: Bytes
): Core__getComputeUnitResultValue0Struct {
  const contract = Core.bind(contractAddress);
  return contract.getComputeUnit(unitId);
}

// @deprecated.
export function getDealContract(contractAddress: Address): Deal {
  return Deal.bind(contractAddress);
}
