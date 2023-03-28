import { expect } from "chai";
import { ethers, getUnnamedAccounts } from "hardhat";
import type { Core, Deal, IERC20, MockParticleVerifyer } from "../../typechain-types";
import { setTimeNextTime, setupTestEnv } from "../../utils/tests";
import { BigNumber } from "ethers";

describe("Particle", () => {
    let userAccount = "";
    let deal: Deal;
    let core: Core;
    let usdToken: IERC20;
    let fltToken: IERC20;
    let mockParticleVerifyer: MockParticleVerifyer;

    before(async () => {
        const accounts = await getUnnamedAccounts();
        userAccount = accounts[0]!;

        const config = await setupTestEnv(
            userAccount,
            ethers.utils.parseEther("1"),
            ethers.utils.parseEther("1"),
            BigNumber.from(1),
            BigNumber.from(1),
            BigNumber.from(1000),
        );
        deal = config.deal;
        usdToken = config.usdToken;
        fltToken = config.fltToken;
        core = config.core;
        mockParticleVerifyer = config.mockParticleVerifyer;
    });

    beforeEach(async () => {
        const pricePerEpoch = await deal.pricePerEpoch();
        await (await usdToken.approve(deal.address, pricePerEpoch.mul(10))).wait();
        await (await deal.depositToPaymentBalance(pricePerEpoch.mul(10))).wait();
    });

    const createPAT = async (index: number) => {
        const requiredStake = await deal.requiredStake();

        await (await fltToken.approve(deal.address, requiredStake)).wait();
        const tx = await deal.createProviderToken(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("salt")), index);

        const eventTopic = deal.interface.getEventTopic("AddProviderToken");
        const log = (await tx.wait()).logs.find(({ topics }: any) => topics[0] === eventTopic);

        const args = deal.interface.parseLog(log!).args;
        const patId = args["id"];

        return patId;
    };

    it("commitParticle with one PAT", async () => {
        const pricePerEpoch = await deal.pricePerEpoch();

        const particle = {
            air: "test1",
            prevData: "test1",
            params: "test1",
            callResults: "test1",
        };

        const paymentBalanceBefore = await deal.paymentBalance();

        const patId = await createPAT(0);

        await (await mockParticleVerifyer.setPATIds(particle, [patId])).wait();

        await deal.commitParticle(particle);

        expect(paymentBalanceBefore.sub(pricePerEpoch.div(2))).to.be.equal(await deal.paymentBalance());
    });

    it("commitParticle with 100 PAT", async () => {
        const pricePerEpoch = await deal.pricePerEpoch();

        const particle = {
            air: "test2",
            prevData: "test2",
            params: "test2",
            callResults: "test2",
        };

        const paymentBalanceBefore = await deal.paymentBalance();

        const pats = [];

        for (let i = 0; i < 100; i++) {
            pats.push(await createPAT(i));
        }

        await (await mockParticleVerifyer.setPATIds(particle, pats)).wait();

        await deal.commitParticle(particle);

        expect(paymentBalanceBefore.sub(pricePerEpoch.div(4))).to.be.equal(await deal.paymentBalance());
    });
});
