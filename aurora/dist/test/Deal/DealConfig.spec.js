"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const chai_1 = require("chai");
const hardhat_1 = require("hardhat");
const tests_1 = require("../../utils/tests");
describe("DealConfig", () => {
    let userAccount = "";
    let deal;
    before(async () => {
        const accounts = await (0, hardhat_1.getUnnamedAccounts)();
        userAccount = accounts[0];
    });
    beforeEach(async () => {
        const config = await (0, tests_1.setupTestEnv)(userAccount, hardhat_1.ethers.utils.parseEther("1"), hardhat_1.ethers.utils.parseEther("1"), ethers_1.BigNumber.from(1), ethers_1.BigNumber.from(1), ethers_1.BigNumber.from(1));
        deal = config.deal;
    });
    it("setAppCID", async () => {
        const tx = await deal.setAppCID("test");
        const res = await tx.wait();
        const appCID = await deal.appCID();
        (0, chai_1.expect)(appCID).to.be.equal("test");
        const cidEvent = res.events.find((e) => {
            return e.event === "NewAppCID";
        });
        (0, chai_1.expect)(cidEvent).to.not.be.undefined;
        (0, chai_1.expect)(cidEvent.args[0]).to.be.equal("test");
    });
});
