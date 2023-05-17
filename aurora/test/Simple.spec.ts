import { expect } from "chai";
import { Config, Controller, Core, DealFactory, DeveloperFaucet, IERC20__factory, Matcher, Workers } from "../typechain-types";
import { deployments, ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("Factory", () => {
    let faucet: DeveloperFaucet;
    let factory: DealFactory;
    let core: Core;
    let controller: Controller;
    let config: Config;
    let workers: Workers;
    let matcher: Matcher;

    before(async () => {
        await deployments.fixture();
        factory = (await ethers.getContractAt("DealFactory", (await deployments.get("Factory")).address)) as DealFactory;
        faucet = (await ethers.getContractAt("DeveloperFaucet", (await deployments.get("Faucet")).address)) as DeveloperFaucet;
        matcher = (await ethers.getContractAt("Matcher", (await deployments.get("Matcher")).address)) as Matcher;
    });

    it("deploy deal", async () => {
        const params = {
            minWorkers_: BigNumber.from(1),
            targetWorkers_: BigNumber.from(100),
            appCID_: "testtesttest",
        };
        const tx = await factory.createDeal(params.minWorkers_, params.targetWorkers_, params.appCID_);
        const res = await tx.wait();

        const eventTopic = factory.interface.getEventTopic("DealCreated");
        const log = res.logs.find(({ topics }: any) => topics[0] === eventTopic);
        const deal = (factory.interface.parseLog(log!) as any).args.deal;

        core = (await ethers.getContractAt("Core", deal.core)) as Core;
        controller = (await ethers.getContractAt("Controller", deal.controller)) as Controller;
        config = (await ethers.getContractAt("Config", deal.config)) as Config;
        workers = (await ethers.getContractAt("Workers", deal.workers)) as Workers;
        expect(await factory.isDeal(deal.core)).to.be.true;
    });

    it("setCID", async () => {
        const tx = await controller.setAppCID("newCID");
        const res = await tx.wait();

        const eventTopic = config.interface.getEventTopic("AppCIDChanged");

        const log = res.logs.find(({ topics }: any) => topics[0] === eventTopic);
        const newCID = (config.interface.parseLog(log!) as any).args.newAppCID;

        expect(newCID).to.be.equal("newCID");
    });

    it("join", async () => {
        const requiredStake = await config.requiredStake();

        const fltAddress = await faucet.fluenceToken();
        const flt = IERC20__factory.connect(fltAddress, ethers.provider.getSigner());

        await (await flt.approve(workers.address, requiredStake)).wait();

        const tx = await controller.join();
        const res = await tx.wait();

        const eventTopic = workers.interface.getEventTopic("PATCreated");
        const log = res.logs.find(({ topics }: any) => topics[0] === eventTopic);
        const parsetLog = workers.interface.parseLog(log!) as any;

        expect(parsetLog.args.owner).to.be.equal(await ethers.provider.getSigner().getAddress());
    });

    it("register in matcher", async () => {
        const owner = ethers.provider.getSigner(0);
        const resourceOwner = ethers.provider.getSigner(1);

        const collateral = (await config.requiredStake()).mul(2);
        const workersCount = 2;
        const totalCollateral = collateral.mul(workersCount);

        const fltAddress = await faucet.fluenceToken();

        const flt = IERC20__factory.connect(fltAddress, ethers.provider.getSigner());

        await (await matcher.connect(owner).setWhiteList(await resourceOwner.getAddress(), true)).wait();
        await (await flt.connect(resourceOwner).approve(matcher.address, totalCollateral)).wait();

        const tx = await matcher.connect(resourceOwner).register(factory.PRICE_PER_EPOCH(), collateral, workersCount, ["one", "two"]);
        const res = await tx.wait();

        /*
        const eventTopic = matcher.interface.getEventTopic("ResourceOwnerRegistred");
        const log = res.logs.find(({ topics }: any) => topics[0] === eventTopic);
        const parsetLog = matcher.interface.parseLog(log!) as any;

        expect(parsetLog.args.owner).to.be.equal(await ethers.provider.getSigner().getAddress());
        expect(parsetLog.args.info.minPriceByEpoch).to.be.equal(1);
        expect(parsetLog.args.info.maxCollateral).to.be.equal(collateral);
        expect(parsetLog.args.info.workersCount).to.be.equal(2);*/

        const resourceOwnerInfo = await matcher.resourceConfigs(await resourceOwner.getAddress());
        expect(resourceOwnerInfo.minPriceByEpoch).to.be.equal(await factory.PRICE_PER_EPOCH());
        expect(resourceOwnerInfo.maxCollateral).to.be.equal(collateral);
        expect(resourceOwnerInfo.workersCount).to.be.equal(workersCount);
    });

    it("match", async () => {
        const resourceOwner = await ethers.provider.getSigner(1).getAddress();

        const tx = await matcher.matchWithDeal(core.address);
        const res = await tx.wait();

        const eventTopic = workers.interface.getEventTopic("PATCreated");

        let patCount = 0;
        for (const log of res.logs) {
            if (log.topics[0] === eventTopic) {
                const parsetLog = workers.interface.parseLog(log) as any;
                expect(parsetLog.args.owner).to.be.equal(resourceOwner);
                patCount++;
            }
        }

        expect(patCount).to.be.equal(2);
    });
});
