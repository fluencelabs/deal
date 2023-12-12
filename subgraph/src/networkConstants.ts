export function getProviderName(providerAddress: string): string {
    let name = "Awesome Provider"
    if (providerAddress === "0x0000000000000000000000000000000000000000") {
        name = "ZERO Provider";
    }
    return name
}
