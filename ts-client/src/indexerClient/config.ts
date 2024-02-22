import type { ContractsENV } from "../client/config.js";

// TODO: b/w deployed contracts and deployed subgraphs to the contracts should be
//  match somehow. Currently, this match is hardcoded in the file (not good).
// Method is used only in ./indexerClientABC. To reuse in your code - check above.
export const getIndexerUrl = (env: ContractsENV) => {
  let indexerUrl: string | undefined = undefined;

  switch (env) {
    case "kras":
      indexerUrl = "https://api.thegraph.com/subgraphs/name/alcibiadescleinias/fluence-deal-contracts";
      break;
    case "testnet":
      indexerUrl =
        "https://api.thegraph.com/subgraphs/name/alcibiadescleinias/fluence-deal-contracts";
      break;
    case "stage":
      indexerUrl =
        "https://graph-node-stage.fluence.dev/subgraphs/name/fluence-deal-contracts";
      break;
    case "local":
      indexerUrl =
        "http://localhost:8000/subgraphs/name/fluence-deal-contracts";
      break;
    default:
      throw new Error(`Unknown chain env: ${env}`);
  }

  return indexerUrl;
};
