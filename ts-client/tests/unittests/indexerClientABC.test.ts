import { describe, expect, test } from "vitest";
import * as fs from "fs";
import { getIndexerUrl } from "../../src/utils/indexerClient/config";

function getDeploymentPath(stand: string) {
  return `../subgraph/deployments/${stand}.txt`;
}

function isStandDeploymentTxtRecordExists(stand: string) {
  return fs.existsSync(getDeploymentPath(stand));
}

function checkFluenceEnvConfig(stand: string) {
  // Check that file exists firstly
  if (!isStandDeploymentTxtRecordExists(stand)) {
    console.warn(`file for ${stand} not found, nothing to check`);
    return;
  }
  const allSavedSubgraphUrls = fs
    .readFileSync(getDeploymentPath(stand), "utf8")
    .split("\n")
    .filter((url) => url.length > 0);
  // It refers to how subgraph url stored in .txt file via fluence-graph.sh script.
  const lastSavedSubgraphName =
    allSavedSubgraphUrls[allSavedSubgraphUrls.length - 1].split(" ")[0];
  const subgraphNameFromClient = getIndexerUrl(stand).split("/").pop();
  expect(
    subgraphNameFromClient,
    "Possibly you forgot to update indexerClient/config.ts with the last subgraph name.",
  ).toBe(lastSavedSubgraphName);
}

describe("#configs", () => {
  test("It uses last stage subgraph url.", async () => {
    checkFluenceEnvConfig("stage");
  });
  test("It uses last kras subgraph url.", async () => {
    checkFluenceEnvConfig("kras");
  });
  test("It uses last dar subgraph url.", async () => {
    checkFluenceEnvConfig("dar");
  });
});
