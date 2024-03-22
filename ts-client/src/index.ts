export { DealClient } from "./client/client.js";
export * from "./client/config.js";
export * from "./typechain-types/index.js";
export { DealExplorerClient } from "./dealExplorerClient/dealExplorerClient.js";
export { DealCliClient } from "./dealCliClient/dealCliClient.js";
export {
  ValidTogetherFiltersError,
  FiltersError,
} from "./dealExplorerClient/serializers/filters.js";
export {
  DealMatcherClient,
  type GetMatchedOffersOut,
  DealNotFoundError,
} from "./dealMatcherClient/dealMatcherClient.js";
