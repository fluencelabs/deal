import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, getUnnamedAccounts } from "hardhat";
import { Deal } from "../../typechain-types";
import { setupTestEnv } from "../../utils/tests";

describe("RoleManager", () => {
  let userAccount: string = "";
  let deal: Deal;

  before(async () => {
    const accounts = await getUnnamedAccounts();
    userAccount = accounts[0];
  });

  beforeEach(async () => {
    const config = await setupTestEnv(
      userAccount,
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1"),
      BigNumber.from(1),
      BigNumber.from(1),
      BigNumber.from(1)
    );
    deal = config.deal;
  });

  it("register", async () => {
    await (await deal.register()).wait();
    expect(await deal.getRole(userAccount)).to.be.equal(1);
  });
});
