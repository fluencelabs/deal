export async function waitSubgraphToIndex(milliseconds) {
  return await new Promise((resolve) =>
    setTimeout(resolve, milliseconds),
  );
}
