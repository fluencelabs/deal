export { DealClient } from "./client/client.js";
export * from "./client/config.js";
export * from "./typechain-types/index.js";
export { DealExplorerClient, DealIndexerClient } from "./dealExplorerClient/dealExplorerClient.js"
// TODO: rm this dirty hack
//  (without this - fiels do not included into the package).
// @ts-ignore
import JsonFile from "./deployments/31337.json" assert { type: "json" };
// @ts-ignore
import JsonFile1 from "./deployments/80001.json" assert { type: "json" };
