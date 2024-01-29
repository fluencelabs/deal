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

// TODO: rm when https://github.com/graphprotocol/graph-node/issues/5171 is fixed.
// Currently this method is synced with scripts/CreateMarket.s.sol script data.
// It is used for dev purpose as scripts/CreateMarket.s.sol itself as well.
export function serializeEffectorDescription(
  cid: string,
  descriptionFromIndexer: string,
): string {
  if (cid == "\u00124VxDoge") {
    return "IPFS";
  }
  if (cid == "\u00124VxDogu") {
    return "cURL";
  }
  return descriptionFromIndexer;
}

export function serializeDealProviderAccessLists(
  providersAccessType: number,
  providersAccessList:
    | Array<{
        __typename?: "DealToProvidersAccess";
        id: string;
      }>
    | null
    | undefined,
): { whitelist: Array<string>; blacklist: Array<string> } {
  const res: { whitelist: Array<string>; blacklist: Array<string> } = {
    whitelist: [],
    blacklist: [],
  };
  if (!providersAccessType || !providersAccessList) {
    // None
    return res;
  }
  const providersAccessListStrings = providersAccessList.map((providerObj) => {
    return providerObj.id;
  });
  if (providersAccessType == 1) {
    // whitelist
    res.whitelist = providersAccessListStrings;
  } else if (providersAccessType == 2) {
    // whitelist
    res.blacklist = providersAccessListStrings;
  }
  return res;
}
