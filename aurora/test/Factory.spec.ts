import { expect } from "chai";
import type { AVLMock, DealFactory } from "../typechain-types";
import { deployments, ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("Factory", () => {
    let factory: DealFactory;

    before(async () => {
        await deployments.fixture();
        factory = (await ethers.getContractAt("DealFactory", (await deployments.get("Factory")).address)) as DealFactory;
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
        const deal = (factory.interface.parseLog(log!) as any).args.deal.core;

        expect(await factory.isDeal(deal)).to.be.true;
    });
});
