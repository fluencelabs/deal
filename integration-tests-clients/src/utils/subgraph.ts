const DEFAULT_TIME_TO_INDEX = 5000  // 5 sec.

export async function waitSubgraphToIndex() {
  return await new Promise((resolve) =>
    setTimeout(resolve, DEFAULT_TIME_TO_INDEX),
  );
}
