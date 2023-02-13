import { BigNumber } from "ethers";
import { expect } from "chai";
import { ethers, getUnnamedAccounts } from "hardhat";
import { Deal, IERC20 } from "../../typechain-types";
import { setupTestEnv } from "../../utils/tests";

describe("DealConfig", () => {
  let userAccount: string = "";
  let deal: Deal;
  let usdToken: IERC20;

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
    usdToken = config.usdToken;
  });

  it("setAppCID", async () => {
    const tx = await deal.setAppCID("test");
    const res = await tx.wait();

    const appCID = await deal.appCID();
    expect(appCID).to.be.equal("test");

    const cidEvent = res.events!.find((e) => {
      return e.event === "NewAppCID";
    });

    expect(cidEvent).to.not.be.undefined;
    expect(cidEvent!.args![0]).to.be.equal("test");
  });
});
