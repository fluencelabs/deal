export { DealClient } from "./client/client.js";
export * from "./client/config.js";
export * from "./typechain-types/index.js";
export {
  DealExplorerClient,
  ValidTogetherFiltersError,
  FiltersError,
} from "./dealExplorerClient/dealExplorerClient.js";
export {
  DealMatcherClient,
  type GetMatchedOffersOut,
  DealNotFoundError,
} from "./dealMatcherClient/dealMatcherClient.js";
