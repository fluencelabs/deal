// TODO: add proper provider name resolver.
// We store provider name in subgraph since we need to text search by it.
export function getProviderName(providerAddress: string): string {
  let name = "Provider " + providerAddress.slice(0, 8);
  if (providerAddress === "0x0000000000000000000000000000000000000000") {
    name = "ZERO Provider";
  }
  return name;
}

const DEFAULT_EFFECTOR_DESCRIPTION = "Unknown";

// TODO: add proper description mapper.
export function getEffectorDescription(cid: string): string {
  // TODO: add real cids (current relates to CreateMarket.s.sol)
  if (cid === "\u00124VxDoge") {
    return "CURL";
  }
  if (cid === "\u00124VxDogu") {
    return "IPFS";
  }
  return DEFAULT_EFFECTOR_DESCRIPTION;
}
