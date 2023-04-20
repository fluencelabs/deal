"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const typechain_types_1 = require("../typechain-types");
const hardhat_1 = require("hardhat");
const ethers_1 = require("ethers");
describe("Factory", () => {
    let faucet;
    let factory;
    let core;
    let controller;
    let config;
    let workers;
    let matcher;
    before(async () => {
        await hardhat_1.deployments.fixture();
        factory = (await hardhat_1.ethers.getContractAt("DealFactory", (await hardhat_1.deployments.get("Factory")).address));
        faucet = (await hardhat_1.ethers.getContractAt("DeveloperFaucet", (await hardhat_1.deployments.get("Faucet")).address));
        matcher = (await hardhat_1.ethers.getContractAt("Matcher", (await hardhat_1.deployments.get("Matcher")).address));
    });
    it("deploy deal", async () => {
        const params = {
            minWorkers_: ethers_1.BigNumber.from(1),
            targetWorkers_: ethers_1.BigNumber.from(100),
            appCID_: "testtesttest",
        };
        const tx = await factory.createDeal(params.minWorkers_, params.targetWorkers_, params.appCID_);
        const res = await tx.wait();
        const eventTopic = factory.interface.getEventTopic("DealCreated");
        const log = res.logs.find(({ topics }) => topics[0] === eventTopic);
        const deal = factory.interface.parseLog(log).args.deal;
        core = (await hardhat_1.ethers.getContractAt("Core", deal.core));
        controller = (await hardhat_1.ethers.getContractAt("Controller", deal.controller));
        config = (await hardhat_1.ethers.getContractAt("Config", deal.config));
        workers = (await hardhat_1.ethers.getContractAt("Workers", deal.workers));
        (0, chai_1.expect)(await factory.isDeal(deal.core)).to.be.true;
    });
    it("setCID", async () => {
        const tx = await controller.setAppCID("newCID");
        const res = await tx.wait();
        const eventTopic = config.interface.getEventTopic("AppCIDChanged");
        const log = res.logs.find(({ topics }) => topics[0] === eventTopic);
        const newCID = config.interface.parseLog(log).args.newAppCID;
        (0, chai_1.expect)(newCID).to.be.equal("newCID");
    });
    it("join", async () => {
        const requiredStake = await config.requiredStake();
        const fltAddress = await faucet.fluenceToken();
        const flt = typechain_types_1.IERC20__factory.connect(fltAddress, hardhat_1.ethers.provider.getSigner());
        await (await flt.approve(workers.address, requiredStake)).wait();
        const tx = await controller.join();
        const res = await tx.wait();
        const eventTopic = workers.interface.getEventTopic("PATCreated");
        const log = res.logs.find(({ topics }) => topics[0] === eventTopic);
        const parsetLog = workers.interface.parseLog(log);
        (0, chai_1.expect)(parsetLog.args.owner).to.be.equal(await hardhat_1.ethers.provider.getSigner().getAddress());
    });
    it("register in matcher", async () => {
        const requiredStake = await config.requiredStake();
        const fltAddress = await faucet.fluenceToken();
        const flt = typechain_types_1.IERC20__factory.connect(fltAddress, hardhat_1.ethers.provider.getSigner());
        await (await flt.approve(matcher.address, requiredStake.mul(2))).wait();
        const tx = await matcher.register(1, requiredStake, 2);
        const res = await tx.wait();
        const eventTopic = matcher.interface.getEventTopic("ResourceOwnerRegistred");
        const log = res.logs.find(({ topics }) => topics[0] === eventTopic);
        const parsetLog = matcher.interface.parseLog(log);
        (0, chai_1.expect)(parsetLog.args.owner).to.be.equal(await hardhat_1.ethers.provider.getSigner().getAddress());
        (0, chai_1.expect)(parsetLog.args.info.minPriceByEpoch).to.be.equal(1);
        (0, chai_1.expect)(parsetLog.args.info.maxCollateral).to.be.equal(requiredStake);
        (0, chai_1.expect)(parsetLog.args.info.workersCount).to.be.equal(2);
    });
    it("match", async () => {
        const resourceOwner = await hardhat_1.ethers.provider.getSigner().getAddress();
        const tx = await matcher.matchWithDeal(core.address, [resourceOwner], [2]);
        const res = await tx.wait();
        const eventTopic = workers.interface.getEventTopic("PATCreated");
        let patCount = 0;
        for (const log of res.logs) {
            if (log.topics[0] === eventTopic) {
                const parsetLog = workers.interface.parseLog(log);
                (0, chai_1.expect)(parsetLog.args.owner).to.be.equal(resourceOwner);
                patCount++;
            }
        }
        (0, chai_1.expect)(patCount).to.be.equal(2);
    });
});
