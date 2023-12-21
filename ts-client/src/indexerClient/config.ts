import type {ContractsENV} from "../client/config.js";


// TODO: should be updated (and synced) somehow from (with) subgprah on deploy.
export const getIndexerUrl = (env: ContractsENV) => {
  let indexerUrl: string | undefined = undefined;

  switch (env) {
    case "kras":
      indexerUrl = "";
      throw new Error("indexer for kras is not deployed.");
    case "testnet":
      indexerUrl = "https://api.thegraph.com/subgraphs/name/alcibiadescleinias/fluence-deal-contracts";
      break;
    case "stage":
      indexerUrl = "https://graph-node.fluence.dev/subgraphs/name/fluence-deal-contracts";
      break;
    case "local":
      indexerUrl = "http://localhost:8000/subgraphs/name/fluence-deal-contracts";
      break;
    default:
      throw new Error(`Unknown chain env: ${env}`);
  }

  return indexerUrl
};
