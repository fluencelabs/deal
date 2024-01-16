// TODO: add proper provider name resolver.
export function getProviderName(providerAddress: string): string {
  let name = "Provider" + providerAddress.slice(0, 8);
  if (providerAddress === "0x0000000000000000000000000000000000000000") {
    name = "ZERO Provider";
  }
  return name;
}
