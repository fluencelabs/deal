"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const tests_1 = require("../../utils/tests");
const ethers_1 = require("ethers");
describe("ProviderManager", () => {
    let userAccount = "";
    let deal;
    let core;
    let usdToken;
    let fltToken;
    let patId = "";
    before(async () => {
        const accounts = await (0, hardhat_1.getUnnamedAccounts)();
        userAccount = accounts[0];
        const config = await (0, tests_1.setupTestEnv)(userAccount, hardhat_1.ethers.utils.parseEther("1"), hardhat_1.ethers.utils.parseEther("1"), ethers_1.BigNumber.from(1), ethers_1.BigNumber.from(1), ethers_1.BigNumber.from(1));
        deal = config.deal;
        usdToken = config.usdToken;
        fltToken = config.fltToken;
        core = config.core;
    });
    it("createProviderToken", async () => {
        const requiredStake = await deal.requiredStake();
        await (await fltToken.approve(deal.address, requiredStake)).wait();
        const tx = await deal.createProviderToken(hardhat_1.ethers.utils.keccak256(hardhat_1.ethers.utils.toUtf8Bytes("salt")), 0);
        const eventTopic = deal.interface.getEventTopic("AddProviderToken");
        const log = (await tx.wait()).logs.find(({ topics }) => topics[0] === eventTopic);
        const args = deal.interface.parseLog(log).args;
        const owner = args["owner"];
        patId = args["id"];
        (0, chai_1.expect)(patId).not.to.be.undefined;
        (0, chai_1.expect)(owner).to.be.equal(await deal.getPATOwner(patId));
        (0, chai_1.expect)(owner).to.be.equal(userAccount);
    });
    it("getRewards", async () => {
        const value = hardhat_1.ethers.utils.parseEther("100");
        const price = await deal.pricePerEpoch();
        await (await usdToken.approve(deal.address, value)).wait();
        await (await deal.depositToPaymentBalance(value)).wait();
        const balance = await deal.paymentBalance();
        const block = await hardhat_1.ethers.provider.getBlock("latest");
        await (0, tests_1.setTimeNextTime)(block.timestamp + 120 * 2); //TODO: change to epoches
        (0, chai_1.expect)(await deal.paymentBalance()).to.be.equal(balance.sub(price.mul(2)));
    });
    it("removeProviderToken", async () => {
        const removeTokenTx = await deal.removeProviderToken(patId);
        const removeEventTopic = deal.interface.getEventTopic("RemoveProviderToken");
        const logRemoveTopic = (await removeTokenTx.wait()).logs.find(({ topics }) => topics[0] === removeEventTopic);
        (0, chai_1.expect)(deal.interface.parseLog(logRemoveTopic).args["id"]).to.be.equal(patId);
    });
    it("withdraw", async () => {
        const balanceBefore = await fltToken.balanceOf(userAccount);
        const timeout = await core.withdrawTimeout();
        const block = await hardhat_1.ethers.provider.getBlock("latest");
        const requiredStake = await deal.requiredStake();
        await (0, tests_1.setTimeNextTime)(block.timestamp + timeout.toNumber());
        const withdrawTx = await deal.withdraw(fltToken.address);
        await withdrawTx.wait();
        const balanceAfter = await fltToken.balanceOf(userAccount);
        (0, chai_1.expect)(balanceAfter).to.be.eq(balanceBefore.add(requiredStake));
    });
});
