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
        {
          cid: effector.effector.id,
          description: effector.effector.description,
        }
      ),
    });
  }

  return composedEffectors;
}

export function serializeEffectorDescription(
  effectorIn: {cid: string, description: string},
): string {
  // Add custom serialization logic here.
  return effectorIn.description;
}
