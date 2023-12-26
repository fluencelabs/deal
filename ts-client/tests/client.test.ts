import { expect, test } from "vitest";
import { getDeployment } from "../src";
import { ethers } from "ethers";

// TODO: fix tests and unskip.
test.skip("test env", async () => {
  expect(await getDeployment("local")).toEqual({
    core: "0x09635F643e140090A9A8Dcd712eD6285858ceBef",
    flt: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    usdc: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    chainId: 31337,
  });

  expect(await getDeployment("stage")).toEqual({
    core: "0x9B3b42fBc41EDD9dbE68cF0C581841071bEF5A33",
    flt: "0xCFE4Cf70d67bda8fc220CB25fAeF63799b978C64",
    usdc: "0x461801D09511671110ba7664324eAD3a7e42AAb1",
    chainId: 80001,
  });

  expect(await getDeployment("testnet")).toEqual({
    core: "0x9B3b42fBc41EDD9dbE68cF0C581841071bEF5A33",
    flt: "0xCFE4Cf70d67bda8fc220CB25fAeF63799b978C64",
    usdc: "0x461801D09511671110ba7664324eAD3a7e42AAb1",
    chainId: 80001,
  });

  expect(await getDeployment("kras")).toEqual({
    core: "0x9B3b42fBc41EDD9dbE68cF0C581841071bEF5A33",
    flt: "0xCFE4Cf70d67bda8fc220CB25fAeF63799b978C64",
    usdc: "0x461801D09511671110ba7664324eAD3a7e42AAb1",
    chainId: 80001,
  });
});
