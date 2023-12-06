import {
  Core,
  Core__getComputeUnitResultValue0Struct,
  Core__getOfferResultValue0Struct,
} from "../generated/Core/Core";
import { Deal } from "../generated/Core/Deal";
import { Address, Bytes } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/Core/ERC20";

export function getTokenSymbol(address: Bytes): string {
  let contract = ERC20.bind(Address.fromBytes(address));
  let symbolValue = "unknown"; // ERC20 does not support symbol().
  let symbolResult = contract.try_symbol();

  if (!symbolResult.reverted) {
    symbolValue = symbolResult.value;
  }
  return symbolValue;
}

// @deprecated.
export function getOffer(
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
