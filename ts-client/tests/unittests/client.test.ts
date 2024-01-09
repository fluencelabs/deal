import { expect, test } from "vitest";
import {getDeployment} from "../../src";
import { ethers } from "ethers";
//  TODO: it is better to have integration tests for DealClient for calls: getMarket/etc.

test("#getDeployment", async () => {
  // TODO: not sure if have to support local env in git!
  // expect(await getDeployment("local")).toEqual({
  //   core: "0x09635F643e140090A9A8Dcd712eD6285858ceBef",
  //   flt: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  //   usdc: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  //   chainId: 31337,
  // });

  expect(await getDeployment("stage")).toEqual({
    core: "0x7523E3b82F05bB0a9775FD1354D5DA736a7c29c0",
    flt: "0xb56B66f6E225a3f6Cde58cc012Cf3f3D13729bac",
    usdc: "0xC1F39E258D827b5B75cA296e797044AA030907bF",
    multicall3: "0xC8cD377019FfA4520E18813499d13C234dc08717",
    chainId: 80001,
  });

  expect(await getDeployment("testnet")).toEqual({
    core: "0x7523E3b82F05bB0a9775FD1354D5DA736a7c29c0",
    flt: "0xb56B66f6E225a3f6Cde58cc012Cf3f3D13729bac",
    usdc: "0xC1F39E258D827b5B75cA296e797044AA030907bF",
    multicall3: "0xC8cD377019FfA4520E18813499d13C234dc08717",
    chainId: 80001,
  });

  expect(await getDeployment("kras")).toEqual({
    core: "0x7523E3b82F05bB0a9775FD1354D5DA736a7c29c0",
    flt: "0xb56B66f6E225a3f6Cde58cc012Cf3f3D13729bac",
    usdc: "0xC1F39E258D827b5B75cA296e797044AA030907bF",
    multicall3: "0xC8cD377019FfA4520E18813499d13C234dc08717",
    chainId: 80001,
  });
});
