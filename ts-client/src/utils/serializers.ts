export function serializeDealProviderAccessLists(
  providersAccessType: number,
  providersAccessList: Array<{
    __typename?: "DealToProvidersAccess";
    provider: { __typename?: "Provider"; id: string }
  }> | null | undefined
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
