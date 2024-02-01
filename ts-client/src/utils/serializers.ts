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
