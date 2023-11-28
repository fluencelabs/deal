import {Bytes} from "@graphprotocol/graph-ts";

const DEFAULT_TOKEN_SYMBOL = 'USDT'

// TODO: add calls to token name() to do meta automatically.
// const TOKEN_TO_SYMBOL = {
//     // TODO: resolve that can not be compiled
// }

export function getTokenSymbol(address: Bytes): string {
    const addressStr = address.toHexString()
    // if (addressStr in TOKEN_TO_SYMBOL) {
    //     return TOKEN_TO_SYMBOL[addressStr]
    // }
    return DEFAULT_TOKEN_SYMBOL
}


export function getProviderName(providerAddress: string): string {
    let name = "Awesome Provider"
    if (providerAddress === "0x0000000000000000000000000000000000000000") {
        name = "ZERO Provider";
    }
    return name
}
