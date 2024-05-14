// TODO: relocate to test integration-tests-contracts folder.
import { describe, test } from "vitest";

/*
 * e2e test with dependencies:
 *  - Deployed contracts (locally),
 *  - Deployed Subgraph and aimed to the deployed contracts.

 * Notice: Each test for matching within this module must be with different
 *  effectors (now it is random). Thus, until the filtration by effectors works well we could
 *  "separate" tests for the matcher method (To ensure the hypothesis in all
 *  positive tests below additional check that no match with different effector is presented).
 * FAQ:
 * - Why so many considerations about state?
 *  Blockchain snapshot is not going to work correctly for the tests since we use indexer (Subgraph)
 *  in conjunction with the chain as well and indexer should be snapshotted as well (but it is not possible for the Subgraph).
 */
describe(
  "#getMatchedOffersByDealId",
  () => {

    test(`It matches successfully for 1:1 configuration where CC has status Active.`, async () => {
    });
  },
);
