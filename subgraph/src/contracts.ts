import {
    CoreImpl, CoreImpl__getComputeUnitResultValue0Struct, CoreImpl__getOfferResultValue0Struct
} from '../generated/Core/CoreImpl'
import {
    DealImpl
} from '../generated/Core/DealImpl'
import {Address, Bytes} from "@graphprotocol/graph-ts";
import {ERC20} from "../generated/Core/ERC20";


export function getTokenSymbol(address: Bytes): string {
    let contract = ERC20.bind(Address.fromBytes(address));
    let symbolValue = "unknown";  // ERC20 does not support symbol().
    let symbolResult = contract.try_symbol();

    if (!symbolResult.reverted) {
        symbolValue = symbolResult.value;
    }
    return symbolValue;
}

// @deprecated.
export function getOfferInfo(contractAddress: Address, offerId: string): CoreImpl__getOfferResultValue0Struct {
    const contract = CoreImpl.bind(contractAddress)
    return contract.getOffer(Bytes.fromHexString(offerId))
}

// @deprecated.
export function getComputeUnit(contractAddress: Address, unitId: Bytes): CoreImpl__getComputeUnitResultValue0Struct {
    const contract = CoreImpl.bind(contractAddress);
    return contract.getComputeUnit(unitId)
}

// @deprecated.
export function getDealContract(contractAddress: Address): DealImpl {
    return DealImpl.bind(contractAddress);
}
