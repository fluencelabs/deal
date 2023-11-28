import {
    CoreImpl, CoreImpl__getComputeUnitResultValue0Struct
} from '../generated/Core/CoreImpl'
import {Address, Bytes} from "@graphprotocol/graph-ts";

export function getComputeUnit(contractAddress: Address, unitId: Bytes): CoreImpl__getComputeUnitResultValue0Struct {
    let contract = CoreImpl.bind(contractAddress);
    return contract.getComputeUnit(unitId)
}
