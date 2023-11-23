import {
    CoreImpl, CoreImpl__getComputeUnitResultValue0Struct
} from '../generated/Core/CoreImpl'
import {
    DealImpl
} from '../generated/Core/DealImpl'
import {Address, BigInt, Bytes} from "@graphprotocol/graph-ts";

export function getComputeUnit(contractAddress: Address, unitId: Bytes): CoreImpl__getComputeUnitResultValue0Struct {
    const contract = CoreImpl.bind(contractAddress);
    return contract.getComputeUnit(unitId)
}

export function getDealContract(contractAddress: Address): DealImpl {
    return DealImpl.bind(contractAddress);
}
