"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const tests_1 = require("../../utils/tests");
describe("PaymentManager", () => {
    let userAccount = "";
    let deal;
    let usdToken;
    before(async () => {
        const accounts = await (0, hardhat_1.getUnnamedAccounts)();
        userAccount = accounts[0];
    });
    beforeEach(async () => {
        const config = await (0, tests_1.setupTestEnv)(userAccount, hardhat_1.ethers.utils.parseEther("1"), hardhat_1.ethers.utils.parseEther("1"), ethers_1.BigNumber.from(1), ethers_1.BigNumber.from(1), ethers_1.BigNumber.from(1));
        deal = config.deal;
        usdToken = config.usdToken;
    });
    it("deposit", async () => {
        const balanceBefore = await deal.getPaymentBalance();
        const value = hardhat_1.ethers.utils.parseEther("1");
        await (await usdToken.approve(deal.address, value)).wait();
        await (await deal.depositToPaymentBalance(value)).wait();
        const balanceAfter = await deal.getPaymentBalance();
        (0, chai_1.expect)(balanceAfter).to.be.equal(balanceBefore.add(value));
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
