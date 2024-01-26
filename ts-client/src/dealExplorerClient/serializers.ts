// If provider does not approved: convert a name.
export function serializeProviderName(
  name: string,
  providerAddress: string,
  isApproved: boolean,
): string {
  if (isApproved) {
    return name;
  }
  if (providerAddress === "0x0000000000000000000000000000000000000000") {
    return "Provider 0x0000000";
  }
  return "Provider " + providerAddress.slice(0, 8);
}
