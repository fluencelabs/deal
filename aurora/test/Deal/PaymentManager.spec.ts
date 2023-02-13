import { BigNumber } from "ethers";
import { expect } from "chai";
import { ethers, getUnnamedAccounts } from "hardhat";
import { Deal, IERC20 } from "../../typechain-types";
import { setTimeNextTime, setupTestEnv } from "../../utils/tests";

describe("PaymentManager", () => {
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

  it("deposit", async () => {
    const balanceBefore = await deal.getPaymentBalance();
    const value = ethers.utils.parseEther("1");

    await (await usdToken.approve(deal.address, value)).wait();
    await (await deal.depositToPaymentBalance(value)).wait();

    const balanceAfter = await deal.getPaymentBalance();

    expect(balanceAfter).to.be.equal(balanceBefore.add(value));
  });

  /* it("withdraw", async () => {
    const value = ethers.utils.parseEther("1");

    await (await usdToken.approve(deal.address, value)).wait();
    await (await deal.depositToPaymentBalance(value)).wait();

    const withdrawValue = value.div(2);

    const balanceBefore = await deal.getPaymentBalance();
    await (
      await deal.withdrawFromPaymentBalance(usdToken.address, withdrawValue)
    ).wait();
    const balanceAfter = await deal.getPaymentBalance();

    expect(balanceAfter).to.be.equal(balanceBefore.sub(withdrawValue));
  });*/
});
