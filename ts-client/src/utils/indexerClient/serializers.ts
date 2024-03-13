// General Simple Serializers presented here: from indexer models to more simple ones.

export function serializeDealProviderAccessLists(
  providersAccessType: number,
  providersAccessList:
    | Array<{
        __typename?: "DealToProvidersAccess";
        provider: { __typename?: "Provider"; id: string };
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
    return providerObj.provider.id;
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

export function serializeEffectors(
  manyToManyEffectors:
    | Array<{ effector: { id: string; description: string } }>
    | null
    | undefined,
): Array<{cid: string, description: string}> {
  const composedEffectors: Array<{cid: string, description: string}> = [];
  if (!manyToManyEffectors) {
    return composedEffectors;
  }
  for (const effector of manyToManyEffectors) {
    composedEffectors.push({
      cid: effector.effector.id,
      description: serializeEffectorDescription(
        effector.effector.id,
        effector.effector.description,
      ),
    });
  }

  return composedEffectors;
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
